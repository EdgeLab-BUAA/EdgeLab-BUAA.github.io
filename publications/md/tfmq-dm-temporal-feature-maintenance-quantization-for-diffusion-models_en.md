# TFMQ-DM: Temporal Feature Maintenance Quantization for Diffusion Models

This article introduces **TFMQ-DM**, a CVPR 2024 Highlight paper on low-bit quantization for diffusion models. The key result is striking: with proper temporal feature maintenance, diffusion models can be compressed to **4-bit weights** with almost no quality loss, while also achieving real hardware acceleration.

Paper: https://arxiv.org/pdf/2311.16503  
Code: https://github.com/ModelTC/TFMQ-DM

![Figure 1](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image1.png)

![Figure 2](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image2.png)

## 1. The key problem: temporal feature disturbance

Diffusion models differ from conventional vision models because they explicitly depend on a time variable `t` across the denoising process. The paper shows that quantization can heavily disturb the temporal feature embedding, and this creates a chain reaction:

- **Temporal feature disturbance**: quantization introduces large errors in time-related features.
- **Temporal information mismatch**: the quantized temporal feature no longer correctly corresponds to its intended timestep.
- **Denoising trajectory deviation**: once the wrong temporal information is injected, the denoising process drifts away from the original path.

![Figure 3](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image3.png)

![Figure 4](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image4.png)

![Figure 5](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image5.png)

## 2. Why existing methods struggle

The paper attributes the problem to two main causes:

- **Inappropriate reconstruction targets**: previous quantization schemes do not directly optimize temporal features.
- **Ignoring finite activations in temporal modules**: time-related modules operate on a finite set of timestep inputs, but existing quantization strategies optimize them as if they followed ordinary broad activation distributions.

![Figure 6](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image6.png)

![Figure 7](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image7.png)

## 3. TFMQ-DM

To solve these issues, the paper proposes **Temporal Feature Maintenance Quantization**:

- **Temporal Information Block (TIB)**: modules responsible for temporal feature generation are grouped into a dedicated structure.
- **Temporal Information-aware Reconstruction (TIAR)**: reconstruction is guided directly by temporal feature alignment.
- **Finite Set Calibration (FSC)**: because timestep inputs come from a finite set, the quantizer uses timestep-specific calibration to better fit the actual activation patterns.

This design allows low-bit quantization to preserve the temporal signals needed for stable denoising.

## 4. Experimental results

The paper evaluates TFMQ-DM on DDIM, LDM, and Stable Diffusion families under unconditional, class-conditional, and text-conditional generation settings. Across these experiments, TFMQ-DM consistently outperforms prior quantization methods and often delivers results close to, or even slightly better than, the full-precision baseline under certain settings.

![Figure 8](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image8.png)

![Figure 9](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image9.png)

![Figure 10](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image10.png)

![Figure 11](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image11.png)

The qualitative comparisons also show that TFMQ-DM better preserves semantic consistency and fine image details.

![Figure 12](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image12.png)

![Figure 13](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image13.png)

![Figure 14](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image14.png)

![Figure 15](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image15.png)

![Figure 16](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image16.png)

![Figure 17](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image17.png)

Finally, the paper reports real CPU-side acceleration, showing that the method is not only accurate but also deployment-friendly.

![Figure 18](publications/md/tfmq-dm-temporal-feature-maintenance-quantization-for-diffusion-models_cn_assets/image18.png)

## 5. Takeaway

TFMQ-DM demonstrates that diffusion quantization becomes much more reliable once temporal features are explicitly protected. It is an important result for anyone interested in **efficient image generation, post-training quantization, and practical diffusion deployment**.
