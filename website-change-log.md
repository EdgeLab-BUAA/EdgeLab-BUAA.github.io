# 网站改动记录

本文档用于持续记录 EdgeLab-BUAA 实验室主页的网页改动、原因、涉及文件和发布状态。

## 2026-06-16

### 1. 人员页在读学生分栏调整

提交：

- `4fc79e5 Update people page student sections`

改动目标：

- 将人员页原来的在读学生分组方式从“第一组 / 第二组 / 第三组”调整为“博士研究生 / 硕士研究生”。
- 保持原有页面样式不变。
- 教师和校友分栏保持不变。

涉及文件：

- `js/people-loader.js`
- `js/i18n.js`

具体改动：

- `js/people-loader.js`
  - 新增 `getSectionKey` 逻辑。
  - 教师和校友仍根据 `team` 字段归入 `faculty` 和 `alumni`。
  - 在读学生根据 `role_en` / `role_zh` 自动识别：
    - `PhD` 或 `博士` 归入博士研究生分栏。
    - `Master`、`Master's` 或 `硕士` 归入硕士研究生分栏。
  - 页面分栏顺序改为：教师、博士研究生、硕士研究生、校友。

- `js/i18n.js`
  - 新增人员页分栏标题：
    - `dynamic.people.phd`
    - `dynamic.people.master`
  - 移除人员页使用的旧小组标题映射：
    - `dynamic.people.team1`
    - `dynamic.people.team2`
    - `dynamic.people.team3`

验证结果：

- `node --check js/people-loader.js` 通过。
- `node --check js/i18n.js` 通过。
- 当前数据分组结果：
  - 教师：2 人
  - 博士研究生：7 人
  - 硕士研究生：11 人
  - 校友：5 人

发布状态：

- 已推送到 `main`。
- GitHub Pages 构建成功。
- 线上人员页可访问：`https://edgelab-buaa.github.io/people/people.html`

### 2. 首页照片轮播渲染修复

提交：

- `c3f6f31 Fix homepage cover carousel rendering`

问题现象：

- 首页右侧照片轮播区域可能长时间空白，看起来像轮播消失。

排查结论：

- 人员页改动没有修改首页相关文件。
- 线上 `js/cover-data.js` 和 `mainpage/cover/` 下的封面图片可以正常访问。
- 原轮播脚本会等待所有封面图预加载完成后才创建卡片。
- 部分封面图体积较大，GitHub Pages 重新构建后 CDN 缓存变冷时，用户侧可能长时间看不到卡片。
- GitHub Pages 不提供目录列表，访问 `mainpage/cover/` 会返回 404；脚本原本虽有兜底，但仍存在不必要的目录探测。

涉及文件：

- `js/card-swap.js`

具体改动：

- 优先使用 `window.__LAB_COVER__` 中的图片清单。
- 有图片清单时不再请求 `mainpage/cover/` 目录。
- 不再等待所有大图预加载完成后才创建卡片。
- 立即根据图片清单创建轮播卡片，由浏览器自然加载背景图。
- fallback 图片清单补上 `00012.jpg`，与当前 `cover-data.js` 保持一致。
- 未修改 CSS 样式。

验证结果：

- `node --check js/card-swap.js` 通过。
- 本地脚本模拟确认会立即创建 5 张轮播卡片。
- 线上 `js/card-swap.js` 已更新为修复后的版本。
- 线上首页返回 `HTTP 200`。

发布状态：

- 已推送到 `main`。
- GitHub Pages 构建成功。
- 线上首页可访问：`https://edgelab-buaa.github.io/`

## 2026-06-17

### 1. 人员页成员信息更新

提交：

- `672bea0 Update people member records`

改动目标：

- 为刘祥龙老师补充本地新增照片。
- 从人员页移除 Du Jinyang。
- 将 Ge Xiaoze、Shi Tong、Ye Jingtao 的身份从硕士研究生调整为博士研究生。
- 由于人员页当前按角色字段自动分入博士/硕士分栏，角色调整后这三位成员会进入博士研究生分栏。

涉及文件：

- `people/people-data.js`
- `people/imgs/Liu Xianglong.jpg`

具体改动：

- `people/people-data.js`
  - 删除 `Du Jinyang / 杜金阳` 的成员记录。
  - 将 `Ge Xiaoze / 葛笑泽` 的 `role_en` 改为 `PhD Student`，`role_zh` 改为 `博士研究生`。
  - 将 `Shi Tong / 石通` 的 `role_en` 改为 `PhD Student`，`role_zh` 改为 `博士研究生`。
  - 将 `Ye Jingtao / 叶京涛` 的 `role_en` 改为 `PhD Student`，`role_zh` 改为 `博士研究生`。

- `people/imgs/Liu Xianglong.jpg`
  - 新增刘祥龙老师照片文件。
  - 数据文件中原本已引用 `imgs/Liu Xianglong.jpg`，本次补齐实际图片资源。

验证结果：

- `node --check people/people-data.js` 通过。
- 当前数据检查结果：
  - `Du Jinyang` 不再存在。
  - `Ge Xiaoze`、`Shi Tong`、`Ye Jingtao` 均为博士研究生。
  - `Liu Xianglong` 照片路径为 `imgs/Liu Xianglong.jpg`。
  - 分组统计：教师 2 人，博士研究生 10 人，硕士研究生 7 人，校友 5 人。

发布状态：

- 已推送到 `main`。
- GitHub Pages 构建成功。
- 线上人员页可访问：`https://edgelab-buaa.github.io/people/people.html`
- 刘祥龙老师照片资源可访问：`https://edgelab-buaa.github.io/people/imgs/Liu%20Xianglong.jpg`

## 后续维护建议

- 后续每次改动网页时，可以继续在本文档中按日期追加记录。
- 建议每条记录至少包含：
  - 改动目标
  - 涉及文件
  - 具体改动
  - 验证结果
  - 是否已发布到线上
- 如果只是本地临时说明文件，不需要提交到仓库。
- 如果希望团队长期追踪网页维护历史，可以将本文档提交到仓库。
