# CMedBench: A Comprehensive Benchmark for Efficient Medical Large Language Models

### 1. Summary

This paper introduces **CMedBench**, which the authors position as the first comprehensive benchmark for evaluating **compressed medical large language models (LLMs)**. The central problem is practical deployment: medical LLMs are often too large for privacy-sensitive or resource-limited healthcare settings, so compression is necessary, but existing evaluation is fragmented and does not adequately measure how compression affects medical capability, trustworthiness, and efficiency together. CMedBench addresses this by evaluating compressed LLMs along **five tracks**: medical knowledge, medical application ability, trustworthiness, compression cross-combination, and computational efficiency. Across experiments on **14 model architectures, 31 datasets, and 11 training-free compression settings**, the paper finds that **weight-only quantization** generally preserves medical performance well and delivers strong efficiency gains, while **structured pruning** often causes the largest performance degradation, especially in smaller models.

### 2. Why this paper matters

Medical LLM deployment is stricter than general-domain deployment because models must be:

- accurate on medical knowledge and reasoning,
- reliable in clinical-style use cases,
- trustworthy in terms of safety, privacy, robustness, and fairness,
- efficient enough for local or constrained environments.

The paper’s main contribution is not a new compression algorithm. It is a **benchmarking framework** that lets researchers compare compression methods in a way that is more aligned with real medical deployment.

### 3. What CMedBench evaluates


Here is an overview of CMedBench 

![image-20260516160343262](publications/imgs/cmedbench.jpg)

| Track | What it measures | Main components |
|---|---|---|
| 1. Medical Knowledge Ability | Whether compression preserves core medical knowledge | General Medical Knowledge, Advanced Medical Knowledge, Biomedical Literature Comprehension |
| 2. Medical Application Ability | Whether compressed models can still apply knowledge in practical medical tasks | Allied Medical Explanation, Clinical Diagnostic Assistant, Expert-level Understanding & Reasoning |
| 3. Trustworthiness Maintenance | Whether compression harms safety-critical behavior | Truthfulness, Safety, Privacy, Ethics, Robustness, Fairness |
| 4. Compression Cross Combination | How compression interacts with different model families and scales | Multi-model, multi-compression comparisons |
| 5. Computational Efficiency | Whether compression actually improves deployability | VRAM, bits, time to first token, average completion time, tokens per second |

### 4. Benchmark design

The paper focuses on **training-free compression methods**, mainly:

- `AWQ` and `GPTQ`: weight-only quantization
- `SmoothQuant`: weight-activation quantization
- `Wanda`: unstructured sparsity
- `ShortGPT`: structured pruning

The evaluation protocol uses representative medical and general-purpose LLMs, including **Meditron-7B**, **HuatuoGPT-o1-8B**, **LLaMA3-8B**, and **Qwen2.5-7B** for most tracks, and a broader set of models from 7B to 72B scale for cross-combination analysis.

### 5. Core findings

#### 5.1 Best overall compression choice: weight-only quantization

The clearest result is that **weight-only quantization is the strongest practical choice** in this benchmark.

- `AWQ` and `GPTQ` mostly preserve medical knowledge and application ability.
- They also provide the strongest computational gains.
- Among the tested methods, they offer the best balance between **clinical capability retention** and **deployment efficiency**.

This is the paper’s most actionable conclusion.

#### 5.2 SmoothQuant is weaker at low bit-width

`SmoothQuant` under 4-bit settings shows noticeable degradation:

- weaker preservation of medical knowledge,
- weaker medical application performance,
- less stable overall results than AWQ and GPTQ.

So although quantization works well in general, **not all quantization methods behave equally well in medical settings**.

#### 5.3 Sparsity is more fragile than quantization

The paper reports that both sparsity approaches are more risky:

- `Wanda` at 50% sparsity usually causes performance drops,
- `ShortGPT` produces the most severe degradation overall.

This is especially important for healthcare, where even modest performance loss may be unacceptable.

#### 5.4 Larger models tolerate structured pruning better

One of the more interesting observations is that **larger models are more resilient to `ShortGPT`-style structured pruning**. The authors interpret this as a likely effect of greater layer redundancy in larger models. That means structured pruning may still be viable for very large models, but it is much less reliable for smaller ones.

#### 5.5 Trustworthiness does not degrade uniformly

Trustworthiness metrics do not all move in the same direction:

- **Truthfulness, safety, and ethics** broadly follow the same trend as task performance.
- **Privacy** remains relatively stable.
- **Robustness** varies moderately.
- **Fairness** sometimes even increases after compression.

This matters because it shows that model compression cannot be judged by accuracy alone. Compression may preserve task scores while changing safety-relevant behavior in less predictable ways.

#### 5.6 Efficiency gains depend on system support

Quantization improves runtime efficiency clearly. In contrast, **unstructured sparsity does not translate into equally strong speedups in practice** under the tested inference stack, mainly because backend support for sparse operators is still limited. So some compression methods look attractive in theory but do not yet produce real deployment gains.

### 6. High-level interpretation

The paper argues for a deployment-oriented view of medical LLM compression:

- If the goal is **safe and efficient deployment now**, weight-only quantization is the most reliable option.
- If the goal is **maximum compression**, pruning-based methods may help, but the risk to medical capability is substantially higher.
- Evaluating only one task or one metric is not enough; compression decisions should be made jointly across **capability, trustworthiness, and efficiency**.

### 7. Practical takeaways

| Scenario | Best-supported takeaway from the paper |
|---|---|
| Need fast local inference with limited VRAM | Prefer 4-bit weight-only quantization |
| Need to preserve clinical-style task quality | AWQ/GPTQ are safer choices than pruning |
| Considering sparsity for deployment | Check backend/operator support first |
| Compressing larger medical LLMs | Structured pruning may be more tolerable than in small models |
| Evaluating a compressed model | Measure trustworthiness separately, not only task accuracy |

### 8. Limitations

The authors explicitly note that CMedBench focuses on a **representative subset of training-free compression techniques**, so it does not cover the full and rapidly changing compression landscape. More broadly, the benchmark is strong on breadth, but like most benchmarks, it still cannot fully substitute for real clinical validation.

### 9. Bottom line

This paper’s main value is its **evaluation framework**. CMedBench provides a structured way to compare compression methods for medical LLMs under realistic constraints. Its experiments suggest a fairly clear recommendation: **weight-only quantization currently offers the best trade-off between efficiency and medical performance**, while pruning-based methods remain less reliable, especially for smaller models and safety-critical deployment.
