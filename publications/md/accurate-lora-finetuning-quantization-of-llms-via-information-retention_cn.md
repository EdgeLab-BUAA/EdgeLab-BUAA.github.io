# 信息引导的量化后LLM微调？北航&ETH提出新范式！

近日，机器学习顶会 ICML 2024 接收论文结果已经正式公布。在 9473 篇有效投稿中，最终有 2609 篇论文被接收，录取率约为 27.5%。本文将介绍一种旨在信息引导的量化后LLM微调新算法 IR-QLoRA，研究者来自北航和苏黎世联邦理工大学，论文已被 ICML 2024 接收。

原始文章：
https://www.qbitai.com/2024/04/136275.html

![图片 7](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image1.png)

论文地址：https://arxiv.org/pdf/2402.05445  
代码地址：https://github.com/htqin/IR-QLoRA

大语言模型（LLM）在各种自然语言理解任务中表现出了卓越的能力，并被确立为该领域的杰出范例。最近值得注意的 LLM 实例例如最近 Meta 的 LLaMA -3系列，超15T Token数据上的超大规模预训练，实现了令人印象深刻的性能提升。

尽管如此，这些大语言模型的卓越表现取决于广泛的参数和计算资源。例如，PaLM-540B 模型拥有令人印象深刻的 5400 亿个参数，需要巨大的计算需求。这一现实对在资源有限的环境中部署大语言模型出了巨大的挑战。近日，研究者们也公布了一项实证研究，全面评估LLaMA3的低比特量化性能（https://mp.weixin.qq.com/s/ou-mX9AoQTX7tWL6CWXiaQ）

为了实现了计算成本和准确性之间的平衡权衡，大语言模型的 LoRA 微调量化出现了，其中大语言模型首先被量化，然后使用参数高效的 LoRA 进行微调。然而，现有的采用 LoRA 的量化大语言模型在准确性方面仍远未达到理想水平。

为此，作者提出了一种基于信息引导的微调方法IR-QLoRA，用于通过信息保留来精确调整 LoRA 微调 LLM 量化，框架如下图所示：

图1 IR-QLoRA框架图，包括用于量化LLM的信息校准量化和用于增强LoRA的信息弹性连接

![图片 9](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image2.png)

其包含从统一信息角度衍生的两种技术：信息校准量化和信息弹性连接。

## 信息校准量化

LLM的量化权重被期望反映原始对应方所携带的信息，但比特宽度的减小严重限制了表示能力。从信息的角度来看，量化LLM和原始LLM的权重之间的相关性表示为互信息

IwFP16;w=HwFP16-HwFP16|w#1

在LLM量化后，由于比特宽度的显著减小导致表示能力的降低，量化权重的熵远小于原始权重的熵。因此，优先考虑低比特权重内的信息恢复对于增强量化LLM至关重要。

首先从数学上定义信息校准的优化目标。校准过程可以看为向量化器引入一个校准常数 τ 以最大化信息，量化过程可以表述如下：

w=NFkw-τdequantFP8s1FP8, s2FP16#2

由于原始权重w是固定的，公式(1)中的优化目标可以表示为

argmaxwHw;τ,s1FP8, s2FP16#3

由于直接求解公式（3）中的目标非常耗时，作者提出了一种分块校准量化器信息的两步策略：

- 第一步是初始化校准常数 τ。基于神经网络权重正态分布的常见假设，将每个权重量化块的常数初始化为中值 τ0 = qw12。由于正态分布中靠近对称轴的区域的概率密度较高，因此该初始化旨在更大程度地利用量化器的间隔。应用位置相关中值来初始化τ0，以减轻异常值的影响。

- 第二步是优化校准常数τ、量化尺度s1、双量化尺度s2。使用信息熵作为度量，并进行基于搜索的优化以获得τ* 。通过将 [τ0 - λσ, τ0 - λσ] 线性划分为 n 个候选来创建 τ 的搜索空间，其中 σ 是的标准差，λ 是系数。使用每个候选 τ 校准权重后，量化校准的权重并计算信息熵。获得的量化尺度与基线一致。通过absmaxw-τ得到量化尺度s1FP16 ，然后二次量化为s1FP8和s2FP16。

对于优化后的校准常数τ*，执行类似于尺度的双量化以节省内存，信息校准量化的量化过程可以总结为：

wICQ=NFkw-dequantFP8τ1FP8, τ2FP16dequantFP8s1FP8, s2FP16#4

## 信息弹性连接

除了基线中的量化LLM之外，由低秩矩阵组成的LoRA也阻碍了信息的恢复，为了增强 LoRA 的表示能力，帮助恢复量化 LLM 的信息，同时保持其轻量级性质，作者引入了有效的信息弹性连接。该方法构建了一个强大的低秩适配器，有助于利用从量化的 LLM 单元导出的信息。

具体来说，首先根据输入和中间维度的最大公约数对原始特征进行分组和平均，并将其添加到由 l1 矩阵计算的输出中。增加弹性连接的 LoRA 的第一个子单元 U1 可以表示为：

U1x=xl1+α1Gh,rhi=1hGh,rxi-1Gh,r,iGh,r-1 #11

LoRA 的后一个矩阵将低秩中间表示变换为输入维度，因此其伴随的无参数变换使用重复串联来增加维度。后一个子单元U2的计算过程可以表示为：

U2x=x'l2+α2i=1oGo,rx'i-1Go,r, iGo,r-1 #11

与LLM和LoRA单元中的矩阵乘法相比，无参数变换是一种多样化的变换形式，进一步增强了量化LLM的信息表示。

## 实验验证

作者广泛评估了IR-QLoRA 的准确性和效率。选择LLaMA和LLaMA2系列模型，在 Alpaca和 Flanv2数据集上构建参数高效的微调，使用MMLU和 CommonsenseQA基准进行评估微调后量化模型的效果。

### 准确率

表 1 和表 2 分别展示了在 Alpaca和 Flanv2数据集上微调的 MMLU 基准的 5-shot精度结果。综合结果表明，在各种规模的 LLaMA 模型中，IR-QLoRA 始终以令人信服的优势优于所有比较量化方法。与基线方法 QLoRA 相比，IR-QLoRA 在相同的微调管道下在 MMLU 基准上实现了精度的显着提高。

表1 LLaMA 在 Alpaca 数据集上微调的 MMLU 基准上的准确率 (%) 比较
![图片 1](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image3.png)

表2 LLaMA 在 FLAN v2数据集上微调的 MMLU 基准上的准确率 (%) 比较
![图片 2](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image4.png)

此外，在LLaMA2 进行了准确性比较，证明了所提出的 IR-QLoRA 跨 LLM 系列的泛化性能。表 3 中的结果表明，IR-QLoRA不仅平均实现了至少 2.7% 的性能改进，而且在几乎每个单独的指标上都表现出了优势。这些结果表明 IR-QLoRA 在不同的 LLM 系列中表现出很强的泛化性。

表3 LLaMA2 在 MMLU 基准上的准确率 (%) 比较
![图片 6](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image5.png)

与 MMLU 基准上的现象类似，在 CommonsenseQA 基准上，与 SOTA 方法相比，我们的 IR-QLoRA 始终保持了 LLaMA-7B 的最佳平均准确率，而且还显著提高了大多数子项的有效性。

表4 LLaMA2 在 CommonsenseQA 基准上的准确率 (%) 比较
![图片 11](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image6.png)

### 超低位宽

除了4比特以外，作者还评估了超低位宽下的 IR-QLoRA 建议。具体来说，我们采用了 QLoRA和 LoftQ的量化方法，按照百分位量化方法构建了 NF2 和 NF3 量化。表 5 显示，随着量化位宽的减小，基线 QLoRA 的性能急剧下降，以至于其在 2 位情况下的性能与随机相差无几。相比之下，IR-QLoRA 表现出更优越的性能，在 Flan v2 数据集上微调 2 位模型时，与 16 位模型相比仅有 0.9% 的精度差异。

表5 LLaMA2 在 MMLU 基准上的准确率 (%) 比较
![图片 10](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image7.png)

### 效率

IR-QLoRA的信息校准量化和信息弹性连接并没有带来额外的存储和训练开销。

表6 不同系列LLaMA的效率消融实验
![图片 14](publications/md/accurate-lora-finetuning-quantization-of-llms-via-information-retention_cn_assets/image8.png)

如表6所示，信息校准量化增加的参数仅相当于量化的缩放因子，而且采用了双重量化以进一步减少存储。因此其带来的额外存储空间很小，在 4 位 LLaMA-7B 上仅增加了 2.04%。校准常数的优化过程也只增加了微不足道的训练时间（例如，LLamA-7B 为 0.46%，LLaMA-13B 为 0.31%）。此外，增加的时间仅用于训练过程中的初始优化，并不会导致推理时间的增加。信息弹性连接也只在每层引入了 2 个额外参数，在整个模型中可以忽略不计。

## 结论

总的来说，基于统计的信息校准量化可确保 LLM 的量化参数准确保留原始信息；以及基于微调的信息弹性连接可以使 LoRA 能够利用不同信息进行弹性表示转换。广泛的实验证明，IRQLoRA 在 LLaMA 和 LLaMA2 系列中实现了令人信服的精度提升，即使是 2-4 位宽，耗时也仅增加了 0.45%。IR-QLoRA 具有显著的多功能性，可与各种量化框架无缝集成。IR-QLoRA 大大提高了 LLM 的 LoRA-finetuning 量化精度，有助于在资源受限的情况下进行实际部署。
