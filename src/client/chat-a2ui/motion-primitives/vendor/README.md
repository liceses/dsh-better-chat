# motion-primitives vendor

来源：<https://github.com/ibelick/motion-primitives>（MIT License，见 `LICENCE.md`）。

已拉取并改写的组件：

| 本地文件 | 上游文件 | 用途 |
| --- | --- | --- |
| TextEffect.tsx | components/core/text-effect.tsx | 空态标题、空白会话标题 |
| TextShimmerWave.tsx | components/core/text-shimmer-wave.tsx | 生成中的副标题 |
| TextScramble.tsx | components/core/text-scramble.tsx | 暂未使用：工具状态文字换成直出，中文被随机拉丁字符替换像渲染故障 |
| AnimatedGroup.tsx | components/core/animated-group.tsx | 空态建议列表 |
| ProgressiveBlur.tsx | components/core/progressive-blur.tsx | 消息区顶/底渐隐 |
| BorderTrail.tsx | components/core/border-trail.tsx | 暂未使用：工具行改成旁注样式后没有描边可跑流光（组件与 `.caui-border-trail` 样式保留备查） |
| CollapsibleBody.tsx | components/core/disclosure.tsx | 思考/工具/上下文折叠 |

改写规则：

- `motion/react` → `framer-motion`（项目已有运行时，不引入第二份 motion）。
- 删除 `@/lib/utils`、Tailwind 类、`cn`，改为本地 `cx` 与 `caui-*` CSS。
- 不引入 `react-use-measure`、lucide、Tailwind。
- 保留上游语义与动画参数；只做上述运行环境适配。

TextScramble 与 BorderTrail 目前没有接入产品（原因见上表）。它们的参数仍留在
`motion.config.json` 的 `scramble.*` / `borderTrail.*`，确认要接回时把调用点补上即可。
