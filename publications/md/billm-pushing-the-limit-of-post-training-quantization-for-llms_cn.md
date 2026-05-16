# ICML 2024无需训练的极限二值化LLM！大语言模型仅需1.1bit权重，港大ETH北航联合发布

大型语言模型引爆自然语言处理以及多模态等众多领域的革命浪潮，正在全面颠覆学界和业界的发展。然而，随着大语言模型参数量的飞速增长，模型计算的内存和资源面对着更加苛刻的挑战。在这种场景下大语言模型的超低精度量化成为一项重要的研究技术，这一技术有望在资源受限的边缘设备上部署LLM，推动AIGC技术的进一步落地。

香港大学，苏黎世联邦理工学院，北京航空航天大学联合推出无需训练的大语言模型超低精度量化方法BiLLM，以1.1bit的平均权重大小实现了目前最极限的LLM训练后压缩。发布当天，该工作便在Hugging Face社区引发巨大热度，目前已被ICML 2024接收。
![image1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image1.png)

![image2](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image2.png)

（BiLLM整体压缩框架）

## LLM权重分布探究

为了应对超低位宽下大语言模型的能力崩溃问题，研究人员对多个预训练大语言模型的权重和其Hessian矩阵（损失的二阶梯度）分布情况进行了初步研究，得到以下观察：
- 研究人员发现大语言模型的Hessian矩阵表现出极端的长尾分布特性，这也意味着大多数位置权重的变化对模型的输入输出并不敏感，而少部分元素对于权重的输出非常敏感。
- 大语言模型中的权重密度遵循不均匀的钟形分布形式。这种钟形分布在特征方面与高斯分布或拉普拉斯分布非常相似，即大多数权重集中在0附近，整体呈现非均匀的钟形分布。

上述观察表明大多数权重在LLM当中是冗余的，而少部分权重发挥着极其重要的作用；同时，在极端的二值化压缩场景下，这种非均匀钟形分布会产生更大的量化误差。对此，研究人员对少部分显著权重和大部分非显著权重分别提出了二阶残差逼近和最优钟形分组方法进行量化，在1.1bit的权重下首次实现了LLM的性能保证。
![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image3.png)

（LLM权重分布现象）

## 显著权重：二阶残差逼近

研究人员发现，显著权重往往积聚在特定的通道当中。因此， BiLLM采用一种通道级别的分组方式来区分显著权重和非显著权重。这种结构化划分相比于非结构化处理引入的开销可以忽略不计，对硬件部署十分友好。
![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image4.png)

（显著通道权重二阶残差逼近示意图）

由于显著权重的重要性，先前工作往往直接将这部分权重保存为原精度或量化到8-bit来保证LLM的性能。然而，这种方式会导致整体位宽的增加。

为此，研究人员开发了一种用二值化残差逼近方法作用于显著通道的权重。 这一方法通过直接二值化和残差二值化有效降低了显著权重的极端量化误差。与直接保留显着权值为16位或者8位相比，该方法仅通过2位开销存储显着权值，同时有效保护了权重中的重要元素。

## 非显著权重：最优钟形划分

由于显着通道数量极低，剩余的大部分权重仍然保持着钟形分布。同时，在排除显着权重影响的情况下变得更加对称。由于二进制量化代表均匀量化的极端形式，直接将钟形分布下的权重舍入到二值权重会带来巨大的的量化误差。

因此研究人员对这部分权重采用了分组二值化的方式，通过自动搜索策略寻找最优的分割点。此外，研究结果表明，尽管非显着权重并非理想的高斯分布或拉普拉斯分布，但搜索函数的误差曲线仍然表现出凸性，证实了最佳分割点的存在。
![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image5.png)

![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image6.png)

（非显著权重分布搜索-左，搜索误差曲线的凸性-右）

同时由于外侧分组的数值方差较大，搜索中总是以较小的比例出现（0.5%～3%）。可以进一步采用稀疏行压缩的策略来进行分组标识，进一步提升细粒度分组方案下的硬件友好性。

## 实验结果

研究团队在OPT 和 LLaMA系列模型上验证了BiLLM性能。此外，考虑到LLM通常需要基于指令进行微调以适应不同的应用环境，实验还报告了 Vicuna-7B和Vicuna-13B的量化结果。

BiLLM在平均1.1bit权重时，在多个评价指标上实现了超过GPTQ，PB-LLM等方法在2-bit时的性能，同时在部分模型体积上接近3-bit权重的性能。结果表明， BiLLM 率先在接近 1 位的平均比特率下实现了 LLM 性能保证，推动了LLM无训练量化的边界。

![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image7.png)

（opt系列困惑度对比结果）
![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image8.png)

（LLaMA系列困惑度对比结果）
![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image9.png)

（Zero-Shot评测数据集对比结果）

BiLLM在LLaMA-13B和Vicuna-7B上实现了更好对话效果。
![图片 1](publications/md/billm-pushing-the-limit-of-post-training-quantization-for-llms_cn_assets/image10.png)
