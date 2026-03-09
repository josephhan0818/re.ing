const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const langToggle = document.getElementById("langToggle");
const matchBtn = document.getElementById("matchBtn");
const matchResult = document.getElementById("matchResult");
const heroVideoA = document.getElementById("heroVideoA");
const heroVideoB = document.getElementById("heroVideoB");
const heroVideoPlaceholder = document.getElementById("heroVideoPlaceholder");
const generatedGrid = document.getElementById("generatedGrid");
const interviewPhoto = document.getElementById("interviewPhoto");
const interviewTag = document.getElementById("interviewTag");
const interviewName = document.getElementById("interviewName");
const interviewQuote = document.getElementById("interviewQuote");
const interviewPrev = document.getElementById("interviewPrev");
const interviewNext = document.getElementById("interviewNext");
const interviewCarousel = document.getElementById("interviewCarousel");

let generatedImageFiles = [];
let interviewIndex = 0;
let interviewAutoplayTimer = null;
let heroVideoFiles = [];
let heroVideoIndex = 0;
let heroVideoActiveSlot = 0;
let heroVideoTimer = null;

const generatedStories = {
  en: [
    {
      title: "Flowing Material Intelligence",
      body: "A soft macro language that visualizes recycled fibers as premium design resources ready for industrial implementation."
    },
    {
      title: "Pellet-to-Product Transition",
      body: "Shows how feedstock can evolve into manufacturable forms, bridging Taiwan suppliers with European design specifications."
    },
    {
      title: "Human-Centered Circular Workspace",
      body: "Expresses an organic production environment where tactile prototyping, sustainability data, and product aesthetics converge."
    }
  ],
  zh: [
    {
      title: "流動材質洞察",
      body: "以柔和微距語言呈現再生纖維，將廢材轉為可導入產線的高質感設計資源。"
    },
    {
      title: "顆粒到產品的轉譯",
      body: "展示材料顆粒如何轉化為可量產形式，連接臺灣供應能力與歐洲設計規格。"
    },
    {
      title: "以人為本的循環工作場景",
      body: "呈現有機製造環境，讓觸覺打樣、永續數據與產品美學在同一流程中整合。"
    }
  ]
};

const interviewProfiles = {
  en: [
    {
      name: "Better Future Factory",
      tag: "Upcycling / Design",
      quote: "Turning waste streams into meaningful products with measurable circular value.",
      image: "professional-portrait-photo-of-better-future-fac-2026-02-25T06-06-02-657Z.jpg"
    },
    {
      name: "Plastic Industrie Utrecht",
      tag: "Manufacturing / Transformation",
      quote: "Scaling bio-material innovation into practical and repeatable production capacity.",
      image: "professional-portrait-photo-of-plastic-industrie-2026-02-25T06-06-15-777Z.jpg"
    },
    {
      name: "Holland Circular Hotspot",
      tag: "Policy / Government",
      quote: "Connecting policy, business, and design actors to build a stronger circular ecosystem.",
      image: "professional-portrait-photo-representing-holland-2026-02-25T06-06-28-458Z.jpg"
    },
    {
      name: "Caroli Buitenhuis",
      tag: "Material Lab",
      quote: "Exploring bio-resource prototypes that open new pathways for sustainable product design.",
      image: "caroli.jpg"
    }
  ],
  zh: [
    {
      name: "Better Future Factory",
      tag: "升級再造 / 設計",
      quote: "將廢棄物流轉化為具市場價值的循環產品。",
      image: "professional-portrait-photo-of-better-future-fac-2026-02-25T06-06-02-657Z.jpg"
    },
    {
      name: "Plastic Industrie Utrecht",
      tag: "製造 / 轉型",
      quote: "把生質材料創新轉譯為可重複、可量產的製程能力。",
      image: "professional-portrait-photo-of-plastic-industrie-2026-02-25T06-06-15-777Z.jpg"
    },
    {
      name: "Holland Circular Hotspot",
      tag: "政策 / 政府",
      quote: "串連政策、企業與設計社群，打造更強的循環經濟生態系。",
      image: "professional-portrait-photo-representing-holland-2026-02-25T06-06-28-458Z.jpg"
    },
    {
      name: "Caroli Buitenhuis",
      tag: "材料實驗室",
      quote: "透過生物資源原型實驗，開啟永續產品設計的新可能。",
      image: "caroli.jpg"
    }
  ]
};

let currentLang = "en";

const i18n = {
  en: {
    navCases: "Case Studies",
    navAnalysis: "Capability Analysis",
    navMatching: "Resource Matching",
    navMedia: "Podcast/Media",
    heroEyebrow: "From Taiwan to Europe: A Circular Industry Action Guide",
    heroTitle: "Bridging Taiwan's Manufacturing Power with Europe's Sustainable Design.",
    heroSubtitle:
      "An open-source action guide and matchmaking platform for the circular economy transition.",
    heroVideoHint: "",
    heroVideoEmpty: "1920 × 1080 video slot reserved. Add files to assets/videos and update manifest.json.",
    ctaPrimary: "Explore European Cases",
    ctaSecondary: "Find Taiwan Partners",
    whyTitle: "Why this platform matters",
    missionTitle: "Motivation & Project Objectives",
    missionP1:
      "As global sustainability accelerates, Europe leads in sustainable design. Taiwan has strong materials and design talent, yet lacks a long-term physical exchange platform in Europe, limiting collaboration depth.",
    missionP2:
      "I am deeply passionate about promoting innovative and meaningful ideas. Through my student projects and two years at Dot Design, I realized I want to share Taiwan's strengths with Europe while bringing European sustainability insights closer to Taiwan industries.",
    missionP3:
      "Therefore, I am building an open platform titled Circular Design Action Guide: Taiwan to Europe, helping the public understand sustainable design and discover collaboration-ready resources more efficiently.",
    missionP4:
      "This leads to a 3-month Deep Interview Program with Europe's sustainability design sector as the essential first step of the larger platform roadmap.",
    goalTitle: "Project Goals",
    goalP1:
      "The core goal is to interview outstanding European sustainability professionals and organizations, document their stories, and open a two-way bridge between Europe and Asia's circular industries.",
    goalP2:
      "Website content will be updated in parallel. The first public version is scheduled for December 2026, offering a free preview and pathways for expert matchmaking.",
    insightTitle: "Insight",
    insightDesc: "Deep-dive interviews with Dutch sustainability pioneers.",
    analysisTitle: "Analysis",
    analysisDesc: "Practical roadmap analysis for traditional industries.",
    connectionTitle: "Connection",
    connectionDesc: "Matching Taiwan's recycled materials with EU design needs.",
    dbTitle: "European Case Studies & Capability Analysis",
    dbSubtitle: "Interview targets and ecosystem capabilities",
    generatedTitle: "Organic Visual Lab",
    generatedSubtitle:
      "AI-generated visuals aligned with circular material transition and tactile product storytelling.",
    card1: "Capability: Turning waste into products.",
    card1Intro: "A design-led pioneer turning circular prototypes into market-ready products.",
    card2: "Capability: Mass production with bio-materials.",
    card2Intro: "An industrial partner translating bio-based materials into scalable production lines.",
    card3: "Capability: Circular economy ecosystem building.",
    card3Intro: "A key ecosystem connector aligning policy, investment, and circular action.",
    card4: "Capability: Bio-resource prototypes.",
    card4Intro: "A material lab exploring bio-resource experiments for next-generation design.",
    interviewTitle: "Interview Spotlight",
    interviewSubtitle: "Professional profile carousel of interview units and one-line positioning.",
    carouselPrev: "Previous",
    carouselNext: "Next",
    matchTitle: "Resource Matching Simulation",
    matchSubtitle: "Preview of the industrial matchmaking workflow",
    fieldRole: "I am a...",
    fieldNeed: "Looking for...",
    matchBtn: "Run Match",
    matchResult: "Match Found: Taiwan Recycled Material Co. + Dutch Design Studio.",
    mediaTitle: "Podcast & Articles",
    podcastTitle: "Ep.1: Secrets of Blue City Rotterdam.",
    articleTitle: "Opinion: How Taiwan's SMEs can meet EU's 2030 ESG Standards.",
    readArticle: "Read Article",
    footerSupport: "Supported by: Youth 10 Billion Overseas Dream Fund (Proposed).",
    footerContact: "Contact",
    footerAuthor: "About the Author (Joseph Han)",
    footerPolicy: "Open Data Policy"
  },
  zh: {
    navCases: "案例資料庫",
    navAnalysis: "能力分析",
    navMatching: "資源媒合",
    navMedia: "Podcast / 媒體",
    heroEyebrow: "從臺灣到歐洲：循環產業行動指南",
    heroTitle: "串接臺灣製造實力與歐洲永續設計。",
    heroSubtitle: "一個開源行動指南與媒合平台，加速循環經濟轉型。",
    heroVideoHint: "",
    heroVideoEmpty: "已預留 1920 × 1080 影片區塊，請將影片放入 assets/videos 並更新 manifest.json。",
    ctaPrimary: "探索歐洲案例",
    ctaSecondary: "尋找臺灣夥伴",
    whyTitle: "為何需要這個平台",
    missionTitle: "動機與計劃目標",
    missionP1:
      "全球永續轉型浪潮下，歐洲為永續設計領航者。台灣擁有卓越的永續材料與設計力，卻缺乏一個實體、長期的歐洲交流平台，導致商機與合作多為短期，難以深化。",
    missionP2:
      "我一直以來都對於推廣創新且有益的事物有巨大的熱忱。如今在工作期間，我意識到自己希望將台灣的好東西跟歐洲分享，也希望歐洲永續領域的資訊能更無礙地與台灣產業交流。",
    missionP3:
      "因此，我打算製作一個「從台灣到歐洲：循環產業指南」的網路公開資訊平台，讓大眾更認識永續設計領域，也更容易找到可以合作對應的資源。",
    missionP4:
      "我構思了為期三個月的「歐洲永續設計產業深度訪談企劃」，希望藉由補助計畫推動企劃不可或缺的第一步。",
    goalTitle: "計劃目標",
    goalP1:
      "本企劃將約訪優秀的歐洲永續產業專家，透過永續設計師與資源單位訪談，記錄其故事於平台曝光，提供歐亞循環產業雙向交流管道。",
    goalP2:
      "同步更新網站資料，預計於 2026 年 12 月推出第一版公開資訊網頁，提供大眾免費預覽與專家媒合機會。",
    insightTitle: "洞察",
    insightDesc: "深度訪談荷蘭永續先行者。",
    analysisTitle: "分析",
    analysisDesc: "為傳統產業提供可落地的轉型路徑。",
    connectionTitle: "連結",
    connectionDesc: "媒合臺灣再生材料與歐洲設計需求。",
    dbTitle: "歐洲案例研究與能力分析",
    dbSubtitle: "訪談對象與生態系能力地圖",
    generatedTitle: "有機視覺實驗室",
    generatedSubtitle: "以 AI 生成符合循環材料轉型與觸覺產品敘事的視覺素材。",
    card1: "能力：將廢棄物轉化為產品。",
    card1Intro: "設計導向的先行者，將循環原型轉化為可進入市場的產品。",
    card2: "能力：以生質材料進行量產轉型。",
    card2Intro: "擅長把生質材料方案導入可擴張的量產流程。",
    card3: "能力：建構循環經濟生態系。",
    card3Intro: "關鍵生態系節點，協調政策、投資與產業落地合作。",
    card4: "能力：生物資源原型開發。",
    card4Intro: "材料實驗室，專注下一代生物資源與循環材料原型。",
    interviewTitle: "受訪單位焦點輪播",
    interviewSubtitle: "以專業形象照與一句話定位，快速理解各受訪單位價值。",
    carouselPrev: "上一位",
    carouselNext: "下一位",
    matchTitle: "資源媒合模擬",
    matchSubtitle: "工業媒合流程預覽",
    fieldRole: "我是...",
    fieldNeed: "正在尋找...",
    matchBtn: "開始媒合",
    matchResult: "配對成功：Taiwan Recycled Material Co. + Dutch Design Studio。",
    mediaTitle: "Podcast 與文章",
    podcastTitle: "第 1 集：藍色城市鹿特丹的關鍵祕密。",
    articleTitle: "觀點：臺灣中小企業如何對接歐盟 2030 ESG 標準。",
    readArticle: "閱讀文章",
    footerSupport: "支持單位：青年百億海外圓夢基金（提案中）。",
    footerContact: "聯絡我們",
    footerAuthor: "關於作者（韓松庭）",
    footerPolicy: "開放資料政策"
  }
};

const applyLanguage = (lang) => {
  document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";
  const dict = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
  langToggle.textContent = lang === "en" ? "EN / ZH-TW" : "ZH-TW / EN";
  renderGeneratedGallery(lang);
  renderInterviewProfile(lang, interviewIndex);
};

const renderInterviewProfile = (lang, index, withTransition = true) => {
  if (!interviewPhoto || !interviewTag || !interviewName || !interviewQuote) {
    return;
  }

  const list = interviewProfiles[lang] || interviewProfiles.en;
  if (!Array.isArray(list) || !list.length) {
    return;
  }

  const safeIndex = (index + list.length) % list.length;
  const applyProfile = () => {
    interviewIndex = safeIndex;
    const profile = list[safeIndex];
    interviewPhoto.src = `./assets/images/${profile.image}`;
    interviewPhoto.alt = profile.name;
    interviewTag.textContent = profile.tag;
    interviewName.textContent = profile.name;
    interviewQuote.textContent = profile.quote;
  };

  if (!withTransition || !interviewCarousel) {
    applyProfile();
    return;
  }

  interviewCarousel.classList.add("is-changing");
  window.setTimeout(() => {
    applyProfile();
    interviewCarousel.classList.remove("is-changing");
  }, 380);
};

const renderGeneratedGallery = (lang) => {
  if (!generatedGrid) {
    return;
  }

  const files = generatedImageFiles.slice(0, 3);
  if (!files.length) {
    generatedGrid.innerHTML = "";
    return;
  }

  const stories = generatedStories[lang] || generatedStories.en;
  generatedGrid.innerHTML = files
    .map((file, index) => {
      const story = stories[index] || stories[stories.length - 1];
      return `
        <article class="generated-card card-tilt">
          <figure>
            <img src="./assets/images/${file}" alt="${story.title}" loading="lazy" />
          </figure>
          <div class="generated-copy">
            <h3>${story.title}</h3>
            <p>${story.body}</p>
          </div>
        </article>
      `;
    })
    .join("");

};

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

const tactileTargets = Array.from(document.querySelectorAll(".btn, .lang-toggle"));

const applyMagnetic = (element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const offsetY = (event.clientY - rect.top - rect.height / 2) / rect.height;
    element.style.transform = `translate(${offsetX * 9}px, ${offsetY * 7}px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });

  element.addEventListener("pointerdown", () => {
    element.classList.add("is-pressed");
  });

  const release = () => element.classList.remove("is-pressed");
  element.addEventListener("pointerup", release);
  element.addEventListener("pointercancel", release);

  element.addEventListener("click", (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty("--rx", `${x}%`);
    element.style.setProperty("--ry", `${y}%`);
    element.classList.remove("ripple");
    window.requestAnimationFrame(() => element.classList.add("ripple"));
    window.setTimeout(() => element.classList.remove("ripple"), 620);
  });
};

tactileTargets.forEach(applyMagnetic);

window.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  document.body.style.setProperty("--mx", `${x}%`);
  document.body.style.setProperty("--my", `${y}%`);
});

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "zh" : "en";
  applyLanguage(currentLang);
});

if (interviewPrev && interviewNext) {
  interviewPrev.addEventListener("click", () => {
    renderInterviewProfile(currentLang, interviewIndex - 1, true);
    restartInterviewAutoplay();
  });

  interviewNext.addEventListener("click", () => {
    renderInterviewProfile(currentLang, interviewIndex + 1, true);
    restartInterviewAutoplay();
  });
}

const restartInterviewAutoplay = () => {
  if (interviewAutoplayTimer) {
    window.clearInterval(interviewAutoplayTimer);
  }
  interviewAutoplayTimer = window.setInterval(() => {
    renderInterviewProfile(currentLang, interviewIndex + 1, true);
  }, 7600);
};

const playHeroVideo = (index) => {
  if (!heroVideoA || !heroVideoB || !heroVideoFiles.length) {
    return;
  }

  const videos = [heroVideoA, heroVideoB];
  const nextSlot = heroVideoActiveSlot === 0 ? 1 : 0;
  const activeVideo = videos[heroVideoActiveSlot];
  const nextVideo = videos[nextSlot];
  const safeIndex = (index + heroVideoFiles.length) % heroVideoFiles.length;
  const source = `./assets/videos/${heroVideoFiles[safeIndex]}`;

  heroVideoIndex = safeIndex;
  nextVideo.src = source;
  nextVideo.load();

  const reveal = () => {
    nextVideo.classList.add("active");
    activeVideo.classList.remove("active");
    heroVideoActiveSlot = nextSlot;
    nextVideo.play().catch(() => {});
  };

  if (nextVideo.readyState >= 2) {
    reveal();
    return;
  }

  nextVideo.oncanplay = () => {
    nextVideo.oncanplay = null;
    reveal();
  };
};

const startHeroVideoAutoplay = () => {
  if (heroVideoTimer) {
    window.clearInterval(heroVideoTimer);
  }
  heroVideoTimer = window.setInterval(() => {
    playHeroVideo(heroVideoIndex + 1);
  }, 9000);
};

matchBtn.addEventListener("click", () => {
  const role = document.getElementById("role").value.trim() || "Designer";
  const need = document.getElementById("need").value.trim() || "Recycled Plastic Supplier";

  if (currentLang === "en") {
    matchResult.textContent = `Match Found for ${role} seeking ${need}: Taiwan Recycled Material Co. + Dutch Design Studio.`;
  } else {
    matchResult.textContent = `已為「${role}」配對「${need}」：Taiwan Recycled Material Co. + Dutch Design Studio。`;
  }
});

const loadMediaSources = async () => {
  try {
    const [imageManifestRes, videoManifestRes] = await Promise.all([
      fetch("./assets/images/manifest.json", { cache: "no-cache" }).catch(() => null),
      fetch("./assets/videos/manifest.json", { cache: "no-cache" }).catch(() => null)
    ]);

    if (imageManifestRes?.ok) {
      const imageManifest = await imageManifestRes.json();
      generatedImageFiles =
        (Array.isArray(imageManifest?.latest) && imageManifest.latest.length
          ? imageManifest.latest
          : Array.isArray(imageManifest?.files)
            ? imageManifest.files
            : []) || [];
    }

    if (videoManifestRes?.ok) {
      const videoManifest = await videoManifestRes.json();
      heroVideoFiles =
        (Array.isArray(videoManifest?.latest) && videoManifest.latest.length
          ? videoManifest.latest
          : Array.isArray(videoManifest?.files)
            ? videoManifest.files
            : []) || [];
    }

    if (heroVideoFiles.length && heroVideoA && heroVideoB) {
      if (heroVideoPlaceholder) {
        heroVideoPlaceholder.style.display = "none";
      }
      heroVideoA.src = `./assets/videos/${heroVideoFiles[0]}`;
      heroVideoA.classList.add("active");
      heroVideoA.load();
      heroVideoA.play().catch(() => {});
      heroVideoIndex = 0;
      startHeroVideoAutoplay();
    } else if (heroVideoPlaceholder) {
      heroVideoPlaceholder.style.display = "grid";
    }

    renderGeneratedGallery(currentLang);
  } catch (error) {
    console.warn("Banner manifest not available, using placeholder.", error?.message);
    renderGeneratedGallery(currentLang);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  applyLanguage(currentLang);
  loadMediaSources();
  renderInterviewProfile(currentLang, interviewIndex, false);
  restartInterviewAutoplay();
});
