# HarmoniCa: Harmonizing Training and Inference for Better Feature Caching in Diffusion Transformer Acceleration

This article introduces **HarmoniCa**, an ICML 2025 paper on accelerating **Diffusion Transformers (DiTs)** through learned feature caching. The core goal is to achieve significant speedup while preserving generation quality.

Paper: https://arxiv.org/abs/2410.01723  
Code: https://github.com/ModelTC/HarmoniCa

![Figure 1](publications/md/harmonica-harmonizing-training-and-inference-for-better-feature-caching-in-diffusion-transformer-acceleration_cn_assets/image1.png)

![Figure 2](publications/md/harmonica-harmonizing-training-and-inference-for-better-feature-caching-in-diffusion-transformer-acceleration_cn_assets/image2.png)

Diffusion Transformers have become strong generators for high-resolution content, but they remain expensive at inference time because denoising requires many repeated computations across time steps. Feature caching has emerged as a promising acceleration strategy, but previous methods often suffer from a mismatch between **how the cache is trained** and **how the cache is actually used during inference**.

## 1. What is broken in existing cache learning

The paper identifies two major problems:

- **No awareness of previous timesteps during training**: the training phase ignores the cache history, while inference strongly depends on previously cached features.
- **Objective mismatch**: training often optimizes intermediate denoising error, while inference quality is determined by the final generated image.

Because of this mismatch, previous learned caching methods either deliver limited speedup or noticeably degrade image quality.

![Figure 3](publications/md/harmonica-harmonizing-training-and-inference-for-better-feature-caching-in-diffusion-transformer-acceleration_cn_assets/image3.png)

## 2. HarmoniCa: training and inference are aligned

HarmoniCa addresses the problem by explicitly **harmonizing training and inference**. The paper proposes two central ideas:

- **Step-Wise Denoising Training (SDT)**: training is made more consistent with the actual timestep-by-timestep inference process.
- **Image Error Proxy-Guided Objective (IEPO)**: instead of optimizing only local denoising discrepancies, the method uses a proxy more aligned with final image quality.

This makes cache learning better reflect real deployment behavior.

![Figure 4](publications/md/harmonica-harmonizing-training-and-inference-for-better-feature-caching-in-diffusion-transformer-acceleration_cn_assets/image4.png)

## 3. Why this matters for DiT deployment

The value of HarmoniCa is practical. DiTs are powerful but often too slow for real applications. A caching framework only becomes useful if it can:

- reduce repeated computation,
- maintain image fidelity,
- and remain stable under real inference conditions.

HarmoniCa is designed around exactly these requirements.

The framework demonstrates that acceleration is not just a systems problem or just a learning problem. It requires the optimization target and the runtime behavior to be consistent.

## 4. Takeaway

HarmoniCa provides a deployment-oriented answer to diffusion acceleration: if cache learning is trained under objectives and trajectories that match inference, feature caching becomes much more reliable. This makes the paper a strong reference for **efficient DiT inference and practical diffusion deployment**.
