# Lucky Break Mobile v1.2.4

玩家移动版，横屏游玩。v1.2.0 新增游艇场景首页、小图标导航、故事插画入口与主对战按钮，保留中英文和六个原有功能入口。

在线地址：https://GioGyan90.github.io/luckybreak-mobile-v1/

技术栈、运行架构、物理系统、移动输入和构建流程见 [技术与构建说明](TECHNOLOGY.md)。

本仓库保存已验证的移动版静态发布产物及 GitHub Pages 自动发布工作流。没有编辑功能、原图备份、用户存档或登录凭据。

原开发目录 luckybreak_mobile_v1.2.0 保留 TypeScript 源码与共享资产构建配置；更新时本地构建后由 scripts/prepare-github-pages.mjs 生成对应子路径的发布文件。site 可独立部署，无需原开发服务器。

移动存档仅在玩家浏览器本地，支持手动 JSON 导入导出；正文 16 px，剧情默认 18 px，可切换 16/18/20 px。真机性能仍待验证。

2026-09-24 图片极限压缩试用：独立图片长边最多 640 像素，WebP 质量 10，图片总体积由约 222 MB 降至 3.72 MB。为测试加载速度主动降低画质，保留原有存档格式。


2026-10-07 更新：联系人最近战绩、NPC 自动月度杯与奖金结算；主页赛事倒计时和首次参赛引导；地图迷雾、地域图标及悬停信息；有任务的地点使用金色定位标记，无任务使用深灰绿色。保留移动版图片压缩配置。

## v1.2.1 · 2026-10-07

- 故事主页底部按钮按图标宽度收拢并居中。
- 日志图标替代“更多”，打开即展示全宽球场日志。
- 顶视图使用 Google Material 眼睛 SVG。
- 顶部集中展示双方头像、已进球和头像右上角的圆形赢局数，中间状态栏缩窄。
- 头像和进球记录从日志弹窗移至顶部。

## v1.2.2

- 修复月度杯跳过模拟后误走普通结算、当天可重复参赛的问题。
- NPC按总评分配准度和规划能力，取消零误差清台与失误自动回正。
- 适配移动浏览器地址栏占用空间，改善低高度横屏、弹窗滚动与蓄力操作。
- 对局技能只显示已解锁项目，排在底部操作组左右，窄屏自动换行。
- 地图球馆信息面板展示当前在馆球手头像、姓名及人数。

## v1.2.3 · 2026-10-07

- 修复课程卡片重叠、球馆任务和投资卡片溢出。
- 改善极矮横屏中的背包、工坊、购买弹窗、照片及按钮可达性。
- 修复剧情追踪器遮挡、英文入口标签裁切及比赛弹窗层级。
- 修复图鉴 3D 预览缩放和快速切页时的异步加载异常。
- 完成 101 个界面状态、2424 个尺寸与语言组合检查，以及交互回归和生产构建验证。



## v1.2.4 · 2026-10-08

- Compact 13-tick precision aiming control and separate spin/angle adjustment dialogs.
- Larger avatars with clockwise countdown rings and eight-ball pocketed rows.
- Top-aligned status, view and log controls; icon pause button and handedness in pause settings.
- New horizontal gold logo and Gloria yacht cover with foreground gaming props.
- Full-resolution 1816×866 homepage background compressed to 205,842 bytes (about 201 KiB).

## 2026-10-08 · 故事与比赛体验更新

- 优化中文文案，修复多页面中英文混用。
- 保留顶视图偏好，下一杆自动恢复；自由球支持点击拿起、移动和再次点击放下，并显示摆位光环。
- 赌注协商改为左侧立绘、右侧文字与操作，前进按钮统一金色。
- 隐藏随机事件抽取数字；卸下球杆显示逐支耐久。
- 修复包括 NPC 球杆在内的重复出售及存档重载后恢复库存漏洞。
- 短信、升级和里程碑奖励使用自动消失提示，显示在手机等弹层之上。
- 保留现有首页清晰图片与浏览器存档。
