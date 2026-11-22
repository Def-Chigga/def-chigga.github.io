---
title: MCP 规格说明
date: 2026-07-30
categories: [AI]
tags: [MCP]
cover:
  - /covers/ai/mcp/specification-light.svg
  - /covers/ai/mcp/specification-dark.svg
---

# MCP 规格说明

> DefChigga <defchigga@qq.com>
>
> 2026年07月30日

> **来源 (Source)**：本手册为原创学习笔记；协议内容依据 [MCP 官方规范](https://modelcontextprotocol.io/specification)（基线 2026-07-28）整理，示例代码与核验记录由作者编写。

## 前言

本册承接第一册《MCP 入门》。开始前，你应能区分主应用、客户端与服务端，启动 MCP 服务并调用工具、读取资源、获取提示模板，也能用 stdio 或 Streamable HTTP 完成一次连接与排错。

本册以协议修订 2026-07-28 为基线。从熟悉的笔记服务出发，借助实验台对照线上消息，理解版本、能力、传输和授权规则。遇到具体的方法或字段，可用册末类型索引查阅。实验给出所需源码、配置、运行步骤和检查标准。

## 目录

- [第1章 如何阅读协议与建立实验台](#第1章-如何阅读协议与建立实验台)
- [第2章 规格说明总览](#第2章-规格说明总览)
- [第3章 架构](#第3章-架构)
- [第4章 基础协议：消息、版本与交互模式](#第4章-基础协议消息版本与交互模式)
- [第5章 基础协议：传输与交互实验](#第5章-基础协议传输与交互实验)
- [第6章 基础协议：授权](#第6章-基础协议授权)
- [第7章 客户端特性](#第7章-客户端特性)
- [第8章 服务器特性](#第8章-服务器特性)
- [第9章 附加工具：补全、分页与缓存](#第9章-附加工具补全分页与缓存)
- [第10章 安全、信任与保障](#第10章-安全信任与保障)
- [第11章 核心方法、字段与类型索引](#第11章-核心方法字段与类型索引)

## 第1章 如何阅读协议与建立实验台

### 1.1 从消息而不是术语表开始

设想客户端要求读取一条笔记。要判断实现是否正确，需要回答：谁发请求、用哪个方法、参数是否完整、服务端需要什么能力、返回哪种结果、失败时用哪种错误。规范给出这些共同规则，SDK 则把规则封装成程序接口。

本册采用正式协议修订 `2026-07-28` 的现行推荐能力。协议日期不是 SDK 版本；Python 示例固定 mcp 2.3.0，TypeScript 的服务端和客户端固定 2.3.1、Node 适配包 2.1.0。应用自己的 `1.0.0` 又是另一种版本。不要把应用自报名称和版本用于授权。

### 1.2 读懂规范用语与消息示例

“必须/不得”对应 MUST/MUST NOT，是符合规范的硬要求；“应当/不应当”对应 SHOULD/SHOULD NOT，有充分理由才能偏离；“可以”对应 MAY，表示可选行为。示例中的名字和业务数据可替换，字段名、方法和枚举值按协议保留。

JSON 结构摘录用于解释对象，完整请求还必须含本次协议版本和客户端能力。`_meta` 放在 `params` 内；不是所有 SDK 的参数名都与线上驼峰字段一致，例如 Python 的 `structured_content` 对应线上的 `structuredContent`。

### 1.3 建立可以独立运行的实验台

沿用第一册的语言环境和启动方法，在本册实验台中固定 SDK 版本和测试输入。用同一组调用比较协议报文、返回结果与错误。

为 Python 和 TypeScript 各建一个空目录。Python 3.12 建虚拟环境后安装下面的 requirements；Node 24.22.1 按 package.json 安装并编译。Windows 命令中的相对路径以当前目录为起点，带空格路径需引号，PowerShell 调用带引号的程序时加 `&`。

#### 1.3.1 Python 工程

`requirements.txt`：

```text
mcp==2.3.0
```

`server.py`：

```python
import argparse
import json
import logging
import sys
from typing import Annotated
from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ResourceNotFoundError, ToolError
from pydantic import BaseModel, Field

mcp = MCPServer('LearningNotes')
NOTES = {
    'mcp': {'title': 'MCP', 'text': 'MCP 统一应用与工具、资源的通信。'},
    'stdio': {'title': 'stdio', 'text': 'stdio 服务端的日志应写入 stderr。'},
    'schema': {'title': 'Schema', 'text': 'Schema 描述参数结构，执行端仍需验证业务规则。'},
}

class NoteHit(BaseModel):
    id: str
    title: str
    text: str

class SearchResult(BaseModel):
    query: str
    items: list[NoteHit]
    total: int

@mcp.tool()
def search_notes(
    query: Annotated[str, Field(min_length=1, max_length=100)],
    limit: Annotated[int, Field(ge=1, le=5)] = 3,
) -> SearchResult:
    """搜索三条固定笔记。只读；空白查询是业务错误。"""
    query = query.strip()
    if not query:
        raise ToolError('query 不能全为空白')
    hits = [NoteHit(id=key, **value) for key, value in NOTES.items()
            if query.lower() in (value['title'] + value['text']).lower()][:limit]
    return SearchResult(query=query, items=hits, total=len(hits))

@mcp.resource('notes://catalog')
def catalog() -> str:
    """返回固定目录，不暴露本机路径。"""
    return json.dumps({key: value['title'] for key, value in NOTES.items()}, ensure_ascii=False)

@mcp.resource('notes://item/{note_id}')
def read_note(note_id: str) -> str:
    """仅允许读取固定笔记ID。"""
    if note_id not in NOTES:
        raise ResourceNotFoundError('笔记不存在')
    return NOTES[note_id]['text']

@mcp.prompt()
def explain_note(note_id: str) -> str:
    """生成解释笔记的消息，不执行任何工具。"""
    if note_id not in NOTES:
        raise ValueError('笔记不存在')
    return f"请用初学者能理解的语言解释这条笔记：{NOTES[note_id]['text']}"

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--http', action='store_true')
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    logging.basicConfig(stream=sys.stderr, level=logging.INFO)
    if args.http:
        mcp.run(transport='streamable-http', host='127.0.0.1', port=args.port)
    else:
        mcp.run()
```

`client.py`：

```python
import argparse
import asyncio
import json
import sys
from pathlib import Path
from mcp.client import Client
from mcp import StdioServerParameters

async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--command', default=sys.executable)
    parser.add_argument('--server', default=str(Path(__file__).with_name('server.py')))
    args = parser.parse_args()
    target = args.url or StdioServerParameters(command=args.command, args=[args.server])
    async with Client(target, mode='2026-07-28') as client:
        tools = await client.list_tools()
        print('tools:', ', '.join(tool.name for tool in tools.tools))
        result = await client.call_tool('search_notes', {'query': 'stdio', 'limit': 2})
        if result.is_error:
            raise RuntimeError(str(result.content))
        print('search:', json.dumps(result.structured_content, ensure_ascii=False))
        resource = await client.read_resource('notes://item/stdio')
        for block in resource.contents:
            if hasattr(block, 'text'):
                print('resource:', block.text)
        prompt = await client.get_prompt('explain_note', {'note_id': 'stdio'})
        for message in prompt.messages:
            if message.content.type == 'text':
                print('prompt:', message.content.text)

if __name__ == '__main__':
    asyncio.run(main())
```

```powershell
python -m venv .venv
& .\.venv\Scripts\python.exe -m pip install -r requirements.txt
& .\.venv\Scripts\python.exe client.py
```

#### 1.3.2 TypeScript 工程

`package.json`：

```json
{
  "name": "mcp-learning-notes",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "server": "node dist/server.js",
    "client": "node dist/client.js"
  },
  "dependencies": {
    "@modelcontextprotocol/server": "2.3.1",
    "@modelcontextprotocol/client": "2.3.1",
    "@modelcontextprotocol/node": "2.1.0",
    "zod": "4.2.1",
    "jose": "6.1.0"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "@types/node": "24.10.1"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "skipLibCheck": true
  },
  "include": ["*.ts"]
}
```

`server.ts`：

```typescript
import { createServer } from 'node:http'
import {
  McpServer,
  ResourceTemplate,
  ResourceNotFoundError,
  createMcpHandler,
} from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import {
  toNodeHandler,
  localhostHostValidation,
  localhostOriginValidation,
} from '@modelcontextprotocol/node'
import * as z from 'zod/v4'

const NOTES: Record<string, { title: string; text: string }> = {
  mcp: { title: 'MCP', text: 'MCP 统一应用与工具、资源的通信。' },
  stdio: { title: 'stdio', text: 'stdio 服务端的日志应写入 stderr。' },
  schema: { title: 'Schema', text: 'Schema 描述参数结构，执行端仍需验证业务规则。' },
}

function createNotesServer(): McpServer {
  const server = new McpServer({ name: 'LearningNotes', version: '1.0.0' })
  const hit = z.object({ id: z.string(), title: z.string(), text: z.string() })
  server.registerTool(
    'search_notes',
    {
      description: '搜索三条固定笔记。只读；空白查询是业务错误。',
      inputSchema: z.object({
        query: z.string().min(1).max(100),
        limit: z.number().int().min(1).max(5).default(3),
      }),
      outputSchema: z.object({ query: z.string(), items: z.array(hit), total: z.number().int() }),
    },
    async ({ query, limit }) => {
      query = query.trim()
      if (!query) return { isError: true, content: [{ type: 'text', text: 'query 不能全为空白' }] }
      const items = Object.entries(NOTES)
        .filter(([, value]) =>
          (value.title + value.text).toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, limit)
        .map(([id, value]) => ({ id, ...value }))
      const output = { query, items, total: items.length }
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    },
  )
  server.registerResource(
    'catalog',
    'notes://catalog',
    { mimeType: 'application/json' },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(
            Object.fromEntries(Object.entries(NOTES).map(([id, note]) => [id, note.title])),
          ),
        },
      ],
    }),
  )
  server.registerResource(
    'note',
    new ResourceTemplate('notes://item/{note_id}', { list: undefined }),
    { mimeType: 'text/plain' },
    async (uri, variables) => {
      const id = String(variables.note_id)
      if (!Object.hasOwn(NOTES, id)) throw new ResourceNotFoundError('笔记不存在')
      return { contents: [{ uri: uri.href, mimeType: 'text/plain', text: NOTES[id].text }] }
    },
  )
  server.registerPrompt(
    'explain_note',
    {
      description: '生成解释笔记的消息，不执行任何工具。',
      argsSchema: z.object({ note_id: z.string() }),
    },
    ({ note_id }) => {
      if (!Object.hasOwn(NOTES, note_id)) throw new Error('笔记不存在')
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请用初学者能理解的语言解释这条笔记：${NOTES[note_id].text}`,
            },
          },
        ],
      }
    },
  )
  return server
}

if (process.argv.includes('--http')) {
  const portIndex = process.argv.indexOf('--port')
  const port = portIndex < 0 ? 8766 : Number(process.argv[portIndex + 1])
  const handler = createMcpHandler(createNotesServer)
  const handle = toNodeHandler(handler, { onerror: console.error })
  const hostOK = localhostHostValidation()
  const originOK = localhostOriginValidation()
  const http = createServer((req, res) => {
    if (!hostOK(req, res) || !originOK(req, res)) return
    if (req.url !== '/mcp') {
      res.writeHead(404).end()
      return
    }
    void handle(req, res)
  })
  http.listen(port, '127.0.0.1', () => console.error(`MCP: http://127.0.0.1:${port}/mcp`))
  process.on('SIGINT', () => {
    void handler.close().finally(() => http.close())
  })
} else {
  serveStdio(createNotesServer)
}
```

`client.ts`：

```typescript
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
function option(name: string, fallback: string): string {
  const index = args.indexOf(name)
  return index < 0 ? fallback : args[index + 1]
}
const url = option('--url', '')
const command = option('--command', process.execPath)
const server = option('--server', fileURLToPath(new URL('./server.js', import.meta.url)))
const transport = url
  ? new StreamableHTTPClientTransport(new URL(url))
  : new StdioClientTransport({ command, args: [server] })
const client = new Client(
  { name: 'NotesClient', version: '1.0.0' },
  {
    versionNegotiation: { mode: { pin: '2026-07-28' } },
  },
)
try {
  await client.connect(transport)
  const tools = await client.listTools()
  console.log('tools:', tools.tools.map((tool) => tool.name).join(', '))
  const result = await client.callTool({
    name: 'search_notes',
    arguments: { query: 'stdio', limit: 2 },
  })
  if (result.isError) throw new Error(JSON.stringify(result.content))
  console.log('search:', JSON.stringify(result.structuredContent))
  const resource = await client.readResource({ uri: 'notes://item/stdio' })
  for (const block of resource.contents) if ('text' in block) console.log('resource:', block.text)
  const prompt = await client.getPrompt({ name: 'explain_note', arguments: { note_id: 'stdio' } })
  for (const message of prompt.messages)
    if (message.content.type === 'text') console.log('prompt:', message.content.text)
} finally {
  await client.close()
}
```

```powershell
npm install
npm run build
node dist/client.js
```

#### 1.3.3 预期结果与最小前置

两套客户端都列出 `search_notes`，搜索 stdio 得一条，读取资源得到 `stdio 服务端的日志应写入 stderr。`，获取模板得到要求解释该笔记的 user 消息。数据在服务端固定给出，先不接模型、数据库或授权服务器。

函数负责完成业务；注册把函数暴露为能力；客户端异步等待结果。Python 的 `async with` 与 TypeScript 的 `try/finally` 负责释放连接；函数中的字典/对象按固定 ID 查笔记。输入约束分别由 Pydantic 与 Zod 在运行时校验，静态类型不能检查网络发来的所有值。

macOS/Linux 使用 `.venv/bin/python`。HTTP 时先运行服务端 `--http`，再给客户端加 `--url http://127.0.0.1:8765/mcp`；TypeScript 服务的默认端口为8766。stdio 由客户端启动子进程，HTTP 服务是独立长驻进程。

### 1.4 练习与答案

**题1**：mcp 2.3.0 的数字是协议修订日期吗？**答案**：不是，这是 SDK 版本。

**题2**：代码通过编译能证明另一客户端可用吗？**答案**：不能，还需要检查消息、能力、传输、授权和业务边界，再实际互通。

**本章结果**：能独立启动实验台，区分业务代码、SDK 对象与线上消息，后续可以用同一输入观察不同层次的约束。

## 第2章 规格说明总览

### 2.1 规格解决的问题

模型上下文协议（Model Context Protocol，MCP）让应用把外部数据、工具和流程接入模型上下文。主应用（Host）管理会话、用户确认和上下文，客户端（Client）在主应用内维护与服务器（Server）的连接，服务器提供工具、资源和提示模板。这个设计借鉴了语言服务器协议（Language Server Protocol，LSP）用统一接口接入多种能力的思路。

### 2.2 协议组件与阅读顺序

| 组件                                            | 读本册哪里                                                        | 重点                                                       |
| :---------------------------------------------- | :---------------------------------------------------------------- | :--------------------------------------------------------- |
| 架构（Architecture）                            | [第3章 架构](#第3章-架构)                                         | 区分主应用、客户端与服务器的职责                           |
| 基础协议（Base Protocol）                       | 第4至6章                                                          | 消息、逐请求版本与能力、消息模式、传输和授权               |
| 客户端特性（Client Features）                   | [第7章 客户端特性](#第7章-客户端特性)                             | 服务器提出输入要求，由主应用协调用户信息征询               |
| 服务器特性（Server Features）                   | [第8章 服务器特性](#第8章-服务器特性)                             | 服务发现、提示模板、资源与工具                             |
| 附加工具（Additional Utilities）                | [第9章 附加工具：补全、分页与缓存](#第9章-附加工具补全分页与缓存) | 参数补全、分页与缓存，配合基础协议中的进度、取消和错误规则 |
| 安全、信任与保障（Security and Trust & Safety） | [第10章 安全、信任与保障](#第10章-安全信任与保障)                 | 保留用户控制权，验证身份和业务权限                         |
| 规格类型索引（Schema Reference）                | [第11章 核心方法、字段与类型索引](#第11章-核心方法字段与类型索引) | 查方法名、请求和结果字段                                   |

所有 MCP 实现必须支持基础协议、版本规则和消息模式，并按应用需要实现和声明额外特性。服务器必须实现服务发现方法（server/discover），客户端可以按需调用。双方使用 JSON-RPC 2.0 交换自包含的请求、响应和通知。每次请求的能力声明与本次操作相关，不能从连接历史推定。

### 2.3 如何辨认规范与扩展

协议数据结构以当前修订的 TypeScript 定义为准，JSON Schema 供自动处理。正文用“必须”“不得”“应当”“可以”表达约束与建议。示例业务数据用于理解消息格式，实现仍须核对方法约束。可选扩展通过明确的能力声明使用，例如交互应用（MCP Apps）、长任务（Tasks）和技能提供（Skills over MCP）。

### 2.4 协议关键变化（Key Changes）

本节以正式修订 `2025-11-25` 和 `2026-07-28` 为比较基线。先用它辨认现有客户端、服务端或网关采用的协议，再沿表中的章节核对实现细节。逐请求版的例子与字段定义均采用 `2026-07-28`。

#### 2.4.1 连接、发现与传输

| 核对项      | 2025-11-25                                                                                   | 2026-07-28 与迁移检查                                                                                                                                                                          |
| :---------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 生命周期    | 先发送 `initialize`，协商版本与能力，再发送 `notifications/initialized`                      | 取消初始化握手。每次请求在 `params._meta` 中声明协议版本和客户端能力。客户端应在请求中附带 `clientInfo`，服务器应在结果中附带 `serverInfo`。核对客户端构造请求及服务端逐请求校验               |
| 服务发现    | 初始化结果提供服务器能力与身份                                                               | 服务器必须实现 `server/discover`，客户端可先调用它取得版本列表、能力和身份。连接未知的 stdio 服务时可将其用作兼容探测                                                                          |
| 会话与目录  | Streamable HTTP 可分配 `Mcp-Session-Id`；服务端可把持久状态挂在会话上                        | 去掉协议会话及该头部。工具、资源和提示目录不按连接变化，仍可按身份和权限变化。跨调用业务状态可由服务端发放受主体约束的句柄，客户端按普通参数传回                                               |
| 变更通知    | HTTP 可用独立 GET 流；资源可通过 `resources/subscribe` 与 `resources/unsubscribe` 订阅或取消 | 用 `subscriptions/listen` 的 POST 响应流选择通知类型、接收确认及带订阅标识的通知。请求自身的进度仍走该请求的响应流。订阅的正常关闭流程见第4章                                                  |
| 断流与取消  | SSE 可选事件 ID 和 `Last-Event-ID` 恢复；断开连接本身不应被解释为取消请求                    | 取消 SSE 恢复和重投。需重新发起时使用新请求 ID，传输重发前先核对副作用和幂等策略。HTTP 请求响应流断开可让服务端感知取消，stdio 使用 `notifications/cancelled`                                  |
| HTTP 请求头 | 后续 HTTP 请求随协议规则携带 `MCP-Protocol-Version`，有会话时带会话标识                      | POST 的 `Mcp-Method` 镜像方法，`tools/call`、`prompts/get`、`resources/read` 的 `Mcp-Name` 镜像目标。工具可通过 `x-mcp-header` 指定需镜像的参数。服务端核对适用头与请求体的对应值              |
| 健康与诊断  | 有 `ping` 和按连接设定的日志级别                                                             | 新的可用性探测可使用 `server/discover` 或应用健康端点。逐请求日志级别使用 `io.modelcontextprotocol/logLevel`，未设置时服务器不得针对该请求发出协议日志通知。应用运行日志可走 stderr 或观测平台 |

Streamable HTTP 仍可使用 SSE 编码流式响应。迁移检查要区分这种响应格式和早期独立的 HTTP+SSE 传输。逐请求字段、错误响应、HTTP 代理校验和各自的取消条件分别见[第4章 基础协议：消息、版本与交互模式](#第4章-基础协议消息版本与交互模式)和第5章。

#### 2.4.2 请求、结果与扩展

| 核对项              | 2025-11-25                                                                    | 2026-07-28 与迁移检查                                                                                                                                                                                                     |
| :------------------ | :---------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 服务器需要更多输入  | 通过服务器发起的请求向客户端询问，原调用可以继续等待                          | 多轮请求（MRTR）返回 `InputRequiredResult`，本轮完成。客户端取得答案后，以新请求 ID 重发原方法并带 `inputResponses`，按约定回传 `requestState`。核心适用范围是调用工具、读取资源和获取提示                                |
| 表单与 URL 征询     | URL 模式用 `elicitationId` 关联并可有独立完成通知                             | 在下一轮请求确认结果，服务端用 `requestState` 保留必要关联。迁移时核对接受、拒绝、取消和过期，避免因页面关闭就认定用户已经完成                                                                                            |
| 结果判别字段        | 结果可无 `resultType`                                                         | 普通结果是 `complete`，需输入为 `input_required`，任务形态由扩展定义。读取旧版服务结果时，缺省 `resultType` 必须视为 `complete`                                                                                           |
| 长任务              | 实验性任务属于核心协议，客户端按调用选择；包括 `tasks/result` 和 `tasks/list` | 改为独立的 `io.modelcontextprotocol/tasks` 扩展。由服务端在已声明能力的工具调用上决定是否返回任务，用 `tasks/get` 轮询、`tasks/update` 提交运行所需输入。仍需处理普通结果                                                 |
| 扩展能力            | 有核心能力与各实现的实验字段                                                  | `ClientCapabilities.extensions` 和 `ServerCapabilities.extensions` 提供扩展协商位置。核对扩展标识、设置以及本次请求能力                                                                                                   |
| 缓存与目录          | 客户端可自行缓存列表，无通用的协议 TTL 和共享范围字段                         | 对 `server/discover`、`tools/list`、`prompts/list`、`resources/list`、`resources/read`、`resources/templates/list` 的完整结果提供 `ttlMs` 和 `cacheScope`。工具列表应保持确定性排序。共享缓存必须遵守授权边界             |
| Schema 和结构化结果 | 工具 Schema 形状受限，`structuredContent` 限于 JSON 对象                      | 工具 Schema 可使用 JSON Schema 2020-12 关键字，不限于常见字段。结构化结果可使用任意 JSON 值。校验器还要限制引用解析和组合条件消耗；若工具声明了输出 Schema，结果必须符合该 Schema                                         |
| 错误码与生成类型    | 资源不存在常用 `-32002`，部分生成的数值约束误限定为整数                       | `resources/read` 的资源不存在改用 `-32602`。`-32000` 至 `-32019` 给实现，`-32020` 至 `-32099` 由 MCP 规范保留。头部不匹配、缺少能力和不支持版本依次用 `-32020`、`-32021`、`-32022`。Schema 的相关数值约束按 `number` 处理 |
| 链路追踪            | 可由应用自行传递追踪上下文                                                    | `_meta` 约定 OpenTelemetry 的 `traceparent`、`tracestate`、`baggage` 键。传播前按信任边界检查，可观测字段不能作为身份凭据                                                                                                 |

#### 2.4.3 授权与兼容检查

| 核对项               | 迁移检查                                                                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 授权响应的签发者     | 授权服务器应返回 `iss`。客户端收到 `iss` 时，必须和发起流程时记录的授权服务器签发者匹配，再兑换授权码                                                          |
| 持久保存的客户端凭据 | 以授权服务器签发者标识为索引保存。同一资源换到另一授权服务器后，重新按该服务器支持的方式取得注册信息，不复用旧凭据                                             |
| 客户端登记           | 优先使用受支持的预登记或客户端标识元数据文档。若维护依赖动态登记的兼容路径，核对旧服务器支持与适用的 `application_type`，避免原生应用和 Web 应用的回调规则混用 |

排错时记录实际协议日期，并取一条入站请求及对应响应。先查版本字段、能力、方法和目标的头部映射，再核对结果形态、状态句柄、权限和授权签发者。若一次升级同时改了包、客户端和代理，可先证明当前版本之间能直接调用，再逐个恢复代理与兼容入口。

### 2.5 FastMCP 的版本与兼容性

#### 2.5.1 识别协议、SDK 与框架版本

| 看什么                | 这个值说明什么                             | 本册实测值                                                         |
| :-------------------- | :----------------------------------------- | :----------------------------------------------------------------- |
| 已选定的 MCP 协议修订 | 当前连接用哪套消息规则                     | 默认协商 `2026-07-28`；显式旧版模式与同一服务器协商为 `2025-11-25` |
| `mcp` 安装版本        | 官方 Python SDK 的 API 与底层协议实现      | `2.3.0`                                                            |
| `fastmcp` 安装版本    | 独立 Python 框架的装饰器、客户端和 CLI API | `4.2.4`，截至 2026-11-22 的稳定版                                  |
| 应用声明的服务器版本  | 业务代码或服务发布版本                     | 笔记服务为 `1.0.0`                                                 |

旧示例中的 `from mcp.server.fastmcp import FastMCP` 指向 Python SDK v1 内置接口。SDK v2 的高层服务类是 `mcp.server.MCPServer`。独立发行包使用 `from fastmcp import FastMCP`，4.x 基于官方 Python SDK v2。升级时按所选 API 改依赖和导入，TypeScript 按对应的官方 SDK 升级。安装哪个框架或 SDK 只说明实现具备的能力范围，连接采用哪个修订还要实测。

#### 2.5.2 框架升级对照

| 原代码或配置                     | 升到 4.2.4 要检查的差异                                                                                                                                                                                                                                                                                         |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SDK v1 自带的 FastMCP            | 改用独立框架时，从 `fastmcp` 导入并安装该包，HTTP 的 host、port、path 在启动时设置。选择官方 SDK v2 时，按 `MCPServer` 的注册方式调整装饰器和类型                                                                                                                                                               |
| 独立 FastMCP 2.x 的构造与注册    | 3.x 起把传输参数移到运行入口，组件显隐由 server/provider 管理，装饰器返回原函数。通过 `get_tool` 取得工具对象，需要自定义序列化时返回 `ToolResult`。预先核对授权配置、持久化存储和提示消息类型                                                                                                                  |
| 独立 FastMCP 2.x/3.x 的组合      | 使用 `mount(namespace=...)`、`create_proxy` 与 `add_transform`。组合后的子服务有独立的生命周期和中间件行为。若业务依赖启动时复制一次的快照，需显式注册要冻结的组件，并回归名称冲突和授权                                                                                                                        |
| 3.x 的 Python 依赖与部署         | 4.x 的依赖下限随 SDK v2 提升，升级指南列出 Pydantic 2.12+ 与服务器所需的 Starlette 1.0.1+。使用 FastAPI 挂载时，核对它允许的 Starlette 范围并重建锁文件。                                                                                                                                                       |
| FastMCP 3.x 的直接类型访问       | Python 字段改用 `input_schema`、`is_error`、`structured_content` 等 snake_case；消息仍按线上的 `inputSchema`、`isError`、`structuredContent` 编解码。类型可继续从 `mcp.types` 导入；新版兼容桥只作为改造过渡                                                                                                    |
| FastMCP 3.x 的低层错误与连接 API | `McpError` 构造改用 `code=`、`message=`，捕获后仍可查看 `error.code`。直接依赖 `client.session`、`ctx.session` 或请求内部对象的代码要适配 SDK v2 的接口；优先使用框架公开 API                                                                                                                                   |
| 自定义 FastMCP HTTP 客户端       | 4.x 使用 `httpx2`，同步检查客户端工厂、认证对象、异常捕获、日志名和 TLS 信任来源。公共客户端读取超时在 `Client(..., timeout=...)` 或定制 HTTP 工厂配置。工具函数中与 FastMCP 无关的对外 HTTP 调用按自身依赖处理                                                                                                 |
| 3.x 时代的连接状态和交互输入     | `mode="auto"` 优先协商逐请求版。应用若需跨请求状态，可显式使用按已认证主体保存的 `UserSession` 或经校验的 `SessionId`。旧 `ctx.elicit()` 只在握手版连接可用；现代连接让工具返回 `InputRequiredResult`，下一轮从工具入口重新执行并读取 `ctx.input_responses`。分别回归两代协议，并验证重发不会重复执行业务副作用 |
| 3.x 的任务配置                   | 4.x 安装 `fastmcp[tasks]`、注册 `TasksExtension`，由工具启用 `task=True`；客户端进程导入 `fastmcp_tasks`。普通 `call_tool` 可以轮询到最终结果，管理句柄时用 `call_tool_task`。测试未协商到 Tasks 时应用的回退行为                                                                                               |
| 中间件与资源模板                 | 4.x 通用中间件能看到更多消息，包括无效请求和通知。按方法与消息类型做计数或授权，精细监测工具可使用工具操作钩子。模板资源参数增加路径安全检查，缺失资源按现行协议映射错误。审查自定义授权层和测试用错误码                                                                                                        |
| 使用 `issuer_url` 的 OAuth 服务  | 分开核对签发者和 HTTP 路由地址。签发者不同于 `base_url` 时，元数据、令牌及授权响应的签发者采用 `issuer_url`，已有令牌和客户端缓存可能需要重新授权                                                                                                                                                               |
| 4.1.x 的 Python 版本与技能 API   | 4.2 要求 Python 3.11+。技能目录提供者使用 `fastmcp.skills.provider.SkillsDirectoryProvider`，客户端用 `list_skill_resources` 和 `read_skill`；检查 `SKILL.md` 的名称与目录名。4.2 也支持用 `Annotated` 声明注入依赖                                                                                             |
| 3.x/4.x 的脚本参数               | 本地脚本用 `Path` 或显式 stdio 传输。HTTP 地址用 URL 字符串。显式指定解释器及脚本路径能避免虚拟环境串用                                                                                                                                                                                                         |
| 4.2.1 到 4.2.4                   | 4.2.2 修正仅转换工具时技能发现的行为。4.2.3 修正部分输出 Schema 转换，后台任务可选用父追踪跨度并提高了 Docket 依赖下限。4.2.4 修正 OAuth 代理令牌处理及组件转换故障隔离。使用相应能力时分别回归技能目录、工具列表、输出校验、任务追踪或 OAuth 流程。                                                            |

FastMCP 4 的参数补全、缓存提示、网关路由头和扩展注册直接对应新版协议能力。应用界面、后台任务、技能及身份扩展还需核对配套包、客户端能力和部署配置。兼容迁移先记录当前导入、依赖和线上响应。大型 2.x 项目可先验证 3.x 的 API 改动，再验证 4.x 的 SDK 和协议改动，最终固定经回归的版本组合。

#### 2.5.3 如何验证同一服务兼容两个协议版本

用笔记服务做三项检查。本机 FastMCP 4.2.4 的默认客户端通过 stdio 和 HTTP 均协商到 `2026-07-28`。HTTP 线上可以在未握手的情况下发出携带完整元数据的首个 `tools/call`，响应为 `resultType: "complete"` 且无 `Mcp-Session-Id`。显式使用 FastMCP 的 `mode="legacy"` 时，同一服务协商到 `2025-11-25`，仍可执行同一个笔记工具。TypeScript 的官方 SDK 客户端固定使用 `2026-07-28` 也能连接该服务。

把这个结论限定在工具、资源和提示模板的兼容性。应用依赖多轮输入、订阅或任务时，应逐项验证能力声明、结果形态、缺能力回退以及授权，不能仅凭双方都成功调用一个简单工具就判定可以上线。

### 2.6 自测与答案

**题目**：服务端声明有工具能力，用户就能执行任意工具吗？

**答案**：能力声明表明服务端提供工具接口。具体调用还需校验当前身份、权限、参数和用户批准。

**题目**：同一个 FastMCP 服务连通新旧客户端，默认客户端和显式旧版客户端应该报告相同的协议日期吗？

**答案**：每条连接按双方支持的协议协商。记录实际日期，并按该日期检查握手、逐请求元数据和可用能力。

## 第3章 架构

模型上下文协议 (MCP，Model Context Protocol）遵循客户端（Clients）-主应用（Host）-服务端（Servers）架构，其中每个主应用可以运行多个客户端实例。MCP 是一种无状态协议（Stateless Protocol）：每个请求都是自包含的，并携带自身的协议版本和能力。该架构使用户能够在各个应用之间集成 AI 能力，同时保持清晰的安全边界并隔离关注点。MCP 基于 JSON-RPC 构建，提供一种专注于客户端与服务端之间上下文交换和用户交互协调的协议。

### 3.1 核心组件

**主应用、客户端与本地和远程服务器**

```mermaid
graph LR
    subgraph 应用主进程
        H[主应用 Host]
        C1[客户端 Client 1]
        C2[客户端 Client 2]
        C3[客户端 Client 3]
        H --> C1
        H --> C2
        H --> C3
    end
    subgraph 本机
        S1[服务器 Server 1<br/>文件与 Git]
        S2[服务器 Server 2<br/>数据库]
        R1[(本地资源 A)]
        R2[(本地资源 B)]
        C1 --> S1
        C2 --> S2
        S1 --> R1
        R1 --> S1
        S2 --> R2
        R2 --> S2
    end
    subgraph 互联网
        S3[服务器 Server 3<br/>外部 API]
        R3[(远程资源 C)]
        C3 --> S3
        S3 --> R3
        R3 --> S3
    end
```

#### 3.1.1 主应用（Host）

主应用进程充当容器和协调者：

- 创建并管理多个客户端实例
- 控制客户端的连接权限和 lifecycle（生命周期）
- 强制执行安全策略和同意（用户同意）要求
- 处理用户授权决策
- 协调 AI/LLM 集成和用户信息交互
- 管理跨客户端的上下文聚合

#### 3.1.2 客户端（Client）

每个客户端由主应用创建，并与恰好一个服务端通信：

- 与恰好一个服务端通信
- 在每个请求上附加协议版本和能力
- 双向路由协议消息
- 管理订阅（订阅）和通知
- 在服务端之间维护安全边界

主应用创建并管理多个客户端，每个客户端与特定服务端之间具有 1:1 关系。

#### 3.1.3 服务端（Server）

服务端提供专门的上下文和能力：

- 通过 MCP 原语暴露资源、工具和提示模板
- 独立运行，职责聚焦
- 在 reply 中通过 `InputRequiredResult` 请求客户端输入（用户信息征询）
- 必须遵守安全约束
- 可以是本地进程或远程服务

### 3.2 设计原则

MCP 基于若干关键的设计原则，这些原则指导其架构与实现：

1. **服务端应易于构建**
   - 主应用处理复杂的编排职责
   - 服务端聚焦于特定的、明确定义的能力
   - 简洁的接口最大限度降低实现开销
   - 清晰的分离使代码更易维护

2. **服务端应能组合使用**
   - 每个服务端以隔离的方式提供聚焦的功能
   - 多个服务端可以无缝组合
   - 共享协议实现互操作性
   - 模块化设计支持可扩展性

3. **服务端不应读取整个对话或窥视其他服务端**
   - 服务端仅接收必要的上下文信息
   - 完整的对话历史保留在主应用
   - 每个服务端保持隔离
   - 跨服务端交互由主应用控制
   - 主应用进程强制执行安全边界

4. **服务端与客户端可以逐步增加功能**
   - 核心协议提供最小化的必需功能
   - 附加能力可根据需要进行协商
   - 服务端和客户端独立演进
   - 协议为未来扩展性而设计

### 3.3 能力协商

模型上下文协议使用基于能力的协商系统，客户端和服务端在每个请求上声明其支持的功能。客户端在每个请求的 `_meta.io.modelcontextprotocol/clientCapabilities` 中包含其能力。服务端在响应 `server/discover` 时通告其能力，客户端可以在发出任何其他请求之前调用以预先发现能力。

- 服务端声明工具支持、资源订阅、提示模板等能力
- 客户端声明用户信息征询处理等能力
- 双方必须在整个交互过程中遵守所声明的能力
- 附加能力可以通过协议扩展进行协商

**可选的服务发现、逐请求调用与订阅**

```mermaid
sequenceDiagram
    participant Host as 主应用 (Host)
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    opt 可选服务发现
        Client->>Server: 发现服务（server/discover）
        Server-->>Client: 支持的协议版本与能力
    end
    loop 客户端发起请求
        Host->>Client: 用户或模型发起的操作
        Client->>Server: 请求携带元数据（_meta）<br/>含版本和客户端能力（clientCapabilities）
        alt 服务器需要客户端输入
            Server-->>Client: 需要补充输入的结果（InputRequiredResult）
            Client->>Host: 交给主应用处理输入
            Host-->>Client: 主应用返回输入响应
            Client->>Server: 重发原请求并附输入响应
        end
        Server-->>Client: 返回响应
        Client-->>Host: 更新界面或把结果交给模型
    end
    opt 可选订阅
        Client->>Server: 监听订阅（subscriptions/listen）<br/>如 toolsListChanged（工具目录变更）
        Server-->>Client: 订阅确认（notifications/subscriptions/acknowledged）
        loop 持续接收通知
            Server-->>Client: 变更通知（notifications/*）<br/>携带订阅标识（subscriptionId）
        end
    end
```

每个能力按逐请求方式解锁特定的协议功能。例如：

- 已实现的服务端 features 必须在服务端的能力中通告
- 接收资源更新通知需要打开一个 `subscriptions/listen` 流，并指定所需的资源 URI
- 工具调用要求服务端声明工具能力

此能力协商确保客户端和服务端对所支持的功能具有清晰的理解，同时保持协议的可扩展性。

### 3.4 练习、答案与使用边界

**练习**：发现结果声明支持工具，是否就允许当前用户调用所有工具？自报 clientInfo 能证明用户身份吗？

**参考答案**：发现不是强制握手，也不能授予业务权限；clientInfo/serverInfo 是自行报告的信息，不能当身份证明。

**操作检查**：先调用 server/discover，记录 supportedVersions 与 capabilities；再调用工具。把客户端能力置空时，普通只读工具仍可能成功，需要征询的工具则必须检查能力。

**速查**：把“会做什么”与“允许谁做”分开。服务端发现给出支持的版本和功能；客户端在每个请求声明自己能处理的交互。

**可观察结果**：观察 `server/discover` 的 `supportedVersions` 与 `capabilities`，再用该版本发出固定工具请求。同一主应用可通过不同客户端实例连接多个服务器，各次调用仍按实际请求参数及授权分别处理。

## 第4章 基础协议：消息、版本与交互模式

第3章确定了由谁发送请求和决定权限。本章把这些职责落实到消息信封、逐请求能力和交互模式。

### 4.1 协议版本与逐请求约定

本节说明客户端如何逐请求声明协议版本、服务端如何处理不支持的版本，以及双方如何按能力使用可选扩展。

本协议不存在协商握手。每个请求都携带其协议版本，服务端独立地接受或拒绝每个请求：

**请求版本支持与协商**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 请求携带元数据（_meta）
    alt 服务器支持该版本
        Server-->>Client: 返回结果
    else 服务器不支持该版本
        Server-->>Client: 协议版本不受支持错误（UnsupportedProtocolVersionError）
        Note over Client,Server: 客户端可选用双方支持的版本重试
    end
```

#### 4.1.1 协议版本协商

每个请求都在其 `_meta` 字段中声明所使用的协议版本。在 HTTP 上，该值还会随 `MCP-Protocol-Version` 标头一同发送。

如果服务端不支持所请求的版本（无论是该版本对服务端未知，还是服务端已知但选择不支持），**必须** 返回 `UnsupportedProtocolVersionError`，并列出其支持的版本：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32022,
    "message": "不支持的协议版本",
    "data": {
      "supported": ["2026-07-28"],
      "requested": "1900-01-01"
    }
  }
}
```

客户端 **应当** 从 `supported` 列表中选择一个双方都支持的版本并重试请求；若不存在兼容版本，则向用户报错。

服务端 **必须** 实现 `server/discover`。客户端 **可以** 在发送任何其他请求之前调用它以提前获知服务端所支持的版本，但这不是强制的：客户端可以自由地发起任意 RPC 内联调用，并在首选版本不受支持时处理 `UnsupportedProtocolVersionError`。

#### 4.1.2 扩展协商

客户端和服务端可以协商支持核心协议之外的、可选的扩展。扩展通过能力的 `extensions` 字段声明，其值是扩展标识符到各扩展设置对象的映射。扩展标识符 **必须** 遵循 `_meta` 键命名规则，且必须带有前缀。

以下示例展示了一个声明了 MCP Apps 扩展（标识符为 `io.modelcontextprotocol/ui`）的客户端：

```json
{
  "capabilities": {
    "extensions": {
      "io.modelcontextprotocol/ui": {
        "mimeTypes": ["text/html;profile=mcp-app"]
      }
    }
  }
}
```

以下是声明 Tasks 扩展（标识符为 `io.modelcontextprotocol/tasks`）的示例：

```json
{
  "capabilities": {
    "tools": {},
    "extensions": {
      "io.modelcontextprotocol/tasks": {}
    }
  }
}
```

每个扩展都会规定其设置对象的 Schema；空对象表示支持但无需额外设置。

如果一方支持某扩展而另一方不支持，支持方 **必须** 选择回退到核心协议行为，或以恰当的错误拒绝请求。扩展 **应当** 文档化其预期的回退行为。

#### 4.1.3 无状态请求与业务状态

每个请求提供处理该次操作所需的元数据和参数。服务器不得依赖同一连接上的先前请求来推断版本、客户端能力、身份或会话。服务器应准备处理属于不同任务、线程或对话的请求，并且不应要求有关联的操作复用同一个连接或进程。客户端也不应把单个任务、线程或对话的生命周期等同于 stdio 子进程的生命周期。

需要跨请求保留状态的业务必须用明确的标识符关联，例如任务 ID 或业务句柄。客户端需要读写该状态时，在相应请求中传入标识符。监听订阅（subscriptions/listen）仍是一次请求，响应保持为开放通知流。流的状态属于该请求，与底层连接上的其他请求无关。

### 4.2 基础消息

先识别消息信封，再解释参数。请求带 id 等待响应；通知没有 id，不应得到普通 RPC 响应。

**先观察一个例子**：对照同一 tools/call 的 id、method、params 与 result；分别构造缺少协议版本、方法不存在和参数错误，观察错误层次。

MCP 客户端与服务端之间的所有消息必须遵循 JSON-RPC 2.0 规范。协议定义了以下消息类型：

#### 4.2.1 请求

Requests 由客户端发送到服务端，以发起一项操作。

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

- Requests 必须包含字符串或整数类型的 ID。
- 与基础 JSON-RPC 不同，ID 不得为 `null`。
- 请求 ID 不得与发送方已发出且尚未收到响应的任何其他请求的 ID 相同。

#### 4.2.2 响应

Responses 作为对请求的回复发送，包含操作的结果或错误。

##### 4.2.2.1 结果响应

Result 响应在操作成功完成时发送。

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  result: {
    resultType: string;
    [key: string]: unknown;
  };
}
```

- Result 响应必须包含与之对应请求相同的 ID。
- Result 响应必须包含 `result` 字段。
- `result` 可以遵循任何 JSON 对象结构。
- `result` 必须包含 `resultType` 字段以指示结果的类型。

###### 4.2.2.1.1 结果类型

结果中的 `resultType` 字段指示所返回结果的类型。MCP 支持多态结果类型，允许服务端根据请求结果返回不同的结构。`resultType` 字段是一个字符串，客户端可以使用它来确定如何解析和处理 `result` 对象。

- `resultType` 为 `"complete"` 指示请求已成功完成，结果包含最终内容。
- `resultType` 为 `"input_required"` 指示请求尚未完成，需要更多信息才能处理。结果包含一个 `InputRequiredResult` 对象，其中含有所需的附加信息。
- 扩展可以添加额外的 `ResultType` 值。所支持的 `ResultType` 值集合必须由核心协议定义的集合与通过能力通告的支持扩展的任何附加值组成。
- 任何客户端无法识别的 `resultType` 值必须被视为无效。

##### 4.2.2.2 错误响应

Error 响应在操作失败或遇到错误时发送。

```typescript
{
  jsonrpc: "2.0";
  id?: string | number;
  error: {
    code: number;
    message: string;
    data?: unknown;
  }
}
```

- Error 响应必须包含与之对应请求相同的 ID（除非由于请求格式错误而无法读取 ID 的错误情况）。
- Error 响应必须包含一个带有 `code` 和 `message` 的 `error` 字段。
- Error codes 必须是整数。
- Error 响应可以包含一个 `data` 成员，其中带有任意类型的附加信息，例如嵌套错误。

##### 4.2.2.3 错误码

MCP 使用标准的 JSON-RPC 2.0 错误码（`-32700`、`-32600` 到 `-32603`）表示常规协议失败。

JSON-RPC 2.0 保留 `-32000` 到 `-32099` 范围用于实现自定义的服务端 errors。MCP 将此范围划分如下：

- **`-32000` 至 `-32019` —— legacy（遗留）。** 此子范围内的代码是在引入本策略之前由实现所分配的。新代码 MUST NOT 在此子范围内分配，新实现 SHOULD NOT 整体使用此子范围内的代码。除 `-32002`（见下文）外，接收方 MUST NOT 假定这些代码具有任何特定含义。
- **`-32020` 至 `-32099` —— 保留给 MCP 规范使用。** 此子范围内的错误码由 MCP 规范独占定义，并记录于 Schema 中。实现 MUST NOT 发出本规范未定义的此子范围内的任何代码，并且 MUST 仅以规定的含义使用已定义的代码。

MCP 定义以下错误码：

| Code     | Name                              |
| -------- | --------------------------------- |
| `-32020` | `HeaderMismatch`                  |
| `-32021` | `MissingRequiredClientCapability` |
| `-32022` | `UnsupportedProtocolVersion`      |

早期协议版本定义的代码仍被保留且不会被重用。本协议版本的实现不得发出以下代码：

纯粹属于实现本地错误的（例如 SDK 内部引发的请求超时）目前未由本规范分配代码。以 JSON-RPC 形式呈现本地错误的实现应确保其不会被误认为来自对端的错误。规范的未来版本可能会在保留的子范围内为常见的本地错误情形定义标准代码。

未由本规范定义用途的新错误码应当在 JSON-RPC 保留范围（`-32768` 至 `-32000`）之外分配；整数空间的其余部分可供应用自定义错误使用。

#### 4.2.3 通知

Notifications 由客户端发送至服务端或反之，作为单向消息。接收方不得发送响应。

```typescript
{
  jsonrpc: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

- 通知不得包含 ID。

#### 4.2.4 消息模式

模型上下文协议 (MCP) 支持若干消息模式，用于定义客户端和服务端如何交互：

1. **请求和响应**：客户端向服务端发送请求，服务端返回结果或错误。
2. **多轮请求 (MRTR)**：服务端需要客户端的额外输入（用户信息征询）才能完成请求。
3. **订阅与通知**：客户端订阅来自服务端的通知流，通知在发生时发送。

#### 4.2.5 练习与答案

**练习**：HTTP 返回200是否足以证明工具成功？一个响应能否同时带 result 与 error？

**参考答案**：成功响应与错误响应不能同时出现；HTTP 状态和 RPC/工具结果分别判断。

**操作检查**：对照同一 tools/call 的 id、method、params 与 result；分别构造缺少协议版本、方法不存在和参数错误，观察错误层次。

**速查**：先识别消息信封，再解释参数。请求带 id 等待响应；通知没有 id，不应得到普通 RPC 响应。

### 4.3 通用字段

元数据关联协议行为与追踪，图标帮助界面展示。它们可以被多个方法共用，但不能改变业务授权。

#### 4.3.1 元数据字段 \_meta

`_meta` 属性/参数由 MCP 保留，供客户端和服务端在其交互中附加额外的元数据。

MCP 为协议级元数据保留某些键名，如下所述；实现不得对这些键的值做任何假设。

**键名格式** 合法的 `_meta` 键名由两段组成：一个可选的 **前缀**，以及一个 **名称**。

**前缀**

- 若指定，必须为由点（`.`）分隔的一系列标签，后跟一个斜杠（`/`）。
  - 标签必须以字母开头，并以字母或数字结尾；内部字符可以是字母、数字或连字符（`-`）。
  - 实现应当使用反向 DNS 表示法（例如 `com.example/` 而非 `example.com/`）。
- 第二级标签为 `modelcontextprotocol` 或 `mcp` 的任何前缀都保留给 MCP 使用。
  - 例如：`io.modelcontextprotocol/`、`dev.mcp/`、`org.modelcontextprotocol.api/` 和 `com.mcp.tools/` 均被保留。
  - 但是 `com.example.mcp/` 未被保留，因为第二级标签为 `example`。

**名称**

- 除非为空，必须以字母数字字符（`[a-z0-9A-Z]`）开头和结尾。
- 可以包含连字符（`-`）、下划线（`_`）、点（`.`）以及字母数字字符。

**保留键**

本规范保留以下 `_meta` 键：

| 键                                           | 说明                         | 定义位置                         |
| -------------------------------------------- | ---------------------------- | -------------------------------- |
| `progressToken`                              | 使请求纳入进度通知           | 进度                             |
| `io.modelcontextprotocol/protocolVersion`    | 请求的协议版本               | 每个请求的协议字段（如下）       |
| `io.modelcontextprotocol/clientInfo`         | 客户端名称与版本             | 每个请求的协议字段（如下）       |
| `io.modelcontextprotocol/clientCapabilities` | 与请求相关的客户端能力       | 每个请求的协议字段（如下）       |
| `io.modelcontextprotocol/subscriptionId`     | 将通知与其发起订阅相关联     | 订阅与通知                       |
| `traceparent`, `tracestate`, `baggage`       | OpenTelemetry 追踪上下文传播 | OpenTelemetry 追踪上下文（如下） |

官方扩展在 `io.modelcontextprotocol/` 前缀下定义额外的 `_meta` 键，第三方扩展则使用各自的供应商前缀。这两种情况下，键均在扩展的文档中进行规定。

**每请求协议字段：**

客户端请求在 `_meta` 中携带以下 `io.modelcontextprotocol/*` 字段；标记为必需的字段必须包含在每个请求中。服务端使用这些字段来识别正在使用的协议版本和能力，而无需依赖任何先前的连接状态。有关版本协商规则，请参阅协议版本与能力规则。

| 键                                           | 类型                 | 必需 | 说明                                    |
| -------------------------------------------- | -------------------- | ---- | --------------------------------------- |
| `io.modelcontextprotocol/protocolVersion`    | `string`             | 是   | 本请求的协议版本（例如 `"2026-07-28"`） |
| `io.modelcontextprotocol/clientInfo`         | `Implementation`     | 否   | 客户端名称与版本                        |
| `io.modelcontextprotocol/clientCapabilities` | `ClientCapabilities` | 是   | 与本请求相关的客户端能力                |

缺失任何必需字段的请求即为格式错误；服务端必须使用 JSON-RPC 错误码 `-32602`（Invalid params）拒绝该请求。在 HTTP 上，响应状态码 必须为 `400 Bad Request`。

除非明确配置为不这样做，否则客户端应当在每个请求中包含 `io.modelcontextprotocol/clientInfo`。

服务端不得依赖客户端未声明的能力。如果处理某个请求需要客户端未在 `io.modelcontextprotocol/clientCapabilities` 中包含的能力，服务端必须返回 `MissingRequiredClientCapabilityError`（`-32021`），其 `data.requiredCapabilities` 列出缺失的能力。在 HTTP 上，响应状态码 必须为 `400 Bad Request`。

**每响应协议字段：**

除非明确配置为不这样做，否则服务端应当在每个结果的 `_meta` 中包含以下 `io.modelcontextprotocol/*` 字段，以便在不依赖任何先前连接状态的情况下标识自身：

| 键                                   | 类型             | 必需 | 说明             |
| ------------------------------------ | ---------------- | ---- | ---------------- |
| `io.modelcontextprotocol/serverInfo` | `Implementation` | 否   | 服务端名称与版本 |

> **说明:** `io.modelcontextprotocol/clientInfo` 和 `io.modelcontextprotocol/serverInfo` 由发送方自行报告，协议不对其进行验证。它们仅用于显示、日志记录和调试。实现不应用它们来改变客户端或服务端的行为，也不应依赖它们做出安全决策。

在通过 `subscriptions/listen` 流传递的通知上，服务端必须在 `_meta` 中包含 `io.modelcontextprotocol/subscriptionId`，以便客户端能够将通知与发起订阅的请求相关联。

**OpenTelemetry 追踪上下文：**

作为上述前缀要求的例外，键 `traceparent`、`tracestate` 和 `baggage` 保留用于 OpenTelemetry 追踪上下文传播。当这些键出现时，其值必须分别遵循 W3C Trace Context 与 W3C Baggage 格式。

此例外存在是为了保持与现有实现以及 OpenTelemetry MCP 语义约定的兼容性。

`_meta` 中 trace 上下文的非规范性示例：

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    },
    "_meta": {
      "traceparent": "00-0af7651916cd43dd8448eb211c80319c-00f067aa0ba902b7-01",
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

#### 4.3.2 图标字段 icons

`icons` 属性为服务端暴露其资源、工具、提示模板和实现的视觉标识符提供了一种标准化的方式。图标通过提供视觉上下文并提高可用功能的可发现性来增强用户界面。

图标表示为一个 `Icon` 对象数组，每个图标包含：

- `src`：指向图标资源的 URI（必需）。可以是：
  - 指向图像文件的 HTTP/HTTPS URL
  - 带有 base64 编码图像数据的 data URI
- `mimeType`：当服务端的类型缺失或通用时的可选媒体类型
- `sizes`：可选的尺寸规格数组（例如 `["48x48"]`，用于可缩放格式如 SVG 的 `["any"]`，或用于多种尺寸的 `["48x48", "96x96"]`）
- `theme`：图标背景的可选主题偏好（`light` 或 `dark`）

**必需的媒体类型支持（必需的媒体类型支持）：**

支持渲染图标的客户端必须至少支持以下媒体类型s：

- `image/png` —— PNG 图像（安全、通用兼容性）
- `image/jpeg`（以及 `image/jpg`） —— JPEG 图像（安全、通用兼容性）

支持渲染图标的客户端应当还支持：

- `image/svg+xml` —— SVG 图像（可缩放但需要注意如下所述的安全预防措施）
- `image/webp` —— WebP 图像（现代、高效的格式）

**安全考虑：**

图标元数据的使用方必须在处理图标时采取适当的安全预防措施以防止危害：

- 将图标元数据与图标字节视为不受信任的输入，并防御网络、隐私与解析风险。
- 确保图标 URI 为 HTTPS 或 `data:` URI。客户端必须拒绝使用不安全方案与重定向的图标 URI，例如 `javascript:`、`file:`、`ftp:`、`ws:` 或本地应用 URI 方案。
  - 禁止方案变化以及重定向到不同源的主应用。
- 对源自过大图像、超大尺寸或过多帧（例如 GIF）的资源耗尽攻击保持韧性。
  - 使用方可以对图像和内容大小设置限制。
- 在不带凭证的情况下获取图标。不应发送 cookies、`Authorization` 头或客户端凭证。
- 验证图标 URI 与服务端同源。这可最大限度降低向第三方暴露数据或追踪信息的风险。
- 在获取和渲染图标时谨慎行事，因为载荷可以包含可执行内容（例如带有嵌入的 JavaScript 或 extended 能力的 SVG）。
  - 使用方可以选择禁用特定文件类型或在渲染前对图标文件进行净化处理。
- 在渲染前验证媒体类型s 与文件内容。将媒体类型信息视为建议性。通过 magic bytes 检测内容类型；不匹配或未知类型时予以拒绝。
  - 维护严格的图像类型白名单。

**使用方式：**

图标可附加到：

- `Implementation`：MCP 服务端/客户端实现的视觉标识符
- `Tool`：工具功能的视觉表示
- `Prompt`：与提示模板一起显示的图标
- `Resource`：不同资源类型的视觉指示符

可以提供多个图标以支持不同的显示上下文和分辨率。客户端应根据其 UI 需求选择最合适的图标。

### 4.4 数据结构与内容类型

先分清协议对象的结构定义、验证业务数据的数据模式，以及响应如何携带文本、媒体和资源。

#### 4.4.1 协议数据结构的定义

Schema 描述可接受的数据形状。内容类型描述返回什么媒体或资源；两者都不能替代权限。

**先观察一个例子**：query 为字符串并有长度限制，limit 为整数且在1—5之间；全空白 query 仍需业务检查。比较文本块与带 URI 的资源链接。

协议的完整规范定义为一个 TypeScript Schema。这是所有协议消息和结构的权威定义。

此外，还有一个 JSON Schema，由 TypeScript 定义自动生成，用于各种自动化工具。

#### 4.4.2 JSON Schema 的使用

模型上下文协议在整个协议中使用 JSON Schema 进行校验。本节阐明 JSON Schema 在 MCP 消息中应如何使用。

##### 4.4.2.1 Schema 方言

MCP 在以下规则下支持 JSON Schema：

1. **默认方言**：当 Schema 不包含 `$schema` 字段时，默认采用 JSON Schema 2020-12。
1. **显式方言**：数据结构定义可以包含 `$schema` 字段以指定其他方言。
1. **受支持的方言**：实现必须至少支持 2020-12，并且应当文档化其所支持的其他方言。
1. **建议**：推荐实现者使用 JSON Schema 2020-12。

##### 4.4.2.2 使用示例

比较缺省方言和显式方言的结构差异；指定方言后，按该方言解释引用和校验关键字。

###### 4.4.2.2.1 默认方言：JSON Schema 2020-12

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["name"]
}
```

###### 4.4.2.2.2 显式指定另一种数据结构方言

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["name"]
}
```

##### 4.4.2.3 实现要求

- 客户端和服务端必须支持不带显式 `$schema` 字段的 Schema 使用 JSON Schema 2020-12。
- 客户端和服务端必须按照其所声明的或默认的方言校验 Schema。对于不支持的方言，它们必须通过返回恰当的错误以指示该方言不受支持的方式进行优雅处理。
- 客户端和服务端应当文档化其所支持的 Schema 方言。

##### 4.4.2.4 Schema 校验

- 数据结构定义必须按其所声明的或默认的方言有效。

##### 4.4.2.5 $ref 解析

JSON Schema 2020-12 允许 `$ref` 指向绝对 URI。实现不得自动解引用解析为网络 URI 的 `$ref` 值。

实现可以提供一个需要主动启用的模式来获取非本地 `$ref`，但该模式必须默认禁用，并且应当强制执行主应用白名单，或至少拒绝回环、链路本地和私有网络地址，施加超时和大小限制，并记录被解引用的 URI。

因未解析的外部 `$ref` 而无法校验通过的数据结构定义应当被拒绝，而非静默地视为宽松通过。

##### 4.4.2.6 组合关键字的资源使用

组合关键字（`anyOf`、`oneOf`、`allOf`、`if`/`then`/`else`）与 `$defs` 允许表达力丰富的 Schema，但校验代价可能很高。实现应当施加合理的边界，例如最大 Schema 深度、子 Schema 总数上限或每次校验的时间预算，以防止恶意 Schema 作为针对校验器的拒绝服务向量。

#### 4.4.3 用同一结果区分内容形态

工具的 content 是内容块数组，文字用 type=text 和 text；图像/音频用相应 type、Base64 data 与 MIME。资源链接是指向可另行读取内容的引用，嵌入资源则直接带资源正文；读取 URI 仍需权限，不根据 scheme 自动访问网络或磁盘。结构化结果放 structuredContent，并按 outputSchema 检查。

本册第1章搜索返回的 query/items/total 是结构化结果；同一内容的文本序列化用于展示。给结构化 total 一个字符串并不因为文本看起来一样就满足整数约束。图像和音频的解码、大小和展示能力也要分别判断，不能强行按 text 访问全部内容块。

**可观察结果**：固定搜索返回 query、items 和数值 total；把 total 改成字符串时不符合本例的整数结构约束。结构正确仍需检查业务权限和空白查询等规则。

#### 4.4.4 练习与答案

**练习**：default 是否一定填入缺失字段？遇到外部 $ref 和很深的组合结构时，应怎样限制校验？

**参考答案**：default 不保证每个校验器自动填值；任意 $ref 抓取和过深组合可能消耗资源，必须限制。

**操作检查**：query 为字符串并有长度限制，limit 为整数且在1—5之间；全空白 query 仍需业务检查。比较文本块与带 URI 的资源链接。

**速查**：Schema 描述可接受的数据形状。内容类型描述返回什么媒体或资源；两者都不能替代权限。

### 4.5 消息模式

基础协议定义三类常见交互。请求 ID 关联同一轮的请求和响应。多轮请求为每一轮分配新 ID，订阅则通过单独的通知流持续接收变更。

**单轮请求与可选进度通知**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 发起请求
    Server-->>Client: 可选进度通知（notifications/progress）
    Server-->>Client: 返回响应
```

**多轮调用的两次请求**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 初次请求（id=1）
    Server-->>Client: 需要补充输入的结果（InputRequiredResult）<br/>携带输入请求（inputRequests）
    Client->>Server: 新请求（id=2）<br/>原参数和输入响应（inputResponses）
    Server-->>Client: 返回响应
```

**保持连接的订阅**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 监听订阅（subscriptions/listen）
    Server-->>Client: 订阅确认（notifications/subscriptions/acknowledged）
    Note over Client,Server: 通知流保持打开
    Server-->>Client: 变更通知（notifications/*）携带订阅标识（subscriptionId）
```

#### 4.5.1 多轮请求（MRTR）

##### 4.5.1.1 一次请求为何会需要第二次交互

工具 `confirm_note` 需要用户确认笔记 ID 才能继续。服务端不能假定主应用有窗口，也不能自己选择“同意”。它对当前请求返回 `resultType: "input_required"`，列出要向用户取得的信息；主应用取得响应后，以新的请求 ID 重发原操作。

**多轮请求中的通用消息顺序**

```mermaid
sequenceDiagram
    participant C as 客户端 (Client)
    participant S as 服务器 (Server)
    C->>S: 客户端请求（id=1，含原参数）
    Note over S: 服务器需要补充信息才能处理请求
    S-->>C: 返回补充输入要求（InputRequiredResult）
    Note over C: 客户端收集输入后重发原操作
    C->>S: 客户端请求（id=2，原参数和取得的输入）
    Note over S: 服务器已有足够信息完成请求
    S-->>C: 返回结果（id=2）
```

第一次 RPC 已经结束，第二次是新的 RPC；这不要求同一服务端进程保留会话。无状态的协议仍允许业务数据库保存工作，不能把“无状态”误解成业务不能持久化。

##### 4.5.1.2 四个核心对象与完整报文

`InputRequests` 是问题 ID 到输入请求的映射；本册使用 `elicitation/create`。`InputResponses` 使用相同问题 ID 映射到用户响应。`InputRequiredResult` 至少包含 `inputRequests` 或 `requestState` 之一；`requestState` 是由服务端解释的 不透明字符串，客户端只能原样转交。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "input_required",
    "inputRequests": {
      "confirm": {
        "method": "elicitation/create",
        "params": {
          "mode": "form",
          "message": "是否继续读取这条笔记？",
          "requestedSchema": {
            "type": "object",
            "properties": { "confirm": { "type": "boolean" } },
            "required": ["confirm"]
          }
        }
      }
    }
  }
}
```

这是完整的服务端响应，不要求它自己再放客户端的请求元数据。随后客户端重试的请求如下：

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "confirm_note",
    "arguments": { "note_id": "stdio" },
    "inputResponses": { "confirm": { "action": "accept", "content": { "confirm": true } } },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": { "elicitation": { "form": {} } }
    }
  }
}
```

**工具征询与状态续接**

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 客户端 (Client)
    participant S as 服务器 (Server)
    C->>S: 调用工具（tools/call，id=1）
    Note over S: 服务器通过用户信息征询（Elicitation）取得补充输入
    S-->>C: 需要补充输入的结果（InputRequiredResult）<br/>id=1，含征询请求（ElicitRequest）和请求状态（requestState）
    Note over C,S: 首次请求已经结束
    C->>U: 显示输入表单
    U-->>C: 提交用户响应
    Note over C: 使用输入响应（inputResponses）和请求状态（requestState）续接
    C->>S: 调用工具（tools/call，id=2）<br/>含征询结果（ElicitResult）和请求状态（requestState）
    Note over S: 服务器恢复原操作所需状态并完成执行
    S-->>C: 工具调用结果（ToolCallResult，id=2）
```

##### 4.5.1.3 支持范围与重试约束

服务端只可以在 `tools/call`、`resources/read`、`prompts/get` 返回这种中间结果；不能把任意目录方法改成需要输入。输入请求必须属于客户端在本次能力中声明支持的类型。服务端不得假定用户会响应，或假定客户端一定会重试。

客户端先构造需要的输入响应，再重试原操作；若服务端只给 requestState 没有问题，可以立即重试。收到状态则原样回显，没有收到就不能自己新增。输入与状态只属于这一操作，不能用于并行的其他请求。缺少仍必需的信息时，服务端应再次征询；非法 JSON、结构错误或内部失败按相应 RPC 错误处理。

服务器分配的输入请求键在原请求范围内必须唯一。客户端用相同的键放入输入响应（InputResponses）。例如，服务器以 `confirm` 作键提出表单征询时，客户端应在 `inputResponses.confirm` 中提交对应的征询结果（ElicitResult）。

服务器应校验输入响应对象可解析且满足结构要求，忽略不认识或不需要的额外信息。协议错误应返回恰当的 JSON-RPC 错误。若只是缺少完成操作所必需的已征询信息，服务器应再次返回补充输入结果（InputRequiredResult），指出仍缺什么。

##### 4.5.1.4 状态的完整性、身份和重放

Base64 只是编码，不提供完整性。客户端可篡改 requestState，因此凡状态影响授权、资源或业务逻辑，服务端必须使用 HMAC/AEAD 等保护并验证。通常还应绑定身份、短有效期、方法和关键参数摘要，拒绝跨用户、过期和操作不匹配的状态。

签名与有效期仍不保证单次使用。一次性兑换需要服务端记录是否已消费，不能在没有共享业务存储的情况下承诺“绝不重放”。仅当篡改的后果不超出请求失败时，才可以不保护无关状态的完整性。

##### 4.5.1.5 实现与交互验证

下面两套程序用 SDK 正确的多轮 API 提出问题，不通过独立的反向请求取得输入。按第1章安装项目依赖，保存对应的服务端和客户端文件后运行客户端。

###### 4.5.1.5.1 Python

`elicit_server.py`：

```python
from typing import Annotated
from pydantic import BaseModel
from mcp.server import MCPServer
from mcp.server.mcpserver import Elicit, Resolve

mcp = MCPServer('ConfirmNotes')

class Confirmation(BaseModel):
    confirm: bool

async def ask_confirmation(note_id: str) -> Elicit[Confirmation]:
    return Elicit(f'是否继续读取笔记 {note_id}？', Confirmation)

@mcp.tool()
async def confirm_note(note_id: str, answer: Annotated[Confirmation, Resolve(ask_confirmation)]) -> str:
    return f'已确认 {note_id}' if answer.confirm else '用户未确认'

if __name__ == '__main__':
    mcp.run()
```

`elicit_client.py`：

```python
import asyncio
from pathlib import Path
import sys
from mcp import StdioServerParameters
from mcp.client import Client
from mcp.types import ElicitResult

async def respond(context, params):
    print('收到问题：', params.message)
    # 协议实验固定返回接受；实际产品必须取得用户的真实选择。
    return ElicitResult(action='accept', content={'confirm': '--no' not in sys.argv})

async def main():
    params = StdioServerParameters(command=sys.executable,
        args=[str(Path(__file__).with_name('elicit_server.py'))])
    async with Client(params, mode='2026-07-28', elicitation_callback=respond) as client:
        result = await client.call_tool('confirm_note', {'note_id': 'stdio'})
        print(result.content[0].text)

if __name__ == '__main__':
    asyncio.run(main())
```

###### 4.5.1.5.2 TypeScript

`elicit_server.ts`：

```typescript
import { McpServer, inputRequired, acceptedContent } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import * as z from 'zod/v4'

const confirmation = z.object({ confirm: z.boolean() })
serveStdio(() => {
  const server = new McpServer({ name: 'ConfirmNotes', version: '1.0.0' })
  server.registerTool(
    'confirm_note',
    {
      description: '取得用户确认后返回所选笔记 ID',
      inputSchema: z.object({ note_id: z.string() }),
    },
    async ({ note_id }, ctx) => {
      const responses = ctx.mcpReq.inputResponses
      if (!responses?.confirm) {
        return inputRequired({
          inputRequests: {
            confirm: inputRequired.elicit({
              mode: 'form',
              message: `是否继续读取笔记 ${note_id}？`,
              requestedSchema: confirmation,
            }),
          },
        })
      }
      const answer = acceptedContent(responses, 'confirm', confirmation)
      return {
        content: [{ type: 'text', text: answer?.confirm ? `已确认 ${note_id}` : '用户未确认' }],
      }
    },
  )
  return server
})
```

`elicit_client.ts`：

```typescript
import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { fileURLToPath } from 'node:url'

const client = new Client(
  { name: 'ConfirmClient', version: '1.0.0' },
  {
    capabilities: { elicitation: { form: {} } },
    versionNegotiation: { mode: { pin: '2026-07-28' } },
  },
)
client.setRequestHandler('elicitation/create', async (request) => {
  console.log('收到问题：', request.params.message)
  // 协议实验固定返回接受；实际产品必须取得用户的真实选择。
  return { action: 'accept', content: { confirm: !process.argv.includes('--no') } }
})
try {
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [fileURLToPath(new URL('./elicit_server.js', import.meta.url))],
    }),
  )
  const result = await client.callTool({ name: 'confirm_note', arguments: { note_id: 'stdio' } })
  for (const block of result.content) if (block.type === 'text') console.log(block.text)
} finally {
  await client.close()
}
```

客户端中的固定接受回调用于协议实验，它没有代替真实用户同意。在实际主应用中先把问题展示给用户，再返回其真实动作。正常结果为“已确认 stdio”；把确认值改为 false 应得到“用户未确认”。第7章进一步解释表单和网址模式。

##### 4.5.1.6 练习与答案

**题1**：重试能沿用 id=1 吗？**答案**：不能，新 RPC 使用新 ID。

**题2**：客户端能解码 requestState 后改掉期限吗？**答案**：不能，必须原样转交；服务端必须验证它。

**题3**：有效 HMAC 是否保证只能使用一次？**答案**：不能，单次消费还需要服务端强制实施。

#### 4.5.2 持续接收变更通知

订阅、进度和取消解决不同问题。订阅关注变化，进度属于正在处理的请求，取消是协作停止。

**先观察一个例子**：先收到订阅确认再处理匹配事件；用同一 progressToken 关联进度；在操作完成前后各尝试取消，解释竞态。

`subscriptions/listen` 开启一个从服务端到客户端的长期通知流。与一次性请求不同，该流保持打开状态并持续传递通知，直至客户端取消它。它取代了先前的 `resources/subscribe` RPC 和 HTTP GET 端点。

##### 4.5.2.1 开启一个流

客户端发送一个 `subscriptions/listen` 请求，其中包含一个 `notifications` filter，用于指定其希望接收的事件类型。服务端不得发送客户端未明确请求的通知类型。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "subscriptions/listen",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    },
    "notifications": {
      "toolsListChanged": true,
      "resourceSubscriptions": ["file:///project/config.json"]
    }
  }
}
```

###### 4.5.2.1.1 通知过滤器

| Field                   | 类型       | 说明                                                      |
| ----------------------- | ---------- | --------------------------------------------------------- |
| `toolsListChanged`      | `boolean`  | 当工具变更时接收 `notifications/tools/list_changed`       |
| `promptsListChanged`    | `boolean`  | 当提示模板变更时接收 `notifications/prompts/list_changed` |
| `resourcesListChanged`  | `boolean`  | 当 list 变更时接收 `notifications/resources/list_changed` |
| `resourceSubscriptions` | `string[]` | 接收这些资源 URIs 的 `notifications/resources/updated`    |

所有字段都是可选的。省略某字段等同于不订阅该通知类型。

##### 4.5.2.2 确认

服务端必须将 `notifications/subscriptions/acknowledged` 作为流上的第一条消息发送，其 `_meta` 中的 `io.modelcontextprotocol/subscriptionId` 携带该订阅的 ID，并且不得在此消息之前于该订阅上发送任何通知。在 stdio 上，所有订阅共享一个 channel，此顺序按订阅 ID 而非按 channel 定义：属于其他订阅的消息可以在其之前交错发送。

确认（acknowledgment）中的 `notifications` 字段反映了服务端同意遵守的子集 —— 不受服务端支持的通知类型将被省略。

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/subscriptions/acknowledged",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/subscriptionId": 1
    },
    "notifications": {
      "toolsListChanged": true,
      "resourceSubscriptions": ["file:///project/config.json"]
    }
  }
}
```

客户端应当将已确认的 filter 与其请求的内容进行比较，并优雅地处理任何不受支持的类型。

##### 4.5.2.3 接收通知

流上传递的所有通知均在 `_meta` 中携带 `io.modelcontextprotocol/subscriptionId`，用以标识开启该流的 `subscriptions/listen` 请求。该值是 `subscriptions/listen` 请求的 JSON-RPC ID。在上面的示例中，该请求使用了 `"id": 1`，因此确认及所有后续通知均携带订阅 ID `1`。在 stdio 上，由于所有消息共享单一 channel，客户端必须使用此字段将通知与其发起的订阅相关联。

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/subscriptionId": 1
    },
    "uri": "file:///project/config.json"
  }
}
```

##### 4.5.2.4 多个并发订阅

客户端可以同时拥有多个活动的订阅 —— 例如，一个订阅工具-list changes，另一个订阅资源 updates。每个订阅由其 `subscriptions/listen` 请求的 JSON-RPC 请求 ID 标识，并且该流上的每个通知都在 `io.modelcontextprotocol/subscriptionId` 中携带该 ID，以便客户端对其进行解复用。

##### 4.5.2.5 取消

Subscription 在以下情况下结束：

- **客户端** 取消它 —— 关闭 SSE 流（HTTP）或发送引用 `subscriptions/listen` 请求 ID 的 `notifications/cancelled`（stdio）。
- **服务端** 主动拆除它（例如在关闭期间）—— 它应当发送成功的 `subscriptions/listen` 响应以表示正常结束，然后关闭该流。
- 底层传输关闭（HTTP 超时、TCP 断开、stdio 进程退出）。

###### 4.5.2.5.1 正常关闭

服务端主动结束订阅时，例如正在关闭进程，应当先用完成结果（`resultType: "complete"`）响应原始的 `subscriptions/listen` 请求，再关闭通知流。除标准结果字段和订阅元数据外，该结果不携带此方法专有的数据。客户端以 JSON-RPC `id` 关联原请求，并据此识别订阅已正常结束。突然断开连接时不会收到该响应。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "_meta": {
      "io.modelcontextprotocol/subscriptionId": 1
    }
  }
}
```

与该流上的其他消息一样，此响应在 `_meta` 中携带 `io.modelcontextprotocol/subscriptionId`，用于标识它关闭的是哪个订阅。该值与发起它的 `subscriptions/listen` 请求的 JSON-RPC `id` 相匹配。

收到此响应的客户端即知道该订阅已正常关闭；若传输未携带它即关闭，则表示意外的断开，客户端可以将其视为触发重连的信号。

在 **stdio** 上，如果连接被终止然后重新建立，客户端必须重新发送 `subscriptions/listen` 以重新建立其订阅 —— 服务端在重连之间不保留任何订阅状态。

#### 4.5.3 报告进度

模型上下文协议 (MCP) 通过通知消息支持对长时间运行操作的可选进度跟踪。服务端可以发送进度通知以报告客户端已发出请求的状态。

##### 4.5.3.1 进度流程

当客户端想要 _接收_ 某个请求的进度更新 时，它会在请求元数据中包含一个 `progressToken`。

- 进度令牌必须是字符串或整数值
- 进度令牌可以由客户端以任何方式选择，但必须在所有活动的请求中保持唯一

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "some_method",
  "params": {
    "_meta": {
      "progressToken": "abc123",
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

服务端可以随后发送进度通知，其中包含：

- 原始进度令牌
- 当前的进度值
- 可选的 "total" 值
- 可选的 "message" 值

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "abc123",
    "progress": 50,
    "total": 100,
    "message": "正在整理数据……"
  }
}
```

- `progress` 值必须在每个通知中递增，即使 total 未知也是如此。
- `progress` 和 `total` 值可以为浮点数。
- `message` 字段应当提供相关的、人类可读的进度信息。

**请求令牌与进度通知**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Note over Client,Server: 请求携带进度令牌（progressToken）
    Client->>Server: 发起带进度令牌（progressToken）的请求
    Note over Client,Server: 报告进度
    Server-->>Client: 进度通知（notifications/progress）0.2/1.0
    Server-->>Client: 进度通知（notifications/progress）0.6/1.0
    Server-->>Client: 进度通知（notifications/progress）1.0/1.0
    Note over Client,Server: 完成操作
    Server->>Client: 返回方法响应
```

##### 4.5.3.2 行为要求

1. 进度通知必须仅引用满足以下条件的令牌：
   - 在某个活动的请求中提供
   - 与正在进行的操作相关联

2. 收到带有进度令牌的请求的服务端可以：
   - 选择不发送任何进度通知
   - 以其认为恰当的任何频率发送通知
   - 若未知则省略 total 值

```text
客户端请求（携带进度令牌）
  → 服务端执行 → 进度通知（同一令牌，可多次）
  → 最终结果（请求结束）
```

##### 4.5.3.3 实现说明

- 客户端和服务端应当跟踪活动进度令牌
- 双方应当实现速率限制ing 以防止 flooding
- 进度通知必须在操作完成后停止

#### 4.5.4 取消请求

模型上下文协议 (MCP) 通过通知消息支持对正在进行的请求进行可选的取消（取消）。客户端应当发送一个取消通知，以指示其先前发出的某个请求应被终止。

服务端必须在拆除某个订阅流时，发送 `notifications/cancelled` 并引用对应的 `subscriptions/listen` 请求 ID（请参阅 Subscriptions）。服务端不得因任何其他目的发送 `notifications/cancelled`。

##### 4.5.4.1 取消流程

当客户端希望取消一个正在进行的请求时，它会发送一个 `notifications/cancelled` 通知，其中包含：

- 要取消的请求的 ID
- 可选的原因字符串，可被记录或展示

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": "123",
    "reason": "User requested cancellation"
  }
}
```

**取消与完成可能发生竞态**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 发起请求（id=123）
    Note over Server: 开始处理
    Client-->>Server: 请求取消通知（notifications/cancelled，id=123）
    alt 处理可能已完成
        Note over Server: 取消到达前处理可能已经完成
    else 处理尚未完成
        Note over Server: 停止处理
    end
```

##### 4.5.4.2 特定于传输层的取消

客户端如何表示取消取决于传输：

- **Streamable HTTP**：关闭 SSE 响应流即为取消信号。服务端必须将客户端断开连接视为对该请求的取消。不需要也不应出现 `notifications/cancelled` 消息。
- **stdio**：没有可关闭的逐请求流。客户端必须发送一个 `notifications/cancelled` 通知，并引用该请求的 ID。

##### 4.5.4.3 超时

实现应当为所有已发送的请求建立超时，以防止连接挂起和资源耗尽。当请求在超时时间内未收到成功或错误响应时，发送方应当取消该请求并停止等待响应。如各传输的取消规则所述，这意味着：

- **Streamable HTTP**：关闭该请求的响应流，即构成取消。
- **stdio**：发送一个 `notifications/cancelled` 通知，并引用该请求的 ID。

SDK 和其他中间件应当允许在逐请求基础上配置这些超时。

实现可以选择在收到对应于该请求的进度通知时重置超时计时器，因为这意味着工作确实正在进行。然而，实现应当始终强制实施一个最大超时，而不管进度通知如何，以限制行为异常的客户端或服务端的影响。

##### 4.5.4.4 行为要求

1. 取消通知必须仅引用满足以下条件的请求：
   - 由客户端先前发出
   - 仍被认为正在进行中
1. 服务端发送的取消通知必须引用某个 `subscriptions/listen` 请求，以终止该订阅流
1. 收到取消通知的服务端应当：
   - 停止处理被取消的请求
   - 释放相关资源
   - 不为被取消的请求发送响应
1. 服务端可以在以下情况下忽略取消通知：
   - 引用的请求未知
   - 处理已经完成
   - 该请求无法被取消
1. 客户端应当忽略任何在被取消请求之后到达的响应

##### 4.5.4.5 时序考虑

由于网络延迟，取消通知可能在请求处理完成之后才到达，并可能发生在响应已发送之后。

双方必须优雅地处理这些竞态条件：

```text
客户端发出请求 → 服务端开始执行
  ├─ 正常完成 → 返回结果
  └─ 客户端取消 → 服务端尽快停止（取消与完成可能竞争）
```

##### 4.5.4.6 实现说明

- 双方应当记录取消 reasons 以便调试
- Application UIs 应当在请求取消时予以指示

##### 4.5.4.7 错误处理

无效的取消通知应当被忽略：

- 未知的请求标识符
- 已完成的请求
- 格式错误的通知

这保持了通知的 "发出后不等待响应" 特性，同时允许异步通信中竞态条件的存在。

#### 4.5.5 综合练习与答案

**练习**：关闭 HTTP 请求的 SSE 与 stdio 取消通知分别作用于什么？取消成功能否证明写操作已经回滚？

**参考答案**：HTTP 关闭请求 SSE 是该请求的取消信号；stdio 用取消通知。取消不是事务回滚。

**操作检查**：先收到订阅确认再处理匹配事件；用同一 progressToken 关联进度；在操作完成前后各尝试取消，解释竞态。

**速查**：订阅、进度和取消解决不同问题。订阅关注变化，进度属于正在处理的请求，取消是协作停止。

## 第5章 基础协议：传输与交互实验

已能辨认单条消息的结构后，本章比较 stdio 与 Streamable HTTP 如何交付同一调用，并验证各自的错误路径。

标准流传输由客户端启动服务端进程，双方按消息边界读写，诊断走 stderr。

**先观察一个例子**：分别运行本册最小工程的客户端，再让 TypeScript 客户端启动 Python 服务端，检查工具返回文本。

### 5.1 标准输入输出（stdio）

在 **stdio** 传输层中，客户端将 MCP 服务端作为子进程（subprocess）启动。双方通过该子进程的标准流（standard streams）进行通信：

- 服务端从 `stdin` 读取 JSON-RPC 消息，并向 `stdout` 写入 JSON-RPC 消息。
- 每条消息都是单个 JSON-RPC 请求、通知或响应。
- 消息以换行符分隔，且 **不得** 包含嵌入的换行符。
- 服务端 **可以** 向 `stderr` 写入 UTF-8 字符串，用于任何日志目的，包括信息、调试和错误消息。
- 客户端 **可以** 捕获、转发或忽略服务端的 `stderr` 输出，且 **不应** 假定 `stderr` 输出代表错误状态。
- 服务端 **不得** 向其 `stdout` 写入任何不属于有效 MCP 消息的内容。
- 客户端 **不得** 向服务端的 `stdin` 写入任何不属于有效 MCP 消息的内容。

标准流是规范通道，但本绑定中仅进程生命周期相关部分依赖于标准流。其在线格式（每行一条以换行符分隔的 JSON-RPC 消息，运行在可靠双向字节流之上）在 Unix 域套接字、TCP 连接或任何类似通道上都能保持不变地工作。
基于此类流构建的自定义传输层 **应当** 复用本文档中所述的封装和消息规则；只有子进程相关方面（启动、`stderr`、通过关闭流实现的关闭、进程重启）需要根据通道提供相应的等价机制。

#### 5.1.1 发送消息

客户端通过向服务器的标准输入（`stdin`）写入 JSON-RPC 请求和通知来发送消息，每行一条消息。客户端不得写入 JSON-RPC 响应。

#### 5.1.2 接收消息

客户端从标准输出（`stdout`）读取服务器消息，每行一条消息。所有消息共享这一个通道；不存在每个请求一个单独的流。

服务端会写入三种消息：

1. 对客户端请求的响应，通过 JSON-RPC `id` 进行关联。
2. 与正在进行中的请求相关的通知，例如 `notifications/progress` 和 `notifications/message`。
3. 针对已激活的 `subscriptions/listen` 请求发送通知。客户端 **必须** 使用 `_meta` 中的 `io.modelcontextprotocol/subscriptionId` 字段关联这些通知

服务端 **不得** 向 `stdout` 写入 JSON-RPC _请求_。服务端到客户端的交互通过 `InputRequiredResult` 响应来承载；

#### 5.1.3 请求元数据

stdio 传输层的所有请求元数据都直接内联于 JSON-RPC 消息正文中。协议版本、客户端标识以及每请求能力都存放在
`_meta.io.modelcontextprotocol/*` 中；方法名和参数按照 JSON-RPC 的规范存放。本绑定不存在标头层。

#### 5.1.4 取消

为了取消一个进行中的请求，客户端 **必须** 发送一条 `notifications/cancelled` 通知，并在其中引用该请求的 ID。由于 stdio 是单一共享的双向通道，不存在每个请求独立的流可供关闭。服务端 **应当** 在可行时尽快停止已取消请求的工作，且 **不得** 再为该请求发送任何消息。

#### 5.1.5 关闭进程

客户端 **应当** 按如下方式发起关闭：

1. 关闭到子进程（即服务端）的输入流。
2. 等待服务端退出。
3. 如果服务端在合理时间内没有退出，则使用操作系统对应的机制强制终止进程。

在 POSIX 系统上，强制终止通常从 `SIGTERM` 升级到 `SIGKILL`。在 Windows 上，由于没有 POSIX 信号，客户端可以使用 `TerminateProcess` 或 Job Objects。

服务端 **应当** 在其标准输入被关闭或读取返回文件结束时立即退出。这是主要的优雅关闭信号，也是唯一可移植的信号；遵守这一信号能够减少对强制终止的需求。

服务端 **可以** 通过关闭到客户端的输出流并自行退出来发起关闭。

#### 5.1.6 意外终止

如果服务端进程意外退出，客户端 **应当** 重启它。由于协议是无状态的（stateless），任何进行中的请求都会简单地丢失，客户端可以针对新进程重试这些请求。已激活的 `subscriptions/listen` 流也必须在重启后重新建立。

#### 5.1.7 练习与答案

**练习**：服务端能否在 stdout 打印启动横幅？JSON 字符串中的换行应怎样传送？

**参考答案**：JSON 字符串内的换行必须转义，不能把一条线上的消息拆成多个物理行；stdout 横幅会破坏协议。

**操作检查**：分别运行本册最小工程的客户端，再让 TypeScript 客户端启动 Python 服务端，检查工具返回文本。

**速查**：标准流传输由客户端启动服务端进程，双方按消息边界读写，诊断走 stderr。

**可观察结果**：第1章的两种客户端都读取到 stdio 笔记文本，服务端诊断不进入 stdout。断开客户端后，服务端子进程随连接释放。

### 5.2 Streamable HTTP 传输

每条请求各自 POST 到 MCP 端点。服务端可以选择 JSON 或本请求的 SSE 响应；客户端要理解两者。

**先观察一个例子**：启动本册的 --http 入口，比较正常请求与 Mcp-Method/正文 method 不匹配的请求；不匹配必须被拒绝。

在 **Streamable HTTP** 传输层中，服务端作为独立进程运行，能够处理多个客户端连接。概览如下：

- 服务端暴露一个接受 POST 的单一 HTTP 端点（即 **MCP 端点**）。
- 客户端将每个 JSON-RPC 请求或通知作为独立的 HTTP POST 发送。
- 服务端对每个请求以单个 JSON 对象或限定于该请求的 Server-Sent Events（SSE）流进行应答；流中先是与该请求相关的通知，最后是最终响应。
- 服务器需要用户补充输入时，使用多轮请求（MRTR）。服务器在 `InputRequiredResult` 中返回征询，客户端取得输入后重新发起请求。
- 长生命周期的变更通知（例如 list 变更和资源更新）在 `subscriptions/listen` 请求的响应流上传递。

有关这些交互的时序图，参见[消息流](#524-消息流)。

服务端 **必须** 提供一个支持 POST 的单一 HTTP 端点路径（以下称为 **MCP 端点**）。例如，URL 可以是 `https://example.com/mcp`。

#### 5.2.1 端点与连接安全

实现 Streamable HTTP 传输层时：

1. 服务端 **必须** 校验所有传入连接的 `Origin` 标头，以防止 DNS 重绑定攻击。
   - 如果 `Origin` 标头存在但无效，服务端 **必须** 返回 HTTP 403 Forbidden。响应正文 **可以** 包含一个不带 `id` 的 JSON-RPC 错误响应。
2. 在本地运行时，服务端 **应当** 仅绑定到 localhost（127.0.0.1），而不是所有网络接口（0.0.0.0）。
3. 服务端 **应当** 为所有连接实现恰当的身份认证。

若缺少这些防护，攻击者可能利用 DNS 重绑定从远程网站与本地 MCP 服务端进行交互。

#### 5.2.2 发送消息

客户端发送的每条 JSON-RPC 消息 **必须** 作为新的 HTTP POST 请求发往 MCP 端点。

1. 客户端 **必须** 使用 HTTP POST 发送 JSON-RPC 消息。
2. 客户端 **必须** 在 `Accept` 标头中同时列出 `application/json` 和 `text/event-stream` 作为支持的内容类型。
3. 客户端 **必须** 在每个 POST 请求中携带请求元数据标头。
4. HTTP POST 的正文 **必须** 是单个 JSON-RPC _请求_ 或 _通知_。客户端 **不得** 发送 JSON-RPC _响应_。
5. 如果正文是 JSON-RPC 通知：
   - 如果服务端接受它，服务端 **必须** 返回 HTTP 状态码 `202 Accepted` 且不带正文。
   - 如果服务端无法接受，**必须** 返回 HTTP 错误状态码（例如 `400 Bad Request`）。响应正文 **可以** 包含一个不带 `id` 的 JSON-RPC 错误响应。
6. 如果正文是 JSON-RPC _请求_，服务端 **必须** 返回 `Content-Type: application/json`（单个 JSON 对象）或 `Content-Type: text/event-stream`（SSE 响应流）中的一种。客户端 **必须** 同时支持这两种方式。

> **说明:** 本修订版本的核心协议在 Streamable HTTP 上未定义客户端到服务端的 _通知_。核心协议中唯一的客户端发送的通知 `notifications/cancelled` 仅用于 stdio 传输层；在 Streamable HTTP 上，关闭 SSE 响应流本身就是取消信号，因此不需要 `notifications/cancelled` 消息（参见取消）。上文中的通知规则描述的是通知 POST 的传输层机制；本修订版本未规定通知 POST 的标头要求。

#### 5.2.3 接收消息

当服务端返回 SSE 响应流（`Content-Type: text/event-stream`）时：

- 服务器可以在最终响应之前发送 JSON-RPC 通知，例如 进度通知（`notifications/progress`）。这些通知必须与发起请求的客户端请求相关。
- 服务器不得在该流或其他响应流上发送独立的 JSON-RPC 请求。对当前操作提出的用户信息征询放在需要补充输入的结果（`InputRequiredResult`）中。
- 最终的 JSON-RPC _响应_ **应当** 终止该流。

在建立 SSE 流时，服务端 **应当** 在 HTTP 响应中包含 `X-Accel-Buffering: no` 标头。这指示反向代理（例如 nginx）禁用响应缓冲，确保 SSE 事件能够立即投递到客户端，而不是被缓冲积压。若缺少该标头，代理可能在向客户端发送消息之前先累积消息，从而引入不必要的延迟，并可能破坏 SSE 通信的实时特性。

> **说明:** 对于长生命周期的流——尤其是 `subscriptions/listen` 响应流——建议服务端周期性地发送 SSE 注释行（以冒号开头的行，例如 `:\r\n`）作为保活信号。这可以防止在无通知传输的静默期间，因中间件或客户端空闲超时而关闭连接。按服务器发送事件（SSE）的格式规定，任何以冒号开头的行都是不携带事件数据的注释；客户端必须忽略此类行，且不得将其视为格式错误的输入。

SSE 流不可恢复。中断后需要按业务规则重新请求或重建订阅。

#### 5.2.4 消息流

沿步骤核对每条消息来自谁、关联哪个请求，以及何时产生最终结果；业务执行与传输结束分别判断。

以下图示展示了单个 MCP 端点上的消息流。

**请求与响应。** 每个请求都是独立的 POST；服务端在每个请求上自行选择以单个 JSON 对象或 SSE 流作出响应：

**普通响应、流式响应与通知的 HTTP 处理**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Note over Client,Server: 普通响应
    Client->>Server: 通过 POST 调用工具（tools/call，JSON-RPC 请求）
    Server-->>Client: 200 OK，application/json<br/>返回 JSON-RPC 响应
    Note over Client,Server: 流式响应
    Client->>Server: 通过 POST 调用工具（tools/call，JSON-RPC 请求）
    Note over Server: 打开仅用于本请求的服务器发送事件流（SSE）
    Server-->>Client: SSE 进度通知（notifications/progress）
    Server-->>Client: SSE 进度通知（notifications/progress）
    Server-->>Client: SSE 承载 JSON-RPC 响应
    Note over Client,Server: 关闭响应流
    Note over Client,Server: 通知
    Client->>Server: POST 提交 JSON-RPC 通知
    Server-->>Client: 202 Accepted（已接受）
```

**服务端到客户端的交互（MRTR）。** 当服务端需要客户端提供输入——用户信息征询——它不会自行发送 JSON-RPC 请求。它返回一个 `InputRequiredResult`，其中包含 `inputRequests`，客户端在重试原始请求时附带匹配的 `inputResponses`（参见多轮请求）：

**通过 HTTP 续接需要额外输入的调用**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 通过 POST 调用工具（tools/call，id=1）
    Note over Server: 服务器需要额外输入
    Server-->>Client: 需要补充输入的结果（InputRequiredResult）<br/>输入请求（inputRequests）包含用户信息征询（elicitation/create）
    Note over Client: 收集所请求的输入
    Client->>Server: 通过 POST 重发工具调用（tools/call，id=2）<br/>原参数和输入响应（inputResponses）
    Server-->>Client: 返回最终结果
```

**变更通知。** 想要获得服务端主动发起的变更通知的客户端通过 `subscriptions/listen` 开启一条长生命周期流；该响应流保持开启，仅传递客户端订阅的通知类型：

**独立订阅流**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 通过 POST 请求监听订阅（subscriptions/listen）<br/>携带通知过滤器
    Server-->>Client: SSE 订阅确认（notifications/subscriptions/acknowledged）
    Note over Client,Server: 通知流保持打开
    Server-->>Client: SSE 工具目录变更通知（notifications/tools/list_changed）
    Server-->>Client: SSE 资源更新通知（notifications/resources/updated）
    Note over Client,Server: 客户端或服务器关闭通知流时结束
```

#### 5.2.5 取消

关闭 SSE 响应流 **必须** 被服务端视为对该请求的取消。由于每个请求都有其自身的响应流，传输层的断开信号是明确的。服务端 **应当** 在可行时尽快停止已取消请求的工作，且 **不得** 再为该请求发送任何消息。完整规则参见取消。

#### 5.2.6 请求元数据

Streamable HTTP 传输层将选定的 JSON-RPC 正文字段镜像到 HTTP 标头中，以便中间件（负载均衡器、网关、可观测性工具）能够在不解析正文的情况下路由和检查请求。

##### 5.2.6.1 协议版本标头

每个发往 MCP 端点的 POST 请求 **必须** 包含 `MCP-Protocol-Version` 标头。

例如：`MCP-Protocol-Version: 2026-07-28`

标头值 **必须** 与请求正文的 `_meta` 中的 `io.modelcontextprotocol/protocolVersion` 字段一致。若两者不一致，服务端 **必须** 返回 `400 Bad Request` 和 `HeaderMismatch` JSON-RPC 错误（参见服务端 Validation）。

如果服务端不支持所请求的协议版本（无论是该版本对服务端未知，还是服务端已知但选择不支持），**必须** 返回 `400 Bad Request` 和 `UnsupportedProtocolVersionError`，并列出其支持的版本。协商流程参见 协议版本协商。

##### 5.2.6.2 标准请求标头

| 标头名称     | 来源字段                      | 适用请求                                           |
| ------------ | ----------------------------- | -------------------------------------------------- |
| `Mcp-Method` | `method`                      | All 请求                                           |
| `Mcp-Name`   | `params.name` 或 `params.uri` | `tools/call`、`resources/read`、`prompts/get` 请求 |

这些标头是符合性 **必需** 的。

如果 `Mcp-Name` 的源值无法安全地表示为普通 ASCII 标头值，客户端 **必须** 按照 Value Encoding 中所述的 Base64 哨兵格式对其进行编码。

**`tools/call` 请求：**

```http
POST /mcp HTTP/1.1
Content-Type: application/json
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: get_weather

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "Seattle, WA"
    },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**`resources/read` 请求：**

```http
POST /mcp HTTP/1.1
Content-Type: application/json
MCP-Protocol-Version: 2026-07-28
Mcp-Method: resources/read
Mcp-Name: file:///projects/myapp/config.json

{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "file:///projects/myapp/config.json",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

##### 5.2.6.3 从工具参数生成自定义标头

MCP 服务端 **可以** 在工具的 `inputSchema` 中通过参数的 `x-mcp-header` 扩展属性，将指定参数映射到 HTTP 标头。注解工具参数的详细信息参见工具 Definitions。

虽然服务端使用 `x-mcp-header` 是可选的，但客户端 **必须** 支持此特性。当服务端的工具定义包含 `x-mcp-header` 注解时，符合规范的客户端 **必须** 将指定参数的值镜像到 HTTP 标头中。

###### 5.2.6.3.1 数据结构注解

`x-mcp-header` 属性指定用于构造标头名 `Mcp-Param-` 的名称部分。

**对 `x-mcp-header` 值的约束**：

- **不得** 为空
- **必须** 符合 HTTP 字段-名称令牌语法（`1*tchar`，RFC 9110 节 5.1）
- **不得** 包含控制字符，包括回车符（CR，`\r`）或换行符（LF，`\n`）
- **必须** 在 `inputSchema` 中所有 `x-mcp-header` 值之间保持大小写不敏感的唯一性
- **必须** 仅应用于具有基本类型的参数（整数、字符串、布尔值）。不允许使用 `number` 类型。Integer 值 **必须** 处于 JavaScript 安全整数范围内（−2^53+1 到 2^53−1）
- **必须** 仅应用于从 Schema 根 _静态可达（statically reachable）_ 的属性：即通过仅由 `properties` 键组成的链路可达。链路 **不得** 经过 `items`（或任何其他数组关键字）、组合关键字（`oneOf`、`anyOf`、`allOf`、`not`）、条件关键字（`if`/`then`/`else`）或 `$ref`。只要链路中的每一步都是 `properties` 键，就允许嵌套对象属性。任何其他位置上的 `x-mcp-header` 注解都会导致该注解以及工具定义无效。

标头抽取定义为：在注解属性精确的属性路径（即通往该属性的 `properties` 键链路）处读取实例值。如果调用参数中该路径上没有值，则省略对应的标头。

使用 Streamable HTTP 传输层的客户端 **必须** 拒绝任何 `x-mcp-header` 值违反上述约束的工具定义。拒绝意味着客户端 **必须** 将无效工具从 `tools/list` 的结果中排除。客户端 **应当** 在拒绝工具定义时记录一条警告，包含工具名称及拒绝原因。这可以确保单个格式错误的工具定义不会阻止其他有效工具的使用。使用其他传输层（例如 stdio）的客户端 **可以** 完全忽略 `x-mcp-header` 注解。

**工具定义示例：**

```json
{
  "name": "execute_sql",
  "description": "在受控数据库上执行 SQL 查询",
  "inputSchema": {
    "type": "object",
    "properties": {
      "region": {
        "type": "string",
        "description": "执行查询的区域",
        "x-mcp-header": "Region"
      },
      "query": {
        "type": "string",
        "description": "要执行的 SQL 查询"
      }
    },
    "required": ["region", "query"]
  }
}
```

**生成的 HTTP 请求：**

```http
POST /mcp HTTP/1.1
Content-Type: application/json
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: execute_sql
Mcp-Param-Region: us-west1

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    },
    "name": "execute_sql",
    "arguments": {
      "region": "us-west1",
      "query": "SELECT * FROM users"
    }
  }
}
```

###### 5.2.6.3.2 值的编码

客户端 **必须** 在将参数值放入 HTTP 标头之前对其进行编码，以确保安全传输并防止注入攻击。

**类型转换**：将参数值转换为其字符串表示形式：

- `string`：按原样使用
- `integer`：转换为十进制字符串表示形式（例如 `42`、`-7`）
- `boolean`：转换为小写的 `"true"` 或 `"false"`

根据 RFC 9110，HTTP 标头字段值必须由可见 ASCII 字符（0x21-0x7E）、空格（0x20）和水平制表符（0x09）组成。当某个值无法安全地表示为普通 ASCII 标头值（例如包含非 ASCII 字符、控制字符，或首尾存在空白字符）时，客户端 **必须** 使用 UTF-8 字节的 Base64 编码，并采用以下格式：

```text
Mcp-Param-{Name}: =?base64?{Base64EncodedValue}?=
```

同样的编码规则适用于 `Mcp-Name` 标头值。工具和提示模板名称仅受标头安全字符的 **应当** 约束，因此安全集合之外的名字（或资源 URI）以以下方式承载：

```text
Mcp-Name: =?base64?{Base64EncodedValue}?=
```

前缀 `=?base64?` 和后缀 `?=` 表示该值经过 Base64 编码。这些标记区分大小写，且 **必须** 严格按照所示形式出现（小写）。需要检查这些值的服务端和中间件 **必须** 相应地进行解码。特别是服务端 **必须** 在服务端 Validation 期间将已编码的 `Mcp-Name` 或 `Mcp-Param-` 值解码后再与对应的请求正文值进行比较。

为避免歧义，对于任何匹配该哨兵模式（即以 `=?base64?` 开头并以 `?=` 结尾）的纯 ASCII 值，客户端 **必须** 同样对其进行 Base64 编码。

**编码示例：**

| 原始值                 | 原因              | 编码后的标头值                                        |
| ---------------------- | ----------------- | ----------------------------------------------------- |
| `"us-west1"`           | 普通 ASCII        | `Mcp-Param-Region: us-west1`                          |
| `"Hello, 世界"`        | 包含非 ASCII 字符 | `Mcp-Param-Greeting: =?base64?SGVsbG8sIOS4lueVjA==?=` |
| `" padded "`           | 首尾含空白        | `Mcp-Param-Text: =?base64?IHBhZGRlZCA=?=`             |
| `"line1\nline2"`       | 包含换行          | `Mcp-Param-Text: =?base64?bGluZTEKbGluZTI=?=`         |
| `"=?base64?literal?="` | 匹配编码哨兵模式  | `Mcp-Param-Val: =?base64?PT9iYXNlNjQ/bGl0ZXJhbD89?=`  |

###### 5.2.6.3.3 客户端行为

通过 HTTP 传输层构造 `tools/call` 请求时，客户端 **必须**：

1. 从请求正文中提取任何标准标头所需的值（例如 `method`、`params.name`、`params.uri`）。
2. 将 `Mcp-Method` 标头以及（若适用）`Mcp-Name` 标头添加到请求中。
3. 检查工具的 `inputSchema`，找出标记有 `x-mcp-header` 的属性，并在每个注解属性的精确属性路径处取值；当该路径上没有值时省略对应的标头（参见 Schema 扩展）。
4. 按照 Value Encoding 规则对值进行编码。
5. 将 `Mcp-Param-{Name}` 标头添加到请求中。

如果服务端因必需的 `Mcp-Param-*` 标头缺失或与正文不匹配而以 `HeaderMismatch` 错误拒绝请求，客户端 **应当** 调用 `tools/list` 检查工具的 `inputSchema` 是否已变更，然后使用恰当的标头重试原始请求。

###### 5.2.6.3.4 服务端对自定义标头的处理

无法识别某个 `Mcp-Param-` 标头的中间服务端 **必须** 按 HTTP 语义规范要求原样转发并忽略其他内容。

服务端 **必须** 拒绝那些具有已识别的 `Mcp-Param-` 标头但其中包含无效字符的请求（参见 Value Encoding）。

任何处理消息正文的服务端 **必须** 验证已编码的标头值在解码（如为 Base64 编码）后是否与请求正文中的对应值一致。如果任何验证失败，服务端 **必须** 以 `400 Bad Request` HTTP 状态和 JSON-RPC 错误码 `-32020`（`HeaderMismatch`）拒绝该请求。

| Scenario                 | 客户端 Behavior    | 服务端 Behavior              |
| ------------------------ | ------------------ | ---------------------------- |
| 提供了参数值             | 客户端必须发送标头 | 服务端必须校验标头与正文一致 |
| 参数值为 `null`          | 客户端必须省略标头 | 服务端不得要求该标头         |
| 调用参数中不存在该字段   | 客户端必须省略标头 | 服务端不得要求该标头         |
| 正文有值但客户端省略标头 | 不符合协议的客户端 | 服务端必须拒绝请求           |

##### 5.2.6.4 大小写规则

标头名称（在 RFC 9110 中称为 "字段 names"）是大小写不敏感的。客户端和服务端 **必须** 对标头名执行大小写不敏感的比较。标头 _值_（例如方法名）区分大小写。

##### 5.2.6.5 服务端校验

处理请求正文的服务端 **必须** 拒绝那些标头中指定的值与请求正文中对应值不一致的请求。这可以防止网络中不同组件依赖不同事实来源（例如负载均衡器基于标头路由，而 MCP 服务端基于正文执行）所带来的潜在安全漏洞。

> **说明:** 在校验整数参数值时，服务端 **应当** 数值化地比较标头值和正文值，而非按字符串比较（例如 `42.0` 与 `42` 被视为相等）。

当因标头校验失败而拒绝请求时，服务端 **必须** 返回 HTTP 状态 `400 Bad Request`，且 **必须** 包含一个采用以下错误码的 JSON-RPC 错误响应：

| Code     | Name             | 说明                                                   |
| -------- | ---------------- | ------------------------------------------------------ |
| `-32020` | `HeaderMismatch` | HTTP 标头与正文对应值不一致，或必需标头缺失/格式错误。 |

该错误码从 MCP 规范为协议定义错误保留的子区间中分配。详见 Error Codes。

**错误响应示例：**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32020,
    "message": "Mcp-Name 标头与正文中的名称不一致"
  }
}
```

校验失败的情况包括：

- 必需的标准标头（`MCP-Protocol-Version`、`Mcp-Method`、`Mcp-Name`）缺失。
- 标头值与请求正文的对应值不一致。对于允许使用 Base64 哨兵编码的标头（`Mcp-Name` 和 `Mcp-Param-`），服务端 **必须** 在与正文值比较之前对已编码的值进行解码（参见 Value Encoding）。
- 标头值包含无效字符。

> **说明:** 中间件 **必须** 针对校验失败返回恰当的 HTTP 错误状态（例如 `400 Bad Request`），但不必返回 JSON-RPC 错误响应。

> **说明:** 基于镜像标头实施策略（例如按租户路由或限速）的中间件 **应当** 校验 `MCP-Protocol-Version` 标头指示的版本是否要求标头–正文校验。缺少相应的标头与正文一致性保证时，中间件 **应当** 拒绝该请求。

#### 5.2.7 练习与答案

**练习**：Mcp-Name 与正文 name 不一致应怎样处理？租户参数能否直接当作授权依据？

**参考答案**：服务端应拒绝镜像标头与正文不一致的请求，返回 HTTP 400 和相应的标头不匹配错误。即使标头通过一致性校验，也必须独立核对租户权限。

**操作检查**：启动本册的 --http 入口，比较正常请求与 Mcp-Method/正文 method 不匹配的请求；不匹配必须被拒绝。

**速查**：每条请求各自 POST 到 MCP 端点。服务端可以选择 JSON 或本请求的 SSE 响应；客户端要理解两者。

### 5.3 完整交互与排错实验

#### 5.3.1 先确定错误属于哪层

| 层次      | 例子                                      | 下一步                       |
| :-------- | :---------------------------------------- | :--------------------------- |
| 连接/HTTP | 连接拒绝、401、403、429                   | 修地址、授权、范围或等待策略 |
| JSON-RPC  | 不合法 JSON、未知方法、缺必需元数据       | 修消息与协议条件             |
| 工具业务  | search_notes 收到空白 query，isError=true | 修输入或业务规则             |
| 主应用    | 工具已成功，结果未送回模型                | 修调用 ID、上下文与调度      |

标准 RPC 错误码：`-32700` 解析错误、`-32600` 无效请求、`-32601` 未找到方法、`-32602` 无效参数、`-32603` 内部错误。MCP 的 `-32020` 是镜像标头不匹配，`-32021` 是缺客户端能力，`-32022` 是不支持的协议版本。错误的 data 结构要按所属错误解释，不把工具错误文本改造成任意 RPC 错误。

#### 5.3.2 完整交互与正常路径

先用第1章的固定客户端验证工具、资源和模板；再运行第4章多轮请求中的征询程序，观察第一次的输入要求与第二次结果。HTTP 实验用本章的 probe，分别对 Python 与 TypeScript 的本机服务运行。

##### 5.3.2.1 Python

```python
"""只连接自己的练习服务，检查正常请求与故意错误。"""
import json
import sys
import urllib.error
import urllib.request

url = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8765/mcp'
meta = {'io.modelcontextprotocol/protocolVersion': '2026-07-28',
        'io.modelcontextprotocol/clientCapabilities': {}}

def call(method, params, extra=None):
    headers = {'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream',
               'MCP-Protocol-Version': '2026-07-28', 'Mcp-Method': method}
    if 'name' in params: headers['Mcp-Name'] = params['name']
    headers.update(extra or {})
    request = urllib.request.Request(url, json.dumps({'jsonrpc': '2.0', 'id': 1,
        'method': method, 'params': params}).encode(), headers)
    try: response = urllib.request.urlopen(request, timeout=10)
    except urllib.error.HTTPError as exc: response = exc
    with response:
        status = response.code
        if 'text/event-stream' in response.headers.get('Content-Type', ''):
            payload = []
            for raw in response:
                line = raw.decode().rstrip('\r\n')
                if line.startswith('data:'): payload.append(line[5:].lstrip(' '))
                elif not line and payload:
                    event = json.loads('\n'.join(payload)); payload = []
                    if event.get('id') == 1: return status, event
            raise RuntimeError('缺少最终响应')
        return status, json.load(response)

for label, method, params, extra in [
    ('发现', 'server/discover', {'_meta': meta}, {}),
    ('正常调用', 'tools/call', {'_meta': meta, 'name': 'search_notes', 'arguments': {'query': 'stdio'}}, {}),
    ('缺元数据', 'tools/list', {}, {}),
    ('不支持版本', 'tools/list', {'_meta': {**meta, 'io.modelcontextprotocol/protocolVersion': '1900-01-01'}},
     {'MCP-Protocol-Version': '1900-01-01'}),
    ('标头不一致', 'tools/list', {'_meta': meta}, {'Mcp-Method': 'prompts/list'}),
]:
    status, body = call(method, params, extra)
    print(label, status, json.dumps(body, ensure_ascii=False))
```

##### 5.3.2.2 TypeScript

```typescript
const url = process.argv[2] ?? 'http://127.0.0.1:8766/mcp'
const meta = {
  'io.modelcontextprotocol/protocolVersion': '2026-07-28',
  'io.modelcontextprotocol/clientCapabilities': {},
}
type Test = [string, string, Record<string, unknown>, Record<string, string>]
const tests: Test[] = [
  ['发现', 'server/discover', { _meta: meta }, {}],
  [
    '正常调用',
    'tools/call',
    { _meta: meta, name: 'search_notes', arguments: { query: 'stdio' } },
    {},
  ],
  ['缺元数据', 'tools/list', {}, {}],
  [
    '不支持版本',
    'tools/list',
    { _meta: { ...meta, 'io.modelcontextprotocol/protocolVersion': '1900-01-01' } },
    { 'MCP-Protocol-Version': '1900-01-01' },
  ],
  ['标头不一致', 'tools/list', { _meta: meta }, { 'Mcp-Method': 'prompts/list' }],
]
for (const [label, method, params, extra] of tests) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'MCP-Protocol-Version': '2026-07-28',
    'Mcp-Method': method,
  }
  if (typeof params.name === 'string') headers['Mcp-Name'] = params.name
  Object.assign(headers, extra)
  const response = await fetch(url, {
    method: 'POST',
    headers,
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  let body: unknown
  if (response.headers.get('content-type')?.includes('text/event-stream')) {
    const data = await response.text()
    const messages = data
      .split(/\r?\n\r?\n/)
      .map((event) =>
        event
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).replace(/^ /, ''))
          .join('\n'),
      )
      .filter(Boolean)
      .map((value) => JSON.parse(value))
    body = messages.find((message) => message.id === 1)
    if (!body) throw new Error('缺少最终响应')
  } else {
    body = await response.json()
  }
  console.log(label, response.status, JSON.stringify(body))
}
export {}
```

探针先请求发现，再发正常工具调用，最后发送缺元数据、版本不支持、标头不一致等故意错误。故意错误不表示服务坏了；返回匹配的错误才是通过条件。它们只对自己的练习服务发送只读请求。

#### 5.3.3 订阅、取消与错误的观察条件

固定笔记工程不产生动态变更，因此目录不变化时没有更新通知是合理结果。订阅实验需要声明支持更新的服务，先观察 acknowledged，再触发允许的变化，再检查对应 subscriptionId。对 HTTP 的长响应关闭读取端，观察工作停止与没有继续写入；对 stdio 用本请求 ID 的取消通知。取消与完成的竞态按第4章解释。

进度令牌用于关联，不承诺结果；订阅 ID 不提供授权；请求 ID 不等于任务句柄。把这些标识互换，即使字符串看起来相似也会破坏协议含义。

#### 5.3.4 改错练习与答案

**题1**：用 GET 打开 /mcp 成功才能叫 HTTP MCP 吗？**答案**：本册端点接受 POST 请求；用网页能否打开判断协议是错误方法。

**题2**：版本不支持时能否反复以同一版本重试？**答案**：应从 supported 中选择双方支持的版本；没有交集时报告无法兼容。

**题3**：工具失败能否返回成功空列表假装没有数据？**答案**：不能，合法无命中与执行失败必须区分。

**通过标准**：能解释每条输入为什么成功或失败，并能指出纠正的是传输、消息、能力、业务还是主应用。

## 第6章 基础协议：授权

第5章解决怎样把消息送达。访问受保护的 HTTP 服务时，还要确认目标资源、授权服务器和访问令牌。

先确认目标资源，再从受保护资源元数据确定可信的授权服务器，最后由授权服务器给客户端令牌。

**先观察一个例子**：沿401挑战、资源元数据、授权服务器元数据、浏览器同意、授权码和访问令牌逐步填写参与者。

### 6.1 授权参与者与流程

#### 6.1.1 引言

先确定谁访问哪个受保护资源，以及本规范在该传输上的适用范围，再阅读后续授权步骤。

##### 6.1.1.1 目的与范围

模型上下文协议在传输层提供授权能力，使 MCP 客户端能够代表资源所有者 向受限制的 MCP 服务端发起请求。本规范定义了基于 HTTP 传输层的授权流程。

##### 6.1.1.2 协议要求

授权对于 MCP 实现而言是 **可选** 的。在受支持时：

- 使用基于 HTTP 的传输的实现应当遵循本规范。
- 使用 STDIO 传输的实现不应遵循本规范，而应改为从环境中检索凭证。
- 使用其他传输的实现必须遵循其协议既定的安全最佳实践。

HTTP 传输的授权规则在本章后续小节展开。客户端和服务器也可以协商适用自身场景的身份验证和授权策略。通过 stdio 启动的服务器应从运行环境取得所需凭据。

##### 6.1.1.3 标准合规

本授权机制基于以下既有规范，但为了在保持简洁性的同时确保安全性与互操作性，仅实现了它们特性的一个选定子集：

- OAuth 2.1 IETF 草案（draft-ietf-oauth-v2-1-13）
- OAuth 2.0 持有者令牌用法
  （RFC6750）
- OAuth 2.0 授权服务端元数据
  （RFC8414）
- OAuth 2.0 资源指示符
  （RFC8707）
- OAuth 2.0 受保护资源元数据（RFC9728）
- OAuth 2.0 授权服务器签发者标识（RFC9207）
- OAuth 客户端 ID 元数据文档（draft-ietf-oauth-client-id-metadata-document-00）
- OpenID Connect 发现 1.0

#### 6.1.2 角色

受保护的 MCP 服务器（Server） 充当 OAuth 2.1 资源服务端，能够使用访问令牌接受和响应受保护资源请求。

MCP 客户端（Client） 充当 OAuth 2.1 客户端，代表资源所有者 发起受保护资源请求。

授权服务器 负责与用户交互（如必要）并颁发供 MCP 服务端使用的访问令牌。授权服务端的实现细节不在本规范范围内。它可以与资源服务端一起托管，也可以是单独的实体。授权服务端发现规定了 MCP 服务端如何向客户端指示其对应授权服务端的位置。

#### 6.1.3 概览

1. 授权服务端必须实现 OAuth 2.1，并对保密客户端与公开客户端采取适当的安全措施。

2. 授权服务端与 MCP 客户端应当支持 OAuth 客户端 ID 元数据文档（draft-ietf-oauth-client-id-metadata-document-00）。

3. MCP 服务端必须实现 OAuth 2.0 受保护资源元数据（RFC9728）。MCP 客户端必须使用 OAuth 2.0 受保护资源元数据进行授权服务端 discovery。

4. MCP 授权服务端必须提供以下发现机制 中的至少一项：
   - OAuth 2.0 授权服务端元数据（RFC8414）
   - OpenID Connect 发现 1.0

   MCP 客户端必须同时支持两种发现机制，以获取与授权服务端交互所需的信息。

#### 6.1.4 授权服务器发现

MCP 服务端通过 OAuth 2.0 受保护资源元数据通告其关联的授权服务端，MCP 客户端则通过授权服务端元数据发现 来确定授权服务端端点和支持的能力。实现必须遵循授权服务端发现中定义的规范性发现 要求。

#### 6.1.5 客户端注册

在启动授权流程之前，客户端先取得可用的客户端 ID。本册使用客户端标识元数据文档或预登记方式，并核对授权服务器声明的支持情况。

#### 6.1.6 权限范围选择策略

MCP 服务端应当在 `WWW-Authenticate` 头中包含一个 `scope` 参数，如 RFC 6750 节 3 所定义，用于指示访问资源所需的权限范围。这为客户端在授权期间就恰当的权限范围提供即时指导，遵循最小权限原则并防止客户端请求过多权限。

`WWW-Authenticate` 挑战中包含的权限范围可以与 `scopes_supported` 一致，可以是其子集或超集，或者既不是严格子集也不是超集的另一种集合。客户端不得假定挑战中的权限范围集合与 `scopes_supported` 之间存在任何特定集合关系。客户端必须将挑战中提供的权限范围视为针对当前操作的权威性权限范围。这些权限范围是满足当前请求所必需的。在重新授权时，客户端应当将这些权限范围与先前已授予的权限范围一并包含，以避免丢失其他操作所需的权限（参见 Step-Up 授权 Flow）。服务端应当在构造权限范围集合时力求一致性，但不需要通过 `scopes_supported` 暴露每个动态颁发的权限范围。

带有权限范围引导的 401 响应示例：

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource",
                         scope="files:read"
```

在实现授权流程时，MCP 客户端应当遵循最小权限原则，仅请求其预期操作所需的权限范围。在初始授权 handshake 期间，MCP 客户端应当遵循以下权限范围选择的优先级顺序：

1. **使用 `scope` 参数**：如果 401 响应的初始 `WWW-Authenticate` 头中提供，则使用该参数。
2. **若 `scope` 不可用**：则使用 受保护资源元数据文档中 `scopes_supported` 中定义的全部权限范围；若 `scopes_supported` 未定义，则省略 `scope` 参数。

`scopes_supported` 字段旨在表示基础功能所需的最小权限范围集合（参见最小化权限范围），附加的权限范围通过权限范围挑战处理一节中描述的追加授权流程步骤按需请求。

#### 6.1.7 授权流程步骤

流程图所示的注册步骤使用客户端登记中定义的机制之一。

完整的授权流程如下：

**从受保护资源挑战到持令牌调用**

```mermaid
sequenceDiagram
    participant B as 浏览器
    participant C as 客户端 (Client)
    participant M as MCP 资源服务器 (Server)
    participant A as 授权服务器 (Authorization Server)
    C->>M: 发送未携带令牌的 MCP 请求
    M->>C: HTTP 401 Unauthorized（未授权）<br/>携带授权挑战（WWW-Authenticate）
    Note over C: 从授权挑战（WWW-Authenticate）中提取资源元数据地址（resource_metadata）
    C->>M: 请求受保护资源元数据
    M->>C: 返回资源元数据
    Note over C: 解析元数据并选定授权服务器
    C->>A: GET 授权服务器元数据端点
    Note over C,A: 按优先级尝试 OAuth 2.0 和 OpenID Connect 发现端点
    A-->>C: 返回授权服务器元数据
    alt 使用客户端标识元数据文档
        Note over C: 以 HTTPS 地址作为客户端标识（client_id）
        Note over A: 识别网址形式的客户端标识（client_id）
        A->>C: 读取客户端标识（client_id）指向的元数据
        C-->>A: 返回 JSON 元数据文档
        Note over A: 验证元数据和回调地址（redirect_uris）
    else 使用预登记客户端
        Note over C: 使用已有客户端标识（client_id）
    end
    Note over C: 准备授权码校验（PKCE）参数和资源（resource）参数<br/>选择权限范围（scope）并记录预期签发者（issuer）
    C->>B: 打开带挑战值（code_challenge）和资源参数（resource）的授权地址
    B->>A: 提交含资源参数（resource）的授权请求
    Note over A: 用户授权
    A->>B: 重定向到回调地址并携带授权码与签发者标识（iss）
    B->>C: 转交授权码回调
    Note over C: 核对签发者标识（iss）与记录值一致（RFC 9207）
    C->>A: 提交令牌请求、校验值（code_verifier）和资源参数（resource）
    A->>C: 颁发访问令牌，可能同时颁发刷新令牌
    C->>M: 携带访问令牌发起 MCP 请求
    M-->>C: 返回 MCP 响应
    Note over C,M: 使用有效访问令牌继续通信
```

##### 6.1.7.1 授权响应验证

在重定向用户代理之前，客户端必须从所选授权服务端的已验证元数据文档中记录 `issuer` 值（参见授权服务端元数据发现），并将其与用于存储 PKCE 校验值（以及 `state` 值，如果使用）的同一逐请求记录相关联。本节中的验证依赖于所记录的值是真实的；如果预期颁发者是从未经验证的来源获得的，则该验证不提供保护。

MCP 授权服务端应当在授权响应（包括错误响应）中包含 `iss` 参数，如 RFC9207 节 2 所定义。包含 `iss` 参数的授权服务端必须通过在其元数据中将 `authorization_response_iss_parameter_supported` 设置为 `true` 来通告这一点（RFC9207 节 2.3）。

在收到授权响应后，MCP 客户端必须在将授权码传输到任何令牌端点之前应用 RFC9207 节 2.4 中的验证：

| `authorization_response_iss_parameter_supported` | 响应中的 `iss` | 客户端动作                                      |
| ------------------------------------------------ | -------------- | ----------------------------------------------- |
| `true`                                           | 存在           | 按 RFC3986 6.2.1 与记录的颁发者作简单字符串比较 |
| `true`                                           | 缺失           | 拒绝响应                                        |
| `false` 或缺失                                   | 存在           | 按 RFC3986 6.2.1 与记录的颁发者作简单字符串比较 |
| `false` 或缺失                                   | 缺失           | 继续处理                                        |

第三行应用了 RFC9207 节 2.4 中的 local-policy 条款：本规范无论元数据通告与否，都将存在的 `iss` 与记录的颁发者进行比较，以兼容那些在更新元数据之前就已发出 `iss` 的授权服务端。

在按照 RFC 9207 节 2.4 从 `application/x-www-form-urlencoded` 响应中解码 `iss` 值后，客户端不得在比较之前应用对 URI 方案名或主机名进行大小写折叠、默认端口省略、尾斜杠或百分号编码规范化（RFC 3986 Sections 6.2.2-6.2.3）。

此验证同样适用于错误响应 —— 一旦不匹配，客户端不得基于或展示 `error`、`error_description` 或 `error_uri`。

#### 6.1.8 资源参数实现

MCP 客户端必须按照 RFC 8707 中的定义实现 OAuth 2.0 资源指示符，以显式指定为之请求令牌的目标资源。`resource` 参数：

1. **必须** 包含在授权请求和令牌请求中。
2. **必须** 标识客户端打算将令牌用于的 MCP 服务端。
3. **必须** 使用 RFC 8707 节 2 中定义的 MCP 服务端规范化的 URI。

##### 6.1.8.1 规范服务器 URI

在本规范中，MCP 服务端的规范化的 URI 按 RFC 8707 节 2 中指定的资源标识符来定义，并与 RFC 9728 中的 `resource` 参数保持一致。

MCP 客户端应当为其打算访问的 MCP 服务端提供尽可能具体的 URI，并遵循 RFC 8707 的指导。虽然规范形式使用小写的方案和主应用组件，但实现应当接受大写的方案和主应用组件以提高稳健性和互操作性。

有效的规范化的 URI 示例：

- `https://mcp.example.com/mcp`
- `https://mcp.example.com`
- `https://mcp.example.com:8443`
- `https://mcp.example.com/server/mcp`（当需要路径组件以标识各个 MCP 服务端时）

无效的规范化的 URI 示例：

- `mcp.example.com`（缺少方案）
- `https://mcp.example.com#fragment`（包含 fragment）

> **说明：** 虽然根据 RFC 3986，`https://mcp.example.com/`（带尾斜杠）和 `https://mcp.example.com`（不带尾斜杠）都是技术上合法的绝对 URI，但实现应当一致地使用不带尾斜杠的形式以获得更好的互操作性，除非尾斜杠对于特定资源在语义上是重要的。

例如，如果访问位于 `https://mcp.example.com` 的 MCP 服务端，则授权请求将包含：

```text
&resource=https%3A%2F%2Fmcp.example.com
```

MCP 客户端必须无论授权服务端是否支持都发送此参数。

#### 6.1.9 访问令牌使用

令牌通过受保护的传输提交给其目标资源；客户端负责安全保存，资源服务器负责验证适用身份和权限。

##### 6.1.9.1 令牌要求

向 MCP 服务端发起请求时的访问令牌处理必须符合 OAuth 2.1 节 5 "资源 Requests" 中定义的要求。具体而言：

1. MCP 客户端 **必须** 使用 OAuth 2.1 节 5.1.1 中定义的授权请求头字段：

```text
Authorization: Bearer <access-token>
```

注意授权 **必须** 包含在客户端发往服务端的每个 HTTP 请求中。

2. Access 令牌 **不得** 包含在 URI 查询字符串中。

请求示例：

```http
GET /mcp HTTP/1.1
Host: mcp.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

##### 6.1.9.2 令牌处理

MCP 服务端以 OAuth 2.1 资源服务端角色行事，必须按照 OAuth 2.1 节 5.2 中所述验证访问令牌。MCP 服务端必须根据 RFC 8707 节 2 验证访问令牌是专门为它们颁发的。如果验证失败，服务端必须根据 OAuth 2.1 节 5.3 错误处理要求进行响应。Invalid 或 expired 令牌必须收到 HTTP 401 响应。

MCP 客户端不得向 MCP 服务端发送不是由该 MCP 服务端的授权服务端颁发的令牌。

MCP 服务端必须仅接受对其自身资源有效的令牌。

MCP 服务端不得接受或传递任何其他令牌。

#### 6.1.10 刷新令牌

本节为 MCP 客户端和 MCP 服务端在处理或颁发 OAuth 与 OpenID Connect 的刷新令牌时提供指导。

需要刷新令牌的 **MCP 客户端**：

- **必须** 按照 OAuth 2.1 节 4.3 的规定，在传输与存储中保持刷新令牌机密性
- **应当** 在其 `grant_types` 客户端元数据中包含 `refresh_token`
- 当授权服务端元数据在 `scopes_supported` 中包含 `offline_access` 时，**可以** 将 `offline_access` 添加到授权和令牌请求的 `scope` 参数中
- **不得** 假定刷新令牌一定会被颁发；AS 保留自由裁量权

**MCP 服务端**（Protected 资源）不应在 `WWW-Authenticate` 权限范围或 受保护资源元数据 `scopes_supported` 中包含 `offline_access`，因为刷新令牌不是资源的需求。

#### 6.1.11 错误处理

服务端必须为授权错误返回恰当的 HTTP 状态码：

| Status Code | 说明         | Usage                  |
| ----------- | ------------ | ---------------------- |
| 401         | Unauthorized | 需要授权或令牌无效     |
| 403         | Forbidden    | 权限范围无效或权限不足 |
| 400         | Bad 请求     | 授权请求格式错误       |

##### 6.1.11.1 权限范围挑战处理

本节介绍客户端已拥有令牌但在运行时操作中需要额外权限时如何处理 insufficient 权限范围错误。这遵循 OAuth 2.1 节 5 中定义的错误处理模式，并利用 RFC 9728（OAuth 2.0 受保护资源元数据） 中的元数据字段。

###### 6.1.11.1.1 运行时权限范围不足错误

当客户端在运行时操作中携带 insufficient 权限范围的访问令牌发起请求时，服务端应当响应：

- `HTTP 403 Forbidden` 状态码（依据 RFC 6750 节 3.1）
- `WWW-Authenticate` 头，包含 `Bearer` 方案及附加参数：
  - `error="insufficient_scope"` —— 指示授权失败的特定类型
  - `scope="required_scope1 required_scope2"` —— 指定操作所需的最小权限范围
  - `resource_metadata` —— 受保护资源元数据文档的 URI（与 401 响应保持一致）
  - `error_description`（可选） —— 人类可读的错误描述

**服务端 Scope Management（服务端 Scope 管理）**：在响应 insufficient 权限范围错误时，服务端应当在 `scope` 参数中包含满足当前操作所需的权限范围，与 RFC 6750 节 3.1 保持一致。`scope` 属性描述访问所请求资源所必需的权限范围 —— 服务端无需包含客户端先前已授予的权限范围。

无论选择哪种方法，服务端应当在单个挑战中包含当前操作所需的全部权限范围。增量式挑战（先返回一个缺失的权限范围，然后在后续重试时再返回另一个）会强制单个操作进行多次授权往返，并降低用户体验。所需权限范围可根据特定请求参数和上下文动态确定，但一旦确定，就应一起发出。

服务端应当在其权限范围包含策略上保持一致，以便为客户端提供可预测的行为。

服务端应当在确定响应中包含哪些权限范围时考虑用户体验影响，因为配置错误的权限范围可能需要频繁的用户交互。

跨操作的权限范围累积是客户端端的职责。有关权限范围并集要求，请参阅 Step-Up 授权 Flow。

insufficient 权限范围响应示例：

```http
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer error="insufficient_scope",
                         scope="files:write",
                         resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource",
                         error_description="File write permission required for this operation"
```

###### 6.1.11.1.2 升级授权流程

客户端在初始授权期间或运行时（`insufficient_scope`）将收到与权限范围相关的错误。客户端应当通过请求一组扩展权限范围的新访问令牌来响应这些错误以通过追加授权流程处理，或者以其他恰当的方式处理这些错误。代表用户行事的客户端应当尝试追加授权流程。代表自身行事的客户端（`client_credentials` 客户端）可以尝试追加授权流程或立即中止请求。

流程如下：

1. **解析错误信息（解析错误信息）**：从授权服务端响应或 `WWW-Authenticate` 头中。
2. **确定所需权限范围（确定所需权限范围）**：通过计算客户端先前请求的权限范围集与当前挑战中的权限范围的并集。这确保在服务端按 RFC 6750 节 3.1 发出 per-operation 权限范围挑战时，先前授予的权限得以保留。客户端可以还可以参考初始权限范围选择获取初始权限范围选择指导。
3. **Initiate (re-)授权（发起（重新）授权）**：使用确定的权限范围集。
4. **重试原请求（重试原始请求）**：使用新的授权重试原始请求，重试次数不超过几次，并将其视为永久性授权失败。

客户端应当实现重试限制，并应当跟踪权限范围升级尝试，以避免对同一资源和操作组合的重复失败。

服务端必须在决定令牌是否足以执行某项操作时考虑权限范围层级结构，其中更宽泛的权限范围隐含更窄的权限范围。

#### 6.1.12 安全考虑

本规范的实现必须遵循安全 Considerations 中的规范性安全要求，涵盖令牌受众绑定与验证、令牌窃取、通信安全、授权码保护、mix-up 与 confused deputy 攻击、open redirection 以及客户端 ID 元数据文档 安全。

#### 6.1.13 额外的授权方式

核心协议有若干授权扩展，它们定义了额外的授权机制。这些扩展具有以下特性：

- **Optional（可选）** —— 实现可以选择采用这些扩展
- **Additive（增量）** —— 扩展不修改或破坏核心协议功能；它们在保留核心协议行为的同时添加新能力
- **Composable（可组合）** —— 扩展是模块化的，旨在协同工作而不发生冲突，允许实现同时采用多个扩展
- **Versioned independently（独立版本化）** —— 扩展遵循核心 MCP 版本控制周期，但可根据需要采用独立版本控制

机器身份与企业托管授权由各自扩展定义，部署时还需核对双方能力、授权服务器配置和访问令牌的适用范围。

### 6.2 发现授权服务器

本文档描述了 MCP 服务端向 MCP 客户端通告其关联授权服务端的机制，以及 MCP 客户端通过该机制确定授权服务端端点和受支持能力的发现过程。

#### 6.2.1 授权服务器位置

MCP 服务端必须实现 OAuth 2.0 受保护资源元数据（RFC9728）规范，以指明授权服务端的位置。MCP 服务端返回的 受保护资源元数据文档必须包含 `authorization_servers` 字段，其中至少包含一个授权服务端。

`authorization_servers` 的具体使用不在本规范的范围内；实现者应参考 OAuth 2.0 受保护资源元数据（RFC9728）以获取实现细节的指导。

实现者应注意 受保护资源元数据文档可以定义多个授权服务端。选择使用哪一个授权服务端的责任在 MCP 客户端一方，需遵循 RFC9728 节 7.6 "授权服务端" 中指定的指南。

当 `authorization_servers` 中列出多个授权服务端时，每个都是独立的 OAuth 2.0 授权服务端。根据 RFC 6749 节 2.2，客户端标识符 对于颁发它们的授权服务端是唯一的。客户端必须为每个授权服务端维护独立的注册状态（客户端凭据、令牌），并且不得假定对某个授权服务端有效的凭证会被另一个授权服务端接受。有关将客户端凭据与颁发它们的授权服务端相关联的要求，请参阅授权服务端 Binding。

#### 6.2.2 受保护资源元数据发现要求

MCP 服务端必须实现以下发现机制之一，以向 MCP 客户端提供授权服务端位置信息：

1. **WWW-Authenticate 标头**：在返回 `401 Unauthorized` 响应时，按照 RFC9728 节 5.1 所述，将资源元数据 URL 包含在 `WWW-Authenticate` HTTP 头的 `resource_metadata` 中。

2. **约定的元数据 URI**：按照 RFC9728 中的规定，在约定的 URI 处提供元数据。可以是以下两种之一：
   - 位于服务端 MCP 端点的路径：`https://example.com/public/mcp` 可在 `https://example.com/.well-known/oauth-protected-resource/public/mcp` 处托管元数据
   - 位于根路径：`https://example.com/.well-known/oauth-protected-resource`

MCP 客户端必须同时支持这两种发现机制，并在存在已解析的 `WWW-Authenticate` 头中的资源元数据 URL 时使用该 URL；否则，它们必须回退到按上述列出顺序构造和请求约定的 URI。

MCP 客户端必须能够解析 `WWW-Authenticate` 头并对来自 MCP 服务端的 `HTTP 401 Unauthorized` 响应做出恰当响应。

服务端还可以在 `WWW-Authenticate` 挑战中包含一个 `scope` 参数，以指示访问资源所需的权限范围；权限范围语义和相关客户端行为在初始权限范围选择一节中定义。

#### 6.2.3 授权服务器元数据发现

MCP 使用 RFC 8414 节 3.1 中定义的默认 `oauth-authorization-server` 约定的 URI 后缀进行授权服务端元数据发现。MCP 不定义特定于应用的约定的 URI 后缀。

为了处理不同的颁发者 URL 格式并确保与 OAuth 2.0 授权服务端元数据和 OpenID Connect 发现 1.0 规范的互操作性，MCP 客户端必须在发现授权服务端元数据时尝试多个约定的元数据端点。

该发现方法基于 RFC 8414 节 3.1 "授权服务端元数据请求" 用于 OAuth 2.0 授权服务端元数据发现，以及 RFC 8414 节 5 "Compatibility Notes" 用于 OpenID Connect 发现 1.0 互操作性。

对于带有路径组件的颁发者 URL（例如 `https://auth.example.com/tenant1`），客户端必须按以下优先级顺序尝试端点：

1. 带有路径插入的 OAuth 2.0 授权服务端元数据：
   `https://auth.example.com/.well-known/oauth-authorization-server/tenant1`
2. 带有路径插入的 OpenID Connect 发现 1.0：
   `https://auth.example.com/.well-known/openid-configuration/tenant1`
3. OpenID Connect 发现 1.0 路径追加：
   `https://auth.example.com/tenant1/.well-known/openid-configuration`

对于不带路径组件的颁发者 URL（例如 `https://auth.example.com`），客户端必须尝试：

1. OAuth 2.0 授权服务端元数据：
   `https://auth.example.com/.well-known/oauth-authorization-server`
2. OpenID Connect 发现 1.0：
   `https://auth.example.com/.well-known/openid-configuration`

在获取元数据文档后，MCP 客户端必须按照 RFC8414 节 3.3 或 OpenID Connect 发现节 4.3 中的要求对其进行验证：文档中的 `issuer` 值必须与用于构造约定的元数据 URL 的颁发者标识符完全相同。如果不同，客户端不得使用该元数据。例如，从 `https://attacker.example/.well-known/oauth-authorization-server` 获取且包含 `"issuer": "https://honest.example"` 的文档必须被拒绝。

#### 6.2.4 时序图

下图概述了一个示例流程：

**按挑战标头或约定地址发现元数据**

```mermaid
sequenceDiagram
    participant C as 客户端 (Client)
    participant M as MCP 资源服务器 (Server)
    participant A as 授权服务器 (Authorization Server)
    Note over C: 尝试匿名发起 MCP 请求
    C->>M: 发送未携带令牌的 MCP 请求
    M-->>C: HTTP 401 Unauthorized（未授权）<br/>可能包含授权挑战（WWW-Authenticate）
    alt 标头提供资源元数据（resource_metadata）
        Note over C: 从标头提取资源元数据网址（resource_metadata）
        C->>M: GET 资源元数据地址（resource_metadata）
        M-->>C: 返回受保护资源元数据，含授权服务器地址
    else 标头未提供资源元数据（resource_metadata）
        Note over C: 按顺序探测约定地址
        Note over M: MCP 端点在根路径时跳过子路径探测
        C->>M: GET /.well-known/oauth-protected-resource/mcp
        alt 找到子路径资源元数据
            M-->>C: 返回受保护资源元数据，含授权服务器地址
        else 未找到子路径资源元数据
            C->>M: GET /.well-known/oauth-protected-resource
            alt 找到根路径资源元数据
                M-->>C: 返回受保护资源元数据，含授权服务器地址
            else 未找到根路径资源元数据
                Note over C: 终止发现或使用预配置值
            end
        end
    end
    Note over C: 验证受保护资源元数据<br/>构造授权服务器元数据地址
    C->>A: GET 授权服务器元数据端点
    Note over C,A: 按优先级尝试 OAuth 2.0 和 OpenID Connect 发现端点
    A-->>C: 返回授权服务器元数据
    Note over C,A: 执行 OAuth 2.1 授权流程
    C->>A: 请求访问令牌
    A-->>C: 颁发访问令牌
    C->>M: 携带访问令牌发起 MCP 请求
    M-->>C: 返回 MCP 响应
    Note over C,M: 使用有效访问令牌继续通信
```

#### 6.2.5 练习与答案

**练习**：401 中取得的地址是否可以不经检查就抓取？资源元数据与授权服务器元数据各回答什么？

**参考答案**：客户端须先检查地址与网络目标，防止服务器端请求伪造（SSRF），并校验元数据中的签发方。受保护资源元数据说明该资源接受哪些授权服务器，授权服务器元数据给出授权与令牌端点及支持的能力。

**操作检查**：沿401挑战、资源元数据、授权服务器元数据、浏览器同意、授权码和访问令牌逐步填写参与者。

**速查**：先确认目标资源，再从受保护资源元数据确定可信的授权服务器，最后由授权服务器给客户端令牌。

### 6.3 客户端登记与授权码实验

先确认客户端如何取得标识和回调配置，再用预登记客户端验证授权码流程。

#### 6.3.1 现行客户端登记方式

登记让授权服务器识别客户端与合法回调。PKCE 把授权码绑定到流程发起者，令牌刷新延长授权的可用性。

**先观察一个例子**：检查 client_id、redirect_uri、state、code_verifier 和 resource 各自对应什么；先用预登记公开客户端完成本章程序。

本节覆盖两种现行客户端登记方式。

- **客户端 ID 元数据文档**：当客户端和服务端之间没有预先关系时（最常见）
- **预登记（Pre-registration）**：当客户端和服务端之间已存在关系时

支持所有选项的客户端应当使用以下优先级顺序：

1. 如果客户端已拥有服务端的预登记客户端信息，则使用之
2. 如果授权服务端通过 OAuth 授权服务端元数据中的 `client_id_metadata_document_supported` 表明其支持客户端 ID 元数据文档，则使用之
3. 若以上选项都不可用，则提示用户输入预登记的客户端信息。

**客户端标识元数据文档的发现与校验**

```mermaid
sequenceDiagram
    participant User as 用户
    participant Client as 客户端 (Client)
    participant Server as 授权服务器 (Authorization Server)
    participant Metadata as 客户端元数据端点
    participant Resource as MCP 资源服务器 (Resource Server)
    Note over Client,Metadata: 客户端在 HTTPS 地址托管元数据<br/>https://app.example.com/oauth/metadata.json
    User->>Client: 发起连接
    Client->>Server: 授权请求<br/>客户端标识 client_id=https://app.example.com/oauth/metadata.json<br/>回调地址 redirect_uri=http://localhost:3000/callback
    Server->>User: 提示用户身份认证
    User->>Server: 提交身份凭据
    Note over Server: 验证用户身份
    Note over Server: 识别网址形式的客户端标识（client_id）
    Server->>Metadata: GET https://app.example.com/oauth/metadata.json
    Metadata-->>Server: 返回 JSON 元数据<br/>如 client_id、client_name、redirect_uris
    Note over Server: 校验 client_id 与地址一致、redirect_uri 在允许列表中<br/>校验文档结构，并按策略选择是否校验域名
    alt 校验成功
        Server->>User: 展示含客户端显示名（client_name）的同意页面
        User->>Server: 同意访问
        Server->>Client: 通过回调地址（redirect_uri）返回授权码
        Client->>Server: 用授权码换令牌<br/>客户端标识 client_id=https://app.example.com/oauth/metadata.json
        Server-->>Client: 颁发访问令牌
        Client->>Resource: 携带访问令牌发起 MCP 请求
        Resource-->>Client: 返回 MCP 响应
    else 校验失败
        Server->>User: 返回错误<br/>invalid_client（无效客户端）或 invalid_request（无效请求）
    end
    Note over Server: 按 HTTP 缓存标头保存元数据供后续请求使用
```

##### 6.3.1.1 客户端 ID 元数据文档

MCP 客户端和授权服务端应当支持 OAuth 客户端 ID 元数据文档 中规定的 OAuth 客户端 ID 元数据文档，以用于客户端登记。

此方法使客户端能够使用 HTTPS URL 作为客户端标识符，其中该 URL 指向包含客户端元数据的 JSON 文档。这解决了服务端和客户端之间没有预先关系的常见 MCP 场景。

###### 6.3.1.1.1 实现要求

支持客户端 ID 元数据文档的 MCP 实现必须遵循 OAuth 客户端 ID 元数据文档 中规定的要求。关键要求包括：

**对于 MCP 客户端：**

- 客户端必须按照 RFC 要求将其元数据文档托管在 HTTPS URL 处
- `client_id` URL 必须使用 "https" 方案且包含一个路径组件，例如 `https://example.com/client.json`
- 元数据文档必须至少包含以下属性：`client_id`、`client_name`、`redirect_uris`
- 客户端必须确保元数据中的 `client_id` 值与文档 URL 完全匹配
- 客户端可以使用 `private_key_jwt` 进行客户端身份认证（例如，对令牌端点的请求），并按照客户端 ID 元数据文档 第 6.2 节进行恰当的 JWKS 配置

**对于授权服务端：**

- **应当** 在遇到 URL 形式的 client_ids 时获取元数据文档
- **必须** 验证所获取文档的 `client_id` 与 URL 完全匹配
- **应当** 在缓存时遵守 HTTP 缓存头
- **必须** 验证授权请求中提供的 回调 URI（redirect_uri） 与元数据文档中列出的相匹配
- **必须** 验证文档结构是有效的 JSON 且包含必需字段
- **应当** 遵循客户端 ID 元数据文档 第 6 节以及客户端 ID 元数据文档 安全中的安全考虑

###### 6.3.1.1.2 元数据文档示例

```json
{
  "client_id": "https://app.example.com/oauth/client-metadata.json",
  "client_name": "Example MCP Client",
  "client_uri": "https://app.example.com",
  "logo_uri": "https://app.example.com/logo.png",
  "redirect_uris": ["http://127.0.0.1:3000/callback", "http://localhost:3000/callback"],
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none"
}
```

###### 6.3.1.1.3 客户端 ID 元数据文档流程

下图说明了使用客户端 ID 元数据文档时的完整流程：

```text
客户端声明 client_id（HTTPS 元数据文档地址）
  → 授权服务器安全读取并校验文档
  → 核对 client_id、redirect_uris 与客户端属性
  → 后续授权流程按登记和精确回调规则执行
```

###### 6.3.1.1.4 通告 CIMD 支持

授权服务端通过在其 OAuth 授权服务端元数据中包含以下属性来通告其支持使用客户端 ID 元数据文档的客户端：

```json
{
  "client_id_metadata_document_supported": true
}
```

客户端在没有合适的预登记凭据时，检查授权服务器是否声明支持客户端标识元数据文档（CIMD）。如未声明支持，应请用户提供可用的预登记信息。无法取得合法客户端标识时终止授权。

##### 6.3.1.2 预注册

MCP 客户端应当支持静态客户端凭据的选项，例如由预登记流程提供的凭证。这可以是：

1. 硬编码专供 MCP 客户端与该授权服务端交互时使用的客户端 ID（以及适用的客户端凭据），或者
2. 呈现一个允许用户输入这些详细信息的 UI，这些信息来自客户端自身（例如通过由服务端托管的配置界面）注册 OAuth 客户端。

##### 6.3.1.3 授权服务器绑定

客户端必须将凭据绑定到签发它的授权服务器，以经过验证的 issuer 为键。授权服务器发生变化时，不得向另一服务器重用这些凭据，应核对新的登记配置。

预登记凭据本身就特定于某个授权服务端。如果受保护的资源元数据指示的授权服务端不再与凭证注册时所对应的那个授权服务端相匹配，客户端应当呈现错误而非静默尝试使用不匹配的凭证。

基于客户端 ID 元数据文档的客户端标识符可跨授权服务端移植，因为它们是由授权服务端按需解析的自托管 HTTPS URL。当授权服务端发生变化时，无需重新注册。

#### 6.3.2 授权码与 PKCE 客户端

准备已核实的 HTTPS 授权端点、令牌端点、资源端点，以及预登记公开客户端。登记回调 http://127.0.0.1:8769/callback 并支持 S256。当前终端设置 OAUTH_ISSUER、OAUTH_METADATA_URL、MCP_URL、OAUTH_CLIENT_ID、OAUTH_SCOPE。程序不保存长期凭据；不要同时占用相同回调端口。

##### 6.3.2.1 Python

```python
"""公开客户端授权码与 PKCE；需要已核实的授权服务器和预登记客户端。"""
import base64
import hashlib
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import secrets
import urllib.error
import urllib.parse
import urllib.request

REDIRECT = 'http://127.0.0.1:8769/callback'

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

HTTP = urllib.request.build_opener(NoRedirect)

def https_url(value, name):
    parsed = urllib.parse.urlsplit(value)
    if parsed.scheme != 'https' or not parsed.netloc or parsed.username:
        raise ValueError(f'{name} 必须是已核实的 HTTPS 地址')
    return value

def endpoint(name):
    return https_url(os.environ[name], name)

def main():
    issuer = endpoint('OAUTH_ISSUER')
    with HTTP.open(endpoint('OAUTH_METADATA_URL'), timeout=30) as response:
        metadata = json.load(response)
    if metadata.get('issuer') != issuer: raise ValueError('授权服务器 issuer 不匹配')
    if 'S256' not in metadata.get('code_challenge_methods_supported', []):
        raise ValueError('授权服务器没有声明 S256 支持')
    authorize = https_url(metadata['authorization_endpoint'], 'authorization_endpoint')
    token_url = https_url(metadata['token_endpoint'], 'token_endpoint')
    resource = endpoint('MCP_URL')
    client_id = os.environ['OAUTH_CLIENT_ID']
    verifier = secrets.token_urlsafe(48)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode()
    state = secrets.token_urlsafe(32)
    returned = {}

    class Callback(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlsplit(self.path)
            query = urllib.parse.parse_qs(parsed.query)
            if parsed.path != '/callback' or query.get('state') != [state]:
                self.send_response(400); self.end_headers(); return
            returned.update({key: values[0] for key, values in query.items()})
            self.send_response(200); self.end_headers()
            self.wfile.write('授权回调已接收，可以关闭此页。'.encode())

        def log_message(self, *args):
            pass  # 不把包含授权码的回调 URL 写进日志。

    params = {'response_type': 'code', 'client_id': client_id, 'redirect_uri': REDIRECT,
              'code_challenge': challenge, 'code_challenge_method': 'S256', 'state': state,
              'resource': resource, 'scope': os.environ['OAUTH_SCOPE']}
    with HTTPServer(('127.0.0.1', 8769), Callback) as http:
        http.timeout = 180
        print('在浏览器打开：', authorize + ('&' if '?' in authorize else '?') + urllib.parse.urlencode(params))
        http.handle_request()
    if 'error' in returned:
        raise RuntimeError('用户拒绝授权或授权服务器返回错误')
    if 'code' not in returned:
        raise RuntimeError('没有收到合法回调，请检查回调 URI 和 state')
    response_issuer = returned.get('iss')
    if (response_issuer is not None and response_issuer != issuer) or (
        metadata.get('authorization_response_iss_parameter_supported') is True and response_issuer is None):
        raise RuntimeError('授权响应 issuer 缺失或不匹配')
    form = urllib.parse.urlencode({'grant_type': 'authorization_code', 'code': returned['code'],
        'client_id': client_id, 'redirect_uri': REDIRECT, 'code_verifier': verifier,
        'resource': resource}).encode()
    request = urllib.request.Request(token_url, form, {'Content-Type': 'application/x-www-form-urlencoded'})
    try:
        with HTTP.open(request, timeout=30) as response:
            token = json.load(response)
        access = token['access_token']
        if token.get('token_type', '').lower() != 'bearer':
            raise ValueError('本例只支持 Bearer 访问令牌')
        message = {'jsonrpc': '2.0', 'id': 1, 'method': 'tools/list', 'params': {'_meta': {
            'io.modelcontextprotocol/protocolVersion': '2026-07-28',
            'io.modelcontextprotocol/clientCapabilities': {}}}}
        request = urllib.request.Request(resource, json.dumps(message).encode(), {
            'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream',
            'Authorization': 'Bearer ' + access, 'MCP-Protocol-Version': '2026-07-28',
            'Mcp-Method': 'tools/list'})
        with HTTP.open(request, timeout=30) as response:
            if 'text/event-stream' in response.headers.get('Content-Type', ''):
                data = []
                result = None
                for raw in response:
                    line = raw.decode().rstrip('\r\n')
                    if line.startswith('data:'): data.append(line[5:].lstrip(' '))
                    elif not line and data:
                        event = json.loads('\n'.join(data)); data = []
                        if event.get('id') == 1:
                            result = event; break
                if result is None: raise RuntimeError('SSE 在最终响应前结束')
            else:
                result = json.load(response)
        if 'error' in result: raise RuntimeError('MCP 拒绝请求，错误码：' + str(result['error']['code']))
        print(json.dumps(result['result'], ensure_ascii=False, indent=2))
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f'远程请求失败，HTTP {exc.code}；请核对授权和服务配置') from None

if __name__ == '__main__':
    main()
```

##### 6.3.2.2 TypeScript

```typescript
import { createHash, randomBytes } from 'node:crypto'
import { createServer } from 'node:http'

function httpsUrl(value: string, name: string): string {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username)
    throw new Error(`${name} 必须是已核实的 HTTPS 地址`)
  return value
}
function endpoint(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`缺少 ${name}`)
  return httpsUrl(value, name)
}
const issuer = endpoint('OAUTH_ISSUER')
const metadataResponse = await fetch(endpoint('OAUTH_METADATA_URL'), {
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
})
if (!metadataResponse.ok) throw new Error('无法读取授权服务器元数据')
const metadata = (await metadataResponse.json()) as {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  code_challenge_methods_supported?: string[]
  authorization_response_iss_parameter_supported?: boolean
}
if (metadata.issuer !== issuer || !metadata.code_challenge_methods_supported?.includes('S256')) {
  throw new Error('授权服务器 issuer 不匹配或没有声明 S256 支持')
}
const authorize = new URL(httpsUrl(metadata.authorization_endpoint, 'authorization_endpoint'))
const tokenUrl = httpsUrl(metadata.token_endpoint, 'token_endpoint')
const resource = endpoint('MCP_URL')
const clientId = process.env.OAUTH_CLIENT_ID
const scope = process.env.OAUTH_SCOPE
if (!clientId || !scope) throw new Error('缺少客户端 ID 或授权范围')
const redirect = 'http://127.0.0.1:8769/callback'
const verifier = randomBytes(48).toString('base64url')
const challenge = createHash('sha256').update(verifier).digest('base64url')
const state = randomBytes(32).toString('base64url')
const callback = await new Promise<URLSearchParams>((resolve, reject) => {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', redirect)
    if (url.pathname !== '/callback' || url.searchParams.get('state') !== state) {
      res.writeHead(400).end()
      return
    }
    res
      .writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
      .end('授权回调已接收，可以关闭此页。')
    clearTimeout(timer)
    server.close()
    resolve(url.searchParams)
  })
  const timer = setTimeout(() => {
    server.close()
    reject(new Error('授权回调等待超时'))
  }, 180_000)
  server.once('error', (error) => {
    clearTimeout(timer)
    reject(error)
  })
  server.listen(8769, '127.0.0.1', () => {
    for (const [key, value] of Object.entries({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirect,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
      resource,
      scope,
    })) {
      authorize.searchParams.set(key, value)
    }
    console.log('在浏览器打开：', authorize.href)
  })
})
if (callback.has('error')) throw new Error('用户拒绝授权或授权服务器返回错误')
const code = callback.get('code')
if (!code) throw new Error('没有收到授权码')
const responseIssuer = callback.get('iss')
if (
  (responseIssuer !== null && responseIssuer !== issuer) ||
  (metadata.authorization_response_iss_parameter_supported === true && responseIssuer === null)
) {
  throw new Error('授权响应 issuer 缺失或不匹配')
}
const tokenResponse = await fetch(tokenUrl, {
  method: 'POST',
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    redirect_uri: redirect,
    code_verifier: verifier,
    resource,
  }),
})
if (!tokenResponse.ok) throw new Error(`获取令牌失败，HTTP ${tokenResponse.status}`)
const token = (await tokenResponse.json()) as { access_token: string; token_type: string }
if (token.token_type.toLowerCase() !== 'bearer' || !token.access_token)
  throw new Error('访问令牌格式不正确')
const response = await fetch(resource, {
  method: 'POST',
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
  headers: {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    authorization: `Bearer ${token.access_token}`,
    'MCP-Protocol-Version': '2026-07-28',
    'Mcp-Method': 'tools/list',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {
      _meta: {
        'io.modelcontextprotocol/protocolVersion': '2026-07-28',
        'io.modelcontextprotocol/clientCapabilities': {},
      },
    },
  }),
})
if (!response.ok) throw new Error(`MCP 请求失败，HTTP ${response.status}`)
let result: { result?: unknown; error?: { code: number } } | undefined
if (response.headers.get('content-type')?.includes('text/event-stream')) {
  if (!response.body) throw new Error('响应流为空')
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  try {
    while (!result) {
      const chunk = await reader.read()
      if (chunk.done) throw new Error('SSE 在最终响应前结束')
      buffer += chunk.value
      let match: RegExpExecArray | null
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        const eventText = buffer.slice(0, match.index)
        buffer = buffer.slice(match.index + match[0].length)
        const data = eventText
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).replace(/^ /, ''))
          .join('\n')
        if (!data) continue
        const event = JSON.parse(data)
        if (event.id === 1) {
          result = event
          break
        }
      }
    }
  } finally {
    await reader.cancel()
  }
} else {
  result = await response.json()
}
if (!result || result.error) throw new Error(`MCP 拒绝请求，错误码：${result?.error?.code}`)
console.log(JSON.stringify(result.result, null, 2))
```

运行 Python 文件，或编译后运行 node dist/oauth_client.js，打开输出的授权 URL。完成同意后请求 tools/list，结果取决于自己的资源服务。生产客户端还应按本章规则处理刷新、撤销、安全存储与追加授权上限；没有真实授权服务时不能把这一步记作已完成。

#### 6.3.3 练习与答案

**练习**：公开客户端能否内嵌共享密钥？授权服务器变化后能否复用原服务器签发的客户端凭据？

**参考答案**：公开客户端无法保守共享密钥，应使用公开客户端配置与 PKCE。预登记凭据与颁发它的授权服务器绑定，不能交给另一台授权服务器。回调地址仍须按登记规则核对。

**操作检查**：检查 client_id、redirect_uri、state、code_verifier 和 resource 各自对应什么；先用预登记公开客户端完成本章程序。

**速查**：登记让授权服务器识别客户端与合法回调。PKCE 把授权码绑定到流程发起者，令牌刷新延长授权的可用性。

## 第7章 客户端特性

征询用于取得当前请求缺少的用户输入。普通表单与敏感信息的外部网址流程分别处理。

**先观察一个例子**：同一问题分别执行 accept、decline、cancel。只有接受且内容符合 requestedSchema 时，才按用户提供的值继续业务。

### 7.1 用户信息征询（Elicitation）

模型上下文协议（MCP）提供了一种标准化方式，使服务端能够在交互过程中通过客户端向用户请求额外信息。该流程允许客户端维持对用户交互和数据共享的控制，同时使服务端能够动态收集必要的信息。

Elicitation 支持两种模式：

- **Form mode（表单模式）**：服务端可以通过可选的 JSON Schema 来校验响应，从而向用户请求结构化数据。
- **网址模式（URL 模式）**：服务端可以将用户引导至外部 URL，以完成那些**不应**经过 MCP 客户端的敏感交互。

#### 7.1.1 用户交互模型

MCP 中的用户信息征询允许服务端通过将用户输入请求嵌套（nested）在其他 MCP 服务端特性中来实现交互式工作流。

实现可以自由地通过任何适合其需求的界面模式来暴露用户信息征询——协议本身并不强制规定任何特定的用户交互模型。

> **注意:** 出于信任与安全（信任与安全）以及安全性的考虑：
>
> - 服务端 **不得** 使用表单征询请求密码、API 键、访问令牌或支付凭证等敏感信息。
> - 对于涉及此类敏感信息的交互，服务端 **必须** 使用 网址模式。
>   此处的 "敏感信息" 指的是用于授予访问权限或授权交易的 secret 和凭证。一般的联系方式或资料信息（例如姓名、电子邮件地址、用户名）并不被一概禁止；是否通过 表单模式 请求此类数据由服务端自行决定，并取决于用户审阅和拒绝的能力。
>   MCP 客户端 **必须**：
> - 提供能够清晰表明是哪个服务端在请求信息的 UI
> - 尊重用户隐私，并提供明确的拒绝（decline）和取消（cancel）选项
> - 对于 表单模式，允许用户在发送前审阅并修改其响应
> - 对于 网址模式，清晰展示目标域/主机，并在导航到目标 URL 之前征得用户同意

#### 7.1.2 能力

支持用户信息征询的客户端 **必须** 在每个请求的 `_meta.io.modelcontextprotocol/clientCapabilities` 中声明 `elicitation` 能力：

```json
{
  "_meta": {
    "io.modelcontextprotocol/clientCapabilities": {
      "elicitation": {
        "form": {},
        "url": {}
      }
    }
  }
}
```

```json
{
  "_meta": {
    "io.modelcontextprotocol/clientCapabilities": {
      "elicitation": {}
    }
  }
}
```

声明 `elicitation` 能力的客户端 **必须** 至少支持一种模式（`form` 或 `url`）。

服务端 **不得** 向客户端发送其不支持的模式的用户信息征询请求。

#### 7.1.3 协议消息

信息征询以输入请求出现在多轮结果中。按表单或网址模式取得用户响应，再以新的 RPC 续接原操作。

##### 7.1.3.1 信息征询请求

在处理客户端请求的过程中，服务端 **可以** 通过发送一个 `InputRequiredResult` 来向用户请求信息，其中包含一个 `elicitation/create` 请求。

所有用户信息征询请求 **必须** 包含以下参数：

| Name      | 类型   | Options       | 说明                                          |
| --------- | ------ | ------------- | --------------------------------------------- |
| `mode`    | 字符串 | `form`, `url` | 征询模式；表单模式可省略，缺省值为 `"form"`。 |
| `message` | 字符串 |               | 解释为什么需要用户交互的可读说明。            |

`mode` 参数指定用户信息征询的类型：

- `"form"`：带内的结构化数据收集，可选地进行 Schema 校验。数据对客户端可见。
- `"url"`：通过 URL 导航进行带外交互。除了 URL 本身，其他数据**不会**对客户端可见。

##### 7.1.3.2 表单模式的征询请求

表单征询允许服务端通过 MCP 客户端直接收集结构化数据。

表单征询请求 **必须** 要么指定 `mode: "form"`，要么省略 `mode` 字段，并包含以下额外参数：

| Name              | 类型 | 说明                             |
| ----------------- | ---- | -------------------------------- |
| `requestedSchema` | 对象 | 描述预期响应结构的 JSON Schema。 |

###### 7.1.3.2.1 请求的数据结构

`requestedSchema` 参数允许服务端使用 JSON Schema 的一个受限子集来定义期望响应的结构。

为简化客户端的用户体验，表单征询的 Schema 仅限于仅包含基本类型属性的扁平对象。

该 Schema 限制为以下基本类型：

1. **String Schema**

   ```json
   {
     "type": "string",
     "title": "显示名称",
     "description": "字段说明",
     "minLength": 3,
     "maxLength": 50,
     "format": "email",
     "default": "user@example.com"
   }
   ```

   支持的格式：`email`、`uri`、`date`、`date-time`

2. **Number Schema**

   ```json
   {
     "type": "number",
     "title": "显示名称",
     "description": "字段说明",
     "minimum": 0,
     "maximum": 100,
     "default": 50
   }
   ```

3. **Boolean Schema**

   ```json
   {
     "type": "boolean",
     "title": "显示名称",
     "description": "字段说明",
     "default": false
   }
   ```

4. **Enum Schema**

   单选枚举（不含 title）：

   ```json
   {
     "type": "string",
     "title": "选择颜色",
     "description": "请选择一种颜色",
     "enum": ["红色", "绿色", "蓝色"],
     "default": "红色"
   }
   ```

   单选枚举（含 title）：

   ```json
   {
     "type": "string",
     "title": "选择颜色",
     "description": "请选择一种颜色",
     "oneOf": [
       {
         "const": "#FF0000",
         "title": "红色"
       },
       {
         "const": "#00FF00",
         "title": "绿色"
       },
       {
         "const": "#0000FF",
         "title": "蓝色"
       }
     ],
     "default": "#FF0000"
   }
   ```

   多选枚举（不含 title）：

   ```json
   {
     "type": "array",
     "title": "选择颜色",
     "description": "请选择多种颜色",
     "minItems": 1,
     "maxItems": 2,
     "items": {
       "type": "string",
       "enum": ["红色", "绿色", "蓝色"]
     },
     "default": ["红色", "绿色"]
   }
   ```

   多选枚举（含 title）：

   ```json
   {
     "type": "array",
     "title": "选择颜色",
     "description": "请选择多种颜色",
     "minItems": 1,
     "maxItems": 2,
     "items": {
       "anyOf": [
         {
           "const": "#FF0000",
           "title": "红色"
         },
         {
           "const": "#00FF00",
           "title": "绿色"
         },
         {
           "const": "#0000FF",
           "title": "蓝色"
         }
       ]
     },
     "default": ["#FF0000", "#00FF00"]
   }
   ```

客户端可以使用此 Schema 来：

1. 生成恰当的输入表单
2. 在发送前校验用户输入
3. 为用户提供更好的引导

所有基本类型都支持可选的默认值，以提供合理的起点。支持默认值的客户端 **应当** 用这些值预填表单字段。

请注意，复杂的嵌套结构、对象数组（枚举之外）以及其他高级 JSON Schema 特性都被有意地排除在外，以简化客户端的用户体验。

###### 7.1.3.2.2 示例：请求单个文本值

**服务端结果中 `InputRequiredResult.inputRequests` 的表单征询条目**

```json
{
  "method": "elicitation/create",
  "params": {
    "mode": "form",
    "message": "请提供你的代码托管用户名",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      },
      "required": ["name"]
    }
  }
}
```

**客户端结果（在重试请求的 `inputResponses` 中返回）：**

```json
{
  "action": "accept",
  "content": {
    "name": "octocat"
  }
}
```

###### 7.1.3.2.3 示例：请求结构化数据

**服务端结果中 `InputRequiredResult.inputRequests` 的征询条目**

```json
{
  "method": "elicitation/create",
  "params": {
    "mode": "form",
    "message": "请提供联系信息",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "你的姓名"
        },
        "email": {
          "type": "string",
          "format": "email",
          "description": "你的电子邮箱"
        },
        "age": {
          "type": "number",
          "minimum": 18,
          "description": "你的年龄"
        }
      },
      "required": ["name", "email"]
    }
  }
}
```

**客户端结果（在重试请求的 `inputResponses` 中返回）：**

```json
{
  "action": "accept",
  "content": {
    "name": "Monalisa Octocat",
    "email": "octocat@github.com",
    "age": 30
  }
}
```

##### 7.1.3.3 网址模式的征询请求

网址征询使服务端能够将用户引导至外部 URL，以完成那些不应经过 MCP 客户端的带外交互。这对于授权流程、支付处理以及其他敏感或安全的操作至关重要。

网址征询请求 **必须** 指定 `mode: "url"` 和 `message`，并包含以下额外参数：

| Name  | 类型   | 说明               |
| ----- | ------ | ------------------ |
| `url` | 字符串 | 用户应访问的网址。 |

`url` 参数 **必须** 包含一个有效的 URL。

> **说明:** **重要**：网址征询 **不是**用来为 MCP 客户端授权其对 MCP 服务端的访问的（这部分由 MCP 授权处理）。它的使用场景是：MCP 服务端需要代表用户获取敏感信息或第三方授权。MCP 客户端的持有者令牌保持不变。客户端的唯一职责是向用户提供关于服务端希望其打开的用户信息征询 URL 的上下文信息。

###### 7.1.3.3.1 示例：请求敏感信息

本示例展示了一个网址征询请求，它将用户引导至一个安全 URL，用户可以在该 URL 提供敏感信息（例如 API 键）。同样的请求也可以将用户引导进入 OAuth 授权流程或支付流程。唯一的区别在于 URL 和 message。

**服务端结果中 `InputRequiredResult.inputRequests` 的征询条目**

```json
{
  "method": "elicitation/create",
  "params": {
    "mode": "url",
    "url": "https://mcp.example.com/ui/set_api_key",
    "message": "请前往安全授权页面完成后续操作。"
  }
}
```

**客户端结果（在重试请求的 `inputResponses` 中返回）：**

```json
{
  "action": "accept"
}
```

带有 `action: "accept"` 的响应表明用户已同意该交互。这并不意味着交互已经完成。交互是带外发生的，客户端并不会被直接告知结果。当客户端重试原始请求时，服务端根据回传的 `requestState`（或其自身存储的状态）判断带外交互是否已完成，并据此选择返回最终结果或再次返回 `InputRequiredResult`。客户端 **应当** 提供手动控件，使用户能够重试或取消原始请求（或以其他方式恢复与客户端的交互）。

#### 7.1.4 消息流

沿步骤核对每条消息来自谁、关联哪个请求，以及何时产生最终结果；业务执行与传输结束分别判断。

##### 7.1.4.1 表单模式流程

**表单征询的请求与响应**

```mermaid
sequenceDiagram
    participant User as 用户
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 调用工具（tools/call，id=1）
    Note over Server: 服务器需要更多信息
    Server-->>Client: 需要补充输入的结果（InputRequiredResult）<br/>表单征询（elicitation/create，mode=form）
    Note over User,Client: 展示征询界面
    User-->>Client: 提供所需信息
    Note over Server,Client: 携带补充信息重试
    Client->>Server: 调用工具（tools/call，id=2）并附上用户响应
    Server-->>Client: 返回结果（id=2）
```

##### 7.1.4.2 网址模式流程

**网址征询的带外交互与续接**

```mermaid
sequenceDiagram
    participant UserAgent as 浏览器
    participant User as 用户
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 调用工具（tools/call，id=1）
    Note over Server: 服务器需要更多信息<br/>生成包含网址相关信息的请求状态（requestState）
    Server-->>Client: 需要补充输入的结果（InputRequiredResult）<br/>网址征询（elicitation/create，mode=url）及请求状态（requestState）
    Client->>User: 请用户确认是否打开网址
    User-->>Client: 同意打开
    Client->>UserAgent: 打开网址
    Client->>Server: 调用工具（tools/call，id=2）<br/>携带同意响应和请求状态（requestState）
    Note over Server: 服务器用请求状态（requestState）查找交互信息<br/>必要时等待带外交互完成
    Note over User,UserAgent: 用户在浏览器中交互
    UserAgent-->>Server: 带外交互完成
    Note over Server: 服务器用新增信息继续处理
    Server-->Client: 返回结果（id=2）
```

#### 7.1.5 响应动作

用户信息征询（Elicitation）响应采用三动作模型，以清晰区分不同的用户动作。这三种动作同时适用于 表单模式 和网址征询。

```json
{
  "action": "accept",
  "content": {
    "propertyName": "value",
    "anotherProperty": 42
  }
}
```

三种响应动作分别为：

1. **Accept**（`action: "accept"`）：用户明确批准并提交了数据
   - 对于 表单模式：`content` 字段包含与所请求 Schema 一致的已提交数据
   - 对于 网址模式：省略 `content` 字段
   - 示例：用户点击了 "Submit"、"OK"、"Confirm" 等

2. **Decline**（`action: "decline"`）：用户明确拒绝了该请求
   - 通常省略 `content` 字段
   - 示例：用户点击了 "Reject"、"Decline"、"No" 等

3. **Cancel**（`action: "cancel"`）：用户在未做出明确选择的情况下关闭了对话框
   - 通常省略 `content` 字段
   - 示例：用户关闭了对话框、点击了对话框外部、按下了 Escape 键、浏览器加载失败等

服务端应分别对各种状态进行恰当的处理：

- **Accept**：处理已提交的数据
- **Decline**：处理显式的拒绝（例如，提供替代方案）
- **Cancel**：处理用户的关闭（例如，稍后再次提示）

#### 7.1.6 实现考量

下面把用户交互落实到状态、身份与敏感信息处理；这些条件影响是否能安全完成同一操作。

##### 7.1.6.1 交互状态

用户信息征询（Elicitation）不要求服务端通过多轮请求机制来维护与用户相关的状态。

但是，若存储状态，实现用户信息征询的服务端 **必须** 按照安全实践文档中的指南，将该状态安全地与各个用户相关联。具体而言：

- 状态存储 **必须** 防止未经授权的访问
- 对于远程 MCP 服务端，用户身份 **必须** 在可能的情况下通过 MCP 授权获取的凭证推导（例如 `sub` 声明）

> **说明:** 本节中的示例为非规范性，用于展示用户信息征询的潜在用途。实现者应根据其特定需求调整这些模式，同时遵循安全最佳实践。

##### 7.1.6.2 使用网址模式处理敏感数据

对于需要与外部 API 交互（涉及凭证、支付信息等敏感信息）的服务端，网址征询提供了一种安全机制，使用户能够提供这些信息而无需将其暴露给 MCP 客户端。

在该模式中：

1. 服务端将用户引导至一个安全网页（通过 HTTPS 提供）
2. 该页面在用户信任的域上展示带有品牌标识的表单 UI
3. 用户直接在该安全表单中输入敏感凭证
4. 服务端将凭证安全存储，与用户身份绑定
5. 后续的 MCP 请求使用这些已存储的凭证进行 API 访问

这种方式确保敏感凭证永远不会经过 LLM 上下文、MCP 客户端或任何中间 MCP 服务端，从而降低通过客户端日志记录或其他攻击途径暴露的风险。

##### 7.1.6.3 使用网址模式完成外部授权

网址征询支持这样一种模式：MCP 服务端作为第三方资源服务端的 OAuth 客户端。通过网址征询启用的与外部 API 的授权，独立于 MCP 授权。MCP 服务端 **不得** 依赖网址征询来为自身进行用户授权。

###### 7.1.6.3.1 区分两种授权目的

- **MCP 授权**：MCP 客户端与 MCP 服务端之间必需的 OAuth 流程（详见授权 specification）
- **External (third-party) 授权**：MCP 服务端与第三方资源服务端之间可选的授权，通过网址征询发起

在外部授权中，服务端同时扮演以下两个角色：

- 对 MCP 客户端而言，作为 OAuth 资源服务端
- 对第三方资源服务端而言，作为 OAuth 客户端

示例场景：

- MCP 客户端连接到 MCP 服务端
- MCP 服务端与多个不同的第三方服务集成
- 当 MCP 客户端调用某个需要访问第三方服务的工具时，MCP 服务端需要该服务的凭证

关键的安全要求包括：

1. **第三方凭证不得经过 MCP 客户端**：客户端必须看不到第三方凭证，以保护安全边界
2. **MCP 服务端不得使用客户端的凭证访问第三方服务**：那将是令牌透传，是被禁止的
3. **User 必须直接为 MCP 服务端授权**：交互发生在 MCP 协议之外，不涉及 MCP 客户端
4. **MCP 服务端对令牌负责**：MCP 服务端负责存储和管理通过网址征询获得的第三方令牌（换句话说，MCP 服务端必须是有状态的）

通过网址征询获得的凭证不同于 MCP 客户端使用的 MCP 服务端凭证。MCP 服务端 **不得** 将通过网址征询获得的凭证传递给 MCP 客户端。

> **说明:** 有关更多背景信息，请参阅安全实践中的令牌透传部分，以了解为何 MCP 服务端不能作为 令牌透传代理。

###### 7.1.6.3.2 实现方式

在通过网址征询实现外部授权时：

1. MCP 服务端生成一个授权 URL，作为第三方服务的 OAuth 客户端
2. MCP 服务端存储将用户信息征询请求与用户身份关联（绑定）起来的内部状态
3. MCP 服务端向客户端发送一个网址征询请求，其中包含可以启动授权流程的 URL，以及一个可选的 `requestState`（用于在需要时编码关于用户信息征询请求和用户的信息）
4. 用户直接与第三方授权服务端完成 OAuth 流程
5. 第三方授权服务端重定向回 MCP 服务端
6. MCP 服务端安全地存储第三方令牌，与用户身份绑定
7. 未来的 MCP 请求可以利用这些已存储的令牌访问第三方资源服务端

以下是该模式可能实现方式的非规范性示例：

**通过网址征询完成第三方授权**

```mermaid
sequenceDiagram
    participant User as 用户
    participant UserAgent as 浏览器
    participant ThirdAuth as 第三方授权服务器
    participant ThirdResource as 第三方资源服务器
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 调用工具（tools/call）
    Note over Server: 服务器需要用户授权其使用第三方服务
    Note over Server: 保存征询状态并绑定用户
    Note over Server: 生成与原请求和用户绑定的请求状态（requestState）
    Server->>Client: 需要补充输入的结果（InputRequiredResult）<br/>携带网址模式（mode=url）、网址（url）与请求状态（requestState）
    Client->>User: 询问用户是否打开网址
    User->>Client: 用户同意
    Client->>UserAgent: 打开网址
    Client->>Server: 返回同意响应（action=accept）
    UserAgent->>Server: 访问连接页面
    Note over Server: 检查用户已通过 MCP 身份验证<br/>确认发起征询的用户与浏览器会话用户一致
    Server->>UserAgent: 重定向到第三方授权端点
    UserAgent->>ThirdAuth: 访问授权页面
    Note over ThirdAuth,User: 用户参加 OAuth 授权<br/>同意 MCP 服务器按请求范围访问第三方
    ThirdAuth->>UserAgent: 重定向到 MCP 服务器的回调地址（redirect_uri）
    UserAgent->>Server: 请求回调地址（redirect_uri）
    Note over Server: 确认回调地址（redirect_uri）属于 MCP 服务器
    Server->>ThirdAuth: 使用授权码换取 OAuth 令牌
    ThirdAuth->>Server: 颁发令牌
    Note over Server: 将令牌绑定到 MCP 用户身份
    Client->>Server: 重发工具调用（tools/call）<br/>附征询结果（ElicitResult）与请求状态（requestState）
    Note over Server: 取出绑定至该用户的令牌
    Server->>ThirdResource: 调用第三方 API
```

该模式在保持清晰安全边界的同时，支持与需要用户授权的第三方服务进行丰富集成。

#### 7.1.7 错误处理

服务端 **不应** 假设用户信息征询请求总会成功，并且 **必须** 处理用户拒绝或取消用户信息征询、以及客户端处理请求失败的情况。

#### 7.1.8 安全考量

1. 服务端 **必须** 将用户信息征询请求与客户端及用户身份进行绑定
1. 客户端 **必须** 提供清晰的指示，表明是哪个服务端在请求信息
1. 客户端 **应当** 实现用户审批控制
1. 客户端 **应当** 允许用户随时拒绝用户信息征询请求
1. 客户端 **应当** 以清晰展示所请求信息及其原因的方式呈现用户信息征询请求

##### 7.1.8.1 安全地处理网址

请求用户信息征询的 MCP 服务端：

1. **不得** 在发送给客户端的 URL 中包含关于最终用户的敏感信息，包括凭证、个人身份信息等。
2. **不得** 提供一个已经预先认证（pre-authenticated）用于访问受保护资源的 URL，因为恶意客户端可能利用该 URL 冒充用户。
3. **不应** 在表单征询请求的任何字段中包含意图可点击的 URL。
4. **应当** 在非开发环境中使用 HTTPS URL。

这些服务端要求确保客户端实现具有何时向用户呈现 URL 的明确规则，以便能够一致地应用下述客户端规则。

实现网址征询的客户端 **必须** 谨慎处理 URL，以防止用户在不知情的情况下点击恶意链接。

在处理网址征询请求时，MCP 客户端应：

1. **不得** 自动预取（pre-fetch）该 URL 或其任何元数据。
2. **不得** 在未经用户明确同意的情况下打开该 URL。
3. **必须** 在取得同意之前向用户展示完整的 URL 以供检查。
4. **必须** 以安全的方式打开服务端提供的 URL，使客户端或 LLM 无法检查内容或用户输入。
   例如，在 iOS 上，SFSafariViewController 是合适的，而 WkWebView 则不合适。
5. **应当** 高亮 URL 的域名以缓解子域名欺骗。
6. **应当** 对包含 Punycode 等模糊/可疑 URI 进行警告。
7. **不应** 在用户信息征询请求的任何字段中将 URL 渲染为可点击的，但 URL 用户信息征询请求中的 `url` 字段例外（需遵守上述限制）。

##### 7.1.8.2 识别用户

服务端 **不得** 在未经服务端校验的情况下依赖客户端提供的用户身份标识，因为这类信息可以被伪造。
服务端 **应当** 遵循安全实践。

非规范性示例：

- 错误做法：将 "我是 joe@example.com" 之类的用户输入视为权威
- 正确做法：依赖授权来标识用户

##### 7.1.8.3 表单模式安全

1. 服务端 **不得** 通过 表单模式 请求敏感信息（密码、API 键等）
2. 客户端 **应当** 针对所提供的 Schema 校验所有响应
3. 服务端 **应当** 校验收到的数据是否与所请求的 Schema 一致

###### 7.1.8.3.1 防范钓鱼

网址征询会返回一个 URL，攻击者可以利用该 URL 将其发送给受害者。MCP 服务端 **必须** 在接受信息之前验证打开该 URL 的用户身份。

通常，身份验证是通过利用 MCP 授权服务端来标识用户（例如通过浏览器中的会话 cookie 或等效机制）来完成的。

例如，网址征询可用于执行服务端作为另一个资源服务端的 OAuth 客户端的 OAuth 流程。如果不采取适当的缓解措施，可能会发生以下 phishing 攻击：

1. 连接到良性服务端的恶意用户（Alice）触发了一个用户信息征询请求
2. 良性服务端生成一个授权 URL，作为第三方授权服务端的 OAuth 客户端
3. Alice 的客户端显示该 URL 并请求同意
4. Alice 没有点击该链接，而是诱使同一良性服务端的受害用户（Bob）点击它
5. Bob 打开该链接并完成授权，以为自己正在为自己与良性服务端的连接授权
6. 良性服务端收到来自第三方授权服务端的回调/重定向，并将其视为 Alice 的请求
7. 第三方服务端的令牌被绑定到 Alice 的会话和身份，而非 Bob 的，从而导致账户接管

为防止该攻击，服务端 **必须** 确保发起用户信息征询请求的用户（通过 MCP 客户端访问服务端的最终用户）与完成授权流程的用户是同一人。

有许多方法可以实现这一点，最好的方式取决于具体实现。

作为一个常见的非规范性示例，考虑这样一种情况：MCP 服务端可通过 Web 访问，并希望执行第三方授权码流程。为防止 phishing 攻击，服务端会针对 `https://mcp.example.com/connect?...` 创建一个网址征询，而不是直接针对第三方授权端点。这个 "connect URL" 必须确保打开页面的用户与生成用户信息征询的用户是同一人。例如，它可以检查用户是否具有有效的会话 cookie，并检查该会话 cookie 对应的用户是否就是使用 MCP 客户端生成网址征询的用户。这可以通过将 MCP 服务端的授权服务端发出的权威 subject（`sub` 声明）与会话 cookie 中的 subject 进行比较来实现。一旦该页面确认了同一用户，就可以将用户引导至第三方授权服务端的 `https://example.com/authorize?...`，在那里完成正常的 OAuth 流程。

在其他情况下，服务端可能无法通过 Web 访问，并且无法使用会话 cookie 来识别用户。在这种情况下，服务端必须使用另一种机制来识别：打开用户信息征询 URL 的用户与生成该用户信息征询的用户是同一人。

在所有实现中，服务端 **必须** 确保用于确定用户身份的机制能够抵御攻击者修改用户信息征询 URL 的攻击。

#### 7.1.9 练习、答案与使用边界

**练习**：服务端能否直接替用户确认？主应用能否让模型猜测用户将会接受？

**参考答案**：征询不是服务端自行弹窗；应用要把问题交给真实用户，不能用未经批准的模型猜测自动接受。

**操作检查**：同一问题分别执行 accept、decline、cancel。只有接受且内容符合 requestedSchema 时，才按用户提供的值继续业务。

**速查**：征询用于取得当前请求缺少的用户输入。普通表单与敏感信息的外部网址流程分别处理。

## 第8章 服务器特性

把“会做什么”与“允许谁做”分开。服务端发现给出支持的版本和功能。客户端在每个请求声明自己能处理的交互。

以下消息片段有时省略 `params._meta`。实际请求必须带 `io.modelcontextprotocol/protocolVersion` 与 `io.modelcontextprotocol/clientCapabilities`，本次没有要声明的客户端能力时用 `{}`。除非明确配置不发送，客户端也应附带 `io.modelcontextprotocol/clientInfo`。字段和错误处理见[元数据字段](#431-元数据字段-_meta)。

**先观察一个例子**：先调用 server/discover，记录 supportedVersions 与 capabilities；再调用工具。把客户端能力置空时，普通只读工具仍可能成功，需要征询的工具则必须检查能力。

### 8.1 发现服务

`server/discover` 允许客户端在发送任何其他请求之前查询服务端所支持的协议版本、能力以及身份信息。服务端 **必须** 实现该方法。

#### 8.1.1 请求

该请求除标准的 `_meta` 外不携带任何正文参数：

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "method": "server/discover",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

#### 8.1.2 响应

服务端回复其支持的协议版本、能力以及身份信息。该操作支持缓存。

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": {
      "tools": {},
      "resources": {}
    },
    "_meta": {
      "io.modelcontextprotocol/serverInfo": {
        "name": "ExampleServer",
        "version": "1.0.0"
      }
    },
    "instructions": "This server provides weather and resource utilities.",
    "ttlMs": 3600000,
    "cacheScope": "public"
  }
}
```

#### 8.1.3 何时调用

对客户端而言，调用 `server/discover` 是可选的——客户端可以直接发起任何 RPC，并在服务端不支持所请求版本时处理 `UnsupportedProtocolVersionError`。`server/discover` 也适合在准备使用某项功能时查询服务器的支持情况：

- **展示服务端信息。** 虽然客户端不必为了使用服务端而调用 `server/discover`，但它是一种便捷方式，可在单次请求中获取服务端的身份、能力与支持的版本。例如，客户端可以通过单次 `server/discover` 响应直接展示服务端所支持的能力，而无需分别通过 `tools/list`、`prompts/list`、`resources/list` 等请求去探测。
- **主动核对版本与能力。** 对支持多种协议修订的客户端，可先请求服务发现，然后按返回的 `supportedVersions` 选择双方都支持的版本。发起业务请求时仍须携带该次请求的版本、客户端能力与所需授权。

完整的版本选择流程请参见 [协议版本协商](#411-协议版本协商)。关于未知方法返回的 HTTP 特定状态码，参见 [Streamable HTTP 传输](#52-streamable-http-传输)。

#### 8.1.4 数据类型

发现结果给出支持的协议版本、服务端能力和缓存属性，帮助客户端决定下一次请求怎样发送。

##### 8.1.4.1 服务发现结果 DiscoverResult

发现结果包含：

- `supportedVersions`：服务端支持的协议版本。客户端应从中选择一个用于后续请求。
- `capabilities`：服务端支持的能力（工具、资源、提示模板等）
- `_meta['io.modelcontextprotocol/serverInfo']`：服务端软件的名称与版本。服务端 **应当** 包含该字段。
- `instructions`：可选的、面向 LLM 的自然语言指引，说明如何有效使用该服务端

> **说明:**
> `serverInfo` 由服务端自行上报，协议不会对其加以验证。它用于展示、日志记录和调试。客户端 **不应** 使用它来改变自身行为，也 **不应** 依赖它做出安全决策。

### 8.2 提示模板（Prompts）

提示模板把参数展开成带角色的消息，不等于执行工具或得到模型答案。

**先观察一个例子**：获取 explain_note(note_id=stdio)，检查 user 角色及正文；未知笔记 ID 应失败。

提示模板（Prompts）由服务端定义。客户端列出可用模板，再按模板名和参数获取结构化消息与指令。

#### 8.2.1 用户交互模型

提示模板由**用户选择使用**。服务端定义模板内容，客户端提供选择入口，由用户决定何时使用。

通常，提示模板会通过用户界面中由用户发起的命令触发，这使用户能够自然地发现并调用可用的提示模板。

例如，作为 slash commands（斜杠命令）：

![主应用将提示模板显示为命令的界面示意](../../../images/ai/mcp/specification/slash-command.png)

图示来源：MCP 官方文档。图示说明：这是主应用呈现方式的示例，按钮与布局依产品而异；协议规定消息和内容，不强制所有产品使用同一界面。

不过，实现者可以自由地通过任何适合其需求的界面模式来暴露提示模板——协议本身并不强制要求任何特定的用户交互模型。

#### 8.2.2 能力

支持提示模板的服务端 **必须** 在其 `DiscoverResult` 中声明 `prompts` 能力：

```json
{
  "capabilities": {
    "prompts": {
      "listChanged": true
    }
  }
}
```

`listChanged` 指明当可用提示模板的列表发生变化时，服务端是否会发出通知。

声明了 `prompts` 能力的服务端 **必须** 响应 `prompts/list` 请求，返回当前对请求客户端可用的提示模板集合。该集合 **可以** 为空，也 **可以** 随时间变化（参见列表变更通知），但 **不得** 因连接不同或连接上其他请求的副作用而异。该集合 **可以** 因请求上呈现的授权而异——例如，仅返回调用者被授予权限范围所允许的提示模板——因为凭据属于逐请求的输入，而非连接状态。

#### 8.2.3 协议消息

先列出模板，再用模板名和字符串参数取得消息；展开结果不自动执行模型。

##### 8.2.3.1 列出提示

为了获取可用的提示模板，客户端发送 `prompts/list` 请求。该操作支持分页 与缓存。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list",
  "params": {
    "cursor": "optional-cursor-value",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "prompts": [
      {
        "name": "code_review",
        "title": "请求代码复核",
        "description": "请模型分析代码质量并给出改进建议",
        "arguments": [
          {
            "name": "code",
            "description": "待复核的代码",
            "required": true
          }
        ],
        "icons": [
          {
            "src": "https://example.com/review-icon.svg",
            "mimeType": "image/svg+xml",
            "sizes": ["any"]
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor",
    "ttlMs": 600000,
    "cacheScope": "public"
  }
}
```

##### 8.2.3.2 获取提示

为获取特定提示模板，客户端发送 `prompts/get` 请求。参数可通过参数补全接口（补全 API） 进行自动补全。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "code": "def hello():\n    print('world')"
    },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "resultType": "complete",
    "description": "代码复核提示模板",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "请检查这份笔记中的输入、输出和边界。"
        }
      }
    ]
  }
}
```

服务端 **可以** 还会以 `InputRequiredResult` 响应 `prompts/get`，以表明在提示模板可被解析前还需要额外输入。这遵循多轮请求（多轮请求） 机制。在重试该请求时，客户端在请求参数中包含 `inputResponses`，若服务端提供则还包含 `requestState`。

##### 8.2.3.3 列表变更通知

当可用提示模板的列表发生变化时，声明了 `listChanged` 能力的服务端 **应当** 向那些已通过 `promptsListChanged: true` 打开 `subscriptions/listen` 流的客户端发送通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/prompts/list_changed"
}
```

#### 8.2.4 消息流

沿步骤核对每条消息来自谁、关联哪个请求，以及何时产生最终结果；业务执行与传输结束分别判断。

**提示模板的发现、获取与刷新**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Note over Client,Server: 发现模板
    Client->>Server: 列出提示模板（prompts/list）
    Server-->>Client: 返回模板目录
    Note over Client,Server: 使用模板
    Client->>Server: 获取提示模板（prompts/get）
    Server-->>Client: 返回模板展开后的内容
    opt 服务端声明目录变更能力（listChanged）
        Client->>Server: 监听订阅（subscriptions/listen）<br/>提示目录变更（promptsListChanged=true）
        Server-->>Client: 订阅确认（notifications/subscriptions/acknowledged）
        Note over Client,Server: 目录发生变更
        Server-->>Client: 提示模板目录变更通知（notifications/prompts/list_changed）
        Client->>Server: 重新列出提示模板（prompts/list）
        Server-->>Client: 返回更新后的目录
    end
```

#### 8.2.5 数据类型

模板描述与参数用于选择和填写，展开后的 PromptMessage 则为主应用提供带角色的内容。

##### 8.2.5.1 提示模板对象 Prompt

提示模板定义包含：

- `name`：提示模板的唯一标识符
- `title`：可选的、用于显示目的的提示模板人类可读名称
- `description`：可选的人类可读描述
- `icons`：可选的、用于在用户界面中显示的图标数组
- `arguments`：可选的、用于定制提示模板的参数列表

##### 8.2.5.2 提示消息对象 PromptMessage

提示模板中的消息可包含：

- `role`：`"user"` 或 `"assistant"`，用于指明说话方
- `content`：以下内容 type 之一：

> **说明:** 提示模板消息中的所有内容 type 都支持可选的注解（注解），用于提供关于受众、优先级与修改时间的元数据（元数据）。

###### 8.2.5.2.1 文本内容

Text 内容表示纯文本消息：

```json
{
  "type": "text",
  "text": "消息的文本内容"
}
```

这是用于自然语言交互的最常见内容 type。

###### 8.2.5.2.2 图像内容

Image 内容允许在消息中包含视觉信息：

```json
{
  "type": "image",
  "data": "base64-encoded-image-data",
  "mimeType": "image/png"
}
```

image data **必须** 经过 base64 编码，并包含有效的媒体类型。这使得在视觉上下文很重要时能够进行多模态交互。

###### 8.2.5.2.3 音频内容

Audio 内容允许在消息中包含音频信息：

```json
{
  "type": "audio",
  "data": "base64-encoded-audio-data",
  "mimeType": "audio/wav"
}
```

audio data 必须经过 base64 编码，并包含有效的媒体类型。这使得在音频上下文很重要时能够进行多模态交互。

###### 8.2.5.2.4 资源链接

提示模板消息 **可以** 包含指向资源 的链接，以在不直接嵌入资源内容的前提下提供额外上下文或数据。在这种情况下，提示模板消息会返回一个可由客户端获取的 URI：

```json
{
  "type": "resource_link",
  "uri": "file:///project/docs/guide.md",
  "name": "说明文档",
  "description": "应用入口说明",
  "mimeType": "text/plain"
}
```

资源 link 与常规资源一样，支持相同的资源注解（资源注解），以帮助客户端理解如何使用它们。

###### 8.2.5.2.5 嵌入资源

Embedded 资源允许在消息中直接引用服务端端的资源：

```json
{
  "type": "resource",
  "resource": {
    "uri": "resource://example",
    "mimeType": "text/plain",
    "text": "资源正文"
  }
}
```

资源可包含 text 或 binary（blob）数据，且 **必须** 包含：

- 一个有效的资源 URI
- 适当的媒体类型
- text 内容或经 base64 编码的 blob data

Embedded 资源使提示模板能够在会话流中无缝整合服务端端管理的内容，如文档、代码示例或其他参考资料。

#### 8.2.6 错误处理

服务端 **应当** 为常见失败场景返回标准 JSON-RPC 错误：

- 无效的提示模板名称：`-32602`（Invalid params）
- 缺少必需的参数：`-32602`（Invalid params）
- 内部错误：`-32603`（Internal 错误）

#### 8.2.7 实现考量

下面把用户交互落实到状态、身份与敏感信息处理；这些条件影响是否能安全完成同一操作。

1. 服务端 **应当** 在处理前对提示模板参数进行验证
2. 客户端 **应当** 对大型提示模板列表处理分页
3. 双方 **应当** 遵守能力协商（能力协商）

#### 8.2.8 安全

实现 **必须** 仔细验证所有提示模板的输入与输出，以防止注入攻击或对资源的未授权访问。

#### 8.2.9 比较模板与工具的输出

用第1章两种客户端获取 explain_note，再查看返回的 messages。模板正文要求解释固定笔记，角色为 user；它不会自动调用模型。把 note_id 改成 missing 应失败，而不是生成含有不存在笔记的模板。

#### 8.2.10 练习、答案与使用边界

**练习**：拿到提示消息是否等于已经调用模型？主应用能否无条件信任服务端模板？

**参考答案**：用户选择和输入要明确；来自服务端的模板仍需要主应用按信任边界处理。

**操作检查**：获取 explain_note(note_id=stdio)，检查 user 角色及正文；未知笔记 ID 应失败。

**速查**：提示模板把参数展开成带角色的消息，不等于执行工具或得到模型答案。

### 8.3 资源（Resources）

资源以 URI 标识内容。URI 是标识符，能读取某个 URI 仍由服务端和当前主体决定。

**先观察一个例子**：先列出 notes://catalog 和资源模板，再读 notes://item/stdio；未知 ID 与 **proto** 都不能越过固定允许集合。

资源（Resources）让服务端共享可加入模型上下文的数据，例如文件、数据库结构或应用记录。每个资源由一个 URI 唯一标识。

#### 8.3.1 用户交互模型

MCP 的资源采用**应用驱动**的设计。主应用根据当前任务决定何时读取资源、怎样将其加入上下文。

例如，应用可以：

- 通过 UI 元素（如树形或列表视图）显式地暴露资源供选择
- 允许用户搜索并筛选可用的资源
- 依据启发式规则或 AI 模型的选择实现自动上下文纳入

![主应用选择资源内容的界面示意](../../../images/ai/mcp/specification/resource-picker.png)

图示来源：MCP 官方文档。图示说明：这是主应用呈现方式的示例，按钮与布局依产品而异；协议规定消息和内容，不强制所有产品使用同一界面。

不过，实现者可以自由地通过任何适合其需求的界面模式来暴露资源——协议本身并不强制要求任何特定的用户交互模型。

#### 8.3.2 能力

支持资源的服务端 **必须** 声明 `resources` 能力：

```json
{
  "capabilities": {
    "resources": {
      "listChanged": true,
      "subscribe": true
    }
  }
}
```

该能力支持两个可选特性：

- `listChanged`：当可用资源的列表发生变化时，服务端是否会发出通知。
- `subscribe`：服务端是否支持针对特定资源的更新通知（通过 `resourceSubscriptions` 过滤项在 `subscriptions/listen` 中订阅）。

服务端可独立地声明任一特性，也可同时声明，或两者都不声明。

既支持 `listChanged` 也支持 `subscribe` 的服务端可以省略它们：

```json
{
  "capabilities": {
    "resources": {}
  }
}
```

声明了 `resources` 能力的服务端 **必须** 响应 `resources/list` 请求，返回当前对请求客户端可用的资源集合。该集合 **可以** 为空，也 **可以** 随时间变化（参见列表变更通知），但 **不得** 因连接不同或连接上其他请求的副作用而异。该集合 **可以** 因请求上呈现的授权而异——例如，仅返回调用者被授予权限范围所允许的资源——因为凭据属于逐请求的输入，而非连接状态。

#### 8.3.3 协议消息

先发现资源或模板，再按 URI 读取；目录变化和正文更新通过不同通知表达。

##### 8.3.3.1 列出资源

为了发现可用的资源，客户端发送 `resources/list` 请求。该操作支持分页 与缓存。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list",
  "params": {
    "cursor": "optional-cursor-value",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "resources": [
      {
        "uri": "file:///project/docs/guide.md",
        "name": "说明文档",
        "title": "应用入口说明文件",
        "description": "应用入口说明",
        "mimeType": "text/plain",
        "icons": [
          {
            "src": "https://example.com/rust-file-icon.png",
            "mimeType": "image/png",
            "sizes": ["48x48"]
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor",
    "ttlMs": 300000,
    "cacheScope": "public"
  }
}
```

##### 8.3.3.2 读取资源

为获取资源内容，客户端发送 `resources/read` 请求。该操作支持缓存。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "file:///project/docs/guide.md",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "resultType": "complete",
    "contents": [
      {
        "uri": "file:///project/docs/guide.md",
        "mimeType": "text/plain",
        "text": "应用入口负责输出问候语。"
      }
    ],
    "ttlMs": 60000,
    "cacheScope": "private"
  }
}
```

服务端 **可以** 在单次 `resources/read` 请求的响应中返回多个资源内容。例如，当读取一个目录资源时，服务端可以同时返回若干文件的内容。

服务端 **可以** 还会以 `InputRequiredResult` 响应 `resources/read`，以表明在资源可被读取前还需要额外输入。这遵循多轮请求（多轮请求） 机制。在重试该请求时，客户端在请求参数中包含 `inputResponses`，若服务端提供则还包含 `requestState`。

另外，如果 `uri` 的方案为 `https://`，客户端也可以直接从 Web 拉取该资源。更多信息请参见常见 URI 方案（常见 URI 方案） 一节。

##### 8.3.3.3 资源模板

资源模板允许服务端使用 URI 模板（URI 模板） 暴露参数化的资源。参数可通过参数补全接口（补全 API） 进行自动补全。该操作支持分页 与缓存。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/templates/list",
  "params": {
    "cursor": "optional-cursor-value",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resultType": "complete",
    "resourceTemplates": [
      {
        "uriTemplate": "file:///{path}",
        "name": "Project Files",
        "title": "📁 项目文件",
        "description": "读取允许访问的项目文件",
        "mimeType": "application/octet-stream",
        "icons": [
          {
            "src": "https://example.com/folder-icon.png",
            "mimeType": "image/png",
            "sizes": ["48x48"]
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor",
    "ttlMs": 300000,
    "cacheScope": "public"
  }
}
```

##### 8.3.3.4 列表变更通知

当可用资源的列表发生变化时，声明了 `listChanged` 能力的服务端 **应当** 发送通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed"
}
```

##### 8.3.3.5 订阅

客户端通过发送 `subscriptions/listen` 请求（其中资源 URI 列入 `notifications.resourceSubscriptions`）来订阅特定资源的变更通知。服务端在被监视的资源发生变化时，会在该流上发出 `notifications/resources/updated`：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/subscriptionId": 4
    },
    "uri": "file:///project/docs/guide.md"
  }
}
```

完整的协议机制（订阅确认、`subscriptionId` 关联以及取消）见订阅与通知。

#### 8.3.4 消息流

沿步骤核对每条消息来自谁、关联哪个请求，以及何时产生最终结果；业务执行与传输结束分别判断。

**资源发现、读取和更新**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Note over Client,Server: 发现资源
    Client->>Server: 列出资源（resources/list）
    Server-->>Client: 返回资源目录
    Note over Client,Server: 发现资源模板
    Client->>Server: 列出资源模板（resources/templates/list）
    Server-->>Client: 返回资源模板目录
    Note over Client,Server: 读取指定资源
    Client->>Server: 读取资源（resources/read）
    Server-->>Client: 返回资源正文
    Note over Client,Server: 订阅资源变更
    Client->>Server: 监听订阅（subscriptions/listen）<br/>资源订阅过滤器（resourceSubscriptions）
    Server-->>Client: 订阅确认（notifications/subscriptions/acknowledged）
    Note over Client,Server: 指定资源已更新
    Server-->>Client: 资源更新通知（notifications/resources/updated）
    Client->>Server: 重新读取资源（resources/read）
    Server-->>Client: 返回更新后的正文
```

#### 8.3.5 数据类型

资源描述帮助选择 URI，读取结果提供该 URI 的正文；文本、二进制和注解分别承担不同职责。

##### 8.3.5.1 资源描述对象 Resource

资源定义包含：

- `uri`：资源的唯一标识符
- `name`：资源的名称
- `title`：可选的、用于显示目的的资源人类可读名称
- `description`：可选的描述
- `icons`：可选的、用于在用户界面中显示的图标数组
- `mimeType`：可选的媒体类型
- `size`：可选的字节数大小

##### 8.3.5.2 资源内容

资源可包含 text 或 binary 数据：

###### 8.3.5.2.1 文本内容

```json
{
  "uri": "file:///example.txt",
  "mimeType": "text/plain",
  "text": "资源正文"
}
```

###### 8.3.5.2.2 二进制内容

```json
{
  "uri": "file:///example.png",
  "mimeType": "image/png",
  "blob": "base64-encoded-data"
}
```

##### 8.3.5.3 注解

资源、资源模板以及内容 block 支持可选的注解，向客户端提示应如何使用或展示该资源：

- **`audience`**：一个数组，指示该资源的目标受众。有效值为 `"user"` 与 `"assistant"`。例如，`["user", "assistant"]` 表示该内容对双方都适用。
- **`priority`**：0.0 到 1.0 之间的数字，指示该资源的重要程度。值为 1 表示"最重要"（实际上是必需的），而为 0 则表示"最不重要"（完全是可选的）。
- **`lastModified`**：ISO 8601 格式的时间戳，指示该资源最后被修改的时间（例如 `"2025-01-12T15:00:58Z"`）。

带注解的资源示例：

```json
{
  "uri": "file:///project/README.md",
  "name": "README.md",
  "title": "项目文档",
  "mimeType": "text/markdown",
  "annotations": {
    "audience": ["user"],
    "priority": 0.8,
    "lastModified": "2025-01-12T15:00:58Z"
  }
}
```

客户端可利用这些注解来：

- 按目标受众筛选资源
- 决定将哪些资源优先纳入上下文
- 展示修改时间或按时间排序

#### 8.3.6 通用 URI 模式

协议定义了几种标准的 URI 方案。该列表并非穷尽——实现始终可以自由使用其他自定义的 URI 方案。

##### 8.3.6.1 网络资源 https://

用于表示 Web 上可用的资源。

服务端 **应当** 仅在客户端能够自行从 Web 拉取并加载该资源时使用该方案——也就是说，不需要通过 MCP 服务端来读取该资源。

对于其他用例，服务端 **应当** 倾向于使用其他 URI 方案，或定义一个自定义方案，即使服务端自身会从 Internet 上下载资源内容。

##### 8.3.6.2 文件资源 file://

用于标识行为类似 filesystem 的资源。但这些资源不必对应于实际的物理 filesystem。

MCP 服务端 **可以** 使用 XDG 媒体类型（如 `inode/directory`）来标识 `file://` 资源，以表示那些没有标准媒体类型的非普通文件（例如目录）。

##### 8.3.6.3 版本库资源 git://

Git 版本控制集成。

##### 8.3.6.4 自定义 URI 方案

自定义 URI 方案 **必须** 符合 RFC3986，并遵循以上指引。

#### 8.3.7 错误处理

如果所请求的资源不存在，服务端 **必须** 返回 code 为 `-32602`（Invalid Params）的 JSON-RPC 错误。对于内部错误，服务端 **应当** 返回 `-32603`。

对于不存在的资源，服务端 **不得** 返回空的 `contents` 数组。空数组是含混的——它可能意味着资源存在但没有内容，也可能意味着该资源根本不存在。

错误示例：

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "error": {
    "code": -32602,
    "message": "未找到资源",
    "data": {
      "uri": "file:///nonexistent.txt"
    }
  }
}
```

#### 8.3.8 安全考量

1. 服务端 **必须** 验证所有资源 URI
2. **应当** 对敏感资源实施访问控制
3. Binary data **必须** 经过正确编码
4. 在执行操作前 **应当** 检查资源权限
5. 在提供 `file://` 资源时，服务端 **必须** 对文件路径进行清理，以防止目录遍历攻击

#### 8.3.9 按同一 URI 验证实现

本册第1章的两种服务端都注册 notes://catalog 和 notes://item/{note_id}。客户端先读取 stdio，再把 URI 改为 notes://item/missing；应区分内容存在与资源错误。固定 ID 允许集合阻止任意路径和原型属性读取，不以 URI 字符串看起来安全为依据。

#### 8.3.10 练习、答案与使用边界

**练习**：拿到资源 URI 是否等于获得读取权限？资源更新通知是否必须携带完整新正文？

**参考答案**：资源链接不保证出现在目录中；通知内容变化不等于把完整新正文推送给客户端。

**操作检查**：先列出 notes://catalog 和资源模板，再读 notes://item/stdio；未知 ID 与 **proto** 都不能越过固定允许集合。

**速查**：资源以 URI 标识内容。URI 是标识符，能读取某个 URI 仍由服务端和当前主体决定。

### 8.4 工具（Tools）

工具是带名称和结构约束的操作。先看目录，再看一次调用怎样选择处理器、校验输入并产生结果。

**先观察一个例子**：搜索 stdio 返回一条；搜索不存在的词返回成功空列表；空白输入和越界 limit 返回工具错误。

工具（Tools）让模型通过主应用请求外部操作，例如查询数据库、调用 API 或执行计算。服务端用唯一名称标识工具，并提供说明、输入约束等元数据。

#### 8.4.1 用户交互模型

MCP 的工具采用**模型驱动**的设计。语言模型可根据上下文和用户输入选择工具并提出调用，主应用仍负责检查权限和批准条件。

不过，实现者可以自由地通过任何适合其需求的界面模式来暴露工具——协议本身并不强制要求任何特定的用户交互模型。

> **注意:** 出于信任与安全与安全考虑，**应当** 始终有用户参与判断，并具备拒绝工具调用的能力。
> 应用 **应当**：
>
> - 提供 UI，清晰展示哪些工具暴露给了 AI 模型
> - 在工具被调用时插入清晰的视觉指示
> - 针对操作向用户呈现确认提示，以确保用户参与判断

#### 8.4.2 能力

支持工具的服务端 **必须** 声明 `tools` 能力：

```json
{
  "capabilities": {
    "tools": {
      "listChanged": true
    }
  }
}
```

`listChanged` 指明当可用工具的列表发生变化时，服务端是否会发出通知。

声明了 `tools` 能力的服务端 **必须** 响应 `tools/list` 请求，返回当前对请求客户端可用的工具集合。该集合 **可以** 为空，也 **可以** 随时间变化（参见列表变更通知），但 **不得** 因连接不同或连接上其他请求的副作用而异。该集合 **可以** 因请求上呈现的授权而异——例如，仅返回调用者被授予权限范围所允许的工具——因为凭据属于逐请求的输入，而非连接状态。

服务端 **应当** 以确定性顺序返回工具（即在底层工具集合未发生变化时跨请求保持相同顺序）。确定性顺序使客户端能够可靠地缓存工具列表，并在将工具包含在模型上下文中时提高 LLM 提示模板缓存的命中率。

#### 8.4.3 协议消息

先列出工具，再按名称和参数调用；结果可能完成，也可能需要补充输入。目录变化通过已订阅的通知告知。

##### 8.4.3.1 列出工具

为了发现可用的工具，客户端发送 `tools/list` 请求。该操作支持分页 与缓存。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "cursor": "optional-cursor-value",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "tools": [
      {
        "name": "get_weather",
        "title": "天气信息服务",
        "description": "获取指定位置的当前天气",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "城市名或邮政编码"
            }
          },
          "required": ["location"]
        },
        "icons": [
          {
            "src": "https://example.com/weather-icon.png",
            "mimeType": "image/png",
            "sizes": ["48x48"]
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor",
    "ttlMs": 300000,
    "cacheScope": "public"
  }
}
```

##### 8.4.3.2 调用工具

要调用一个工具，客户端发送 `tools/call` 请求：

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "resultType": "complete",
    "content": [
      {
        "type": "text",
        "text": "纽约当前天气：\n温度：72°F\n状况：晴间多云"
      }
    ],
    "isError": false
  }
}
```

##### 8.4.3.3 需要输入的工具结果

服务端 **可以** 响应 `tools/call` 时返回 `InputRequiredResult`，以表明在工具调用可完成前还需要额外输入。这遵循多轮请求（多轮请求） 机制。

在携带输入响应重试请求时，客户端在请求参数中包含 `inputResponses`，若服务端提供则还包含 `requestState`：

**Input Required 响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "resultType": "input_required",
    "inputRequests": {
      "github_login": {
        "method": "elicitation/create",
        "params": {
          "mode": "form",
          "message": "请提供你的代码托管用户名",
          "requestedSchema": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              }
            },
            "required": ["name"]
          }
        }
      }
    },
    "requestState": "eyJsb2NhdGlvbiI6Ik5ldyBZb3JrIn0..."
  }
}
```

**携带输入响应重试:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    },
    "inputResponses": {
      "github_login": {
        "action": "accept",
        "content": {
          "name": "octocat"
        }
      }
    },
    "requestState": "eyJsb2NhdGlvbiI6Ik5ldyBZb3JrIn0...",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

请注意，初始请求与重试之间，JSON-RPC 的 `id` **必须** 不同。

##### 8.4.3.4 列表变更通知

当可用工具的列表发生变化时，声明了 `listChanged` 能力的服务端 **应当** 向那些已通过 `toolsListChanged: true` 打开 `subscriptions/listen` 流的客户端发送通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

#### 8.4.4 消息流

沿步骤核对每条消息来自谁、关联哪个请求，以及何时产生最终结果；业务执行与传输结束分别判断。

**工具发现、调用和目录刷新**

```mermaid
sequenceDiagram
    participant LLM as 大语言模型 (LLM)
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Note over Client,Server: 发现工具
    Client->>Server: 列出工具（tools/list）
    Server-->>Client: 返回工具目录
    Note over Client,LLM: 选择工具
    LLM->>Client: 选择要调用的工具
    Note over Client,Server: 调用工具
    Client->>Server: 调用工具（tools/call）
    Server-->>Client: 返回工具结果
    Client->>LLM: 处理工具结果
    opt 工具声明目录变更能力（listChanged）
        Client->>Server: 监听订阅（subscriptions/listen）<br/>工具目录变更（toolsListChanged=true）
        Server-->>Client: 订阅确认（notifications/subscriptions/acknowledged）
        Note over Client,Server: 目录发生变更
        Server-->>Client: 工具目录变更通知（notifications/tools/list_changed）
        Client->>Server: 重新列出工具（tools/list）
        Server-->>Client: 返回更新后的工具目录
    end
```

#### 8.4.5 数据类型

工具描述规定名称、输入和输出约束；调用结果装载内容与结构化数据，内容块再区分文本、媒体与资源。

##### 8.4.5.1 工具描述对象 Tool

工具定义包含：

- `name`：工具的唯一标识符
- `title`：可选的、用于显示目的的工具人类可读名称
- `description`：功能的人类可读描述
- `icons`：可选的、用于在用户界面中显示的图标数组
- `inputSchema`：定义预期参数的 JSON Schema
  - 遵循 JSON Schema 的使用规则（JSON Schema 的使用指南）
  - 若不存在 `$schema` 字段，则默认为 2020-12
  - **必须** 是有效的 JSON Schema 对象（不能为 `null`）
  - 对于无参数的工具，使用以下任一合法方式：
    - `{ "type": "object", "additionalProperties": false }` —— **推荐**：显式地仅接受空对象
    - `{ "type": "object" }` —— 接受任何对象（包括带属性的）
  - Properties **可以** 包含 `x-mcp-header` annotation，以便将参数值作为 HTTP 标头暴露出去
- `outputSchema`：可选的、定义预期输出结构的 JSON Schema
  - 遵循 JSON Schema 的使用规则（JSON Schema 的使用指南）
  - 若不存在 `$schema` 字段，则默认为 2020-12
- `annotations`：可选的、描述工具行为的属性

> **注意:** 出于信任与安全与安全考虑，除非来自受信任的服务端，否则客户端 **必须** 将工具注解视为不可信。

###### 8.4.5.1.1 工具名称

- 工具名称 **应当** 长度在 1 到 128 个字符之间（含）。
- 工具名称 **应当** 被视为大小写敏感。
- **应当** 仅允许以下字符：大写和小写 ASCII 字母（A-Z、a-z）、数字（0-9）、下划线（\_）、连字符（-）和点（.）
- 工具名称 **不应** 包含空格、逗号或其他特殊字符
- 工具名称 **应当** 在单个服务端内唯一
- 有效的工具名称示例：
  - `getUser`
  - `DATA_EXPORT_v2`
  - `admin.tools.list`

> **说明:** 工具名称的唯一性范围限定在单个服务端内。从多个服务端汇总工具的客户端或代理 **可以** 遇到命名冲突（例如，两个服务端都暴露一个 `search` 工具），**应当** 实现消歧策略，例如在工具名称前加上服务端标识符。
> 服务端的 `name`（来自 `serverInfo`）不保证跨服务端唯一，**不应** 被依赖用于消歧。

###### 8.4.5.1.2 参数标头注解 x-mcp-header

`x-mcp-header` 扩展属性允许服务端将特定的工具参数映射为 HTTP 标头（在使用 Streamable HTTP 传输时）。这使网络中间件（负载均衡器、代理、WAF）能够基于参数值路由和处理请求，而无需解析请求正文。

`x-mcp-header` 属性直接放置在要被映射的属性的 JSON Schema 内。其值指定所产生的 `Mcp-Param-{name}` HTTP 标头的名称部分。

**`x-mcp-header` 值的约束：**

- **不得** 为空
- **必须** 符合 HTTP 字段-名称令牌语法（`1*tchar`，RFC 9110 节 5.1）
- **不得** 包含控制字符，包括 carriage return（CR，`\r`）或 line feed（LF，`\n`）
- 在 `inputSchema` 内所有 `x-mcp-header` 值中 **必须** 大小写不敏感地唯一
- **必须** 仅应用于基本类型 type 的参数（整数、字符串、布尔值）。不允许使用 `number` type 的参数。Integer 值 **必须** 处于使用 IEEE754 double-precision 浮点数表示的整数安全范围内（−2^53+1 到 2^53−1）
- **必须** 仅应用于那些从 Schema root _statically reachable_（静态可达）的属性，定义参见 Custom 标头 from 工具 Parameters，该处还定义了如何从调用参数中提取标头值

使用 Streamable HTTP 传输的客户端 **必须** 拒绝任何 `x-mcp-header` 值违反这些约束的工具 definition。拒绝意味着客户端 **必须** 将该无效的工具从 `tools/list` 的结果中排除。客户端 **应当** 在拒绝工具 definition 时记录一条 warning，包含工具名称与拒绝原因。这能确保单个畸形的工具 definition 不会妨碍其他合法工具的使用。使用其他传输（例如 stdio）的客户端 **可以** 完全忽略 `x-mcp-header` annotation。

**带 `x-mcp-header` 的工具 definition 示例：**

```json
{
  "name": "execute_sql",
  "description": "在受控数据库上执行 SQL 查询",
  "inputSchema": {
    "type": "object",
    "properties": {
      "region": {
        "type": "string",
        "description": "执行查询的区域",
        "x-mcp-header": "Region"
      },
      "query": {
        "type": "string",
        "description": "要执行的 SQL 查询"
      }
    },
    "required": ["region", "query"]
  }
}
```

在该示例中，当该工具以 `"region": "us-west1"` 被调用时，客户端会在 HTTP 请求中添加标头 `Mcp-Param-Region: us-west1`。

> **注意:** 服务端开发者 **不应** 将敏感参数（password、API 键、令牌、PII）标记为 `x-mcp-header`，因为标头值对网络中间件可见。

##### 8.4.5.2 工具结果

工具结果可包含 **structured**（结构化） 或 **unstructured（非结构化）** 内容。

**Unstructured** 内容在结果的 `content` 字段中返回，可包含多种不同 type 的内容 item：

> **说明:** 所有内容 type（text、image、audio、资源 link 以及嵌入的资源）都支持可选的注解（注解），用于提供关于受众、优先级和修改时间的元数据。这与资源和提示模板使用的 annotation 格式相同。

###### 8.4.5.2.1 文本内容

```json
{
  "type": "text",
  "text": "工具返回的文本"
}
```

###### 8.4.5.2.2 图像内容

```json
{
  "type": "image",
  "data": "base64-encoded-data",
  "mimeType": "image/png",
  "annotations": {
    "audience": ["user"],
    "priority": 0.9
  }
}
```

###### 8.4.5.2.3 音频内容

```json
{
  "type": "audio",
  "data": "base64-encoded-audio-data",
  "mimeType": "audio/wav"
}
```

###### 8.4.5.2.4 资源链接

工具 **可以** 返回指向资源 的链接，以提供额外的上下文或数据。在这种情况下，工具会返回一个可由客户端订阅或拉取的 URI：

```json
{
  "type": "resource_link",
  "uri": "file:///project/docs/guide.md",
  "name": "说明文档",
  "description": "应用入口说明",
  "mimeType": "text/plain"
}
```

资源 link 与常规资源一样，支持相同的资源注解（资源注解），以帮助客户端理解如何使用它们。

> **说明:** 工具返回的资源 link 不保证会出现在 `resources/list` 请求的结果中。

###### 8.4.5.2.5 嵌入资源

资源 **可以** 通过合适的 URI 方案被嵌入以提供额外的上下文或数据。使用嵌入的资源的服务端 **应当** 实现 `resources` 能力：

```json
{
  "type": "resource",
  "resource": {
    "uri": "file:///project/docs/guide.md",
    "mimeType": "text/plain",
    "text": "应用入口负责输出问候语。"
  },
  "annotations": {
    "audience": ["user", "assistant"],
    "priority": 0.7,
    "lastModified": "2025-05-03T14:30:00Z"
  }
}
```

Embedded 资源与常规资源一样，支持相同的资源注解（资源注解），以帮助客户端理解如何使用它们。

###### 8.4.5.2.6 结构化内容

**Structured** 内容作为 JSON 值在结果的 `structuredContent` 字段中返回。它可以是任何 JSON 值（对象、数组、字符串、数值、布尔值或 null），并且遵循工具的 `outputSchema`（若已定义）。

> **说明:** `structuredContent` 是由服务端生成的结果数据，与 LLM 的"结构化输出"（structured outputs，即受 Schema 约束的模型生成）无关。

###### 8.4.5.2.7 输出模式

工具也可以提供输出 Schema，用于对结构化结果进行验证。如果提供了输出 Schema：

- 服务端 **必须** 提供符合该 Schema 的结构化结果。
- 客户端 **应当** 依据该 Schema 对结构化结果进行验证。

带输出 Schema 的工具示例：

```json
{
  "name": "get_weather_data",
  "title": "天气数据查询",
  "description": "获取指定位置的天气数据",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "城市名或邮政编码"
      }
    },
    "required": ["location"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "temperature": {
        "type": "number",
        "description": "摄氏温度"
      },
      "conditions": {
        "type": "string",
        "description": "天气状况说明"
      },
      "humidity": {
        "type": "number",
        "description": "相对湿度百分比"
      }
    },
    "required": ["temperature", "conditions", "humidity"]
  }
}
```

该工具的有效响应示例：

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "resultType": "complete",
    "content": [
      {
        "type": "text",
        "text": "{\"temperature\": 22.5, \"conditions\": \"晴间多云\", \"humidity\": 65}"
      }
    ],
    "structuredContent": {
      "temperature": 22.5,
      "conditions": "晴间多云",
      "humidity": 65
    }
  }
}
```

带数组输出 Schema 的工具示例：

```json
{
  "name": "list_users",
  "title": "用户列表",
  "description": "返回当前主体可访问的用户列表",
  "inputSchema": {
    "type": "object",
    "properties": {}
  },
  "outputSchema": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        }
      },
      "required": ["id", "name", "email"]
    }
  }
}
```

带数组输出的工具的有效响应示例：

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "result": {
    "resultType": "complete",
    "content": [
      {
        "type": "text",
        "text": "找到2名用户：Alice（alice@example.com）和 Bob（bob@example.com）。"
      }
    ],
    "structuredContent": [
      {
        "id": "1",
        "name": "Alice",
        "email": "alice@example.com"
      },
      {
        "id": "2",
        "name": "Bob",
        "email": "bob@example.com"
      }
    ]
  }
}
```

提供输出 Schema 有助于客户端和 LLM 理解并妥善处理结构化的工具输出，其作用包括：

- 支持对响应的严格 Schema 验证
- 提供类型信息，便于与编程语言更好地集成
- 引导客户端和 LLM 正确解析与利用返回的数据
- 支持更完善的文档与开发者体验

##### 8.4.5.3 Schema 示例

下面分别给出输出形状和输入方言的例子。按同一个工具的声明检查实际结果，不能只比较展示文字。

###### 8.4.5.3.1 使用默认 2020-12 Schema 的工具：

```json
{
  "name": "calculate_sum",
  "description": "将两个数相加",
  "inputSchema": {
    "type": "object",
    "properties": {
      "a": {
        "type": "number"
      },
      "b": {
        "type": "number"
      }
    },
    "required": ["a", "b"]
  }
}
```

###### 8.4.5.3.2 使用显式 draft-07 Schema 的工具：

```json
{
  "name": "calculate_sum",
  "description": "将两个数相加",
  "inputSchema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "a": {
        "type": "number"
      },
      "b": {
        "type": "number"
      }
    },
    "required": ["a", "b"]
  }
}
```

###### 8.4.5.3.3 无参数的工具：

```json
{
  "name": "get_current_time",
  "description": "返回服务端当前时间",
  "inputSchema": {
    "type": "object",
    "additionalProperties": false
  }
}
```

#### 8.4.6 有状态的工具

> **说明:** 本节是关于工具设计的非规范性指引。协议中没有状态句柄的概念；从线上消息角度看，句柄只是工具结果中的一个普通字符串，也是后续工具调用的一个普通参数。

MCP 没有协议层的会话，因此服务端不能依赖隐式的逐连接状态来关联相邻的工具调用。那些需要在跨调用间保持状态的服务端（购物车、打开的浏览器上下文、数据库事务）应当通过一个创建工具返回显式的句柄，并在后续调用中以参数形式接受该句柄。

例如，一个管理购物车的服务端可能暴露：

```jsonc
// → tools/call
{ "name": "create_basket", "arguments": {} }

// ← result
{
  "content": [{ "type": "text", "text": "已创建购物车 bsk_a1b2c3" }],
  "structuredContent": { "basket_id": "bsk_a1b2c3" }
}

// → tools/call
{
  "name": "add_item",
  "arguments": { "basket_id": "bsk_a1b2c3", "sku": "..." }
}
```

由模型负责在后续调用中携带 `basket_id`；服务端以该键存储购物车内容，并在每次调用时按该键进行查找。

在设计句柄时，服务端应考虑：

- **授权。** 对于已身份认证的服务端，句柄是一个名称，而非能力。服务端应当在每次调用时依据句柄校验调用者的授权。对于未身份认证的服务端，句柄必然充当持有者令牌，应当以足够的熵（例如 UUIDv4）生成，并设定有界的有效期。
- **不透明性。** 编码了内部结构的句柄会引诱解析或猜测；不透明标识符则不会。
- **生命周期。** 由于句柄的生命周期长于任何单次连接，服务端的保留策略应在创建工具的 description 中明确说明（例如"购物车在 24 小时不活动后过期"），以便模型在决定创建状态时能够看到这一点。
- **过期错误。** 对已过期或未知句柄的调用应当返回明确说明这一情况的工具执行错误，以便模型能够通过创建一个新的句柄来恢复。

#### 8.4.7 错误处理

工具使用两种错误上报机制：

1. **协议错误** 指示请求结构本身的问题，模型较难自行修复：
   - 未知的工具
   - 畸形的请求（不满足 CallToolRequest Schema 的请求）
   - 服务端错误

   它们以标准 JSON-RPC 错误的形式返回：

   ```json
   {
     "jsonrpc": "2.0",
     "id": 3,
     "error": {
       "code": -32602,
       "message": "未知工具：invalid_tool_name"
     }
   }
   ```

2. **工具执行错误** 包含可供语言模型自我修正并使用调整后参数重试的可执行反馈：
   - API 失败
   - 输入验证错误（例如日期格式错误、值超出范围）
   - 业务逻辑错误

   它们在工具结果中以 `isError: true` 上报：

   ```json
   {
     "jsonrpc": "2.0",
     "id": 4,
     "result": {
       "resultType": "complete",
       "content": [
         {
           "type": "text",
           "text": "出发日期无效：必须晚于本次业务规定的当前日期。"
         }
       ],
       "isError": true
     }
   }
   ```

客户端 **可以** 将协议错误透传给语言模型，但这些错误不太可能带来成功的恢复。客户端 **应当** 将工具执行错误透传给语言模型，以实现自我修正。

#### 8.4.8 安全考量

1. 服务端 **必须**：
   - 验证所有工具输入
   - 实施适当的访问控制
   - 对工具调用进行速率限制
   - 对工具输出进行清理

2. 客户端 **应当**：
   - 在敏感操作前提示用户进行确认
   - 在调用服务端前向用户展示工具输入，以避免恶意或意外的数据外泄
   - 在将工具结果传递给 LLM 前对其进行验证
   - 在依据 `inputSchema` 与 `outputSchema` 验证工具输入与输出时，遵循 `$ref` 解析要求
   - 对工具调用实施超时
   - 记录工具使用情况以供审计

#### 8.4.9 完整实现与可观察结果

第1章的 server.py/server.ts 与 client.py/client.ts 已提供本工具的完整实现。输入 query=stdio、limit=2 时总计一条；输入 query=absent 时是成功空列表；输入空白或 limit=0 时是工具错误。分别检查 Python 的 structured_content/is_error 和 TypeScript 的 structuredContent/isError，它们对应同一线上字段。

#### 8.4.10 练习、答案与使用边界

**练习**：查询没有命中、空白 query 和未知方法属于同一种失败吗？readOnlyHint 是否强制只读？

**参考答案**：工具结果 isError 与 JSON-RPC error 不是同一层。描述和注解帮助使用，不构成权限保证。

**操作检查**：搜索 stdio 返回一条；搜索不存在的词返回成功空列表；空白输入和越界 limit 返回工具错误。

**速查**：工具是带名称和结构约束的操作。先看目录，再看一次调用怎样选择处理器、校验输入并产生结果。

## 第9章 附加工具：补全、分页与缓存

补全帮助填写参数，分页帮助遍历目录，缓存帮助减少重复读取；三者的数据新鲜度和权限条件不同。

**先观察一个例子**：取得 `nextCursor` 后原样发回，直到字段缺失。再对照同一列表的缓存规则，判断哪些结果可供不同用户复用。

本章的消息片段也可能省略逐请求元数据。联调时按[元数据字段](#431-元数据字段-_meta)补齐。

### 9.1 参数补全

参数补全（Completion）为尚未填完的提示模板或资源模板参数提供候选值。请求用名称标识提示模板，或用 URI 标识资源模板。

#### 9.1.1 用户交互模型

MCP 中的参数补全旨在支持类 IDE 代码补全的交互式用户体验。

例如，应用可以在用户键入时以下拉菜单或弹出菜单的形式展示参数补全建议，并允许从中筛选与选择。

不过，实现者可以自由地通过任何适合其需求的界面模式来暴露参数补全——协议本身并不强制要求任何特定的用户交互模型。

#### 9.1.2 能力

支持参数补全的服务端 **必须** 声明 `completions` 能力：

```json
{
  "capabilities": {
    "completions": {}
  }
}
```

#### 9.1.3 协议消息

补全请求同时标明引用、正在填写的参数和已有上下文；响应只给候选，不替用户提交业务操作。

##### 9.1.3.1 请求补全

要获得参数补全建议，客户端发送 `completion/complete` 请求，通过 reference type 指明被补全的对象：

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/prompt",
      "name": "code_review"
    },
    "argument": {
      "name": "language",
      "value": "py"
    },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "completion": {
      "values": ["python", "pytorch", "pyside"],
      "total": 10,
      "hasMore": true
    }
  }
}
```

对于具有多个参数的提示模板或 URI 模板，客户端应在 `context.arguments` 对象中包含之前的补全值，以便为后续请求提供上下文。

**请求:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/prompt",
      "name": "code_review"
    },
    "argument": {
      "name": "framework",
      "value": "fla"
    },
    "context": {
      "arguments": {
        "language": "python"
      }
    },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

**响应:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "completion": {
      "values": ["flask"],
      "total": 1,
      "hasMore": false
    }
  }
}
```

##### 9.1.3.2 引用类型

协议支持两种类型的参数补全 reference：

| 类型           | 描述                         | 示例                                                |
| -------------- | ---------------------------- | --------------------------------------------------- |
| `ref/prompt`   | 按名称引用一个提示模板       | `{"type": "ref/prompt", "name": "code_review"}`     |
| `ref/resource` | 引用一个资源 URI 或 URI 模板 | `{"type": "ref/resource", "uri": "file:///{path}"}` |

##### 9.1.3.3 补全结果

服务端返回一个按相关性排序的参数补全值数组，其特征为：

- 每个响应最多 100 项
- 可选地给出可用匹配的总条数
- 给出是否存在更多结果的布尔值

#### 9.1.4 消息流

沿步骤核对每条消息来自谁、关联哪个请求，以及何时产生最终结果；业务执行与传输结束分别判断。

**随输入变化重新请求补全**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Note over Client: 用户填写参数
    Client->>Server: 请求参数补全（completion/complete）
    Server-->>Client: 返回补全候选
    Note over Client: 用户继续填写
    Client->>Server: 再次请求参数补全（completion/complete）
    Server-->>Client: 返回更新后的候选
```

#### 9.1.5 数据类型

补全请求确定正在填写哪个模板参数，结果提供候选值、总数提示和是否还有更多候选。

##### 9.1.5.1 补全请求 CompleteRequest

- `ref`：`PromptReference` 或 `ResourceTemplateReference`。对于 `ResourceTemplateReference`，`uri` 是一个 URI 或 URI 模板。
- `argument`：对象，包含：
  - `name`：参数名
  - `value`：当前值
- `context`：对象，包含：
  - `arguments`：一个将已解析的参数名称映射到其值的映射。

##### 9.1.5.2 补全结果 CompleteResult

- `completion`：对象，包含：
  - `values`：建议数组（最多 100 项）
  - `total`：可选的总匹配数
  - `hasMore`：是否存在更多结果的标志

#### 9.1.6 错误处理

服务端 **应当** 为常见失败场景返回标准 JSON-RPC 错误：

- 未找到方法：`-32601`（未支持该能力）
- 无效的提示模板名称：`-32602`（Invalid params）
- 缺少必需的参数：`-32602`（Invalid params）
- 内部错误：`-32603`（Internal 错误）

#### 9.1.7 实现考量

下面把用户交互落实到状态、身份与敏感信息处理；这些条件影响是否能安全完成同一操作。

1. 服务端 **应当**：
   - 按相关性返回排序后的建议
   - 在合适的情况下实现 fuzzy matching
   - 对参数补全请求实施速率限制
   - 验证所有输入

2. 客户端 **应当**：
   - 对频繁的参数补全请求进行 debounce
   - 在合适的情况下缓存参数补全结果
   - 优雅地处理缺失或部分结果

#### 9.1.8 安全

实现 **必须**：

- 验证所有参数补全输入
- 实施恰当的速率限制ing
- 控制对敏感建议的访问
- 防止基于参数补全的信息泄露

#### 9.1.9 练习与答案

**练习**：服务端返回一个参数候选后，是否已经提交了工具调用？

**参考答案**：还没有。补全只提供候选。主应用仍需确认最终参数，并通过对应的方法发起独立操作。

### 9.2 分页读取列表

分页（Pagination）把可能很大的列表拆成多次请求。每次返回一页，客户端用游标请求下一页。这样能控制单次处理的数据量，无论服务运行在本机还是远程。

**游标分页**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 列表请求，省略游标（cursor）
    loop 有下一页时继续
        Server-->>Client: 返回本页及下一页游标（nextCursor）
        Client->>Server: 带游标（cursor）请求下一页
    end
```

#### 9.2.1 分页模型

MCP 中的分页使用基于不透明 cursor 的方法，而非数字编号的页。

- **cursor** 是一个不透明字符串令牌，表示在结果集中的位置。
- **每页大小** 由服务端决定，客户端 **不得** 假定固定的每页大小。

#### 9.2.2 响应格式

当服务端发送包含以下内容的 **响应** 时，分页开始：

- 当前页的结果
- 若存在更多结果，则带有可选的 `nextCursor` 字段

```text
{
  "jsonrpc": "2.0",
  "id": "123",
  "result": {
    "resultType": "complete",
    "resources": [...],
    "nextCursor": "eyJwYWdlIjogM30=",
    "ttlMs": 300000,
    "cacheScope": "public"
  }
}
```

#### 9.2.3 请求格式

收到 cursor 后，客户端可以通过在请求中包含该 cursor 来 _continue_ 分页：

```json
{
  "jsonrpc": "2.0",
  "id": "124",
  "method": "resources/list",
  "params": {
    "cursor": "eyJwYWdlIjogMn0=",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

#### 9.2.4 分页流程

```text
第一页请求 → 项目与 nextCursor
  → 原样回传 cursor → 后续项目
  → 没有 nextCursor：遍历结束
```

#### 9.2.5 支持分页的操作

以下 MCP 操作支持分页：

- `resources/list` - 列出可用的资源
- `resources/templates/list` - 列出资源模板
- `prompts/list` - 列出可用的提示模板
- `tools/list` - 列出可用的工具

#### 9.2.6 实现指南

1. 服务端 **应当**：
   - 提供稳定的 cursor
   - 优雅地处理无效的 cursor

2. 客户端 **应当**：
   - 将缺失的 `nextCursor` 视为结果的结尾
   - 同时支持分页与非分页的流程

3. 客户端 **必须** 将 cursor 视为不透明令牌：
   - 不要对 cursor 的格式作任何假设
   - 不要尝试解析或修改 cursor
   - 除了判断是否提供了非 null 的值之外，不要根据 cursor 值做出任何判定（例如空字符串是一个合法的 cursor，因此 **不得** 被视为结果的结尾）

#### 9.2.7 错误处理

无效的 cursor **应当** 产生一个 code 为 -32602（Invalid params）的错误。

#### 9.2.8 练习与答案

**练习**：能否把不透明游标当页码修改？

**参考答案**：不能。游标由服务端解释。把上次响应的 `nextCursor` 原样作为下一次请求的 `cursor`，直到响应不再提供下一页游标。

### 9.3 结果缓存

缓存（Caching）让客户端在适用条件下复用响应。新鲜时长控制结果多久可以直接复用，变更通知可以提前使结果失效。

**新鲜期内复用与目录变更失效**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant Server as 服务器 (Server)
    Client->>Server: 列出工具（tools/list）
    Server-->>Client: 工具目录，ttlMs=300000（缓存新鲜时长 5 分钟）
    Note over Client: 将本次响应存入缓存
    Note over Client: 2 分钟后
    Client->>Client: 请求工具目录，缓存仍新鲜，直接使用
    Note over Client: 又过 3 分钟，新鲜期结束
    Client->>Client: 再次需要目录，缓存已过期
    Client->>Server: 重新列出工具（tools/list）
    Server-->>Client: 工具目录，ttlMs=300000（缓存新鲜时长 5 分钟）
    Note over Server: 新鲜期内工具目录发生变更
    Server-->>Client: 工具目录变更通知（notifications/tools/list_changed）
    Note over Client: 立刻使缓存失效
    Client->>Server: 重新列出工具（tools/list）
    Server-->>Client: 工具目录，ttlMs=300000（缓存新鲜时长 5 分钟）
```

#### 9.3.1 可缓存结果

服务端必须在以下操作返回的 `resultType: "complete"` 结果上附带缓存提示：

- `server/discover`
- `tools/list`
- `prompts/list`
- `resources/list`
- `resources/templates/list`
- `resources/read`

具有 `resultType: "input_required"` 的中间结果（参见多轮请求）不可缓存，并且不携带缓存 hint。

#### 9.3.2 缓存键

缓存的响应由请求方法与影响结果的请求参数共同标识（例如 `resources/read` 中的 `uri`，或分页列表请求中的 `cursor`）。客户端 **不得** 将缓存的响应用于与产生该响应的请求在方法或参数上有所不同的请求。

通过多轮请求机制重试请求而产生的结果——即携带 `inputResponses` 或 `requestState` 的请求——**不得** 被缓存，因为它们依赖于缓存键之外的输入。

#### 9.3.3 可缓存模式

MCP 中可缓存结果通过两个字段向客户端提供缓存提示：

- **新鲜度字段（TTL）** `ttlMs`：一个以毫秒为单位的整数值，指定客户端可将该结果视为保持新鲜的时长。
- **缓存共享范围字段** `cacheScope`：指示该缓存响应的目标权限范围，值为 `"public"` 或 `"private"`。

##### 9.3.3.1 存活时间（TTL）字段

`ttlMs` 字段是服务端给出的一项提示，指示客户端可将该结果视为新鲜的毫秒数。其语义类似于 HTTP `Cache-Control: max-age`。

- 若 `ttlMs` 为 `0`，则该响应 **应当** 被视为立即过期的。客户端可在每次需要该结果时重新拉取。
- 若 `ttlMs` 为正数，客户端 **应当** 在收到该响应之后的那么多毫秒内将其视为新鲜的。
- 若 `ttlMs` 缺失，客户端 **应当** 假定默认值 `0`（立即过期的），并依赖自身的缓存策略 或通知。
- 若 `ttlMs` 为负数，客户端 **应当** 忽略该值并将其视为 `0`。

服务端 **必须** 提供一个 `>= 0` 的 `ttlMs` 值。

> **说明:** TTL 是一个 **新鲜度 hint（新鲜度提示）**，而非保证。服务端可以在 TTL 到期前改变底层数据。TTL 告诉客户端在多长时间内可以合理地避免重新拉取，而非数据保证在多长时间内保持不变。

###### 9.3.3.1.1 新鲜度计算

客户端会记录收到响应的本地时间（`t_received`）。在以下条件成立期间，该响应被视为 **新鲜的**：

```text
now < t_received + ttlMs
```

一旦 TTL 过期，该响应即为 **过期的**，客户端 **应当** 在下次访问时重新拉取。

客户端 **不应** 将 TTL 视为触发自动后台重新拉取的轮询间隔。TTL 是一个新鲜度 hint：客户端在需要数据时检查新鲜度，并在过期的时才重新拉取。若实现确实选择进行轮询，**必须** 应用 jitter 与 backoff。

客户端 **可以** 在 TTL 到期前重新拉取，前提是其有理由认为数据已发生变化（例如在工具调用上收到意外错误，指示 method 未找到或参数无效）。

客户端 **可以** 在重新拉取过程中发生错误（例如网络问题、服务端停机）时继续使用过期缓存响应。

##### 9.3.3.2 缓存范围字段

`cacheScope` 字段控制哪些主体可以缓存一个响应，类似于 HTTP 的 `Cache-Control: public` 与 `Cache-Control: private`。

| 取值        | 含义                                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"public"`  | 该响应不含用户特定数据。任何客户端、共享网关 或缓存代理 **可以** 存储该缓存响应，并将其提供给任意用户。                                                     |
| `"private"` | 该响应含有不宜在调用方之间共享的私有数据。缓存的响应 **可以** 在相同的授权上下文内复用。缓存**不得** 跨授权上下文共享（例如不同的访问令牌需要不同的缓存）。 |

###### 9.3.3.2.1 选择缓存范围

- 当工具、提示模板和资源模板的列表对所有用户都相同时，适合使用 **`"public"`**。
- 当 `resources/read` 的结果依赖于身份认证后的用户，或因用户而异的过滤列表结果时，适合使用 **`"private"`**。

#### 9.3.4 与通知的交互

TTL 与服务端推送通知是互补的：

- 服务端 **可以** 提供 `ttlMs` 而不声明 `listChanged: true` 的能力。在这种情况下，客户端完全依赖基于 TTL 的新鲜度。
- 服务端 **可以** 声明 `listChanged: true` **并** 提供 `ttlMs`。在这种情况下，客户端可以使用 TTL 在两次通知之间避免不必要的重新拉取，而通知充当即时的失效信号。

如果在新鲜期内收到对应的变更通知，应立即把缓存标为过期。以上图为例，工具目录缓存的新鲜时长原为 5 分钟。收到 `notifications/tools/list_changed` 后，下一次需要目录时应重新请求 `tools/list`。

#### 9.3.5 与分页的交互

列表分页时，每一页都是一个可独立缓存的响应——与 HTTP `Cache-Control` 处理分页资源的方式一致。

- 每一页的响应都带有其自身的 `ttlMs` 值。每一页的新鲜度时钟从收到该页时开始计时。
- 服务端 **可以** 为不同页返回不同的 `ttlMs` 值（例如对稳定列表的前几页使用较长的 TTL，对最后一页使用较短的 TTL）。
- 当某一页的缓存过期时，客户端 **应当** 使用其 cursor 重新拉取该页。
- 不存在跨页的一致性保证。若底层数据在分页拉取之间发生变化，客户端可能观察到重复或缺漏。
- 若客户端需要完整列表的一致快照，**应当** 从头（不携带 cursor）重新拉取。
- 若 cursor 变为无效（例如服务端对之前有效的 cursor 返回错误），客户端 **应当** 丢弃所有已缓存的页并从头重新拉取。

服务端 **必须** 对同一 list 请求的所有响应页应用相同的 `cacheScope`。例如，若 `tools/list` 响应的第一页为 `cacheScope: "private"`，则该请求的所有后续页 **必须** 也为 `"private"`。

#### 9.3.6 安全考量

`cacheScope` 为 `"public"` 表明该响应不含用户特定数据，可以被安全共享。服务端必须意识到，带有 `"public"` `cacheScope` 的响应可能在调用方之间被共享，即使该结果来自一个已身份认证的端点。例如，来自已身份认证的 `tools/list` 调用的、带有 `"public"` `cacheScope` 的结果，可能被客户端缓存并被共享到初始请求的授权上下文之外（即不同的访问令牌可以使用同一缓存）。

服务端实现者：

- 应确保 `cacheScope` 正确反映该基本类型的目标可见性。
- 必须实施恰当的 逐能力访问控制，并且不得仅依赖 `cacheScope` 来防止对基本类型的未授权访问。

#### 9.3.7 练习与答案

**练习**：公共缓存与私有缓存能否使用同一个跨用户键？

**参考答案**：不能。公共缓存按可共享范围复用，私有缓存须按授权上下文隔离。即使缓存仍在有效期内，也不能将一个用户的私有结果交给另一个用户。

### 9.4 补全、分页与缓存速查

补全帮助填写参数，分页帮助遍历目录，缓存帮助减少重复读取；三者的数据新鲜度和权限条件不同。

## 第10章 安全、信任与保障

### 10.1 用户控制、数据隐私与工具安全

用户应了解并明确同意哪些数据会被访问、共享给谁以及将执行哪些操作。主应用应提供可审阅的授权界面，让用户控制数据共享与操作执行。向服务器披露用户数据、把资源数据转发到其他系统、调用工具之前，主应用必须取得相应的用户明确同意。

工具会触发实际代码，可能访问文件、网络和业务数据。应按来源处理服务器提供的工具描述与行为注解（annotations），不能把注解当作权限或只读保证。让用户在同意前理解工具的作用，再由客户端和服务器各自执行权限与输入检查。

协议消息本身无法强制落实这些原则。实现者应提供可靠的同意与授权流程、说明安全影响、实施访问控制和数据保护、遵循集成的安全实践，并在设计时考虑隐私风险。

### 10.2 令牌、客户端与授权边界

有效 OAuth 流程并不自动消除滥用；检查主体、受众、回调、元数据、网络和业务授权的整条链路。

**先观察一个例子**：对照正确令牌、错误受众、过期令牌和另一主体的资源；只有第一种且有业务权限时允许访问。

本文档概述了在构建 MCP 客户端和服务端时实现者必须考虑的安全要求。

此外，实现者必须遵循 OAuth 2.1 节 7. "安全 Considerations" 中概述的 OAuth 2.1 安全最佳实践。

#### 10.2.1 令牌受众绑定与验证

RFC 8707 资源指示符 通过将令牌绑定到其预期受众来提供关键的安全优势 —— **前提是授权服务端支持此能力**。为了启用当前和未来的采用：

- MCP 客户端必须按照资源参数实现 一节的规定，在授权和令牌请求中包含 `resource` 参数
- MCP 服务端必须验证向其出示的令牌是专门为它们的使用而颁发的

安全实践说明阐述了为何令牌受众验证至关重要以及为何令牌透传被明确禁止。

#### 10.2.2 令牌窃取

获取客户端存储的令牌，或者在服务端上被缓存或记录的令牌的攻击者，可以使用对资源服务端看似合法的请求访问受保护的资源。

客户端和服务端必须实现安全的令牌存储并遵循 OAuth 最佳实践，如 OAuth 2.1, 节 7.1 所述。

授权服务端应当颁发短时效的访问令牌以减少泄漏令牌的影响。对于公开客户端，授权服务端必须按照 OAuth 2.1 节 4.3.1 "令牌 Endpoint 扩展" 所述轮换刷新令牌。

#### 10.2.3 通信安全

实现必须遵循 OAuth 2.1 节 1.5 "通信安全"。

具体而言：

1. 所有授权服务端端点 必须通过 HTTPS 提供服务。
1. 所有 回调 URI（redirect_uri） 必须是 `localhost` 或使用 HTTPS。

#### 10.2.4 授权码保护

已获得授权响应中授权码访问权限的攻击者可以尝试将该授权码兑换为访问令牌或以其他方式利用该授权码。（详见 OAuth 2.1 节 7.5）

为缓解此问题，MCP 客户端必须按照 OAuth 2.1 节 7.5.2 实现 PKCE，并且必须在继续进行授权之前验证 PKCE 支持。PKCE 通过要求客户端创建秘密校验值与挑战对来帮助防止授权码拦截和注入攻击，确保只有原始请求者才能将授权码兑换为令牌。

MCP 客户端必须在技术可行时使用 `S256` 校验挑战方法，如 OAuth 2.1 节 4.1.1 所要求。

由于 OAuth 2.1 和 PKCE 规范未定义客户端发现 PKCE 支持的机制，MCP 客户端必须依赖授权服务端元数据来验证此能力：

- **OAuth 2.0 授权服务端元数据**：如果 `code_challenge_methods_supported` 缺失，则授权服务端不支持 PKCE，MCP 客户端必须拒绝继续。

- **OpenID Connect 发现 1.0**：虽然 OpenID Provider 元数据未定义 `code_challenge_methods_supported`，但该字段常被 OpenID providers 包含。MCP 客户端必须验证 provider 元数据响应中 `code_challenge_methods_supported` 的存在。如果该字段缺失，MCP 客户端必须拒绝继续。

提供 OpenID Connect 发现 1.0 的授权服务端必须在其元数据中包含 `code_challenge_methods_supported`，以确保 MCP 兼容性。

#### 10.2.5 混淆攻击

控制 MCP 客户端所交互的某个授权服务端的攻击者，可能会尝试让客户端向其发送由另一个诚实的授权服务端颁发的授权码或令牌（mix-up 攻击，详见 RFC9207 节 1）。授权响应 Validation 规定了所需的缓解措施。

#### 10.2.6 开放重定向

攻击者可能构造恶意的 回调 URI（redirect_uri），将用户引导到钓鱼网站。

MCP 客户端必须将 回调 URI（redirect_uri） 注册到授权服务端。

授权服务端必须精确验证 回调 URI（redirect_uri） 与预注册值，以防止重定向攻击。

MCP 客户端应当在授权码流程中使用并验证状态参数，并丢弃任何不包含状态或与原始状态不匹配的结果。

授权服务端必须采取预防措施以防止将用户代理 重定向到不受信任的 URI，遵循 OAuth 2.1 节 7.12.2 中阐述的建议。

授权服务端应当仅在信任该回调 URI 时才自动重定向用户代理。如果该 URI 不受信任，授权服务端可以通知用户并依赖用户做出正确决策。

#### 10.2.7 客户端 ID 元数据文档安全

在实现客户端 ID 元数据文档时，授权服务端必须考虑 OAuth 客户端 ID 元数据文档 第 6 节中详述的安全影响。关键考虑包括：

##### 10.2.7.1 授权服务器滥用防护

获取元数据文档的授权服务端应当考虑服务器端请求伪造（SSRF） 风险，如 OAuth 客户端 ID 元数据文档: 服务器端请求伪造（SSRF）攻击 所述。

##### 10.2.7.2 本地主机重定向 URI 风险

客户端 ID 元数据文档本身无法防止 `localhost` URL 假冒。

授权服务端：

- **应当** 对仅 `localhost` 的 回调 URI（redirect_uri） 显示额外的警告
- **可以** 要求额外的 attestation 机制以增强安全性
- **必须** 在授权期间清晰地显示 redirect URI 主机名

##### 10.2.7.3 信任策略

授权服务端可以实现基于域名的信任策略以接受客户端 ID 元数据文档，如客户端 ID 元数据文档 规范中的节 6.4 和节 6.8 所述。

#### 10.2.8 混淆代理问题

攻击者可以利用充当第三方 API 中间人的 MCP 服务端，导致混淆代理漏洞。通过使用被盗的授权码，他们可以在未经用户同意的情况下获取访问令牌。

使用静态客户端标识符的 MCP 代理服务端必须在转发到第三方授权服务端（可能需要额外的同意）之前，为每个动态登记的客户端获取用户同意。

#### 10.2.9 访问令牌权限限制

如果服务端接受为其他资源颁发的令牌，攻击者可能获得对 MCP 服务端的未授权访问或以其他方式危害 MCP 服务端。

MCP 服务端必须在处理请求之前验证访问令牌，确保访问令牌是专门为 MCP 服务端颁发的，并采取一切必要措施确保不会向未授权方返回数据。

A MCP 服务端必须遵循 OAuth 2.1 - 节 5.2 中的指南来验证入站令牌。

MCP 服务端必须仅接受专门为它们自身颁发的令牌，并且必须拒绝那些未在 audience claim 中包含它们或以其他方式无法验证它们是该令牌预期接收者的令牌。详见安全 Best Practices 令牌 Passthrough 一节。

如果 MCP 服务端向上游 APIs 发起请求，则它可以作为 OAuth 客户端访问它们。在上游 API 处使用的访问令牌是由上游授权服务端颁发的单独令牌。MCP 服务端不得透传从 MCP 客户端处接收到的令牌。

MCP 客户端必须按照 RFC 8707 - OAuth 2.0 资源指示符中所定义实现并使用 `resource` 参数，以显式指定为之请求令牌的目标资源。该要求与 RFC 9728 节 7.4 中的建议一致。这确保访问令牌被绑定到其预期的资源上，并且无法在不同的服务之间被滥用。

### 10.3 元数据与授权网址的安全边界

对外部元数据地址实施网络目标校验，拒绝自动访问私网、回环或链路本地目标。只接受实现允许的安全网址方案，将网址交给受控浏览器处理。

**拒绝指向内部服务的元数据地址**

```mermaid
sequenceDiagram
    participant Client as 客户端 (Client)
    participant MCP as 不可信 MCP 服务器
    participant Internal as 内部服务
    Client->>MCP: 连接 MCP 服务器
    MCP-->>Client: HTTP 401 提供指向内部地址的资源元数据字段（resource_metadata）
    Note over Client: 示意有缺陷的客户端未经校验就访问该地址
    Client->>Internal: 向内部服务发出请求
    Internal-->>Client: 内部服务返回敏感数据
    Note over Client: 错误或响应信息可能泄露
    Client->>MCP: 在后续请求中泄露错误详情
```

**授权网址校验与本地代理边界**

```mermaid
sequenceDiagram
    participant MaliciousMCP as 不可信 MCP 服务器
    participant Client as 客户端 (Client)
    participant Proxy as MCP 代理
    participant System as 本机系统
    MaliciousMCP->>Client: 收到不安全的授权网址
    Client->>Client: 示意有缺陷的客户端把网址作为代码处理
    Client->>Client: 代理身份凭据被滥用
    Client->>Proxy: 向代理发送未授权操作请求
    Note over Client,Proxy: 代理误信该凭据
    Proxy->>System: 在本地以代理权限执行操作
    System-->>Proxy: 本机返回操作结果
    Proxy-->>Client: 代理回传结果
    Client-->>MaliciousMCP: 数据可能泄露或本地状态可能受影响
```

### 10.4 将令牌验证落实到资源服务

下面两个完整服务只提供 whoami，返回已验证主体。配置 AUTH_ISSUER、MCP_PUBLIC_URL 与 AUTH_PUBLIC_KEY_FILE；对外资源及颁发者使用已核实的 HTTPS 地址，公钥来自可信登记。Python 安装 PyJWT[crypto]==2.15.1，TypeScript 另安装 jose==6.1.0。运行本地监听后，由已配置的 HTTPS 代理转发 /mcp；示例不自动部署，也不签发令牌。

#### 10.4.1 Python

```python
import os
from pathlib import Path
import jwt
from pydantic import BaseModel
from mcp.server import MCPServer
from mcp.server.auth.provider import AccessToken
from mcp.server.auth.settings import AuthSettings
from mcp.server.auth.middleware.auth_context import get_access_token

ISSUER = os.environ['AUTH_ISSUER']
RESOURCE = os.environ['MCP_PUBLIC_URL']
PUBLIC_KEY = Path(os.environ['AUTH_PUBLIC_KEY_FILE']).read_text(encoding='utf-8')
if not ISSUER.startswith('https://') or not RESOURCE.startswith('https://'):
    raise ValueError('授权颁发者和对外资源地址必须使用 HTTPS')

class Verifier:
    async def verify_token(self, token: str) -> AccessToken | None:
        try:
            claims = jwt.decode(token, PUBLIC_KEY, algorithms=['RS256'], issuer=ISSUER, audience=RESOURCE,
                options={'require': ['exp', 'iss', 'sub', 'aud']})
            scopes = claims.get('scope', '')
            if not isinstance(scopes, str) or not isinstance(claims['sub'], str): return None
            return AccessToken(token=token, client_id=claims.get('client_id', claims['sub']),
                subject=claims['sub'], expires_at=int(claims['exp']), resource=RESOURCE,
                scopes=scopes.split(), claims=claims)
        except (jwt.InvalidTokenError, ValueError, TypeError):
            return None

mcp = MCPServer('ProtectedNotes', token_verifier=Verifier(), auth=AuthSettings(
    issuer_url=ISSUER, resource_server_url=RESOURCE, required_scopes=['notes:read'],
    validate_token_resource=True))

class IdentityView(BaseModel):
    subject: str | None
    text: str

@mcp.tool(structured_output=True)
def whoami() -> IdentityView:
    """只返回已验证主体，不返回原始令牌。"""
    token = get_access_token()
    if token is None: raise RuntimeError('缺少已验证主体')
    return IdentityView(subject=token.subject, text='已通过身份与范围检查。')

if __name__ == '__main__':
    mcp.run(transport='streamable-http', host='127.0.0.1', port=int(os.environ.get('PORT', '8777')))
```

#### 10.4.2 TypeScript

```typescript
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { importSPKI, jwtVerify } from 'jose'
import { McpServer, createMcpHandler } from '@modelcontextprotocol/server'
import {
  toNodeHandler,
  localhostHostValidation,
  localhostOriginValidation,
} from '@modelcontextprotocol/node'
import * as z from 'zod/v4'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`缺少 ${name}`)
  return value
}
const issuer = required('AUTH_ISSUER')
const resource = required('MCP_PUBLIC_URL')
if (new URL(issuer).protocol !== 'https:' || new URL(resource).protocol !== 'https:')
  throw new Error('对外地址必须使用 HTTPS')
const key = await importSPKI(await readFile(required('AUTH_PUBLIC_KEY_FILE'), 'utf8'), 'RS256')
const metadataUrl = new URL('/.well-known/oauth-protected-resource', resource).href
const hostOK = localhostHostValidation()
const originOK = localhostOriginValidation()
const http = createServer(async (req, res) => {
  if (!hostOK(req, res) || !originOK(req, res)) return
  if (req.url === '/.well-known/oauth-protected-resource') {
    res.writeHead(200, { 'content-type': 'application/json' }).end(
      JSON.stringify({
        resource,
        authorization_servers: [issuer],
        scopes_supported: ['notes:read'],
      }),
    )
    return
  }
  if (req.url !== '/mcp') {
    res.writeHead(404).end()
    return
  }
  const challenge = `Bearer resource_metadata="${metadataUrl}"`
  const match = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!match) {
    res.writeHead(401, { 'WWW-Authenticate': challenge }).end()
    return
  }
  let subject: string
  try {
    const verified = await jwtVerify(match[1], key, {
      algorithms: ['RS256'],
      issuer,
      audience: resource,
      requiredClaims: ['exp', 'iss', 'sub', 'aud'],
    })
    if (typeof verified.payload.sub !== 'string') throw new Error('缺少主体')
    const scopes =
      typeof verified.payload.scope === 'string' ? verified.payload.scope.split(' ') : []
    if (!scopes.includes('notes:read')) {
      res
        .writeHead(403, {
          'WWW-Authenticate': challenge + ', error="insufficient_scope", scope="notes:read"',
        })
        .end()
      return
    }
    subject = verified.payload.sub
  } catch {
    res.writeHead(401, { 'WWW-Authenticate': challenge + ', error="invalid_token"' }).end()
    return
  }
  // 每次请求只闭包绑定本次已验证的主体，不用全局变量在并发用户间传身份。
  const handler = createMcpHandler(() => {
    const server = new McpServer({ name: 'ProtectedNotes', version: '1.0.0' })
    server.registerTool(
      'whoami',
      { description: '只返回已验证主体，不返回原始令牌。', inputSchema: z.object({}) },
      async () => ({
        content: [{ type: 'text', text: '已通过身份与范围检查。' }],
        structuredContent: { subject, text: '已通过身份与范围检查。' },
      }),
    )
    return server
  })
  try {
    await toNodeHandler(handler)(req, res)
  } finally {
    await handler.close()
  }
})
http.listen(Number(process.env.PORT ?? 8778), '127.0.0.1')
```

检查无令牌、错签名、错受众、过期、范围不足和正确令牌，分别观察401、403与正常结果。固定公钥版本便于复核，生产轮换应使用受控的密钥分发与缓存；不能按 JWT 自带任意URL获取密钥。示例不存私有记录，接入实际数据后还要按已验证主体逐记录授权。

**可观察结果**：没有合法身份时是401，合法身份缺少 notes:read 时是403；合法且有范围时得到本次已验证主体。两个主体的连续请求不应互相串用身份。

### 10.5 练习、答案与使用边界

**练习**：令牌签名正确但受众不同能否接受？工具内容、图标和元数据各需要什么信任边界？

**参考答案**：签名正确但受众不匹配的令牌必须拒绝。工具返回的文本按不可信内容处理，图标按安全地址和媒体类型策略校验，授权元数据要校验来源、网络目标和签发方。

**操作检查**：对照正确令牌、错误受众、过期令牌和另一主体的资源；只有第一种且有业务权限时允许访问。

**速查**：有效 OAuth 流程并不自动消除滥用；检查主体、受众、回调、元数据、网络和业务授权的整条链路。

## 第11章 核心方法、字段与类型索引

本章按能力归类数据结构。字段的类型约束保留协议标识符，以中文解释含义；这些是消息对象的参考，不是可执行服务端程序。方法如何调用、失败时怎样处理，已在对应教学章展开。

字段名后的 `?` 表示可省略；`[]` 表示数组；对象中的成员不能仅凭名称猜用途。结果类型的宽字符串写法允许协议扩展，使用本册核心方法时仍必须按 complete/input_required 的实际分支处理。

### 11.1 消息信封

本组对象用于消息信封。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.1.1 错误响应信封 JSONRPCErrorResponse

该对象表示错误响应信封。

| 字段与类型       | 中文含义与约束                                                           |
| :--------------- | :----------------------------------------------------------------------- |
| `jsonrpc: "2.0"` | 消息协议常量，值为 "2.0"。                                               |
| `id?: RequestId` | 请求标识有效时回显，用于关联错误；无法确定有效请求标识时可以省略。       |
| `error: Error`   | 错误对象，包含数字错误码和消息，必要时含 data；不是工具的 isError 标记。 |

#### 11.1.2 消息信封联合类型 JSONRPCMessage

该对象表示消息信封联合类型。

取值或分支：`JSONRPCRequest | JSONRPCNotification | JSONRPCResponse`。

#### 11.1.3 通知信封 JSONRPCNotification

该对象表示通知信封。

| 字段与类型                        | 中文含义与约束                                     |
| :-------------------------------- | :------------------------------------------------- |
| `method: string`                  | 方法或通知名，必须匹配该类型给出的字面量。         |
| `params?: { [key: string]: any }` | 通知参数；需要的关联元数据按该通知类型的规则提供。 |
| `jsonrpc: "2.0"`                  | 消息协议常量，值为 "2.0"。                         |

#### 11.1.4 请求信封 JSONRPCRequest

该对象表示请求信封。

| 字段与类型                        | 中文含义与约束                                           |
| :-------------------------------- | :------------------------------------------------------- |
| `method: string`                  | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params?: { [key: string]: any }` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |
| `jsonrpc: "2.0"`                  | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                   | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |

#### 11.1.5 响应信封联合类型 JSONRPCResponse

该对象表示响应信封联合类型。

取值或分支：`JSONRPCResultResponse | JSONRPCErrorResponse`。

#### 11.1.6 成功响应信封 JSONRPCResultResponse

该对象表示成功响应信封。

| 字段与类型       | 中文含义与约束                                                                      |
| :--------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"` | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: Result` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

### 11.2 通用值与元数据

本组对象用于通用值与元数据。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.2.1 显示与用途注解 Annotations

该对象表示显示与用途注解。

| 字段与类型              | 中文含义与约束                                              |
| :---------------------- | :---------------------------------------------------------- |
| `audience?: Role[]`     | 内容建议提供给哪些角色，不是授权受众。                      |
| `priority?: number`     | 内容展示或选择优先级，数值在0—1之间；不构成必须展示的保证。 |
| `lastModified?: string` | ISO 8601 格式的最后修改时间，供显示与新鲜度判断。           |

#### 11.2.2 分页游标 Cursor

该对象表示分页游标。

取值或分支：`string`。

#### 11.2.3 空结果 EmptyResult

该对象表示空结果。

取值或分支：`Result`。

#### 11.2.4 图标描述 Icon

该对象表示图标描述。

| 字段与类型                  | 中文含义与约束                                                 |
| :-------------------------- | :------------------------------------------------------------- |
| `src: string`               | 图标来源 URI；按图标安全要求允许 HTTPS 或 data，并检查重定向。 |
| `mimeType?: string`         | 内容媒体类型的提示；渲染前仍应检查实际内容。                   |
| `sizes?: string[]`          | 图标适用尺寸字符串数组，例如 48x48 或 any。                    |
| `theme?: "light" \| "dark"` | 图标适合的背景主题，使用 light 或 dark。                       |

#### 11.2.5 多轮续接参数 InputResponseRequestParams

该对象表示多轮续接参数。

| 字段与类型                        | 中文含义与约束                                                                             |
| :-------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta: RequestMetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `inputResponses?: InputResponses` | 以相同问题 ID 关联的输入响应。                                                             |
| `requestState?: string`           | 服务端生成的不透明状态；客户端原样回显，服务端按安全要求验证完整性、主体、期限和请求绑定。 |

#### 11.2.6 JSON 数组 JSONArray

该对象表示JSON 数组。

取值或分支：`JSONValue[]`。

#### 11.2.7 JSON 对象 JSONObject

该对象表示JSON 对象。

取值或分支：`{ [key: string]: JSONValue }`。

#### 11.2.8 JSON 值 JSONValue

该对象表示JSON 值。

取值或分支：`string | number | boolean | null | JSONObject | JSONArray`。

#### 11.2.9 通用元数据 MetaObject

该对象表示通用元数据。

取值或分支：`Record<string, unknown>`。

#### 11.2.10 通知元数据 NotificationMetaObject

该对象表示通知元数据。

| 字段与类型                                             | 中文含义与约束                                                       |
| :----------------------------------------------------- | :------------------------------------------------------------------- |
| `"io.modelcontextprotocol/subscriptionId"?: RequestId` | 将通知关联到已确认的订阅，适用时必需。                               |
| `[key: string]: unknown`                               | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。 |

#### 11.2.11 通知参数 NotificationParams

该对象表示通知参数。

| 字段与类型                       | 中文含义与约束                                                       |
| :------------------------------- | :------------------------------------------------------------------- |
| `_meta?: NotificationMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

#### 11.2.12 分页请求参数 PaginatedRequestParams

该对象表示分页请求参数。

| 字段与类型                 | 中文含义与约束                                                       |
| :------------------------- | :------------------------------------------------------------------- |
| `_meta: RequestMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `cursor?: string`          | 从上一页取得的不透明游标，原样回传。                                 |

#### 11.2.13 进度令牌 ProgressToken

该对象表示进度令牌。

取值或分支：`string | number`。

#### 11.2.14 请求标识 RequestId

该对象表示请求标识。

取值或分支：`string | number`。

#### 11.2.15 请求元数据 RequestMetaObject

该对象表示请求元数据。

| 字段与类型                                                         | 中文含义与约束                                                       |
| :----------------------------------------------------------------- | :------------------------------------------------------------------- |
| `progressToken?: ProgressToken`                                    | 关联进度的字符串或数字令牌。                                         |
| `"io.modelcontextprotocol/protocolVersion": string`                | 本次请求协议版本，必需。                                             |
| `"io.modelcontextprotocol/clientInfo"?: Implementation`            | 客户端自报实现信息，通常应包含，不作身份验证。                       |
| `"io.modelcontextprotocol/clientCapabilities": ClientCapabilities` | 本次客户端能力，必需。                                               |
| `[key: string]: unknown`                                           | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。 |

#### 11.2.16 通用请求参数 RequestParams

该对象表示通用请求参数。

| 字段与类型                 | 中文含义与约束                                                       |
| :------------------------- | :------------------------------------------------------------------- |
| `_meta: RequestMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

#### 11.2.17 通用结果 Result

该对象表示通用结果。

| 字段与类型                 | 中文含义与约束                                                                             |
| :------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`       | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `[key: string]: unknown`   | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.2.18 结果元数据 ResultMetaObject

该对象表示结果元数据。

| 字段与类型                                              | 中文含义与约束                                                       |
| :------------------------------------------------------ | :------------------------------------------------------------------- |
| `"io.modelcontextprotocol/serverInfo"?: Implementation` | 服务端自报实现信息，通常应包含，不作身份验证。                       |
| `[key: string]: unknown`                                | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。 |

#### 11.2.19 结果分支标记 ResultType

该对象表示结果分支标记。

取值或分支：`"complete" | "input_required" | string`。

#### 11.2.20 消息角色 Role

该对象表示消息角色。

取值或分支：`"user" | "assistant"`。

### 11.3 错误对象与错误码

本组对象用于错误对象与错误码。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.3.1 通用错误 Error

该对象表示通用错误。

| 字段与类型        | 中文含义与约束                                                        |
| :---------------- | :-------------------------------------------------------------------- |
| `code: number`    | 错误码；标准错误与 MCP 指定错误码有固定含义，业务失败不能任意冒用。   |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。      |
| `data?: unknown`  | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |

#### 11.3.2 标头不匹配错误码 HEADER_MISMATCH

该对象表示标头不匹配错误码。

取值或分支：`-32020`。

#### 11.3.3 HTTP 标头不匹配 HeaderMismatchError

该对象表示HTTP 标头不匹配。

| 字段与类型                        | 中文含义与约束                                                           |
| :-------------------------------- | :----------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                  | 消息协议常量，值为 "2.0"。                                               |
| `id?: RequestId`                  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                 |
| `error: Error & { code: -32020 }` | 错误对象，包含数字错误码和消息，必要时含 data；不是工具的 isError 标记。 |

#### 11.3.4 内部错误 InternalError

该对象表示内部错误。

| 字段与类型        | 中文含义与约束                                                        |
| :---------------- | :-------------------------------------------------------------------- |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。      |
| `data?: unknown`  | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `code: -32603`    | 错误码；标准错误与 MCP 指定错误码有固定含义，业务失败不能任意冒用。   |

#### 11.3.5 无效参数 InvalidParamsError

该对象表示无效参数。

| 字段与类型        | 中文含义与约束                                                        |
| :---------------- | :-------------------------------------------------------------------- |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。      |
| `data?: unknown`  | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `code: -32602`    | 错误码；标准错误与 MCP 指定错误码有固定含义，业务失败不能任意冒用。   |

#### 11.3.6 无效请求 InvalidRequestError

该对象表示无效请求。

| 字段与类型        | 中文含义与约束                                                        |
| :---------------- | :-------------------------------------------------------------------- |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。      |
| `data?: unknown`  | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `code: -32600`    | 错误码；标准错误与 MCP 指定错误码有固定含义，业务失败不能任意冒用。   |

#### 11.3.7 未知方法 MethodNotFoundError

该对象表示未知方法。

| 字段与类型        | 中文含义与约束                                                        |
| :---------------- | :-------------------------------------------------------------------- |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。      |
| `data?: unknown`  | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `code: -32601`    | 错误码；标准错误与 MCP 指定错误码有固定含义，业务失败不能任意冒用。   |

#### 11.3.8 缺少能力错误码 MISSING_REQUIRED_CLIENT_CAPABILITY

该对象表示缺少能力错误码。

取值或分支：`-32021`。

#### 11.3.9 缺少客户端能力 MissingRequiredClientCapabilityError

该对象表示缺少客户端能力。

| 字段与类型                                                                             | 中文含义与约束                                                           |
| :------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                                                                       | 消息协议常量，值为 "2.0"。                                               |
| `id?: RequestId`                                                                       | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                 |
| `error: Error & { code: -32021; data: { requiredCapabilities: ClientCapabilities }; }` | 错误对象，包含数字错误码和消息，必要时含 data；不是工具的 isError 标记。 |

#### 11.3.10 JSON 解析错误 ParseError

该对象表示JSON 解析错误。

| 字段与类型        | 中文含义与约束                                                        |
| :---------------- | :-------------------------------------------------------------------- |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。      |
| `data?: unknown`  | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `code: -32700`    | 错误码；标准错误与 MCP 指定错误码有固定含义，业务失败不能任意冒用。   |

#### 11.3.11 版本不支持错误码 UNSUPPORTED_PROTOCOL_VERSION

该对象表示版本不支持错误码。

取值或分支：`-32022`。

#### 11.3.12 协议版本不支持 UnsupportedProtocolVersionError

该对象表示协议版本不支持。

| 字段与类型                                                                           | 中文含义与约束                                                           |
| :----------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                                                                     | 消息协议常量，值为 "2.0"。                                               |
| `id?: RequestId`                                                                     | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                 |
| `error: Error & { code: -32022; data: { supported: string[]; requested: string }; }` | 错误对象，包含数字错误码和消息，必要时含 data；不是工具的 isError 标记。 |

### 11.4 内容块与资源正文

本组对象用于内容块与资源正文。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.4.1 音频内容 AudioContent

该对象表示音频内容。

| 字段与类型                  | 中文含义与约束                                                        |
| :-------------------------- | :-------------------------------------------------------------------- |
| `type: "audio"`             | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。            |
| `data: string`              | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `mimeType: string`          | 内容媒体类型的提示；渲染前仍应检查实际内容。                          |
| `annotations?: Annotations` | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。          |
| `_meta?: MetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。  |

#### 11.4.2 二进制资源正文 BlobResourceContents

该对象表示二进制资源正文。

| 字段与类型           | 中文含义与约束                                                       |
| :------------------- | :------------------------------------------------------------------- |
| `uri: string`        | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。           |
| `mimeType?: string`  | 内容媒体类型的提示；渲染前仍应检查实际内容。                         |
| `_meta?: MetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `blob: string`       | 资源正文的 Base64 字节表示。                                         |

#### 11.4.3 内容块联合类型 ContentBlock

该对象表示内容块联合类型。

取值或分支：`| TextContent
  | ImageContent
  | AudioContent
  | ResourceLink
  | EmbeddedResource`。

#### 11.4.4 嵌入资源 EmbeddedResource

该对象表示嵌入资源。

| 字段与类型                                               | 中文含义与约束                                                       |
| :------------------------------------------------------- | :------------------------------------------------------------------- |
| `type: "resource"`                                       | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。           |
| `resource: TextResourceContents \| BlobResourceContents` | 嵌入的资源正文，包含自身 URI、媒体类型及文本或二进制数据。           |
| `annotations?: Annotations`                              | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。         |
| `_meta?: MetaObject`                                     | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

#### 11.4.5 图像内容 ImageContent

该对象表示图像内容。

| 字段与类型                  | 中文含义与约束                                                        |
| :-------------------------- | :-------------------------------------------------------------------- |
| `type: "image"`             | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。            |
| `data: string`              | 错误的结构化附加数据，或图像/音频的 Base64 数据；含义由所属对象决定。 |
| `mimeType: string`          | 内容媒体类型的提示；渲染前仍应检查实际内容。                          |
| `annotations?: Annotations` | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。          |
| `_meta?: MetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。  |

#### 11.4.6 资源链接 ResourceLink

该对象表示资源链接。

| 字段与类型                  | 中文含义与约束                                                       |
| :-------------------------- | :------------------------------------------------------------------- |
| `icons?: Icon[]`            | 图标数组；抓取前检查安全 scheme、同源、大小和 MIME，不带凭据获取。   |
| `name: string`              | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。               |
| `title?: string`            | 供界面显示的名称；可与程序名称不同。                                 |
| `uri: string`               | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。           |
| `description?: string`      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。   |
| `mimeType?: string`         | 内容媒体类型的提示；渲染前仍应检查实际内容。                         |
| `annotations?: Annotations` | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。         |
| `size?: number`             | 资源字节大小提示；实际读取仍需限制大小。                             |
| `_meta?: MetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `type: "resource_link"`     | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。           |

#### 11.4.7 文本内容 TextContent

该对象表示文本内容。

| 字段与类型                  | 中文含义与约束                                                       |
| :-------------------------- | :------------------------------------------------------------------- |
| `type: "text"`              | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。           |
| `text: string`              | 文本正文；进入模型上下文时仍保留来源与信任边界。                     |
| `annotations?: Annotations` | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。         |
| `_meta?: MetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

#### 11.4.8 文本资源正文 TextResourceContents

该对象表示文本资源正文。

| 字段与类型           | 中文含义与约束                                                       |
| :------------------- | :------------------------------------------------------------------- |
| `uri: string`        | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。           |
| `mimeType?: string`  | 内容媒体类型的提示；渲染前仍应检查实际内容。                         |
| `_meta?: MetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `text: string`       | 文本正文；进入模型上下文时仍保留来源与信任边界。                     |

### 11.5 参数补全

本组对象用于参数补全。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.5.1 参数补全请求对象 CompleteRequest

该对象表示参数补全请求对象。

| 字段与类型                      | 中文含义与约束                                           |
| :------------------------------ | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                 | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `method: "completion/complete"` | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params: CompleteRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |

#### 11.5.2 参数补全请求参数 CompleteRequestParams

该对象表示参数补全请求参数。

| 字段与类型                                            | 中文含义与约束                                                       |
| :---------------------------------------------------- | :------------------------------------------------------------------- |
| `_meta: RequestMetaObject`                            | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `ref: PromptReference \| ResourceTemplateReference`   | 所补全的模板引用。                                                   |
| `argument: { name: string; value: string }`           | 正在填写的参数及其当前值。                                           |
| `context?: { arguments?: { [key: string]: string } }` | 补全时已经知道的其他参数上下文。                                     |

#### 11.5.3 参数补全响应的允许结果分支 CompleteResultResponse

该对象表示参数补全响应的允许结果分支。

| 字段与类型               | 中文含义与约束                                                                      |
| :----------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`         | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`          | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: CompleteResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.5.4 参数补全完成结果 CompleteResult

该对象表示参数补全完成结果。

| 字段与类型                                                            | 中文含义与约束                                                                             |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`                                            | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                                                  | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `completion: { values: string[]; total?: number; hasMore?: boolean }` | 补全候选与分页提示。                                                                       |
| `[key: string]: unknown`                                              | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.5.5 提示模板补全引用 PromptReference

该对象表示提示模板补全引用。

| 字段与类型           | 中文含义与约束                                             |
| :------------------- | :--------------------------------------------------------- |
| `name: string`       | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。     |
| `title?: string`     | 供界面显示的名称；可与程序名称不同。                       |
| `type: "ref/prompt"` | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。 |

#### 11.5.6 资源模板补全引用 ResourceTemplateReference

该对象表示资源模板补全引用。

| 字段与类型             | 中文含义与约束                                             |
| :--------------------- | :--------------------------------------------------------- |
| `type: "ref/resource"` | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。 |
| `uri: string`          | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。 |

### 11.6 用户信息征询

本组对象用于用户信息征询。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.6.1 用户信息征询请求对象 ElicitRequest

该对象表示用户信息征询请求对象。

| 字段与类型                     | 中文含义与约束                                 |
| :----------------------------- | :--------------------------------------------- |
| `method: "elicitation/create"` | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params: ElicitRequestParams`  | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

#### 11.6.2 用户信息征询请求参数 ElicitRequestParams

该对象表示用户信息征询请求参数。

取值或分支：`ElicitRequestFormParams | ElicitRequestURLParams`。

#### 11.6.3 用户信息征询完成结果 ElicitResult

该对象表示用户信息征询完成结果。

| 字段与类型                                                             | 中文含义与约束                                                                  |
| :--------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `action: "accept" \| "decline" \| "cancel"`                            | 用户动作：accept、decline 或 cancel；不能自动解释为业务确认。                   |
| `content?: { [key: string]: string \| number \| boolean \| string[] }` | 文本/媒体/嵌入资源等内容，按 type 判断分支；提示消息的 content 是单个内容对象。 |

#### 11.6.4 布尔值约束 BooleanSchema

该对象表示布尔值约束。

| 字段与类型             | 中文含义与约束                                                     |
| :--------------------- | :----------------------------------------------------------------- |
| `type: "boolean"`      | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`       | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string` | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `default?: boolean`    | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

#### 11.6.5 表单征询参数 ElicitRequestFormParams

该对象表示表单征询参数。

| 字段与类型                                                                                                                              | 中文含义与约束                                                   |
| :-------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `mode?: "form"`                                                                                                                         | 征询方式，form 为表单、url 为外部网址。                          |
| `message: string`                                                                                                                       | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。 |
| `requestedSchema: { $schema?: string; type: "object"; properties: { [key: string]: PrimitiveSchemaDefinition }; required?: string[]; }` | 受限的扁平字段 Schema，用于生成用户表单。                        |

#### 11.6.6 网址征询参数 ElicitRequestURLParams

该对象表示网址征询参数。

| 字段与类型        | 中文含义与约束                                                   |
| :---------------- | :--------------------------------------------------------------- |
| `mode: "url"`     | 征询方式，form 为表单、url 为外部网址。                          |
| `message: string` | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。 |
| `url: string`     | 供用户访问的外部网址；按征询安全规则检查。                       |

#### 11.6.7 枚举约束联合类型 EnumSchema

该对象表示枚举约束联合类型。

取值或分支：`| SingleSelectEnumSchema
  | MultiSelectEnumSchema
 `。

#### 11.6.8 多选枚举约束 MultiSelectEnumSchema

该对象表示多选枚举约束。

取值或分支：`| UntitledMultiSelectEnumSchema
  | TitledMultiSelectEnumSchema`。

#### 11.6.9 数值约束 NumberSchema

该对象表示数值约束。

| 字段与类型                    | 中文含义与约束                                                     |
| :---------------------------- | :----------------------------------------------------------------- |
| `type: "number" \| "integer"` | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`              | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string`        | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `minimum?: number`            | 数值下界。                                                         |
| `maximum?: number`            | 数值上界。                                                         |
| `default?: number`            | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

#### 11.6.10 征询字段约束联合类型 PrimitiveSchemaDefinition

该对象表示征询字段约束联合类型。

取值或分支：`| StringSchema
  | NumberSchema
  | BooleanSchema
  | EnumSchema`。

#### 11.6.11 单选枚举约束 SingleSelectEnumSchema

该对象表示单选枚举约束。

取值或分支：`| UntitledSingleSelectEnumSchema
  | TitledSingleSelectEnumSchema`。

#### 11.6.12 字符串约束 StringSchema

该对象表示字符串约束。

| 字段与类型                                           | 中文含义与约束                                                     |
| :--------------------------------------------------- | :----------------------------------------------------------------- |
| `type: "string"`                                     | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`                                     | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string`                               | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `minLength?: number`                                 | 文本最短长度。                                                     |
| `maxLength?: number`                                 | 文本最长长度。                                                     |
| `format?: "uri" \| "email" \| "date" \| "date-time"` | 约定的字符串格式提示。                                             |
| `default?: string`                                   | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

#### 11.6.13 带显示标题的多选枚举 TitledMultiSelectEnumSchema

该对象表示带显示标题的多选枚举。

| 字段与类型                                             | 中文含义与约束                                                     |
| :----------------------------------------------------- | :----------------------------------------------------------------- |
| `type: "array"`                                        | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`                                       | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string`                                 | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `minItems?: number`                                    | 最少选择数。                                                       |
| `maxItems?: number`                                    | 最多选择数。                                                       |
| `items: { anyOf: { const: string; title: string }[] }` | 数组项目的 Schema。                                                |
| `default?: string[]`                                   | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

#### 11.6.14 带显示标题的单选枚举 TitledSingleSelectEnumSchema

该对象表示带显示标题的单选枚举。

| 字段与类型                                  | 中文含义与约束                                                     |
| :------------------------------------------ | :----------------------------------------------------------------- |
| `type: "string"`                            | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`                            | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string`                      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `oneOf: { const: string; title: string }[]` | 带独立 const/title 的单选分支。                                    |
| `default?: string`                          | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

#### 11.6.15 无显示标题的多选枚举 UntitledMultiSelectEnumSchema

该对象表示无显示标题的多选枚举。

| 字段与类型                                  | 中文含义与约束                                                     |
| :------------------------------------------ | :----------------------------------------------------------------- |
| `type: "array"`                             | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`                            | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string`                      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `minItems?: number`                         | 最少选择数。                                                       |
| `maxItems?: number`                         | 最多选择数。                                                       |
| `items: { type: "string"; enum: string[] }` | 数组项目的 Schema。                                                |
| `default?: string[]`                        | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

#### 11.6.16 无显示标题的单选枚举 UntitledSingleSelectEnumSchema

该对象表示无显示标题的单选枚举。

| 字段与类型             | 中文含义与约束                                                     |
| :--------------------- | :----------------------------------------------------------------- |
| `type: "string"`       | 对象分支或 Schema 类型的区分字段，不能只按其他字段猜类型。         |
| `title?: string`       | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string` | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `enum: string[]`       | 允许的值集合。                                                     |
| `default?: string`     | 建议默认值；是否自动填充取决于处理实现，不能假定校验器都会注入。   |

### 11.7 取消通知

本组对象用于取消通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.7.1 取消通知通知对象 CancelledNotification

该对象表示取消通知通知对象。

| 字段与类型                            | 中文含义与约束                                 |
| :------------------------------------ | :--------------------------------------------- |
| `jsonrpc: "2.0"`                      | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/cancelled"`   | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params: CancelledNotificationParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

#### 11.7.2 取消通知通知参数 CancelledNotificationParams

该对象表示取消通知通知参数。

| 字段与类型                       | 中文含义与约束                                                       |
| :------------------------------- | :------------------------------------------------------------------- |
| `_meta?: NotificationMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `requestId: RequestId`           | 要取消的活动请求 ID，不是进度令牌。                                  |
| `reason?: string`                | 取消的可选原因说明。                                                 |

### 11.8 进度通知

本组对象用于进度通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.8.1 进度通知通知对象 ProgressNotification

该对象表示进度通知通知对象。

| 字段与类型                           | 中文含义与约束                                 |
| :----------------------------------- | :--------------------------------------------- |
| `jsonrpc: "2.0"`                     | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/progress"`   | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params: ProgressNotificationParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

#### 11.8.2 进度通知通知参数 ProgressNotificationParams

该对象表示进度通知通知参数。

| 字段与类型                       | 中文含义与约束                                                       |
| :------------------------------- | :------------------------------------------------------------------- |
| `_meta?: NotificationMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `progressToken: ProgressToken`   | 关联进度的字符串或数字令牌。                                         |
| `progress: number`               | 当前进度数值；后续报告应递增，不能假设单位。                         |
| `total?: number`                 | 可选候选总数提示，不保证等于本次返回条数。                           |
| `message?: string`               | 面向使用者的说明；不要泄露密钥与内部堆栈。征询时应清楚说明目的。     |

### 11.9 提示目录变更通知

本组对象用于提示目录变更通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.9.1 提示目录变更通知通知对象 PromptListChangedNotification

该对象表示提示目录变更通知通知对象。

| 字段与类型                                     | 中文含义与约束                                 |
| :--------------------------------------------- | :--------------------------------------------- |
| `jsonrpc: "2.0"`                               | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/prompts/list_changed"` | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params?: NotificationParams`                  | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

### 11.10 资源目录变更通知

本组对象用于资源目录变更通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.10.1 资源目录变更通知通知对象 ResourceListChangedNotification

该对象表示资源目录变更通知通知对象。

| 字段与类型                                       | 中文含义与约束                                 |
| :----------------------------------------------- | :--------------------------------------------- |
| `jsonrpc: "2.0"`                                 | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/resources/list_changed"` | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params?: NotificationParams`                    | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

### 11.11 资源正文更新通知

本组对象用于资源正文更新通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.11.1 资源正文更新通知通知对象 ResourceUpdatedNotification

该对象表示资源正文更新通知通知对象。

| 字段与类型                                  | 中文含义与约束                                 |
| :------------------------------------------ | :--------------------------------------------- |
| `jsonrpc: "2.0"`                            | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/resources/updated"` | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params: ResourceUpdatedNotificationParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

#### 11.11.2 资源正文更新通知通知参数 ResourceUpdatedNotificationParams

该对象表示资源正文更新通知通知参数。

| 字段与类型                       | 中文含义与约束                                                       |
| :------------------------------- | :------------------------------------------------------------------- |
| `_meta?: NotificationMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `uri: string`                    | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。           |

### 11.12 订阅确认通知

本组对象用于订阅确认通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.12.1 订阅确认通知通知对象 SubscriptionsAcknowledgedNotification

该对象表示订阅确认通知通知对象。

| 字段与类型                                            | 中文含义与约束                                 |
| :---------------------------------------------------- | :--------------------------------------------- |
| `jsonrpc: "2.0"`                                      | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/subscriptions/acknowledged"`  | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params: SubscriptionsAcknowledgedNotificationParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

#### 11.12.2 订阅确认通知通知参数 SubscriptionsAcknowledgedNotificationParams

该对象表示订阅确认通知通知参数。

| 字段与类型                          | 中文含义与约束                                                       |
| :---------------------------------- | :------------------------------------------------------------------- |
| `_meta?: NotificationMetaObject`    | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `notifications: SubscriptionFilter` | 订阅或确认的通知过滤条件。                                           |

### 11.13 工具目录变更通知

本组对象用于工具目录变更通知。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.13.1 工具目录变更通知通知对象 ToolListChangedNotification

该对象表示工具目录变更通知通知对象。

| 字段与类型                                   | 中文含义与约束                                 |
| :------------------------------------------- | :--------------------------------------------- |
| `jsonrpc: "2.0"`                             | 消息协议常量，值为 "2.0"。                     |
| `method: "notifications/tools/list_changed"` | 方法或通知名，必须匹配该类型给出的字面量。     |
| `params?: NotificationParams`                | 该方法的参数；请求元数据在本对象的 \_meta 内。 |

### 11.14 多轮请求

本组对象用于多轮请求。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.14.1 待处理输入请求映射 InputRequests

该对象表示待处理输入请求映射。

取值或分支：`问题 ID 到 ElicitRequest 的映射（本册讲解的现行输入类型）`。

#### 11.14.2 需要补充输入的中间结果 InputRequiredResult

该对象表示需要补充输入的中间结果。

| 字段与类型                      | 中文含义与约束                                                                             |
| :------------------------------ | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`      | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`            | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `inputRequests?: InputRequests` | 问题 ID 到输入请求的映射；只使用客户端支持的交互类型。                                     |
| `requestState?: string`         | 服务端生成的不透明状态；客户端原样回显，服务端按安全要求验证完整性、主体、期限和请求绑定。 |
| `[key: string]: unknown`        | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.14.3 已取得输入响应映射 InputResponses

该对象表示已取得输入响应映射。

取值或分支：`问题 ID 到 ElicitResult 的映射（与 InputRequests 的键对应）`。

### 11.15 获取提示模板

本组对象用于获取提示模板。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.15.1 获取提示模板请求对象 GetPromptRequest

该对象表示获取提示模板请求对象。

| 字段与类型                       | 中文含义与约束                                           |
| :------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                 | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `method: "prompts/get"`          | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params: GetPromptRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |

#### 11.15.2 获取提示模板请求参数 GetPromptRequestParams

该对象表示获取提示模板请求参数。

| 字段与类型                              | 中文含义与约束                                                                             |
| :-------------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta: RequestMetaObject`              | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `inputResponses?: InputResponses`       | 以相同问题 ID 关联的输入响应。                                                             |
| `requestState?: string`                 | 服务端生成的不透明状态；客户端原样回显，服务端按安全要求验证完整性、主体、期限和请求绑定。 |
| `name: string`                          | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。                                     |
| `arguments?: { [key: string]: string }` | 工具的参数对象或提示模板的字符串参数映射；两种用途不能混用。                               |

#### 11.15.3 获取提示模板响应的允许结果分支 GetPromptResultResponse

该对象表示获取提示模板响应的允许结果分支。

| 字段与类型                                       | 中文含义与约束                                                                      |
| :----------------------------------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                                 | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`                                  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: InputRequiredResult \| GetPromptResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.15.4 获取提示模板完成结果 GetPromptResult

该对象表示获取提示模板完成结果。

| 字段与类型                  | 中文含义与约束                                                                             |
| :-------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`  | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`        | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `description?: string`      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。                         |
| `messages: PromptMessage[]` | 按顺序排列的带角色消息。                                                                   |
| `[key: string]: unknown`    | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.15.5 带角色的提示消息 PromptMessage

该对象表示带角色的提示消息。

| 字段与类型              | 中文含义与约束                                                                  |
| :---------------------- | :------------------------------------------------------------------------------ |
| `role: Role`            | 消息角色，核心内容使用 user/assistant。                                         |
| `content: ContentBlock` | 文本/媒体/嵌入资源等内容，按 type 判断分支；提示消息的 content 是单个内容对象。 |

### 11.16 提示模板目录

本组对象用于提示模板目录。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.16.1 提示模板目录请求对象 ListPromptsRequest

该对象表示提示模板目录请求对象。

| 字段与类型                       | 中文含义与约束                                           |
| :------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                 | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `params: PaginatedRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |
| `method: "prompts/list"`         | 方法或通知名，必须匹配该类型给出的字面量。               |

#### 11.16.2 提示模板目录响应的允许结果分支 ListPromptsResultResponse

该对象表示提示模板目录响应的允许结果分支。

| 字段与类型                  | 中文含义与约束                                                                      |
| :-------------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`            | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`             | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: ListPromptsResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.16.3 提示模板目录完成结果 ListPromptsResult

该对象表示提示模板目录完成结果。

| 字段与类型                          | 中文含义与约束                                                                             |
| :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`          | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `nextCursor?: string`               | 存在时表示可能还有下一页；不能用本页条数猜测是否结束。                                     |
| `ttlMs: number`                     | 缓存新鲜度的毫秒时长；不能跨越主体或越权复用。                                             |
| `cacheScope: "public" \| "private"` | public/private 的共享范围；与 TTL 一起约束复用。                                           |
| `prompts: Prompt[]`                 | 提示模板目录数组。                                                                         |
| `[key: string]: unknown`            | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.16.4 提示模板描述 Prompt

该对象表示提示模板描述。

| 字段与类型                     | 中文含义与约束                                                       |
| :----------------------------- | :------------------------------------------------------------------- |
| `icons?: Icon[]`               | 图标数组；抓取前检查安全 scheme、同源、大小和 MIME，不带凭据获取。   |
| `name: string`                 | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。               |
| `title?: string`               | 供界面显示的名称；可与程序名称不同。                                 |
| `description?: string`         | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。   |
| `arguments?: PromptArgument[]` | 工具的参数对象或提示模板的字符串参数映射；两种用途不能混用。         |
| `_meta?: MetaObject`           | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

#### 11.16.5 提示模板参数描述 PromptArgument

该对象表示提示模板参数描述。

| 字段与类型             | 中文含义与约束                                                     |
| :--------------------- | :----------------------------------------------------------------- |
| `name: string`         | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。             |
| `title?: string`       | 供界面显示的名称；可与程序名称不同。                               |
| `description?: string` | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `required?: boolean`   | 提示参数是否必填，或 Schema 的必填字段名数组；类型由所属对象决定。 |

### 11.17 资源目录

本组对象用于资源目录。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.17.1 资源目录请求对象 ListResourcesRequest

该对象表示资源目录请求对象。

| 字段与类型                       | 中文含义与约束                                           |
| :------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                 | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `params: PaginatedRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |
| `method: "resources/list"`       | 方法或通知名，必须匹配该类型给出的字面量。               |

#### 11.17.2 资源目录响应的允许结果分支 ListResourcesResultResponse

该对象表示资源目录响应的允许结果分支。

| 字段与类型                    | 中文含义与约束                                                                      |
| :---------------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`              | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`               | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: ListResourcesResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.17.3 资源目录完成结果 ListResourcesResult

该对象表示资源目录完成结果。

| 字段与类型                          | 中文含义与约束                                                                             |
| :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`          | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `nextCursor?: string`               | 存在时表示可能还有下一页；不能用本页条数猜测是否结束。                                     |
| `ttlMs: number`                     | 缓存新鲜度的毫秒时长；不能跨越主体或越权复用。                                             |
| `cacheScope: "public" \| "private"` | public/private 的共享范围；与 TTL 一起约束复用。                                           |
| `resources: Resource[]`             | 资源目录数组或相关能力设置。                                                               |
| `[key: string]: unknown`            | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.17.4 资源描述 Resource

该对象表示资源描述。

| 字段与类型                  | 中文含义与约束                                                       |
| :-------------------------- | :------------------------------------------------------------------- |
| `icons?: Icon[]`            | 图标数组；抓取前检查安全 scheme、同源、大小和 MIME，不带凭据获取。   |
| `name: string`              | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。               |
| `title?: string`            | 供界面显示的名称；可与程序名称不同。                                 |
| `uri: string`               | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。           |
| `description?: string`      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。   |
| `mimeType?: string`         | 内容媒体类型的提示；渲染前仍应检查实际内容。                         |
| `annotations?: Annotations` | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。         |
| `size?: number`             | 资源字节大小提示；实际读取仍需限制大小。                             |
| `_meta?: MetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

### 11.18 读取资源

本组对象用于读取资源。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.18.1 读取资源请求对象 ReadResourceRequest

该对象表示读取资源请求对象。

| 字段与类型                          | 中文含义与约束                                           |
| :---------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                    | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                     | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `method: "resources/read"`          | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params: ReadResourceRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |

#### 11.18.2 读取资源请求参数 ReadResourceRequestParams

该对象表示读取资源请求参数。

| 字段与类型                        | 中文含义与约束                                                                             |
| :-------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta: RequestMetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `inputResponses?: InputResponses` | 以相同问题 ID 关联的输入响应。                                                             |
| `requestState?: string`           | 服务端生成的不透明状态；客户端原样回显，服务端按安全要求验证完整性、主体、期限和请求绑定。 |
| `uri: string`                     | 资源标识符；不意味着客户端可自行解析成本地文件或网络请求。                                 |

#### 11.18.3 读取资源响应的允许结果分支 ReadResourceResultResponse

该对象表示读取资源响应的允许结果分支。

| 字段与类型                                          | 中文含义与约束                                                                      |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                                    | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`                                     | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: InputRequiredResult \| ReadResourceResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.18.4 读取资源完成结果 ReadResourceResult

该对象表示读取资源完成结果。

| 字段与类型                                                   | 中文含义与约束                                                                             |
| :----------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`                                   | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                                         | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `ttlMs: number`                                              | 缓存新鲜度的毫秒时长；不能跨越主体或越权复用。                                             |
| `cacheScope: "public" \| "private"`                          | public/private 的共享范围；与 TTL 一起约束复用。                                           |
| `contents: (TextResourceContents \| BlobResourceContents)[]` | 资源正文数组；每项带自身 URI，按 text/blob 与媒体类型解释。                                |
| `[key: string]: unknown`                                     | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

### 11.19 资源模板目录

本组对象用于资源模板目录。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.19.1 资源模板目录请求对象 ListResourceTemplatesRequest

该对象表示资源模板目录请求对象。

| 字段与类型                           | 中文含义与约束                                           |
| :----------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                     | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                      | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `params: PaginatedRequestParams`     | 该方法的参数；请求元数据在本对象的 \_meta 内。           |
| `method: "resources/templates/list"` | 方法或通知名，必须匹配该类型给出的字面量。               |

#### 11.19.2 资源模板目录响应的允许结果分支 ListResourceTemplatesResultResponse

该对象表示资源模板目录响应的允许结果分支。

| 字段与类型                            | 中文含义与约束                                                                      |
| :------------------------------------ | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                      | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`                       | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: ListResourceTemplatesResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.19.3 资源模板目录完成结果 ListResourceTemplatesResult

该对象表示资源模板目录完成结果。

| 字段与类型                              | 中文含义与约束                                                                             |
| :-------------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`              | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                    | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `nextCursor?: string`                   | 存在时表示可能还有下一页；不能用本页条数猜测是否结束。                                     |
| `ttlMs: number`                         | 缓存新鲜度的毫秒时长；不能跨越主体或越权复用。                                             |
| `cacheScope: "public" \| "private"`     | public/private 的共享范围；与 TTL 一起约束复用。                                           |
| `resourceTemplates: ResourceTemplate[]` | 可实例化的资源模板描述数组。                                                               |
| `[key: string]: unknown`                | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.19.4 资源模板描述 ResourceTemplate

该对象表示资源模板描述。

| 字段与类型                  | 中文含义与约束                                                       |
| :-------------------------- | :------------------------------------------------------------------- |
| `icons?: Icon[]`            | 图标数组；抓取前检查安全 scheme、同源、大小和 MIME，不带凭据获取。   |
| `name: string`              | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。               |
| `title?: string`            | 供界面显示的名称；可与程序名称不同。                                 |
| `uriTemplate: string`       | 资源 URI 模板，使用 URI 模板展开规则而不是随意字符串拼接。           |
| `description?: string`      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。   |
| `mimeType?: string`         | 内容媒体类型的提示；渲染前仍应检查实际内容。                         |
| `annotations?: Annotations` | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。         |
| `_meta?: MetaObject`        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |

### 11.20 服务发现

本组对象用于服务发现。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.20.1 服务发现请求对象 DiscoverRequest

该对象表示服务发现请求对象。

| 字段与类型                  | 中文含义与约束                                           |
| :-------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`            | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`             | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `method: "server/discover"` | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params: RequestParams`     | 该方法的参数；请求元数据在本对象的 \_meta 内。           |

#### 11.20.2 服务发现响应的允许结果分支 DiscoverResultResponse

该对象表示服务发现响应的允许结果分支。

| 字段与类型               | 中文含义与约束                                                                      |
| :----------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`         | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`          | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: DiscoverResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.20.3 服务发现完成结果 DiscoverResult

该对象表示服务发现完成结果。

| 字段与类型                          | 中文含义与约束                                                                             |
| :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`          | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `supportedVersions: string[]`       | 发现结果中的服务端支持版本列表；不是应用版本。                                             |
| `capabilities: ServerCapabilities`  | 本次声明的协议功能及其设置。                                                               |
| `instructions?: string`             | 服务端供主应用参考的使用说明；不是更高优先级的执行授权。                                   |
| `ttlMs: number`                     | 缓存新鲜度的毫秒时长；不能跨越主体或越权复用。                                             |
| `cacheScope: "public" \| "private"` | public/private 的共享范围；与 TTL 一起约束复用。                                           |
| `[key: string]: unknown`            | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.20.4 客户端能力 ClientCapabilities

该对象表示客户端能力。

| 字段与类型                                              | 中文含义与约束                                           |
| :------------------------------------------------------ | :------------------------------------------------------- |
| `experimental?: { [key: string]: JSONObject }`          | 实现声明的非标准能力命名空间；存在不表示另一端支持。     |
| `elicitation?: { form?: JSONObject; url?: JSONObject }` | 客户端支持的表单/网址征询模式。                          |
| `extensions?: { [key: string]: JSONObject }`            | 扩展标识符到设置对象的映射；双方支持并选择使用后才启用。 |

#### 11.20.5 实现信息 Implementation

该对象表示实现信息。

| 字段与类型             | 中文含义与约束                                                     |
| :--------------------- | :----------------------------------------------------------------- |
| `icons?: Icon[]`       | 图标数组；抓取前检查安全 scheme、同源、大小和 MIME，不带凭据获取。 |
| `name: string`         | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。             |
| `title?: string`       | 供界面显示的名称；可与程序名称不同。                               |
| `version: string`      | 实现自己的版本号；不要当作协议日期。                               |
| `description?: string` | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。 |
| `websiteUrl?: string`  | 实现声明的网站地址，属于不可信外部元数据。                         |

#### 11.20.6 服务端能力 ServerCapabilities

该对象表示服务端能力。

| 字段与类型                                                   | 中文含义与约束                                           |
| :----------------------------------------------------------- | :------------------------------------------------------- |
| `experimental?: { [key: string]: JSONObject }`               | 实现声明的非标准能力命名空间；存在不表示另一端支持。     |
| `completions?: JSONObject`                                   | 服务端支持参数补全的声明。                               |
| `prompts?: { listChanged?: boolean }`                        | 提示模板目录数组。                                       |
| `resources?: { subscribe?: boolean; listChanged?: boolean }` | 资源目录数组或相关能力设置。                             |
| `tools?: { listChanged?: boolean }`                          | 工具目录数组或相关能力设置，按所属对象区分。             |
| `extensions?: { [key: string]: JSONObject }`                 | 扩展标识符到设置对象的映射；双方支持并选择使用后才启用。 |

### 11.21 订阅通知流

本组对象用于订阅通知流。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.21.1 订阅通知流请求对象 SubscriptionsListenRequest

该对象表示订阅通知流请求对象。

| 字段与类型                                 | 中文含义与约束                                           |
| :----------------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                           | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                            | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `method: "subscriptions/listen"`           | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params: SubscriptionsListenRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |

#### 11.21.2 订阅通知流请求参数 SubscriptionsListenRequestParams

该对象表示订阅通知流请求参数。

| 字段与类型                          | 中文含义与约束                                                       |
| :---------------------------------- | :------------------------------------------------------------------- |
| `_meta: RequestMetaObject`          | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。 |
| `notifications: SubscriptionFilter` | 订阅或确认的通知过滤条件。                                           |

#### 11.21.3 订阅通知流响应的允许结果分支 SubscriptionsListenResultResponse

该对象表示订阅通知流响应的允许结果分支。

| 字段与类型                          | 中文含义与约束                                                                      |
| :---------------------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                    | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`                     | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: SubscriptionsListenResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.21.4 订阅通知流完成结果 SubscriptionsListenResult

该对象表示订阅通知流完成结果。

| 字段与类型                                   | 中文含义与约束                                                                             |
| :------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `resultType: string`                         | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `_meta: SubscriptionsListenResultMetaObject` | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `[key: string]: unknown`                     | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.21.5 通知过滤器 SubscriptionFilter

该对象表示通知过滤器。

| 字段与类型                         | 中文含义与约束                                      |
| :--------------------------------- | :-------------------------------------------------- |
| `toolsListChanged?: boolean`       | 是否订阅或确认工具目录变更通知。                    |
| `promptsListChanged?: boolean`     | 是否订阅或确认提示模板目录变更通知。                |
| `resourcesListChanged?: boolean`   | 是否订阅或确认资源目录变更通知。                    |
| `resourceSubscriptions?: string[]` | 所关注的资源 URI 集合；确认结果决定实际接收的更新。 |

#### 11.21.6 通知流结果元数据 SubscriptionsListenResultMetaObject

该对象表示通知流结果元数据。

| 字段与类型                                              | 中文含义与约束                                                       |
| :------------------------------------------------------ | :------------------------------------------------------------------- |
| `"io.modelcontextprotocol/serverInfo"?: Implementation` | 服务端自报实现信息，通常应包含，不作身份验证。                       |
| `"io.modelcontextprotocol/subscriptionId": RequestId`   | 将通知关联到已确认的订阅，适用时必需。                               |
| `[key: string]: unknown`                                | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。 |

### 11.22 工具调用

本组对象用于工具调用。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.22.1 工具调用请求对象 CallToolRequest

该对象表示工具调用请求对象。

| 字段与类型                      | 中文含义与约束                                           |
| :------------------------------ | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                 | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `method: "tools/call"`          | 方法或通知名，必须匹配该类型给出的字面量。               |
| `params: CallToolRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |

#### 11.22.2 工具调用请求参数 CallToolRequestParams

该对象表示工具调用请求参数。

| 字段与类型                               | 中文含义与约束                                                                             |
| :--------------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta: RequestMetaObject`               | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `inputResponses?: InputResponses`        | 以相同问题 ID 关联的输入响应。                                                             |
| `requestState?: string`                  | 服务端生成的不透明状态；客户端原样回显，服务端按安全要求验证完整性、主体、期限和请求绑定。 |
| `name: string`                           | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。                                     |
| `arguments?: { [key: string]: unknown }` | 工具的参数对象或提示模板的字符串参数映射；两种用途不能混用。                               |

#### 11.22.3 工具调用响应的允许结果分支 CallToolResultResponse

该对象表示工具调用响应的允许结果分支。

| 字段与类型                                      | 中文含义与约束                                                                      |
| :---------------------------------------------- | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`                                | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`                                 | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: InputRequiredResult \| CallToolResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.22.4 工具调用完成结果 CallToolResult

该对象表示工具调用完成结果。

| 字段与类型                    | 中文含义与约束                                                                             |
| :---------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`    | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`          | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `content: ContentBlock[]`     | 文本/媒体/嵌入资源等内容，按 type 判断分支；提示消息的 content 是单个内容对象。            |
| `structuredContent?: unknown` | 工具的结构化结果，按 outputSchema 校验；不能只依赖展示文字。                               |
| `isError?: boolean`           | 工具是否以业务错误结束。它仍可以装在成功 RPC 响应中。                                      |
| `[key: string]: unknown`      | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

### 11.23 工具目录

本组对象用于工具目录。先确定所属方法或内容分支，再核对请求、结果及其中引用的类型。

#### 11.23.1 工具目录请求对象 ListToolsRequest

该对象表示工具目录请求对象。

| 字段与类型                       | 中文含义与约束                                           |
| :------------------------------- | :------------------------------------------------------- |
| `jsonrpc: "2.0"`                 | 消息协议常量，值为 "2.0"。                               |
| `id: RequestId`                  | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。 |
| `params: PaginatedRequestParams` | 该方法的参数；请求元数据在本对象的 \_meta 内。           |
| `method: "tools/list"`           | 方法或通知名，必须匹配该类型给出的字面量。               |

#### 11.23.2 工具目录响应的允许结果分支 ListToolsResultResponse

该对象表示工具目录响应的允许结果分支。

| 字段与类型                | 中文含义与约束                                                                      |
| :------------------------ | :---------------------------------------------------------------------------------- |
| `jsonrpc: "2.0"`          | 消息协议常量，值为 "2.0"。                                                          |
| `id: RequestId`           | 匹配请求与响应；通知不带此字段。类型必须符合 RequestId。                            |
| `result: ListToolsResult` | 成功结果；按原请求对应的方法和 resultType 解释。不能与 error 同时出现在响应信封中。 |

#### 11.23.3 工具目录完成结果 ListToolsResult

该对象表示工具目录完成结果。

| 字段与类型                          | 中文含义与约束                                                                             |
| :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `_meta?: ResultMetaObject`          | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                       |
| `resultType: string`                | 区分结果分支；正常完成使用 complete，需要补充输入使用 input_required。扩展另行定义其分支。 |
| `nextCursor?: string`               | 存在时表示可能还有下一页；不能用本页条数猜测是否结束。                                     |
| `ttlMs: number`                     | 缓存新鲜度的毫秒时长；不能跨越主体或越权复用。                                             |
| `cacheScope: "public" \| "private"` | public/private 的共享范围；与 TTL 一起约束复用。                                           |
| `tools: Tool[]`                     | 工具目录数组或相关能力设置，按所属对象区分。                                               |
| `[key: string]: unknown`            | 允许按约定的字符串键扩展；值仍受所示类型约束，不能覆盖规范保留字段。                       |

#### 11.23.4 工具描述 Tool

该对象表示工具描述。

| 字段与类型                                                                  | 中文含义与约束                                                                        |
| :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `icons?: Icon[]`                                                            | 图标数组；抓取前检查安全 scheme、同源、大小和 MIME，不带凭据获取。                    |
| `name: string`                                                              | 供程序查找的名称；不是全局唯一身份，也不自动授予权限。                                |
| `title?: string`                                                            | 供界面显示的名称；可与程序名称不同。                                                  |
| `description?: string`                                                      | 帮助用户或模型理解用途的说明；它和工具提示同样不能代替执行侧校验。                    |
| `inputSchema: { $schema?: string; type: "object"; [key: string]: unknown }` | 工具参数对象的 JSON Schema；校验字段、类型和限制，仍需业务规则与授权。                |
| `outputSchema?: { $schema?: string; [key: string]: unknown }`               | 结构化输出的 Schema；存在时服务端必须返回符合约束的 structuredContent，客户端应检查。 |
| `annotations?: ToolAnnotations`                                             | 展示、用途或行为提示；不可信服务提供的注解不能作为安全保证。                          |
| `_meta?: MetaObject`                                                        | 所属对象的元数据；键的命名、保留字段和可见范围按该对象的上下文解释。                  |

#### 11.23.5 工具行为提示 ToolAnnotations

该对象表示工具行为提示。

| 字段与类型                  | 中文含义与约束                                     |
| :-------------------------- | :------------------------------------------------- |
| `title?: string`            | 供界面显示的名称；可与程序名称不同。               |
| `readOnlyHint?: boolean`    | 只读行为提示；真正只读由代码和账户权限保证。       |
| `destructiveHint?: boolean` | 可能执行破坏性动作的提示；缺省判断仍需谨慎。       |
| `idempotentHint?: boolean`  | 相同参数重复调用是否预期不产生额外业务影响的提示。 |
| `openWorldHint?: boolean`   | 是否可能与开放外部世界交互的提示。                 |
