# BiLLM: Pushing the Limit of Post-Training Quantization for LLMs

This article introduces **BiLLM**, an ICML 2024 paper on extreme post-training quantization for large language models. The key message is that LLMs can be pushed close to **1-bit weight storage** while still maintaining practical performance.

![Figure 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image1.png)

![Figure 2](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image2.png)

As LLMs continue to grow in size, model storage and inference cost become major deployment bottlenecks. Binarization is an attractive direction because it can reduce weights to an extremely low precision, but naive binarization usually destroys model quality. BiLLM tackles this problem with a more careful treatment of different weight groups.

## 1. Weight distribution insight

The paper begins by analyzing the weight and Hessian distributions of pretrained LLMs. Two observations are especially important:

- The Hessian exhibits a strong long-tail pattern, which suggests that only a small subset of weights is highly sensitive.
- The overall weight distribution is bell-shaped and centered near zero, meaning many weights are redundant while a smaller subset is much more important.

These observations suggest that not all weights should be treated the same during binarization.

![Figure 3](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image3.png)

## 2. Salient weights: binary residual approximation

BiLLM identifies **salient channels** that contain the most important weights. Instead of keeping those weights in high precision, the paper proposes a more efficient alternative: use a **binary residual approximation** to better preserve them.

This allows the method to protect critical weights without paying the full cost of storing them in 8-bit or 16-bit precision.

![Figure 4](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image4.png)

## 3. Non-salient weights: optimal bell-shaped grouping

For the remaining large set of non-salient weights, the paper notes that the distribution becomes even more symmetric after salient weights are separated out. Direct binary rounding still causes large quantization error, so BiLLM introduces a **grouped binarization strategy** with an automatically searched partition point.

The idea is to better fit the bell-shaped distribution rather than forcing all weights through a uniform extreme quantizer.

![Figure 5](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image5.png)

## 4. Why BiLLM is interesting

BiLLM is important because it pushes post-training LLM quantization much further than standard low-bit methods. Instead of stopping at 4-bit or 8-bit weights, it explores whether **near-1-bit quantization** can still work for pretrained LLMs.

Its central lesson is that ultra-low-bit compression becomes feasible when:

- important and unimportant weights are separated structurally,
- salient weights receive stronger approximation,
- the bell-shaped structure of remaining weights is respected.

## 5. Takeaway

BiLLM is a strong example of how distribution-aware design can make **extreme LLM compression** practical. It shows that 1-bit-style post-training quantization is not only a theoretical curiosity, but a serious direction for efficient LLM deployment.
