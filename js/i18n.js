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
    "common.footer.modelEfficiency": { en: "Model Efficiency", zh: "模型高效化" },
    "common.footer.dataEfficiency": { en: "Data Efficiency", zh: "数据高效化" },
    "common.footer.neuromorphic": { en: "Neuromorphic AI", zh: "神经形态 AI" },
    "common.footer.ai4science": { en: "AI4Science", zh: "AI4Science" },
    "common.langToggle": { en: "中文", zh: "EN" },
    "common.langToggleAria": { en: "Switch to Chinese", zh: "切换到英文" },
    "common.project": { en: "Project", zh: "项目" },

    "page.home.title": { en: "Laboratory Homepage", zh: "实验室主页" },
    "page.home.heroMainTitle": { en: "Efficient and scalable AI computing", zh: "高效可扩展的 AI 计算" },
    "page.home.heroMainBody": {
      en: "Our lab studies model efficiency, data efficiency, label efficiency, neuromorphic computing, and AI4Science, building practical learning systems that are smaller, faster, and easier to deploy.",
      zh: "我们聚焦模型效率、数据效率、标签效率、神经形态计算与 AI4Science，致力于构建更小、更快、更易部署的实用智能学习系统。"
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
    "page.home.counter.neuromorphic": { en: "Neuromorphic AI", zh: "神经形态 AI" },
    "page.home.counter.science": { en: "Science", zh: "科学" },
    "page.home.counter.ai4science": { en: "AI4Science", zh: "AI4Science" },
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
    "page.publications.searchPlaceholder": { en: "e.g. Title, Author, Venue, Year", zh: "例如：标题、作者、会议、年份" },
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
      en: "Our group currently has positions for master-to-Ph.D. (2026), bachelor-to-Ph.D. (2027), and master's candidates (2027). We also welcome students interested in research internships.",
      zh: "课题组目前有 2026 年硕转博/申请考核博士名额，以及 2027 年直博/硕士名额，同时也欢迎对科研实习感兴趣的同学加入。"
    },
    "page.opening.advantagesTitle": { en: "Advantages of Our Research Group", zh: "课题组优势" },
    "page.opening.adv1Title": { en: "Sufficient Computing Resources and Guidance", zh: "充足的算力资源与细致指导" },
    "page.opening.adv1Body1": {
      en: "Our research group is newly established, with sufficient computing resources and startup funding to support your research. With a smaller team at this stage, each member can receive comprehensive guidance and direct support from the supervisor.",
      zh: "课题组成立未久，拥有充足的计算资源和启动经费支撑科研工作。当前团队规模较小，每位成员都能获得导师较为全面、直接的指导与支持。"
    },
    "page.opening.adv1Body2": {
      en: "We provide hands-on mentorship for every new group member, including paper reading, debugging, and research writing. We are committed to thoroughly revising each student's first research paper from start to finish.",
      zh: "我们会手把手带领新成员阅读论文、调试代码并撰写论文，尤其会帮助每位同学对第一篇论文进行从头到尾的系统修改和打磨。"
    },
    "page.opening.adv2Title": { en: "Industry-Relevant Research Topics", zh: "与产业界紧密相关的研究内容" },
    "page.opening.adv2Body1": {
      en: "Our research topics are closely aligned with problems that matter to industry. For students planning to pursue industrial careers, this research experience can provide a significant advantage.",
      zh: "课题组研究内容与产业界关注的问题高度相关。对于计划毕业后进入企业发展的同学，这类研究经历会带来明显优势。"
    },
    "page.opening.adv2Body2": {
      en: "The group encourages students who meet graduation requirements to take research-oriented internships in companies. We have collaborations with ByteDance, Huawei, Baidu, and SenseTime, and outstanding graduates may receive recommendations to these companies or for doctoral or postdoctoral opportunities at the University of Hong Kong, CUHK, the University of Sydney, and Shanghai AI Lab.",
      zh: "课题组鼓励满足毕业要求的同学到企业开展以科研为主的实习，并已与字节、华为、百度、商汤等公司建立合作。优秀毕业生也有机会获得前往相关公司，或赴港大、港中文、悉尼大学、上海 AI Lab 等机构继续攻读博士/博士后的推荐。"
    },
    "page.opening.expectationsTitle": { en: "Expectations for Prospective Students", zh: "对申请同学的期望" },
    "page.opening.exp1Title": { en: "Strong Self-Motivation", zh: "强烈的自驱力" },
    "page.opening.exp1Body": {
      en: "We provide abundant guidance and research resources to all members, and we expect each student to make full use of these resources with strong self-motivation and a commitment to producing meaningful scientific contributions.",
      zh: "课题组会为成员提供充分的指导和科研资源，也希望每位同学能以强烈的自驱力主动利用这些资源，做出真正有价值的科研成果。"
    },
    "page.opening.exp2Title": { en: "Early Engagement in Research", zh: "尽早进入科研状态" },
    "page.opening.exp2Body": {
      en: "Students planning to join the group are welcome to begin their undergraduate thesis and other research projects in the fourth year after securing postgraduate recommendation or admission. Starting early will substantially benefit future development, and papers published during this period can count toward graduate output requirements.",
      zh: "对于有意加入课题组的同学，在确定保研或录取后，欢迎在大四提前进入组里开展毕业设计和其他科研项目。提前一年熟悉科研工作会显著有利于后续发展，该阶段产出的论文也可计入研究生阶段的成果要求。"
    },
    "page.opening.exp3Title": { en: "Robust Self-Learning and Programming Skills", zh: "扎实的自学与编程能力" },
    "page.opening.exp3Body": {
      en: "Students joining the group are expected to be proficient in Python, PyTorch, and basic Linux operations, with solid programming experience. Valuable advantages include ACM competition participation and awards, deep involvement in website development, program design, or open-source projects, and sustained, high-quality professional knowledge sharing.",
      zh: "希望加入课题组的同学熟练掌握 Python、PyTorch 与 Linux 基础操作，并具备扎实的编程经验。ACM 竞赛经历与奖项、深度参与网站开发/程序设计/开源项目，以及长期持续的专业知识分享，都会成为重要加分项。"
    },
    "page.opening.applicationEyebrow": { en: "Application Information", zh: "申请方式" },
    "page.opening.applicationTitle": { en: "Contact us directly with your materials", zh: "请直接通过邮件发送申请材料" },
    "page.opening.applicationBody": {
      en: "If you are interested in applying for a doctoral or master's position, or in joining the group as an intern, please send your resume and academic transcript by email.",
      zh: "如果你希望申请博士、硕士或科研实习岗位，请直接通过邮件发送简历与成绩单。"
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
    "page.contact.success": {
      en: "Thank you for reaching out. We will get back to you within a few days.",
      zh: "感谢你的留言。我们会在几天内与你联系。"
    },

    "dynamic.people.faculty": { en: "Faculty", zh: "教师" },
    "dynamic.people.team1": { en: "Team 1", zh: "第一组" },
    "dynamic.people.team2": { en: "Team 2", zh: "第二组" },
    "dynamic.people.team3": { en: "Team 3", zh: "第三组" },
    "dynamic.people.alumni": { en: "Alumni", zh: "校友" },
    "dynamic.people.error": { en: "Unable to load people data.", zh: "无法加载成员数据。" },
    "dynamic.people.emailCopied": { en: "Email copied!", zh: "邮箱已复制！" },
    "dynamic.people.title.scholar": { en: "Google Scholar", zh: "谷歌学术" },
    "dynamic.people.title.github": { en: "GitHub", zh: "GitHub" },
    "dynamic.people.title.homepage": { en: "Homepage", zh: "主页" },
    "dynamic.people.title.copyEmail": { en: "Copy email", zh: "复制邮箱" },

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
    "dynamic.news.readMore": { en: "Read More", zh: "查看更多" }
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
