/**
 * Fallback when fetch("./mainpage/directions/directions.json") is unavailable
 * (e.g. opening index.html via file://). Keep in sync with mainpage/directions/directions.json.
 */
window.__LAB_DIRECTIONS__ = {
  "directions": [
    {
      "id": "efficient-computing",
      "title_en": "Efficient foundation model",
      "title_zh": "高效基础模型",
      "intro_en": "Compression, quantization, distillation, and deployment methods for foundation models that reduce computation and memory cost while preserving capability.",
      "intro_zh": "面向基础模型的压缩、量化、蒸馏与部署方法，在保持模型能力的同时降低计算和存储成本。",
      "href": "./mainpage/directions/efficient-computing.html"
    },
    {
      "id": "neuromorphic-ai",
      "title_en": "Efficient embodied AI",
      "title_zh": "高效具身智能",
      "intro_en": "Efficient perception, reasoning, and action learning for embodied AI systems under real-world compute, memory, and latency constraints.",
      "intro_zh": "面向真实场景计算、存储与时延约束的高效具身智能感知、推理与行动学习方法。",
      "href": "./mainpage/directions/neuromorphic-ai.html"
    },
    {
      "id": "ai4science",
      "title_en": "Efficient AI memory",
      "title_zh": "高效 AI 记忆",
      "intro_en": "Efficient memory, retrieval, and long-context mechanisms that help AI systems store, access, and reuse knowledge more effectively.",
      "intro_zh": "高效记忆、检索与长上下文机制，帮助 AI 系统更有效地存储、访问和复用知识。",
      "href": "./mainpage/directions/ai4science.html"
    }
  ]
};
