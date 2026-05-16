# TPAMI 2025 时间特征至关重要：面向扩散模型量化的统一框架

仅需时间特征维护——扩散模型以超低精度量化技术重塑图像内容生成！

北京航空航天大学，莫纳什大学，德州奥斯汀联合推出时间特征维护的扩散模型低精度无损量化方法TFMQ-DM，以4bit的权重大小实现了目前无损条件下最极限的扩散模型训练后压缩，同时实现了超过2.38倍真实硬件加速。这一发现再次将Diffusion压缩推向全新的高度。

该工作目前已被CVPR 2024高分接收，并被接收为Highlight Poster (Top 2.8%)。

![Text

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image1.png)

论文地址：https://arxiv.org/abs/2407.19547  
相关代码参考：https://github.com/ModelTC/TFMQ-DM

![Picture 3](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image2.png)

（TFMQDM整体压缩框架）

## Diffusion 中的时间特征扰动

扩散模型由于引入了时间变量 t，于是在模型中注入了时序信息，这正是扩散模型不同于以往传统视觉模型的一大特征。同时该变量也通过将时序特征融入模型去控制去噪过程。研究人员首次定义了时间特征emb，同时发现现有量化算法对于这些特征将产生严重扰动，从而破环图片生成质量：

- 时间特征扰动：研究人员发现量化导致了明显的时间特征误差。并将这种特征错误内的扰动现象称为时间特征扰动；
- 时间信息失配：时间特征扰动改变了原始嵌入的时间信息。具体来说， embt 旨在对应于时间步长 t。然而，由于存在显著的误差，量化模型的 embt 不再准确地与 t 相关联，倾向于与 t+δt对应的时间特征更为接近导致了我们所说的时间信息不匹配；
- 去噪轨迹偏离：时间信息不匹配传递了错误的时间信息，因此导致图像在去噪轨迹中对应的时间位置发生了偏差，最终导致图片不再按原轨迹去噪：xt ⇏ xt-1。
![Chart

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image3.png)

![Chart, line chart

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image4.png)

![Website

Description automatically generated with medium confidence](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image5.png)

（Diffusion中的时间特征扰动）

## 扰动诱因分析

研究人员发现该扰动主要由以下两个原因造成：
- 不合适的重建对象：已有量化重建方法并未直接优化时间特征，同时时间特征将会受到有限的校准数据影响产生过拟合现象，如下图Prev所示，其中Freeze代表冻结相关量化参数；
![Table

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image6.png)

- 忽略了时间特征相关模块中的有限激活：由于输入T是有限整数，因此产生时间特征的模块将仅产生有限且随时间变化的激活，而已有量化策略均考虑分布层级优化，忽略了对于此类有限激活的拟合近似。

![Diagram

Description automatically generated with low confidence](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image7.png)

（Diffusion中时间特征相关模块有限激活）

## 时间特征维护框架

基于以上的诱因分析研究人员提出了如下时间特诊维护策略，在低bit量化下完美的保证了Diffusion模型的时间特征精度与图像生成质量：
- 时间信息块：将时间特征生成相关模块进行整合得到时间信息块（见框架图）： gih⋅i=0,…n；
- 时间信息意识重建：基于时间信息块，研究人员提出了时间信息感知重建 (TIAR) 来应对第一个诱因。在重构过程中，该块的优化目标如下：

LTIAR=i=0ngiht-gihtF2；
- 有限集校准：为了解决第二个诱因中有限集内激活范围宽泛的挑战，研究人员提出了有限集校准 (FSC) 用于激活量化。这个策略为所有时间信息块内的每个激活使用 T 组量化参数，例如激活 x 的量化参数可为 sT, zT, …, s1, z1。在时间步长为 t 时，x 的量化函数可以表示为：

x=Φxst+zt, 0, 2b-1。

其中sT, zt分别为量化缩放因子和零偏移

## 实验结果

研究团队在DDIM，LDM以及Stable Diffusion系列模型上验证了无条件生成/分类条件生成/文本条件/多种先进采样器生成下TFMQ-DM框架性能。TFMQ-DM在平均4/8 bit权重，8/32 bit激活时，在所有评价指标上实现了超过Q-Diffusion，PTQD等方法在对应比特时的性能，且在大部分场景4bit结果超越已有方案在8-bit权重甚至于全精度模型的性能。结果表明，TFMQ-DM率先在接近 4位的平均比特率下实现了 Diffusion无损的性能保证，推动了Diffusion无训练量化的边界。

![Table

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image8.png)

（LDM系列无条件生成对比结果）

![Table

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image9.png)

![Table

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image10.png)

（左：LDM系列分类条件生成对比结果；右：DDIM系列五条件生成对比结果）

![Table

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image11.png)

（Stable Diffusion系列文本条件生成对比结果）

![Picture 4](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image12.png)

![Picture 5](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image13.png)

（左：PLMS系列先进采样器无条件生成对比结果右：DPM++系列先进采样器无条件生成对比结果）

由于现有指标并不能完全反映图像效果优略，因此该团队研究人员提供了大量可视化效果对比图：
![A collage of people

Description automatically generated with medium confidence](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image14.png)

![A collage of a person

Description automatically generated with medium confidence](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image15.png)

（LDM上无条件图像生成效果图）
![A picture containing text, different, colorful, several

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image16.png)

（LDM上分类条件图像生成效果图）
![A picture containing text, tree, different, various

Description automatically generated](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image17.png)

（Stable Diffusion上文本条件图像生成效果图，左提示词：“A digital illustration of the Babel tower, detailed, trending in artstation, fantasy vivid colors”。右提示词：“A beautiful castle beside a waterfall in the woods”。）

除精度/可视化效果外，团队人员还在Intel® Xeon® Gold 6248R 处理器上验证框架的推理加速，相比原始浮点模型实现了 2.38 倍的无损加速。
![Picture 6](publications/md/temporal-feature-matters-a-framework-for-diffusion-model-quantization_cn_assets/image18.png)

（Stable Diffusion在CPU上真实加速）

## 总结

总的来说，基于时间特诊维护的校准量化可确保 Diffusion的量化参数准确保留原始时间信息。广泛的实验证明，TFMQ-DM 在 DDIM, LDM及Stable-Diffusion 系列中实现了令人信服的精度提升，即使是 4 位宽，同时也实现了真实硬件部署加速。TFMQ-DM 具有显著的兼容性，可与各种Diffusion量化框架无缝集成。TFMQ-DM 提供的显著量化精度，有助于在资源受限的情况下进行实际部署。
