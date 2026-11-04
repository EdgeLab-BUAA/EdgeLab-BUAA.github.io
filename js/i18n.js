(() => {
  const STORAGE_KEY = "lab-language";
  const DEFAULT_LANG = "en";

  const translations = {
    "common.siteTitle": { en: "Laboratory Homepage", zh: "实验室主页" },
    "common.logoAria": { en: "Lab home", zh: "实验室主页" },
    "common.navAria": { en: "Main navigation", zh: "主导航" },
    "common.nav.home": { en: "Home", zh: "首页" },
    "common.nav.people": { en: "People", zh: "团队成员" },
    "common.nav.projects": { en: "Projects", zh: "项目" },
    "common.nav.directions": { en: "Directions", zh: "研究方向" },
    "common.nav.news": { en: "News & Media", zh: "新闻与动态" },
    "common.nav.publications": { en: "Publications", zh: "论文发表" },
    "common.nav.activities": { en: "Activities", zh: "活动" },
    "common.nav.opening": { en: "Opening", zh: "招生招聘" },
    "common.nav.contact": { en: "Contact", zh: "联系我们" },
    "common.footer.about": { en: "About", zh: "关于" },
    "common.footer.home": { en: "Home", zh: "首页" },
    "common.footer.people": { en: "People", zh: "团队成员" },
    "common.footer.mission": { en: "Mission", zh: "使命" },
    "common.footer.contact": { en: "Contact", zh: "联系我们" },
    "common.footer.publications": { en: "Publications", zh: "论文发表" },
    "common.footer.papers": { en: "Papers", zh: "论文" },
    "common.footer.projects": { en: "Projects", zh: "项目" },
    "common.footer.datasets": { en: "Datasets", zh: "数据集" },
    "common.footer.code": { en: "Code", zh: "代码" },
    "common.footer.awards": { en: "Awards", zh: "荣誉奖励" },
    "common.footer.competitions": { en: "Competitions", zh: "竞赛" },
    "common.footer.honors": { en: "Honors", zh: "荣誉" },
    "common.footer.grants": { en: "Grants", zh: "项目资助" },
    "common.footer.media": { en: "Media", zh: "媒体" },
    "common.footer.activities": { en: "Activities", zh: "活动" },
    "common.footer.workshops": { en: "Workshops", zh: "学术活动" },
    "common.footer.teamBuilding": { en: "Team-building", zh: "团建" },
    "common.footer.openings": { en: "Openings", zh: "招生招聘" },
    "common.footer.research": { en: "Research", zh: "研究方向" },
    "common.footer.modelEfficiency": { en: "Efficient foundation model", zh: "高效基础模型" },
    "common.footer.dataEfficiency": { en: "Efficient embodied AI", zh: "高效具身智能" },
    "common.footer.neuromorphic": { en: "Efficient embodied AI", zh: "高效具身智能" },
    "common.footer.ai4science": { en: "Efficient AI memory", zh: "高效 AI 记忆" },
    "common.langToggle": { en: "中文", zh: "EN" },
    "common.langToggleAria": { en: "Switch to Chinese", zh: "切换到英文" },
    "common.project": { en: "Project", zh: "项目" },

    "page.home.title": { en: "Laboratory Homepage", zh: "实验室主页" },
    "page.home.heroMainTitle": { en: "Efficient AI Computing", zh: "高效 AI 计算" },
    "page.home.heroMainBody": {
      en: "Our lab works on efficient AI computing, making large models smaller, faster, and easier to deploy on real-world hardware.",
      zh: "课题组专注于高效 AI 计算，让大模型更小、更快，也更易于部署到真实硬件上。"
    },
    "page.home.hero2Title": {
      en: "Research for efficient, deployable, and scientific AI",
      zh: "面向高效部署与科学发现的 AI 研究"
    },
    "page.home.counter.models": { en: "Models", zh: "模型" },
    "page.home.counter.compression": { en: "Compression", zh: "压缩" },
    "page.home.counter.data": { en: "Data", zh: "数据" },
    "page.home.counter.efficiency": { en: "Efficiency", zh: "效率" },
    "page.home.counter.snn": { en: "SNN", zh: "SNN" },
    "page.home.counter.neuromorphic": { en: "Efficient embodied AI", zh: "高效具身智能" },
    "page.home.counter.science": { en: "Science", zh: "科学" },
    "page.home.counter.ai4science": { en: "Efficient AI memory", zh: "高效 AI 记忆" },
    "page.home.highlighted.lead": {
      en: "Selected systems, benchmarks, and model-efficiency work",
      zh: "精选系统、基准与模型高效化研究"
    },
    "page.home.highlighted.title": { en: "Highlighted Articles", zh: "精选文章" },
    "page.home.researchTitle": { en: "Our Research", zh: "研究方向" },
    "page.home.researchBlock1Title": { en: "Efficient foundation models and deployment", zh: "高效基础模型与部署" },
    "page.home.researchBlock1Body": {
      en: "We develop compression, quantization, sparsification, and knowledge distillation methods for large language models, diffusion models, segmentation models, and vision systems.",
      zh: "我们面向大语言模型、扩散模型、分割模型与视觉系统，研究压缩、量化、稀疏化和知识蒸馏等高效方法。"
    },
    "page.home.researchBlock1Button": { en: "Learn More", zh: "了解更多" },
    "page.home.researchBlock2Title": { en: "Representative publications and benchmarks", zh: "代表性论文与基准" },
    "page.home.researchBlock2Body": {
      en: "Recent work includes LLM compression benchmarks, small language model quantization, medical LLM compression evaluation, post-training quantization, sparsity benchmarks, and efficient model deployment papers.",
      zh: "近期工作涵盖大模型压缩基准、小语言模型量化、医疗大模型压缩评测、训练后量化、稀疏基准以及高效部署等方向。"
    },
    "page.home.researchBlock2Button": { en: "View Papers", zh: "查看论文" },
    "page.home.researchBlock3Title": { en: "Join the Lab", zh: "加入课题组" },
    "page.home.researchBlock3Body": {
      en: "We welcome students interested in efficient AI computing, model compression, PyTorch systems, open-source research, and AI4Science. Strong candidates are self-motivated and comfortable with Python, PyTorch, and Linux.",
      zh: "我们欢迎对高效 AI 计算、模型压缩、PyTorch 系统、开源科研与 AI4Science 感兴趣的同学加入。理想候选人应具备较强自驱力，并熟悉 Python、PyTorch 与 Linux。"
    },
    "page.home.researchBlock3Button": { en: "Openings", zh: "招生招聘" },

    "page.people.title": { en: "People | Laboratory Homepage", zh: "团队成员 | 实验室主页" },
    "page.people.heroLead": { en: "Faculty, students, and collaborators", zh: "教师、学生与合作伙伴" },
    "page.people.heroTitle": { en: "People", zh: "团队成员" },
    "page.people.loading": { en: "Loading...", zh: "加载中..." },

    "page.projects.title": { en: "Projects | Laboratory Homepage", zh: "项目 | 实验室主页" },
    "page.projects.heroLead": { en: "Open-source tools, benchmarks, and systems from the lab", zh: "课题组的开源工具、基准与系统" },
    "page.projects.heroTitle": { en: "Projects", zh: "项目" },
    "page.projects.placeholder": { en: "Projects coming soon.", zh: "项目内容即将上线。" },

    "page.news.title": { en: "News & Media | Laboratory Homepage", zh: "新闻与动态 | 实验室主页" },
    "page.news.heroLead": { en: "Updates, announcements, and highlights from the lab", zh: "课题组的最新动态、公告与精选内容" },
    "page.news.heroTitle": { en: "News & Media", zh: "新闻与动态" },
    "page.news.placeholder": { en: "News coming soon.", zh: "新闻内容即将上线。" },
    "page.news.latestLead": { en: "Updates and highlights", zh: "最新动态与精选内容" },
    "page.news.latestTitle": { en: "Latest News", zh: "最新消息" },
    "page.home.newsLead": { en: "From the lab", zh: "来自课题组" },
    "page.home.newsTitle": { en: "Latest News", zh: "最新消息" },

    "page.publications.title": { en: "Publications | Laboratory Homepage", zh: "论文发表 | 实验室主页" },
    "page.publications.heroLead": { en: "Selected papers, benchmarks, and systems work", zh: "精选论文、基准与系统研究" },
    "page.publications.heroTitle": { en: "Publications", zh: "论文发表" },
    "page.publications.searchPlaceholder": { en: "e.g. Title, Author, Venue, Year, Tags", zh: "例如：标题、作者、会议、年份、标签" },
    "page.publications.initialCount": { en: "Showing 0 of 0 papers", zh: "显示 0 / 0 篇论文" },
    "page.publications.note": { en: "*Co-lead authors, ✉ Corresponding author(s);", zh: "*共同一作，✉ 通讯作者；" },
    "page.publications.empty": { en: "No papers found.", zh: "未找到论文。" },

    "page.activities.title": { en: "Activities | Laboratory Homepage", zh: "活动 | 实验室主页" },
    "page.activities.heroLead": { en: "Workshops, team-building gatherings, and shared moments from the lab", zh: "学术活动、团队团建与课题组日常瞬间" },
    "page.activities.heroTitle": { en: "Activities", zh: "活动" },

    "page.opening.title": { en: "Opening | Laboratory Homepage", zh: "招生招聘 | 实验室主页" },
    "page.opening.heroLead": { en: "Join us for Ph.D., master's, and research internship opportunities", zh: "欢迎申请博士、硕士与科研实习机会" },
    "page.opening.heroTitle": { en: "Opening", zh: "招生招聘" },
    "page.opening.eyebrow": { en: "Recruitment", zh: "招生信息" },
    "page.opening.introTitle": { en: "Research openings for highly motivated students", zh: "面向高自驱学生的科研招生机会" },
    "page.opening.introBody": {
      en: "Our group is currently recruiting students for 2027 admission, including master-to-Ph.D. students, regular Ph.D. students (application-assessment track), and master's students. Research internships are also welcome.",
      zh: "组里现有 2027 年入学的硕转博、普博（申请考核制）及硕士名额，也欢迎同学来组里科研实习。"
    },
    "page.opening.advantagesTitle": { en: "Advantages of Our Research Group", zh: "课题组优势" },
    "page.opening.adv1Title": {
      en: "Abundant Resources and Comprehensive Guidance",
      zh: "充足的科研资源和全面的指导"
    },
    "page.opening.adv1Body1": {
      en: "Our research group is growing rapidly and has abundant computing resources and research funding to support your work. We place great emphasis on the development of every student.",
      zh: "课题组正处于快速发展阶段，拥有充足的计算资源和科研经费，能够有力支持同学们开展科学研究。课题组重视每一位同学的培养。"
    },
    "page.opening.adv1Body2": {
      en: "The supervisor provides hands-on mentorship for every new group member, helping them read papers, debug code, and write research articles. We are committed to thoroughly revising each student's first research paper from beginning to end.",
      zh: "导师会手把手地带每一位新入组的同学读论文、改 Bug、写论文。我们承诺会帮助每位同学对第一篇论文从头到尾进行优化改写。"
    },
    "page.opening.adv2Title": {
      en: "Industry-Relevant Research Topics",
      zh: "与产业界密切联系的研究内容"
    },
    "page.opening.adv2Body1": {
      en: "The research topics in our group are closely aligned with problems of interest to the industry. For students aiming to pursue careers in the industry, such research experience will provide a significant advantage.",
      zh: "课题组的研究内容与产业界关心的问题密切相关，如果同学们毕业后准备到企业发展，这样的研究经历会为你在企业求职带来巨大优势。"
    },
    "page.opening.adv2Body2": {
      en: "Our group encourages students who meet the graduation requirements to undertake research-based internships in companies. We have established in-depth collaborations with leading companies such as ByteDance, Huawei, Baidu, and SenseTime. Outstanding graduates may also receive recommendations to these companies or for doctoral/postdoctoral opportunities at institutions such as the University of Hong Kong, CUHK, the University of Sydney, and Shanghai AI Lab.",
      zh: "课题组鼓励满足学校毕业要求的同学到企业开展以科研为主要内容的实习。同时，课题组与字节、华为、百度、商汤等多家公司有深入合作。优秀者毕业后可推荐至相关公司，或推荐至港大、港中文、悉尼大学、上海 AI Lab 等攻读博士/博士后。"
    },
    "page.opening.expectationsTitle": { en: "Expectations for Prospective Students", zh: "对申请同学的期望" },
    "page.opening.exp1Title": {
      en: "Strong Self-Motivation",
      zh: "有强烈的自驱力（Self-Motivation）"
    },
    "page.opening.exp1Body": {
      en: "We provide abundant guidance and research resources to all members, and we hope each student can fully leverage these resources with strong self-motivation to deliver truly valuable scientific contributions.",
      zh: "课题组会为同学们提供充足的指导和科研资源，希望每位同学可以充分利用这些资源，以强烈的自驱力做出真正有价值的科学工作。"
    },
    "page.opening.exp2Title": {
      en: "Early Engagement in Research",
      zh: "尽早投入科研"
    },
    "page.opening.exp2Body": {
      en: "After securing postgraduate recommendation or admission, students intending to join the group are welcome to work on their undergraduate thesis and other research projects with us during their fourth year. Starting research a year early will greatly benefit your future development. Papers published during this period can count toward the output requirements for graduate school.",
      zh: "有意向加入课题组的同学，在完成保研/推免后，大四即可来到组里完成毕业设计以及其他科研项目。提前一年熟悉科研工作，多一年的积累会为你后续的发展提供巨大帮助。大四期间发表的论文可计入研究生阶段的工作产出，用于满足学校的毕业要求。"
    },
    "page.opening.exp3Title": {
      en: "Strong Self-Learning and Programming Skills",
      zh: "较强的自学能力和编程能力"
    },
    "page.opening.exp3Body": {
      en: "Students joining the group are expected to be proficient in Python, PyTorch, and basic Linux operations, with considerable programming experience. The following experiences are highly valued: participation and awards in ACM competitions; in-depth involvement in website development, software development, or open-source projects; and long-term, valuable knowledge sharing in professional fields.",
      zh: "希望加入课题组的同学熟练掌握 Python、PyTorch 及 Linux 基础操作，有较为丰富的编程经验。以下经历会是重要的加分项：ACM 竞赛参赛和获奖经历；深度参与的网站搭建、程序开发或开源项目；长期、有价值的专业知识分享。"
    },
    "page.opening.stepsTitle": {
      en: "Before You Apply",
      zh: "申请前的准备"
    },
    "page.opening.step1Title": {
      en: "1. Present one of our papers",
      zh: "1. 讲解一篇课题组论文"
    },
    "page.opening.step1Body": {
      en: "Select one paper published by our group (see Publications) and prepare a presentation (PPT) that explains its motivation, core method, and main experimental results.",
      zh: "从课题组已发表的论文中任选一篇（见论文发表页面），制作一份 PPT，讲解论文的研究动机、核心方法和主要实验结果。"
    },
    "page.opening.step2Title": {
      en: "2. Propose your own improvements",
      zh: "2. 提出你的改进思路"
    },
    "page.opening.step2Body": {
      en: "In the same PPT, analyze the paper's limitations and propose your own ideas for improvement or future extension.",
      zh: "在同一份 PPT 中，分析该论文的不足之处，并提出你自己的改进思路或后续拓展方向。"
    },
    "page.opening.applicationEyebrow": { en: "Application Information", zh: "申请方式" },
    "page.opening.applicationTitle": {
      en: "Send your application",
      zh: "提交申请"
    },
    "page.opening.applicationBody": {
      en: "Please send your PPT, resume, and academic transcript to jinyangguo@buaa.edu.cn. Applications without the PPT may not be considered. If you are passionate about research, we look forward to having you join us!",
      zh: "请将 PPT、简历和成绩单一并发送至 jinyangguo@buaa.edu.cn。未附 PPT 的申请可能不予考虑。如果你有科研的热情和梦想，期待你的加入！"
    },

    "page.contact.title": { en: "Contact | Laboratory Homepage", zh: "联系我们 | 实验室主页" },
    "page.contact.heroLead": { en: "Get in touch", zh: "联系课题组" },
    "page.contact.heroTitle": { en: "Contact", zh: "联系我们" },
    "page.contact.placeholder": { en: "Contact information coming soon.", zh: "联系信息即将上线。" },
    "page.contact.heroBody": {
      en: "We welcome inquiries about research collaborations, student recruitment, and everything in between.",
      zh: "欢迎就科研合作、学生招生以及其他相关事宜与我们联系。"
    },
    "page.contact.formTitle": { en: "Leave a message", zh: "留言咨询" },
    "page.contact.nameLabel": { en: "Your name", zh: "你的姓名" },
    "page.contact.namePlaceholder": { en: "Name", zh: "姓名" },
    "page.contact.emailLabel": { en: "Your email", zh: "你的邮箱" },
    "page.contact.emailPlaceholder": { en: "you@example.com", zh: "you@example.com" },
    "page.contact.messageLabel": { en: "Message", zh: "留言内容" },
    "page.contact.messagePlaceholder": { en: "Write your message here...", zh: "请在这里输入你的留言..." },
    "page.contact.submit": { en: "Send Message", zh: "发送留言" },
    "page.contact.emailTitle": { en: "Email us", zh: "邮件联系" },
    "page.contact.emailNote": { en: "For research collaborations, student recruitment, or anything else, write to:", zh: "科研合作、学生招生或其他事宜，欢迎发送邮件至：" },
    "page.contact.copy": { en: "Copy email", zh: "复制邮箱" },
    "page.contact.write": { en: "Write an email", zh: "发送邮件" },
    "page.contact.copied": { en: "Email copied", zh: "邮箱已复制" },
    "page.contact.address": { en: "Beihang University, No. 37 Xueyuan Road, Haidian District, Beijing, China", zh: "北京市海淀区学院路 37 号 北京航空航天大学" },
    "page.contact.joinLink": { en: "Interested in joining the lab? See Openings", zh: "有意加入课题组？查看招生信息" },
    "page.contact.success": {
      en: "Thank you for reaching out. We will get back to you within a few days.",
      zh: "感谢你的留言。我们会在几天内与你联系。"
    },

    "dynamic.people.faculty": { en: "Faculty", zh: "教师" },
    "dynamic.people.phd": { en: "Ph.D. Students", zh: "博士研究生" },
    "dynamic.people.master": { en: "Master's Students", zh: "硕士研究生" },
    "dynamic.people.alumni": { en: "Alumni", zh: "校友" },
    "dynamic.people.error": { en: "Unable to load people data.", zh: "无法加载成员数据。" },
    "dynamic.people.emailCopied": { en: "Email copied!", zh: "邮箱已复制！" },
    "dynamic.people.title.scholar": { en: "Google Scholar", zh: "谷歌学术" },
    "dynamic.people.title.github": { en: "GitHub", zh: "GitHub" },
    "dynamic.people.title.homepage": { en: "Homepage", zh: "主页" },
    "dynamic.people.title.copyEmail": { en: "Copy email", zh: "复制邮箱" },
    "dynamic.people.label.email": { en: "Email", zh: "邮箱" },
    "dynamic.people.next": { en: "Next:", zh: "下一站：" },
    "dynamic.people.jumpAria": { en: "Jump to group", zh: "跳转到分组" },
    "dynamic.people.title.dblp": { en: "dblp", zh: "dblp" },
    "dynamic.people.cohort": { en: "Since {year}", zh: "{year}级" },
    "dynamic.people.facts.papers": { en: "Selected papers", zh: "代表论文" },
    "dynamic.people.facts.honors": { en: "Honors", zh: "荣誉" },
    "dynamic.people.facts.service": { en: "Service", zh: "学术服务" },
    "dynamic.people.facts.experience": { en: "Experience", zh: "经历" },
    "dynamic.people.facts.cosup": { en: "Co-supervision", zh: "联合指导" },
    "dynamic.people.join.title": { en: "Join us", zh: "加入我们" },
    "dynamic.people.join.body": {
      en: "We are recruiting postdocs, Ph.D. students, master's students, and visiting students in efficient AI computing. Email your CV and publications (if any) to {email}.",
      zh: "课题组招收博士后、博士生、硕士生和访问学生，研究方向为高效 AI 计算。欢迎将简历及已发表论文（如有）发送至 {email}。"
    },
    "dynamic.people.join.cta": { en: "View openings", zh: "查看招生信息" },

    "dynamic.activities.error": { en: "Unable to load activities data.", zh: "无法加载活动数据。" },
    "dynamic.activities.photoAria": { en: "Activity photo", zh: "活动照片" },

    "dynamic.publications.errorTitle": { en: "Unable to load papers", zh: "无法加载论文数据" },
    "dynamic.publications.errorBody": { en: "Publication data is missing. Run the generator first.", zh: "论文数据缺失，请先生成数据文件。" },
    "dynamic.publications.link.paper": { en: "PDF", zh: "PDF" },
    "dynamic.publications.link.code": { en: "Code", zh: "代码" },
    "dynamic.publications.link.books": { en: "Book", zh: "书籍" },
    "dynamic.publications.link.scholar": { en: "Bibtex", zh: "Bibtex" },
    "dynamic.publications.countAll": { en: "Showing all {count} papers", zh: "显示全部 {count} 篇论文" },
    "dynamic.publications.countMatching": { en: "Showing {count} matching papers", zh: "显示 {count} 篇匹配论文" },
    "dynamic.publications.empty": { en: "No papers found.", zh: "未找到论文。" },

    "dynamic.cards.coverPhoto": { en: "Lab cover photo {index}", zh: "课题组封面照片 {index}" },
    "dynamic.news.error": { en: "Unable to load news right now.", zh: "暂时无法加载新闻内容。" },
    "dynamic.news.empty": { en: "News coming soon.", zh: "新闻内容即将上线。" },
    "dynamic.news.readMore": { en: "Read More", zh: "查看更多" },
    "dynamic.news.loadMore": { en: "Load More", zh: "加载更多" },
    "dynamic.directions.error": {
      en: "Unable to load research directions.",
      zh: "无法加载研究方向内容。"
    },

    "page.direction.label": { en: "Research Direction", zh: "研究方向" },
    "page.direction.overview": { en: "Overview", zh: "概述" },
    "page.direction.publications": { en: "Related Publications", zh: "相关论文" },
    "page.direction.publicationsPlaceholder": {
      en: "Coming soon — see <a href=\"../../publications/publications.html\" style=\"color:#5227ff;\">full publication list</a>.",
      zh: "即将上线 — 查看<a href=\"../../publications/publications.html\" style=\"color:#5227ff;\">全部论文列表</a>。"
    },
    "page.direction.people": { en: "People", zh: "相关人员" },
    "page.direction.peoplePlaceholder": {
      en: "Coming soon — see <a href=\"../../people/people.html\" style=\"color:#5227ff;\">full members list</a>.",
      zh: "即将上线 — 查看<a href=\"../../people/people.html\" style=\"color:#5227ff;\">全部成员列表</a>。"
    },

    "page.direction.efficient-computing.pageTitle": { en: "Efficient LLM/VLM | Laboratory Homepage", zh: "高效大语言/视觉语言模型 | 实验室主页" },
    "page.direction.efficient-computing.heroTitle": { en: "Efficient LLM/VLM", zh: "高效大语言/视觉语言模型" },
    "page.direction.efficient-computing.intro": {
      en: "Quantization, sparsity, distillation, and token compression for large language, vision-language, and generative models, cutting compute and memory cost with little loss in capability.",
      zh: "面向大语言模型、视觉语言模型与生成模型的量化、稀疏、蒸馏与 Token 压缩方法，在几乎不损失能力的前提下降低计算与存储开销。"
    },

    "page.direction.neuromorphic-ai.pageTitle": { en: "Efficient Embodied AI | Laboratory Homepage", zh: "高效具身智能 | 实验室主页" },
    "page.direction.neuromorphic-ai.heroTitle": { en: "Efficient Embodied AI", zh: "高效具身智能" },
    "page.direction.neuromorphic-ai.intro": {
      en: "Fast, lightweight perception, planning, and action models for robots and agents, including vision-language-action and world action models that must run in real time on limited hardware.",
      zh: "面向机器人与智能体的轻量化感知、规划与动作模型，包括需要在受限硬件上实时运行的视觉-语言-动作模型与世界动作模型。"
    },

    "page.direction.ai4science.pageTitle": { en: "Efficient AI System | Laboratory Homepage", zh: "高效 AI 系统 | 实验室主页" },
    "page.direction.ai4science.heroTitle": { en: "Efficient AI System", zh: "高效 AI 系统" },
    "page.direction.ai4science.intro": {
      en: "Systems and hardware support for efficient AI: low-bit kernels and training, KV cache and memory systems, and deployment on domestic accelerators such as Ascend NPUs.",
      zh: "为高效 AI 提供系统与硬件支撑：低比特算子与低比特训练、KV Cache 与记忆系统，以及在昇腾等国产加速器上的部署。"
    }
  };

  const interpolate = (template, vars = {}) =>
    String(template).replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? `{${key}}`));

  const getStoredLanguage = () => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === "zh" || value === "en" ? value : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  };

  let currentLanguage = getStoredLanguage();

  const t = (key, vars = {}, lang = currentLanguage) => {
    const entry = translations[key];
    if (!entry) return key;
    const value = entry[lang] ?? entry.en ?? key;
    return interpolate(value, vars);
  };

  const setStoredLanguage = (lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage failures.
    }
  };

  const updateElement = (el, lang) => {
    if (el.dataset.i18n) {
      const value = t(el.dataset.i18n, {}, lang);
      if (Object.prototype.hasOwnProperty.call(el.dataset, "i18nHtml")) el.innerHTML = value;
      else el.textContent = value;
    }
    if (el.dataset.i18nPlaceholder) el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder, {}, lang));
    if (el.dataset.i18nTitle) el.setAttribute("title", t(el.dataset.i18nTitle, {}, lang));
    if (el.dataset.i18nAriaLabel) el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel, {}, lang));
  };

  const ensureToggleButtons = () => {
    document.querySelectorAll(".gooey-nav-shell").forEach((shell) => {
      if (shell.querySelector(".lang-toggle")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lang-toggle";
      button.addEventListener("click", () => setLanguage(currentLanguage === "en" ? "zh" : "en"));
      shell.appendChild(button);
    });
  };

  const syncToggleButtons = (lang) => {
    document.querySelectorAll(".lang-toggle").forEach((button) => {
      button.textContent = t("common.langToggle", {}, lang);
      button.setAttribute("aria-label", t("common.langToggleAria", {}, lang));
      button.setAttribute("title", t("common.langToggleAria", {}, lang));
    });
  };

  const applyLanguage = (lang) => {
    currentLanguage = lang === "zh" ? "zh" : "en";
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
    document.body?.setAttribute("data-language", currentLanguage);

    ensureToggleButtons();
    document.querySelectorAll("[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label]").forEach((el) => {
      updateElement(el, currentLanguage);
    });
    syncToggleButtons(currentLanguage);

    document.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: { language: currentLanguage }
      })
    );
    document.dispatchEvent(new CustomEvent("nav:refresh"));
  };

  const setLanguage = (lang) => {
    const normalized = lang === "zh" ? "zh" : "en";
    setStoredLanguage(normalized);
    applyLanguage(normalized);
  };

  window.labI18n = {
    applyLanguage,
    getLanguage: () => currentLanguage,
    setLanguage,
    t
  };

  document.addEventListener("DOMContentLoaded", () => {
    ensureToggleButtons();
    applyLanguage(getStoredLanguage());
  });
})();
