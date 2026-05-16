# Accurate LoRA-Finetuning Quantization of LLMs via Information Retention

This article introduces **IR-QLoRA**, an ICML 2024 paper on accurate quantized LoRA finetuning for large language models. The main goal is to improve the quality of **post-quantization LLM finetuning** under tight memory and compute budgets.

Source article:
https://www.qbitai.com/2024/04/136275.html

![Figure 1](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image1.png)

Paper: https://arxiv.org/pdf/2402.05445  
Code: https://github.com/htqin/IR-QLoRA

Large language models have achieved strong performance across a wide range of NLP tasks, but their deployment remains difficult because of their heavy memory and compute requirements. A common practical solution is to first quantize the backbone model and then use **LoRA** for parameter-efficient finetuning. However, existing quantized LoRA pipelines still suffer from notable accuracy loss.

To address this, the paper proposes **IR-QLoRA**, a method built around the idea of **information retention**. The framework contains two key components:

- **Information Calibration Quantization (ICQ)**, which adjusts quantization to preserve more useful information from the original full-precision weights.
- **Information Elastic Connection (IEC)**, which strengthens LoRA's representation ability so it can better recover information lost during quantization.

## 1. Information Calibration Quantization

The paper starts from an information-theoretic view: the quantized weights should retain as much information as possible from the original model weights. In low-bit settings, the representational capacity of quantized weights is sharply reduced, so preserving information becomes especially important.

IR-QLoRA introduces a calibration constant into the quantizer and then searches for a better setting that improves information preservation. Instead of treating quantization only as a scale-and-round operation, the method explicitly optimizes the quantizer so that the resulting low-bit weights remain more informative.

The paper describes a practical two-stage optimization process:

1. Initialize the calibration constant using robust statistics from each quantization block.
2. Search over candidate values and jointly optimize the calibration constant together with quantization scales.

This design leads to better low-bit quantization quality before LoRA finetuning even begins.

## 2. Information Elastic Connection

Quantization is only part of the problem. Even after quantizing the backbone, standard LoRA still has limited capacity to compensate for lost information.

IR-QLoRA therefore adds an **elastic connection** inside the LoRA branch. The idea is to build a stronger low-rank adapter that can reuse and transform information from the quantized backbone more effectively, while still keeping the adapter lightweight.

![Figure 2](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image2.png)

This makes the LoRA pathway more expressive and improves the overall ability of the quantized model to recover downstream-task performance.

## 3. Why this paper matters

The contribution of IR-QLoRA is not just another low-bit finetuning trick. It reframes quantized LoRA finetuning through the lens of **retaining and recovering information**:

- quantization should preserve more useful information at the weight level,
- LoRA should be strengthened to better restore lost information during adaptation,
- both stages should work together instead of being optimized independently.

This is especially valuable for deployment settings where users want:

- lower memory usage,
- lower inference and training overhead,
- but still competitive task accuracy after finetuning.

## 4. Takeaway

IR-QLoRA shows that improving quantized finetuning is not only about choosing a better bit-width. It is also about preserving the right information during quantization and giving LoRA enough flexibility to recover what is lost. This makes the paper a useful reference for anyone working on **efficient LLM adaptation under low-bit constraints**.
