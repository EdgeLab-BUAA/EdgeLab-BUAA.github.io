/**
 * Fallback when fetch("./mainpage/directions/directions.json") is unavailable
 * (e.g. opening index.html via file://). Keep in sync with mainpage/directions/directions.json.
 */
window.__LAB_DIRECTIONS__ = {
  "directions": [
    {
      "id": "efficient-computing",
      "title_en": "Efficient Computing",
      "title_zh": "高效计算",
      "intro_en": "Compression, quantization, distillation, and systems that make models smaller, faster, and cheaper to run—from LLMs to vision and segmentation.",
      "intro_zh": "压缩、量化、蒸馏与系统优化，让模型更小、更快、更省算力，覆盖大语言模型、视觉与分割等方向。",
      "href": "./mainpage/directions/efficient-computing.html"
    },
    {
      "id": "neuromorphic-ai",
      "title_en": "Neuromorphic AI",
      "title_zh": "神经形态 AI",
      "intro_en": "Spiking and event-driven paradigms that target low latency and energy-aware inference at the edge and in neuromorphic hardware.",
      "intro_zh": "脉冲与事件驱动范式，面向低延迟、低功耗推理，服务边缘端与神经形态硬件上的智能应用。",
      "href": "./mainpage/directions/neuromorphic-ai.html"
    },
    {
      "id": "ai4science",
      "title_en": "AI4Science",
      "title_zh": "AI4Science",
      "intro_en": "Learning methods for scientific discovery and domain benchmarks—turning large models and efficient training into practical scientific tools.",
      "intro_zh": "面向科学发现的学习方法与领域基准，把大模型与高效训练转化为可落地的科研工具。",
      "href": "./mainpage/directions/ai4science.html"
    }
  ]
};
