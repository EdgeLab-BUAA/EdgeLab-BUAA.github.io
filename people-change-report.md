# 人员页改动说明

## 改了什么

- 保持页面样式不变。
- 把人员页原来的分栏逻辑从：
  - 教师
  - 第一组 / 第二组 / 第三组
  - 校友

  改成了：
  - 教师
  - 博士研究生
  - 硕士研究生
  - 校友

## 修改文件

- `js/people-loader.js`
  - 增加了按角色文字自动归类在读学生的逻辑。
  - 识别到 `PhD/博士` 的成员会进入博士分栏。
  - 识别到 `Master/Master's/硕士` 的成员会进入硕士分栏。
  - 页面显示顺序改为：教师、博士、硕士、校友。

- `js/i18n.js`
  - 新增了人员页分栏标题：
    - `dynamic.people.phd`
    - `dynamic.people.master`
  - 去掉了人员页里旧的第一组/第二组/第三组标题映射。

## 验证结果

- `node --check js/people-loader.js` 通过
- `node --check js/i18n.js` 通过
- 本地静态服务可以正常打开 `people/people.html`

## 预览地址

- `http://localhost:8080/people/people.html`

## 2026-06-17 更新

本次继续更新人员页内容：

- 新增刘祥龙老师照片文件：`people/imgs/Liu Xianglong.jpg`
- 删除 `Du Jinyang / 杜金阳`
- 将以下成员身份从硕士研究生改为博士研究生：
  - `Ge Xiaoze / 葛笑泽`
  - `Shi Tong / 石通`
  - `Ye Jingtao / 叶京涛`

由于人员页现在按 `role_en` / `role_zh` 自动分入博士或硕士分栏，上述三位成员会显示在博士研究生分栏。

验证结果：

- `node --check people/people-data.js` 通过
- 已提交：`672bea0 Update people member records`
- GitHub Pages 构建成功
- 线上人员页可访问：`https://edgelab-buaa.github.io/people/people.html`
- 当前分组统计：
  - 教师：2 人
  - 博士研究生：10 人
  - 硕士研究生：7 人
  - 校友：5 人
