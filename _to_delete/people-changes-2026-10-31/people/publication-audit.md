# People 页面论文核对记录

核对日期：2026-10-31。此记录对应 `people-publications.js`，仅用于成员名片的论文统计。

## 统计口径

- 学生及校友只统计第一作者、共同第一作者；普通合作者和仅通讯作者不计入学生数字。
- 明确标注共同贡献的第一顺位作者归入“共一”，不重复计入“一作”。不能仅凭第二作者位置或星号推断共一，需核对标记说明。
- 同一论文的预印本与正式发表版本合并；预印本计入总数，并在卡片及条目中明确标注。
- 会议、Findings、Workshop 分别标示。公开资料不足时显示“论文信息待补充”，不表示该成员没有论文。
- 当前收录 35 篇不同论文，其中 8 篇预印本；对应 14 位学生／校友的 42 条作者归属。同组成员共一时分别计入各自名片，不能将名片数字相加作为课题组论文总数。

## 已核实的成员统计

| 成员 | 一作 | 共一 | 合计 | 其中预印本 |
| --- | ---: | ---: | ---: | ---: |
| 郑星宇 | 3 | 3 | 6 | 1 |
| 王梓宁 | 2 | 1 | 3 | 0 |
| 丁一芙 | 6 | 3 | 9 | 1 |
| 杨戈 | 1 | 0 | 1 | 0 |
| 曾烨均 | 0 | 1 | 1 | 0 |
| 王家诚 | 0 | 1 | 1 | 0 |
| 谢辉 | 2 | 1 | 3 | 3 |
| 石通 | 1 | 1 | 2 | 2 |
| 朱亚男 | 0 | 1 | 1 | 0 |
| 何昌义 | 1 | 0 | 1 | 0 |
| 高圣博 | 1 | 0 | 1 | 0 |
| 陈鸿 | 0 | 4 | 4 | 0 |
| 吕程涛 | 1 | 4 | 5 | 1 |
| 杜金阳 | 3 | 1 | 4 | 2 |

以下成员尚未匹配到可核实的一作／共一记录：金圣浩、陈远明、刘晓宁、葛笑泽、翁晨皓、叶京涛、崔逸凡、肖鹏、Zhao Haoyu、Wang Jing、吴健宇。姓名沿用现有成员数据，未根据英文名猜测中文名。

## 补全的 2026 年记录

| 成员 | 论文 | 会议信息 | 归属依据 |
| --- | --- | --- | --- |
| 王梓宁 | [OmniFit: Bridging Modalities via Layer-Adaptive Token Compression for Omnimodal Large Language Models](https://icml.cc/virtual/2026/poster/65962) | ICML 2026 Spotlight | 官方作者列表列首；尚未获取可核验贡献标记的全文 |
| 杜金阳 | [Half-S: Halving the Scale for Near-Lossless 4-Bit LLM Training](https://aclanthology.org/2026.findings-acl.241/) | Findings of ACL 2026 | 论文首页列首，王梓宁为普通合作者 |
| 朱亚男 | [Region-Aware Hierarchical Sub-Feature Alignment for Robust EEG-Based Visual Decoding](https://openaccess.thecvf.com/content/CVPR2026F/html/Zhu_Region-Aware_Hierarchical_Sub-Feature_Alignment_for_Robust_EEG-Based_Visual_Decoding_CVPRF_2026_paper.html) | CVPR Findings 2026 | 论文首页标注与 Ziwei Xiang、Jiamin Wu 共同贡献 |

原[团队介绍](https://jinyangguo.github.io/team.html)还列有**王梓宁 NeurIPS 2026**。检索及官方会议信息中尚未匹配到可靠题目，未计入数字。原名片中只有会议名的“代表成果”文字由可核实的论文列表替代，此项在此保留待补线索。

## 关键排除与校正

- [JSQ（ICML 2024）](https://raw.githubusercontent.com/mlresearch/v235/main/assets/guo24g/guo24g.pdf)：郭晋阳列首；吴健宇、王梓宁没有共同贡献标记，不计入这两位学生的一作／共一数字。
- [DA-KD（ICML 2025）](https://raw.githubusercontent.com/mlresearch/v267/main/assets/he25c/he25c.pdf)：何昌义一作，丁一芙未标共一。
- LLMCBench：以正式论文作者顺序为准，杨戈一作；何昌义不计入。
- IR-QLoRA：郑星宇不是一作／共一。MoDES、FCPTS、低比特大模型综述等也未取得符合学生统计口径的作者证据，未计入。
- Low-bit FlashAttention：杜金阳一作；丁一芙为通讯作者，未计入其学生一作／共一数字。
- LLMC+：吕程涛一作。星号说明的是商汤实习经历，不是共同贡献；当前论文 PDF 标示 AAAI 2026。
- APQ-ViT 对应 ACM MM 2022，BiFSMN 对应 IJCAI 2022；采用论文及出版记录中的年份、会议信息。
- BiBERT 的共一依据为作者[论文主页](https://htqin.github.io/publications/)的作者标记及 Equal Contribution 图例；未将全文下载失败描述为已核对 PDF。

## 后续维护

每篇论文的 `evidence.url` 和 `evidence.note` 保存具体来源及作者判断。补充或更正时编辑 `people-publications.js`：核对论文身份、作者贡献、发表状态，复用成员 ID，同一论文保持唯一记录。卡片数量由这些记录自动计算，无需手工改名片数字。这里只维护 People 页面目录，不同步改写全站 Publications 数据。
