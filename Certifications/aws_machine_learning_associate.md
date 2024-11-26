# AWS Machine Learning Associate

* [Main certification page](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
* [Udemy course](https://udemy.com/course/aws-certified-machine-learning-engineer-associate-mla-c01/)
* [Udemy practice exams](https://udemy.com/course/aws-machine-learning-engineer-associate-practice-exams/)
* [AWS Skillbuilder 1](https://explore.skillbuilder.aws/learn/public/learning_plan/view/2191/standard-exam-prep-plan-aws-certified-machine-learning-associate-mla-c01)
* [AWS Skillbuilder 2](https://explore.skillbuilder.aws/learn/course/external/view/elearning/19688/exam-prep-official-practice-question-set-aws-certified-machine-learning-engineer-associate-mla-c01-english)
* [AWS Skillbuilder paid exam preparation](https://skillbuilder.aws/exam-prep/machine-learning-engineer-associate)
* [Tutorialsdojo free practice exams](https://portal.tutorialsdojo.com/courses/free-aws-certified-machine-learning-engineer-associate-practice-exams-mla-c01-sampler/)
* [Tutorialdojo paid practice exams](https://portal.tutorialsdojo.com/courses/aws-certified-machine-learning-engineer-associate-practice-exams-mla-c01-2024/)

## Storage

### EFS

For high IOPS requirements and shared file service:

- FSx for NetApp ONTAP: snapshot capabilities
- FSx for Lustre: good for high throughput and IOPS

## Streaming

- For real-time processing, Kinesis data streams + Managed service for Flink, can provide real-time anomaly detection
- Firehose is near real-time. S3 + Glue also has some delays

## Data science

- To reduce overfitting: apply dropout in the hidden layers and reduce learning rate
- To stabilize learning: batch normalization after each hidden layer
- To preprocess image data: resize and crop images to a fixed size, normalize pixel values, apply data augmentation

---

- Parquet: good for semi-structured data, efficient storage
- To handle missing values and outliers: SG data wrangler and Glue DataBrew
- Difference in proportion of labels (DPL) metric identifies potential biases in the dataset by comparing the proportion of each label across different data groups

## Sagemaker

- Automatic model training when data is uploaded to S3: Eventbridge to monitor the bucket for object creation, trigger SG Pipeline. SG Pipeline for preprocessing, training and evaluation
  - S3 event notification cannot trigger SG pipeline
- To save on costs: spot instances
- SG saving plan requires a 1 or 3 year plan
- Model monitor to detect data drift, bias, alert users when thresholds are breached
- Clarify: detect bias in datasets and model predictions
- Debugger: debug training issues, vanishing/exploding gradients

#### Instance types:

- Standard (t)
- Compute optimized (c)
- Memory optimized (r)
- Accelerated computing (like for images) (p, g, t)
- Inference (inf)

#### Deployment

- Canary: first direct a small percentage of traffic to the new deployment, then increase or decrease based on performance. good rollout, allows real-world traffic testing
- Blue/green deployment: deploy new model to a separate environment and switch **all** traffic to it after testing it. Easy rollback

#### Inference

- Real-time: low-latency, high cost
- Serverless: low-latency, scaling for traffic
- Asynchronous
- Batch

## Other AWS AI services:

- Polly: text to voice
- Transcribe: audio to text
- Comprehend: NLP on text

## Bedrock

- To add unique terminology and specific data, fine-tune a foundational model with your dataset
  - Set model parameters to include custom vocabularies and domain-specific terminology
- Use RAG (retrieval-augmented generation) when you have a knowledge base
-