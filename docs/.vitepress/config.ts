import { defineConfig } from 'vitepress-theme-async/config'
import pkg from '../../package.json' with { type: 'json' }

const author = pkg.author.name

/**
 * 获取实际年龄
 * @param year - 年
 * @param month - 月
 * @param day - 日
 */
function getAge(year: number, month: number, day: number) {
  const date = new Date()
  let age = date.getFullYear() - year
  const currentMonth = date.getMonth() + 1
  const currentDay = date.getDate()
  if (currentMonth < month) {
    return age - 1
  }
  if (currentMonth > month) {
    return age
  }
  if (currentDay < day) {
    return age - 1
  }
  return age
}

export default defineConfig({
  base: '/', // 站点将部署到的 base URL
  srcDir: './',
  lang: 'zh',
  cleanUrls: true,
  /* 网站信息 */
  title: 'Blog',
  titleTemplate: `${author} 的小站`,
  description: `${author} 使用 Vitepress 搭建的博客站点`,
  rewrites: {
    'posts/(.*)': '(.*)',
  },
  /* 主题配置 */
  themeConfig: {
    // globalComponents: true, // 开启全局组件
    postDir: 'posts',
    rewritePost: true,
    // 自定义样式 - ['明亮模式', '暗黑模式']
    themeColor: {
      enable: true,
      primary: ['#6062ce', '#6062ce'],
      primaryWeak: ['#49649d', '#7a89df'],
      bodyColor: ['#1f2d3d', '#f1f1f1b3'],
      bodyBgColor: ['#00151f', '#00151f'],
      themeColor: ['#00283a', '#dedee0'],
      themeBgColor: ['#fcfcfe', '#00283a'],
      themeBg2Color: ['#f4f5f7', '#02162b'],
    },
    favicon: {
      logo: '/logo.png',
      icon16: '/favicon.ico',
      icon32: '/favicon.ico',
      appleTouchIcon: '/logo.png',
      visibilitychange: true,
    },
    page: {
      index: '/',
      archives: '/archives',
      categories: '/categories',
      tags: '/tags',
    },
    topBars: [
      { title: 'home', url: '/' },
      { title: 'archives', url: '/archives' },
      { title: 'categories', url: '/categories' },
      { title: 'tags', url: '/tags' },
      // { title: 'links', url: '/links' },
      { title: 'about', url: '/about' },
      // { title: 'gallery', url: '/gallery' },
    ],
    outline: {
      level: [2, 6],
      label: '目录列表',
    },
    user: {
      name: `${author}`,
      firstName: 'Chigga',
      lastName: 'Def',
      email: 'defchigga@qq.com',
      /* 友链信息 */
      domain: 'https://www.bing.com',
      // avatar: 'https://foruda.gitee.com/avatar/1677493109319365464/8702488_defchigga_1677493109.png!avatar200',
      avatar: '/avatar.jpg',
      darkAvatar: '/avatar.jpg',
      describe: '记录学习笔记~',
      ruleText:
        '暂不接受个人博客以外的友链申请，确保您的网站内容积极向上，文章至少30篇，原创70%以上，部署HTTPS。',
    },
    sidebar: {
      typedTextPrefix: '',
      typedText: ['just do it！', '就要干 it！'],
      social: [
        {
          // GitHub profile link. The icon previously inlined a
          // hand-drawn recreation of GitHub's Octocat; that has been
          // removed because it is a derivative of a registered
          // trademark used outside the bounds of GitHub's Logo
          // Policy and Trademark Policy. The linked service is now
          // identified by a plain text label only, which is a
          // nominative use.
          name: 'GitHub',
          url: 'https://github.com/Def-Chigga',
          icon: '<span class="trm-social-text">GitHub</span>',
        },
        {
          // Gitee profile link. Same nominative-use rationale as
          // the GitHub entry above: no Gitee mark or derivative is
          // used; the linked destination is identified by a plain
          // text label only.
          name: 'Gitee',
          url: 'https://gitee.com/defchigga',
          icon: '<span class="trm-social-text">Gitee</span>',
        },
      ],
      info: [
        {
          key: 'residence',
          val: 'mars',
        },
        {
          key: 'city',
          val: 'kunming',
        },
        {
          key: 'age',
          val: String(getAge(1997, 7, 14)),
        },
      ],
    },
    banner: {
      type: 'img', // 'img' | 'video'
      // Original SVG created for this repository. See NOTICE §3.
      bgurl: '/banner-bg.svg',
      bannerTitle: 'Hello word',
      bannerText: 'Hi my new friend!',
      // ...
    },
    footer: {
      powered: {
        enable: false,
      },
      // The Chinese MIIT (beian) ICP record is shown only when a
      // valid, registered number is available. Displaying an
      // unregistered or fabricated ICP number would be misleading;
      // if you do hold a real ICP number for this site, replace
      // the string below with the exact number issued by
      // https://beian.miit.gov.cn and set `enable: true`.
      beian: {
        enable: false,
        icp: '',
      },
      copyrightYear: '2026',
      liveTime: {
        enable: true,
        prefix: '博客已萌萌哒运行',
        startTime: '2026/01/17',
      },
    },

    /* 内置页面配置 */
    // 友链
    links: [
      {
        name: 'Vitepress',
        url: 'https://vitepress.dev',
        image: 'https://vitepress.dev/vitepress-logo-mini.svg',
        desc: 'VitePress is a Static Site Generator (SSG) designed for building fast, content-centric websites',
      },
      /*{
        name: '白云苍狗',
        url: 'https://www.imalun.com/',
        image: 'https://www.imalun.com/images/avatar.jpg',
        desc: '醒，亦在人间；梦，亦在人间',
      },*/
    ],
    // 关于
    about: {
      title:
        '如果一切都是镜花水月，那就让这万物走向终结。如果一切皆是命中注定，那就让这世界消失殆尽。',
      introduction: `大家好，我是 <strong>${author}</strong>，很高兴您能在浩瀚如烟的互联网世界里发现这个博客，更感谢您能够饶有兴致地浏览这个页面。建立这个 Blog 是出于兴趣爱好，我将在此分会分享一些学习笔记，可能还会分享少许图片、视频以及其他有趣东西的链接。`,
      blog: `<ul class="trm-list"> <li>程序：Vitepress </li> <li>托管：GitHub </li> </ul>`,
      privacy:
        '本网站不会追踪访客行为，且不要求访客提供身份证号、手机号等敏感信息。站点内容以学习记录与技术交流为主；如涉及转载、引用或第三方资源，我会尽量标注来源并在收到通知后及时核查处理。访客参与评论时必须遵守法律法规与基本公序良俗，不得发布违法、侵权、骚扰、暴力、博彩、淫秽或其它不当内容。站点内容亦不应用于绕过服务条款、访问控制、计费规则或账号限制等违规用途。',
    },
    // 404
    notFound: {
      text: '从前有座山，山里有座庙，庙里有个页面，现在找不到...',
    },

    /* 文章详情配置 */
    reward: {
      enable: false,
      methods: [
        { name: '微信', path: '' },
        { name: '支付宝', path: '' },
        { name: 'QQ', path: '' },
      ],
    },
    creativeCommons: {
      license: 'by-nc-sa',
      language: 'deed.zh-hans',
      post: true, // 在每篇文章末尾显示
      clipboard: false, // 是否在复制文章时，在剪贴板中追加版权信息
    },
    postPagination: {
      enable: true,
      type: 'small', // 'large' | 'small'
    },
    cover: {
      type: 'img', // 'img' | 'date' | 'random'
      default: '',
    },
    noticeOutdate: {
      enable: true,
      style: 'flat', // 'simple' | 'flat'
      limitDay: 365,
      position: 'top',
    },
    /*errorImg: {
      flink: '',
      postPage: ''
    },*/

    /* 其它配置 */
    rightside: {
      readmode: true,
      aside: true,
    },
    indexGenerator: {
      // perPage: 10,
      // orderBy: '',
      static: true,
    },
    archiveGenerator: {
      style: 'less', // less | more
      static: true,
    },
    categorieCard: {
      enable: true,
      len: 4,
      list: ['Git', 'AI', '前端', '后端', '数据库', '运维', '工具', '其它'],
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
    pageLoading: true,
    themeLoading: true,
    author,
  },

  /* Vite 配置 */
  vite: {
    build: {
      minify: 'terser', // 确保使用 Terser 进行压缩
      terserOptions: {
        compress: {
          drop_console: true, // 移除所有 console.*
          drop_debugger: true, // 如果需要，也可以一并移除 debugger 语句
        },
      },
    },
  },
})
