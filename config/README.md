# 站点配置

大部分个人信息和首页展示规则集中在 `config/site.ts`，修改这里即可更新全站：

- `person`：姓名、职业、位置、邮箱、简介、事实数据
- `brand`：品牌名和页脚版权文字
- `navigation`：顶部导航
- `home`：首页文案、ticker、首页作品/文章数量
- `social`：页脚社交链接
- `ai`：「和我聊」的人格与文案

文章和作品不放在配置里，而是继续使用内容文件：

- `content/posts/*.mdx`：新增文章
- `content/projects/*.mdx`：新增作品

修改配置或新增 MDX 后，开发环境会自动刷新；生产环境重新构建即可。

## 关于我的访谈

`aboutInterview` 控制关于页的访谈、技能和可展示内容：

- `questions`：我问的问题、你的回答、做事原则，以及关联内容类型
- `skills`：可以展示给访客的能力
- `showcase`：引导访客继续查看作品、文章或联系入口

后续我们可以先在对话中完成访谈，再把确认后的答案整理进 `config/site.ts`。

## 「和我聊」对话

「和我聊」就是鹿码人本人在网站上聊天（首页对话区 + 内页右下角悬浮窗），由 DeepSeek 驱动：

- **灵魂**：`config/site.ts` 的 `ai.soul` 是注入每次对话的人格设定，改这里就是给它换性格；`ai.greeting` / `ai.suggestions` 控制开场白和建议提问，`ai.homeSection` 控制首页对话区文案
- **养分**：`lib/ai.ts` 在服务端读取 `siteConfig` 人设访谈 + 内容目录（标题/slug/简介），正文通过 `get_project_detail` / `get_post_detail` / `search_content` 三个工具按需取用——写新文章、加新项目，重新部署后它就自动学会
- **API**：`app/api/me/route.ts` 是流式代理，Key 通过环境变量 `DEEPSEEK_API_KEY` 注入（本地放 `.env.local`，Vercel 放项目环境变量，参考 `.env.example`），内置同源校验 + IP 限流（每分钟 6 次 / 每天 60 次）+ 输入预算限制
- **对话历史**仅保存在浏览器内存中，刷新即清空，不落库

## 「和我聊」的展示入口

- 首页对话区（`#chat`）：`components/HomeChat.tsx`，hero 按钮 `home.tertiaryCta` 锚点直达
- 内页右下角悬浮窗：`components/AiChatWidget.tsx`（首页自动隐藏）
- 关于页 showcase：`直接和我聊` 卡片
