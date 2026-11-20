#!/usr/bin/env node
/**
 * 根据文章 frontmatter 生成明暗两套封面 SVG（A 方案：图案主导）。
 *
 * 用法：
 *   node scripts/gen-covers.mjs                 # 生成全部文章
 *   node scripts/gen-covers.mjs --only a,b      # 只生成指定 slug（文件名去扩展名）
 *   node scripts/gen-covers.mjs --dry-run       # 只打印将写入的路径
 *
 * 输出镜像文章目录：docs/public/images/<文章相对目录>/<slug>-<scheme>.svg
 * 同分类的不同文章通过 slug 派生的确定性变体区分图案拓扑。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = path.join(root, 'docs/posts')
const publicCovers = path.join(root, 'docs/public/covers')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const onlyArg = args.find((a) => a.startsWith('--only'))
const only = onlyArg
  ? (onlyArg.includes('=') ? onlyArg.split('=')[1] : args[args.indexOf(onlyArg) + 1] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null

/* ---------- frontmatter ---------- */

function parseScalar(value) {
  const v = value.trim()
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }
  return v.replace(/^['"]|['"]$/g, '')
}

function parseFrontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
  if (!m) return null
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    if (!line || /^\s/.test(line) || line.startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx < 0) continue
    meta[line.slice(0, idx).trim()] = parseScalar(line.slice(idx + 1))
  }
  return meta
}

/* ---------- 文章 ---------- */

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (entry.name.endsWith('.md') && entry.name !== 'index.md') out.push(p)
  }
  return out
}

const posts = walk(postsDir)
  .map((file) => {
    const meta = parseFrontmatter(fs.readFileSync(file, 'utf8'))
    if (!meta?.title) return null
    return {
      file,
      relDir: path.relative(postsDir, path.dirname(file)).split(path.sep).join('/'),
      slug: path.basename(file, '.md'),
      title: String(meta.title),
      date: meta.date ? new Date(meta.date) : new Date(fs.statSync(file).birthtimeMs),
      categories: [].concat(meta.categories || []),
      tags: [].concat(meta.tags || []),
    }
  })
  .filter(Boolean)
  .sort((a, b) => +b.date - +a.date)

/* ---------- 工具 ---------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function seedOf(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const pick = (seed, n) => seed % n

const CATEGORY_EN = {
  Git: 'GIT',
  AI: 'AI',
  前端: 'FRONTEND',
  后端: 'BACKEND',
  数据库: 'DATABASE',
  运维: 'DEVOPS',
  工具: 'TOOLS',
  其它: 'OTHER',
}

/* ---------- 标题竖排（左栏内垂直居中，字多自动分列） ---------- */

const TITLE_COL = { left: 96, right: 520, center: 308, width: 400 }
const TITLE_MID_Y = 480
const TITLE_MAX_H = 560

function charWidth(ch) {
  if (/[一-鿿　-〿＀-￯]/.test(ch)) return 1
  if (/[A-Z]/.test(ch)) return 0.7
  if (/[a-z]/.test(ch)) return 0.58
  if (/[0-9]/.test(ch)) return 0.6
  if (ch === ' ') return 0.32
  return 0.5
}

function measure(str, size, spacing) {
  const units = [...str].reduce((sum, ch) => sum + charWidth(ch), 0)
  return units * size + Math.max(0, [...str].length - 1) * spacing
}

// 连续英文/数字算一个词，空白单独成 token，中文逐字
function tokenize(text) {
  return text.match(/[A-Za-z0-9.+#/_-]+|\s+|[^\s]/g) || []
}

/** 拆出英文段与中文段：英文作横排标签，中文竖排 */
function splitTitle(title) {
  const latin = (title.match(/[A-Za-z][A-Za-z0-9.+#/_-]*/g) || []).join(' ')
  const cjk = title.replace(/[A-Za-z0-9.+#/_-]+/g, ' ').replace(/\s+/g, '')
  return { latin, cjk }
}

let zhSegmenter = null

/** 中文按词切分；环境不支持 Intl.Segmenter 时退回逐字 */
function cjkWords(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    zhSegmenter ||= new Intl.Segmenter('zh', { granularity: 'word' })
    return [...zhSegmenter.segment(text)].map((s) => s.segment).filter((w) => w.trim())
  }
  return [...text]
}

/**
 * 把词序列连续切成 k 段，最小化「最长段」长度（minimax DP），
 * 保证列与列之间在词边界断开且长度均衡。
 */
function partitionWords(words, k) {
  const n = words.length
  const parts = Math.max(1, Math.min(k, n))
  const prefix = [0]
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + [...words[i]].length

  const dp = Array.from({ length: n + 1 }, () => Array(parts + 1).fill(Infinity))
  const cut = Array.from({ length: n + 1 }, () => Array(parts + 1).fill(0))
  dp[0][0] = 0
  for (let j = 1; j <= parts; j++) {
    for (let i = j; i <= n; i++) {
      for (let p = j - 1; p < i; p++) {
        const segLen = prefix[i] - prefix[p]
        const worst = Math.max(dp[p][j - 1], segLen)
        if (worst < dp[i][j]) {
          dp[i][j] = worst
          cut[i][j] = p
        }
      }
    }
  }

  const bounds = []
  let i = n
  for (let j = parts; j > 0; j--) {
    const p = cut[i][j]
    bounds.unshift([p, i])
    i = p
  }
  return bounds.map(([a, b]) => words.slice(a, b).join(''))
}

/** 竖排：每列从上到下，列从右往左；按词边界分列，字号收缩到不超过 4 列 */
function layoutVertical(text, label) {
  const chars = [...text]
  const words = cjkWords(text)
  const build = (colCount, size, step) => {
    const columns = partitionWords(words, colCount).map((part) => [...part])
    return { mode: 'vertical', columns, size, step, label }
  }
  for (let size = 46; size >= 22; size -= 2) {
    const step = Math.round(size * 1.16)
    // 单列最多 7 字，过长就分列，避免一根长条
    const maxPerCol = Math.max(1, Math.min(7, Math.floor(TITLE_MAX_H / step)))
    const colCount = Math.ceil(chars.length / maxPerCol)
    const colStep = Math.round(size * 1.55)
    if (colCount <= 4 && colCount * colStep <= TITLE_COL.width) {
      return build(colCount, size, step)
    }
  }
  const size = 22
  return build(4, size, Math.round(size * 1.16))
}

function wrapHorizontal(text, size, spacing) {
  const lines = []
  let cur = ''
  for (const token of tokenize(text)) {
    const next = cur + token
    if (cur && measure(next.trimEnd(), size, spacing) > TITLE_COL.width) {
      lines.push(cur.trim())
      cur = token.trimStart()
    } else {
      cur = next
    }
  }
  if (cur.trim()) lines.push(cur.trim())
  return lines
}

/** 横排：按宽度换行，最多 4 行 */
function layoutHorizontal(title) {
  for (let size = 44; size >= 24; size -= 2) {
    const spacing = size >= 36 ? 2 : 1
    const lines = wrapHorizontal(title, size, spacing)
    if (lines.length <= 4 && lines.every((l) => measure(l, size, spacing) <= TITLE_COL.width)) {
      return { mode: 'horizontal', lines, size, spacing }
    }
  }
  const spacing = 1
  return { mode: 'horizontal', lines: wrapHorizontal(title, 24, spacing), size: 24, spacing }
}

function layoutTitle(title) {
  const { latin, cjk } = splitTitle(title)
  // 中文标题竖排，英文段退为上方横排标签；纯英文标题横排
  if (cjk.length >= 2) return layoutVertical(cjk, latin)
  return layoutHorizontal(title)
}

/* ---------- 配色 ---------- */

const PALETTE = {
  light: { bg: '#f5f3ee', ink: '#1a2330', accent: '#6062ce', glow: 0.14 },
  dark: { bg: '#061119', ink: '#e3e5e8', accent: '#8f91e6', glow: 0.16 },
}

/* ---------- 图案（大版，中心区域 x 420–1500 / y 90–870） ---------- */

function gitVariants(c) {
  const { ink, accent: ac, bg } = c
  const node = (x, y, r = 28, filled = false, purple = false) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${purple ? ac : filled ? ink : bg}" stroke="${
      filled || purple ? 'none' : ink
    }" stroke-width="7" />`

  const main = (branches, extra = '') => `
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M880 110 V850" stroke="${ink}" stroke-width="9" stroke-opacity="0.85" />
    ${branches}
    ${extra}
  </g>
  <g>
    ${node(880, 110)}
    ${node(880, 330, 32, true)}
    ${node(880, 580)}
    ${node(880, 850)}
  </g>`

  const branch = (d, purple = false) => `
    <path d="${d}" fill="none" stroke="${purple ? ac : ink}" stroke-width="${purple ? 10 : 8}" stroke-opacity="${
    purple ? 1 : 0.5
  }" stroke-linecap="round" />
    <path class="flow" d="${d}" fill="none" stroke="${purple ? '#ffffff' : ac}" stroke-width="3.5" stroke-opacity="0.9" />`

  return [
    // 右分支
    main(
      branch('M880 330 C 1060 330 1100 200 1300 200 V 460 C 1100 460 1060 580 880 580') +
        branch('M880 580 C 1080 580 1120 760 1320 760', true)
    ) +
      node(1300, 200, 26) +
      node(1300, 460, 26) +
      node(1320, 760, 32, false, true) +
      `<rect x="960" y="308" width="110" height="14" rx="7" fill="${ink}" opacity="0.28" />`,
    // 左分支
    main(
      branch('M880 330 C 720 330 680 200 600 200 V 460 C 680 460 720 580 880 580') +
        branch('M880 580 C 720 580 680 760 600 760', true)
    ) +
      node(600, 200, 26) +
      node(600, 460, 26) +
      node(600, 760, 32, false, true) +
      `<rect x="1160" y="308" width="90" height="14" rx="7" fill="${ink}" opacity="0.28" />`,
    // 双侧
    main(
      branch('M880 330 C 1020 330 1050 200 1200 200 V 440 C 1050 440 1020 540 880 540') +
        branch('M880 540 C 720 540 690 700 640 700') +
        branch('M880 580 C 1060 580 1100 800 1280 800', true)
    ) +
      node(1200, 200, 26) +
      node(1200, 440, 26) +
      node(640, 700, 24) +
      node(1280, 800, 32, false, true) +
      `<rect x="960" y="308" width="100" height="14" rx="7" fill="${ink}" opacity="0.28" />`,
  ]
}

function frontendVariants(c) {
  const { ink, accent: ac } = c
  const shell = (inner) => `
  <g>
    <rect x="560" y="140" width="880" height="700" rx="22" fill="${ink === '#1a2330' ? '#ffffff' : '#0c1a25'}" fill-opacity="0.82" stroke="${ink}" stroke-width="4" stroke-opacity="0.45" />
    <line x1="560" y1="222" x2="1440" y2="222" stroke="${ink}" stroke-width="4" stroke-opacity="0.28" />
    <circle cx="612" cy="182" r="11" fill="${ac}" />
    <circle cx="650" cy="182" r="11" fill="${ink}" opacity="0.4" />
    <circle cx="688" cy="182" r="11" fill="${ink}" opacity="0.2" />
    ${inner}
  </g>`
  return [
    shell(`
      <rect x="600" y="264" width="180" height="536" rx="12" fill="${ac}" opacity="0.22" />
      <rect x="808" y="264" width="592" height="220" rx="12" fill="${ac}" opacity="0.4" />
      <rect x="808" y="512" width="286" height="288" rx="12" fill="${ac}" opacity="0.14" />
      <rect x="1114" y="512" width="286" height="288" rx="12" fill="${ink}" opacity="0.1" />
      <rect x="808" y="264" width="180" height="20" rx="10" fill="${ac}" />
      <rect x="836" y="330" width="300" height="12" rx="6" fill="${ink}" opacity="0.25" />
      <rect x="836" y="366" width="220" height="12" rx="6" fill="${ink}" opacity="0.25" />`),
    shell(`
      <rect x="600" y="264" width="392" height="536" rx="12" fill="${ac}" opacity="0.34" />
      <rect x="1012" y="264" width="388" height="250" rx="12" fill="${ac}" opacity="0.16" />
      <rect x="1012" y="542" width="388" height="258" rx="12" fill="${ink}" opacity="0.08" />
      <rect x="600" y="264" width="200" height="20" rx="10" fill="${ac}" />
      <rect x="640" y="330" width="260" height="12" rx="6" fill="${ink}" opacity="0.28" />
      <rect x="640" y="366" width="180" height="12" rx="6" fill="${ink}" opacity="0.28" />`),
    shell(`
      <rect x="600" y="264" width="796" height="150" rx="12" fill="${ac}" opacity="0.4" />
      <rect x="600" y="438" width="378" height="362" rx="12" fill="${ac}" opacity="0.18" />
      <rect x="996" y="438" width="400" height="362" rx="12" fill="${ink}" opacity="0.1" />
      <rect x="826" y="264" width="200" height="20" rx="10" fill="${ac}" />`),
  ]
}

function backendVariants(c) {
  const { ink, accent: ac } = c
  const stack = (count) => {
    const h = 96
    const gap = 24
    const total = count * h + (count - 1) * gap
    const top = 480 - total / 2
    const layers = Array.from({ length: count }, (_, i) => {
      const y = top + i * (h + gap)
      const hot = i === Math.floor(count / 2)
      return `
      <rect x="620" y="${y}" width="800" height="${h}" rx="16" fill="${hot ? ac : 'none'}" fill-opacity="${hot ? 0.16 : 0}" stroke="${ink}" stroke-width="4" stroke-opacity="0.42" />
      <circle cx="684" cy="${y + h / 2}" r="13" fill="${hot ? ac : ink}" opacity="${hot ? 0.95 : 0.45}" />
      <rect x="730" y="${y + 28}" width="230" height="12" rx="6" fill="${ink}" opacity="0.32" />
      <rect x="730" y="${y + 58}" width="150" height="12" rx="6" fill="${ink}" opacity="0.2" />
      <rect x="1300" y="${y + 26}" width="64" height="44" rx="10" fill="${ink}" opacity="0.12" />`
    })
    return `
    <g>${layers.join('')}</g>
    <path class="flow" d="M1020 ${top - 48} V${top} M1020 ${top + total} V${top + total + 48}" stroke="${ac}" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round" />`
  }
  return [stack(3), stack(4), stack(5)]
}

function aiVariants(c) {
  const { ink, accent: ac, bg } = c
  const net = (count, radius) => {
    const cx = 1000
    const cy = 480
    const nodes = Array.from({ length: count }, (_, i) => {
      const a = (Math.PI * 2 * i) / count - Math.PI / 2
      return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius, i }
    })
    const spokes = nodes
      .map(
        (n) => `
          <line x1="${cx}" y1="${cy}" x2="${n.x.toFixed(0)}" y2="${n.y.toFixed(0)}" stroke="${ink}" stroke-width="3" stroke-opacity="0.32" />
          <line class="flow" x1="${cx}" y1="${cy}" x2="${n.x.toFixed(0)}" y2="${n.y.toFixed(0)}" stroke="${ac}" stroke-width="3" stroke-opacity="0.85" />`
      )
      .join('')
    const dots = nodes
      .map(
        (n) =>
          `<circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${n.i % 3 === 0 ? 22 : 15}" fill="${
            n.i % 3 === 0 ? ac : bg
          }" stroke="${n.i % 3 === 0 ? 'none' : ink}" stroke-width="4" stroke-opacity="0.5" />`
      )
      .join('')
    return `
    <circle cx="${cx}" cy="${cy}" r="${radius - 60}" fill="none" stroke="${ac}" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="6 12" />
    ${spokes}
    ${dots}
    <circle cx="${cx}" cy="${cy}" r="64" fill="${ac}" opacity="0.9" />
    <circle cx="${cx}" cy="${cy}" r="28" fill="${bg}" />`
  }
  return [net(6, 330), net(8, 340), net(10, 350)]
}

function databaseVariants(c) {
  const { ink, accent: ac } = c
  const db = (count) => {
    const layerH = 92
    const total = count * layerH
    const top = 480 - total / 2
    const layers = Array.from({ length: count }, (_, i) => {
      const y = top + i * layerH
      return `
      <ellipse cx="1000" cy="${y}" rx="330" ry="64" fill="${i === 0 ? ac : 'none'}" fill-opacity="${i === 0 ? 0.26 : 0}" stroke="${ink}" stroke-width="4" stroke-opacity="0.45" />
      <path d="M670 ${y} V${y + layerH} A330 64 0 0 0 1330 ${y + layerH} V${y}" fill="none" stroke="${ink}" stroke-width="4" stroke-opacity="0.35" />`
    })
    return `<g>${layers.join('')}</g>`
  }
  return [db(2), db(3), db(4)]
}

function devopsVariants(c) {
  const { ink, accent: ac } = c
  const rings = (r1, r2, r3) => {
    const cx = 1000
    const cy = 480
    return `
    <g fill="none">
      <circle cx="${cx}" cy="${cy}" r="${r1}" stroke="${ink}" stroke-width="4" stroke-opacity="0.4" />
      <circle class="flow" cx="${cx}" cy="${cy}" r="${r2}" stroke="${ac}" stroke-width="4" stroke-opacity="0.55" stroke-dasharray="8 16" />
      <circle cx="${cx}" cy="${cy}" r="${r3}" stroke="${ink}" stroke-width="3" stroke-opacity="0.25" />
      <circle cx="${cx}" cy="${cy - r1}" r="22" fill="${ac}" />
      <circle cx="${cx + r2}" cy="${cy}" r="16" fill="${ink}" fill-opacity="0.5" />
      <circle cx="${cx - r2}" cy="${cy}" r="16" fill="${ink}" fill-opacity="0.5" />
      <circle cx="${cx}" cy="${cy + r3}" r="14" fill="${ink}" fill-opacity="0.35" />
      <circle cx="${cx}" cy="${cy}" r="60" fill="${ink}" fill-opacity="0.12" />
    </g>`
  }
  return [rings(150, 240, 330), rings(170, 280, 380), rings(130, 300, 400)]
}

function toolsVariants(c) {
  const { ink, accent: ac, bg } = c
  const term = (lines) => `
  <g>
    <rect x="580" y="190" width="840" height="600" rx="22" fill="${c.ink === '#1a2330' ? '#101922' : '#0a151d'}" stroke="${ink}" stroke-width="4" stroke-opacity="0.5" />
    <line x1="580" y1="266" x2="1420" y2="266" stroke="${ink}" stroke-width="4" stroke-opacity="0.2" />
    <circle cx="630" cy="228" r="10" fill="${ac}" />
    <circle cx="668" cy="228" r="10" fill="${ink}" opacity="0.4" />
    <text x="636" y="420" font-family="'Cascadia Code','Consolas',monospace" font-size="64" fill="${ac}" opacity="0.95">&gt;_</text>
    <rect x="716" y="378" width="34" height="52" fill="${ac}" opacity="0.85" />
    ${lines}
  </g>`
  const line = (y, w, o) => `<rect x="636" y="${y}" width="${w}" height="12" rx="6" fill="${ink}" opacity="${o}" />`
  return [
    term(line(500, 480, 0.3) + line(544, 340, 0.22) + line(588, 420, 0.15) + `<rect x="636" y="664" width="160" height="14" rx="7" fill="${ac}" opacity="0.7" />`),
    term(line(500, 300, 0.3) + line(544, 520, 0.22) + line(588, 260, 0.15) + `<rect x="636" y="664" width="220" height="14" rx="7" fill="${ac}" opacity="0.7" />`),
    term(line(500, 560, 0.3) + line(544, 420, 0.22) + line(588, 500, 0.15) + line(632, 300, 0.12) + `<rect x="636" y="700" width="140" height="14" rx="7" fill="${ac}" opacity="0.7" />`),
  ]
}

function otherVariants(c) {
  const { ink, accent: ac } = c
  const grid = (cols, rows, hot) => {
    const cw = 140
    const ch = 130
    const gw = cols * cw + (cols - 1) * 18
    const gh = rows * ch + (rows - 1) * 18
    const left = 1000 - gw / 2
    const top = 480 - gh / 2
    const cells = []
    for (let r = 0; r < rows; r++) {
      for (let q = 0; q < cols; q++) {
        const on = (r * cols + q) % hot === 0
        cells.push(
          `<rect x="${left + q * (cw + 18)}" y="${top + r * (ch + 18)}" width="${cw}" height="${ch}" rx="12" fill="${
            on ? ac : 'none'
          }" fill-opacity="${on ? 0.35 : 0}" stroke="${ink}" stroke-width="3" stroke-opacity="0.28" />`
        )
      }
    }
    return `<g>${cells.join('')}</g>`
  }
  return [grid(4, 3, 5), grid(5, 3, 7), grid(3, 4, 4)]
}

const PATTERN_SETS = {
  git: gitVariants,
  frontend: frontendVariants,
  backend: backendVariants,
  ai: aiVariants,
  database: databaseVariants,
  devops: devopsVariants,
  tools: toolsVariants,
  other: otherVariants,
}

const CATEGORY_PATTERN = {
  Git: 'git',
  AI: 'ai',
  前端: 'frontend',
  后端: 'backend',
  数据库: 'database',
  运维: 'devops',
  工具: 'tools',
  其它: 'other',
}

/* ---------- SVG ---------- */

const FONT_SANS = "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif"
const FONT_EN = "'Segoe UI','Helvetica Neue',sans-serif"

function animationStyle() {
  return `
    @media (prefers-reduced-motion: no-preference) {
      .flow { stroke-dasharray: 24 150; animation: flow 2.6s linear infinite; }
      .breathe { animation: breathe 3.2s ease-in-out infinite; }
      .breathe.d2 { animation-delay: 0.8s; }
      .breathe.d3 { animation-delay: 1.6s; }
    }
    @keyframes flow { from { stroke-dashoffset: 88; } to { stroke-dashoffset: 0; } }
    @keyframes breathe { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }`
}

function buildSvg(post, index, total, scheme) {
  const c = PALETTE[scheme]
  const seed = seedOf(post.slug + post.title)
  const catLabel = post.categories[0] || '其它'
  const catEn = CATEGORY_EN[catLabel] || 'OTHER'
  const key = CATEGORY_PATTERN[catLabel] || 'other'
  const variants = PATTERN_SETS[key](c)
  const pattern = variants[pick(seed, variants.length)]

  const keywords = (post.tags.length ? post.tags : post.categories).slice(0, 5).join(' · ')
  const dateStr = `${post.date.getFullYear()}.${String(post.date.getMonth() + 1).padStart(2, '0')}.${String(
    post.date.getDate()
  ).padStart(2, '0')}`

  const layout = layoutTitle(post.title)
  let title
  if (layout.mode === 'vertical') {
    const colStep = Math.round(layout.size * 1.55)
    const totalW = layout.columns.length * colStep
    const rightMostX = TITLE_COL.center + totalW / 2 - colStep / 2
    const maxColLen = Math.max(...layout.columns.map((col) => col.length))
    const blockTop = TITLE_MID_Y - (maxColLen * layout.step) / 2
    const startY = blockTop + Math.round(layout.size * 0.82)
    const labelY = Math.max(178, blockTop - 34)
    const labelSvg = layout.label
      ? `<text x="${TITLE_COL.center}" y="${labelY}" text-anchor="middle" font-family="${FONT_EN}" font-size="${Math.round(
          layout.size * 0.66
        )}" font-weight="600" letter-spacing="2" fill="${c.accent}">${esc(layout.label)}</text>\n  `
      : ''
    title =
      labelSvg +
      layout.columns
        .flatMap((col, ci) => {
          const x = rightMostX - ci * colStep
          return col.map(
            (ch, ri) =>
              `<text x="${x}" y="${startY + ri * layout.step}" text-anchor="middle" font-family="${FONT_SANS}" font-size="${layout.size}" font-weight="600" fill="${c.ink}">${esc(
                ch
              )}</text>`
          )
        })
        .join('\n  ')
  } else {
    const lineHeight = Math.round(layout.size * 1.34)
    const firstBaseline =
      TITLE_MID_Y - (layout.lines.length * lineHeight) / 2 + Math.round(layout.size * 0.82)
    title = layout.lines
      .map(
        (line, i) =>
          `<text x="${TITLE_COL.center}" y="${firstBaseline + i * lineHeight}" text-anchor="middle" font-family="${FONT_SANS}" font-size="${layout.size}" font-weight="600" letter-spacing="${layout.spacing}" fill="${c.ink}">${esc(
            line
          )}</text>`
      )
      .join('\n  ')
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="960" viewBox="0 0 1600 960" role="img" aria-label="${esc(
    post.title
  )} 封面">
  <style>${animationStyle()}
  </style>
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="${c.ink}" opacity="0.14" />
    </pattern>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${c.accent}" stop-opacity="${c.glow}" />
      <stop offset="1" stop-color="${c.accent}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1600" height="960" fill="${c.bg}" />
  <rect width="1600" height="960" fill="url(#dots)" />
  <circle cx="900" cy="470" r="520" fill="url(#glow)" class="breathe" />

  <g>${pattern}
  </g>

  <text x="${TITLE_COL.center}" y="132" text-anchor="middle" font-family="${FONT_EN}" font-size="20" letter-spacing="6" fill="${c.accent}">${String(
    index
  ).padStart(2, '0')} — ${total} · ${catEn}</text>
  ${title}

  <line x1="100" y1="860" x2="1500" y2="860" stroke="${c.ink}" stroke-width="1" stroke-opacity="0.25" />
  <text x="100" y="908" font-family="${FONT_SANS}" font-size="22" letter-spacing="3" fill="${
    c.ink
  }" fill-opacity="0.55">${esc(keywords)}</text>
  <text x="1500" y="908" text-anchor="end" font-family="${FONT_EN}" font-size="22" letter-spacing="3" fill="${
    c.ink
  }" fill-opacity="0.4">${dateStr}</text>
</svg>
`
}

/* ---------- frontmatter 注入 ---------- */

/** 把 cover 数组写入文章 frontmatter；已有 cover 块则替换，幂等 */
function injectCover(src, relDir, slug) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
  if (!m) return null
  const eol = src.startsWith('---\r\n') ? '\r\n' : '\n'
  const kept = []
  let inCover = false
  for (const line of m[1].split(/\r?\n/)) {
    if (/^cover:\s*(\[\])?$/.test(line) || /^cover:\s*\[/.test(line)) {
      inCover = true
      continue
    }
    if (inCover && /^\s+-\s/.test(line)) continue
    inCover = false
    kept.push(line)
  }
  kept.push('cover:')
  kept.push(`  - /covers/${relDir}/${slug}-light.svg`)
  kept.push(`  - /covers/${relDir}/${slug}-dark.svg`)
  return src.replace(m[0], `---${eol}${kept.join(eol)}${eol}---`)
}

/* ---------- 主流程 ---------- */

const writeFrontmatter = args.includes('--write-frontmatter')
const targets = only ? posts.filter((p) => only.includes(p.slug)) : posts
if (!targets.length) {
  console.error('没有匹配的文章')
  process.exit(1)
}

for (const post of targets) {
  const index = posts.indexOf(post) + 1
  const outDir = path.join(publicCovers, post.relDir)
  if (!dryRun) fs.mkdirSync(outDir, { recursive: true })
  for (const scheme of ['light', 'dark']) {
    const file = path.join(outDir, `${post.slug}-${scheme}.svg`)
    if (dryRun) {
      console.log('would write', path.relative(root, file))
      continue
    }
    fs.writeFileSync(file, buildSvg(post, index, posts.length, scheme), 'utf8')
    console.log('written', path.relative(root, file))
  }

  if (writeFrontmatter && !dryRun) {
    const src = fs.readFileSync(post.file, 'utf8')
    const next = injectCover(src, post.relDir, post.slug)
    if (next && next !== src) {
      fs.writeFileSync(post.file, next, 'utf8')
      console.log('frontmatter', path.relative(root, post.file))
    }
  }
}
