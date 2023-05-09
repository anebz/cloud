# AWS Machine Learning Specialty

* [Sample questions from AWS](https://d1.awsstatic.com/training-and-certification/docs-ml/AWS-Certified-Machine-Learning-Specialty_Sample-Questions.pdf)
* [Practice exam from AWS](https://explore.skillbuilder.aws/learn/course/external/view/elearning/12469/aws-certified-machine-learning-specialty-practice-question-set-mls-c01-english)
* [Examtopics question dump](https://www.examtopics.com/exams/amazon/aws-certified-machine-learning-specialty/view/)

- [AWS Machine Learning Specialty](#aws-machine-learning-specialty)
  - [Data engineering](#data-engineering)
    - [S3](#s3)
    - [Kinesis data streams](#kinesis-data-streams)
    - [Kinesis data firehose](#kinesis-data-firehose)
    - [Kinesis Video Stream](#kinesis-video-stream)
    - [Data pipelines](#data-pipelines)
    - [AWS Batch](#aws-batch)
    - [Step functions](#step-functions)
    - [Redshift](#redshift)
    - [EBS](#ebs)
  - [Feature engineering](#feature-engineering)
  - [Sagemaker](#sagemaker)
    - [Sagemaker notebook](#sagemaker-notebook)
    - [Data input](#data-input)
    - [SageMaker built-in algorithms](#sagemaker-built-in-algorithms)
    - [Text algorithms](#text-algorithms)
    - [Images algorithms](#images-algorithms)
    - [Clustering algorithms](#clustering-algorithms)
    - [Apache Spark \& Sagemaker](#apache-spark--sagemaker)
    - [Sagemaker tools](#sagemaker-tools)
    - [Pre-training bias metrics in Clarify](#pre-training-bias-metrics-in-clarify)
  - [High-level AI services](#high-level-ai-services)
    - [Comprehend](#comprehend)
    - [Translate](#translate)
    - [Transcribe](#transcribe)
    - [Polly](#polly)
    - [Rekognition](#rekognition)
    - [Forecast](#forecast)
    - [Lex](#lex)
    - [Personalize](#personalize)
    - [Other AI services](#other-ai-services)
  - [Evaluation](#evaluation)
  - [ML implementation and operations](#ml-implementation-and-operations)
    - [Docker](#docker)
    - [SageMaker on the Edge](#sagemaker-on-the-edge)
    - [Security](#security)
    - [Inference](#inference)
      - [Elastic inference](#elastic-inference)
      - [Serverless inference](#serverless-inference)
      - [Inference recommender](#inference-recommender)
      - [Inference pipelines](#inference-pipelines)
      - [SG Endpoint](#sg-endpoint)


## Data engineering

### S3

* S3 Analytics: gives recommendations to when to transition objects to the right storage class. Only works for Standard and Standard IA. Creates a report daily
* Amazon FSx for Lustre: used to serve S3 training data to SageMaker, speeds up training and setup
* SageMaker can only read from S3. If data is in DynamoDB, use data pipeline to export to S3 as JSON, and then converted to CSV
* For sensitive data, use S3 KMS to encrypt and use Glue's sensitive data detection to redact PIIs and sensitive information, at cell and column level

### Kinesis data streams

* One shard can handle up to 1000 transactions/s or 1MB/s. If the file is 8kb, that means 8MB/s. So we need 8 shards.
* Stream can deliver to Glue, which can transfom files into Parquet, and deliver to S3
* Stream cannot convert files to Parquet on the fly
* it can retain data, but minimum only for 24h

### Kinesis data firehose

* Buffer interval: wait the buffer time until data comes, and then send all of it downstream. max interval: 900s
* Can convert csv -> json, but not csv -> parquet
* Can ingest data and transform to parquet on the fly
* Can send data directly to Redshift with Redshift streaming ingestion

### Kinesis Video Stream

* Provides video playback
* Data retention 1h - 10 years

Video stream allows one producer, all cameras compose one producer. Consumers can be:

* Rekognition
* SageMaker
* EC2 consumer tensorflow MXNet
* Fargate: can decode frames

Consumers store checkpoints and processing status in DynamoDB. Inference results can be sent to KDS.

### Data pipelines

* ETL service to manage task dependencies. For example, it can move data from RDS to S3 weekly
* ETL runs in EC2
* Data sources might be on-premises
* Highly available, retries and notifications on-failure

### AWS Batch

* Serverless service to run batch jobs as Docker images
* Dynamic provisioning of instances (EC2 and spot)
* Automatically determines optimal quantity and type based on volume of jobs and requirements
* Can schedule Batch jobs using CloudWatch events, or using Step functions

### Step functions

* Service to orchestrate workflows
* Supports advanced error handling and retry mechanism outside the code
* Supports audit of the workflow history
* Max execution time of 1 year

### Redshift

* Redshift ML: to access the model with SQL commands. No need to move it to S3 and then SageMaker
* Redshift streaming ingestion: send data directly to Redshift from Kinesis Firehose

### EBS

Can be used for storage for SageMaker instance, but only up to 16TB and it has not so high I/O. To optimize that, store data in S3 and use Pipe mode.

## Feature engineering

* tf-idf: term frequency, inverse document frequency
  * Table dimensions: first axis is the amount of sentences, the other axis is the amount of *unique* unigrams + amount of unique bigrams, if that is what the analysis is based on.
* SG ground truth: manages human labeling, dynamically creates a model so fewer samples have to be labeled in the future. Labels are still labeled by your team, not 3rd party people
* Quantile-binning transformation: process to discover non-linearity in the variable's distribution by grouping observed values together
* Orthogonal sparse bigram (OSB) transformation: alternative to the n-gram transformation
* t-SNE (t-distributed stochastic neighbor embedding): non-linear dimensionality reduction algorithm, similar to PCA
* MICE (multiple imputations by chained equations): algorithm to deal with missing data in dataset, works with categorical values

## Sagemaker

Supported file formats:

* For text: csv, libsvm
* For images: jpg, png

SG training can be hosted in :managed spot training: uses ec2 spot instances to run training jobs, reduces the cost while hhaving same time. to avoid restarting a training job from scratch if it's interrupted, implement checkpointing which saves the model in training at periodic intervals.

### Sagemaker notebook

With lifecycle configuration, you can automate initial installation of libraries when creating a notebook.

If you build a custom training container using a python training script that he developed on his local machine, then After copying the script to the location inside the container that is expected by SageMaker, you must define it as the script entry point in the SAGEMAKER_PROGRAM environment variable. When training starts, the interpreter executes the entry point defined by SAGEMAKER_PROGRAM.

Spot instances can be used for training: it saves a lot of money but increases training time. Use checkpoints to S3 so training can resume in case the instance gets interrupted.

### Data input

Data input to SageMaker:

* File mode
  * Uses disk space to store both final model artifacts and full training dataset
* Pipe mode
  * streams S3 data to the training container, improving the performance of training jobs
  * Accepts protobufIO format, not Parquet
  * Higher I/O
  * you reduce the size of the EBS volumes of the training instances. to optimize, convert data into protobuf.recordIO.
  * It only needs to store the final model artifacts

### SageMaker built-in algorithms

Built-in SG algorithms can't be edited. To use another algorithm, extend a pre-built TF container, or build the new algorithm using TF Estimator

* **Linear learner**
  * Preprocessing: automatically normalizes and shuffles data
  * Training: stochastic gradient descent, can select optimization algorithm, tunes L1 and L2 regularization
  * Trains multiple models in parallel and selects the most optimal one
  * ContinuousParameterRanges of logarithmic helps with learning rates with a range that spans several orders of magnitude. For example, if you are tuning a linear learner model and you specify a range of values between .0001 and 1.0 for the learning_rate hyperparameter, searching uniformly on a logarithmic scale gives you a better sample of the entire range than searching on a linear scale would. This is because searching on a linear scale would, on average, devote 90 percent of your training budget to only the values between .1 and 1.0, leaving only 10 percent of your training budget for the values between .0001 and .1
* **XGBoost**
  * Input can be recordIO-protobuf, parquet, csv
  * Models are de/serialized with pickle
  * Can be used as framework within notebooks, or as a built-in sagemaker algorithm
  * Difficult to tune all of its hyperparameters
    * To prevent overfitting: use subsample and Eta, max_depth not too big
    * To help with unbalanced classes, use scale_pos_weight
  * Training can be parallelized across machines
* **DeepAR**
  * Forecasting 1D time series data with RNNs. The same model is trained over several related time series. Finds frequencies and seasonality
  * Input is JSON format in Gzip or Parquet
  * Better results than autoregressive integrated moving average (ARIMA) and error, trend and seasonality (ETS)
  * Time series filling methods:
    * Middle filling: fills missing values between the item start and item end data of a data set
    * Back filling: fills missing values between the last recorded data point and the global end date of a dataset
    * Future filling: fills missing values between the global end date and the end of the forecast horizon
* **K-nearest-neighbors**
  * Used for classification and regression
  * Input: recordIO-protobuf or csv
  * Train: CPU or GPU. Inference: CPU (lower latency) or GPU (higher throughput on large batches)
* **PCA**
  * Dimensionality reduction, unsupervised
  * Input: recordIO-protobuf or csv
* **Factorization machines**
  * Supervised method, classification or regression to deal with sparse data
  * Useful when an item's target value depends on the other people's target values
  * Input: recordIO-protobuf with Float32. csv isn't practical for sparse data
* Collaborative filtering models
  * Recommender model
  * leverages other user's experiences. users with similar tastes (based on observed user-item interactions) are likely to have similar interactions with items they haven't seen before. works better when there is a lot of data
* **IP insights**
  * Unsupervised learning of IP address usage patterns, identify suspicious behavior
  * Input: csv only
* **Reinforcement learning**
  * Uses deep learning framework with Tensorflow and MXNet
  * Can distribute training and/or environment rollout
* **Automatic model tuning**
  * Define hyperparams and ranges, and metrics you're optimizing for
  * Sagemaker creates a HyperParameter tuning job that trains as many combinations as you decide. The set of hyperparams producing the best results can be deployed as a model
  * Don't optimize too many hyperparams at once. Limit your ranges to as small a range as possible
  * Don't run too many training jobs concurrently
* **AutoML**
  * Load csv input data from S3 and select target column
  * Automatic preprocessing and model creation, model notebook is available
    * Problem types: binary/multiclass classificaiton, regression
    * Algorithm types: linear learner, XGBoost, deep learning
  * Model leaderboard with ranked list of recommended models, you can pick one
  * Deploy and monitor the model, refine via notebook if needed
  * Integrates with SG Clarify for explainability, uses Shap values, assigns each feature an importance value for a given prediction
  * Can have human guidance

### Text algorithms

* **Seq2seq**
  * Used to generate text as output
  * Input: recordIO-protobuf, tokens must be integers. Text files must be tokenized
  * Input data must contain training and val data and vocabulary file
  * Pre-trained models and public datasets are available
  * Training can onle be done in one machine
* **BlazingText**
  * Supervised method for text classification. Uses word2vec
* **Object2vec**
  * Similar to word2vec but for arbitrary objects, like sentences with labels
  * Creates low-dimensional embedding layer
  * Input: data must be tokenized into integers. Training data consists of pairs of tokens and/or sequences of tokens
  * Training: two input channels, two encoders (which network to choose is a hyperparam), and a comparator that decides the output label
  * Can only be trained on a single machine (CPU or GPU)
  * Use INFERENCE_PREFERRED_MODE envvar to optimize for encoder embeddings
* Neural topic modeling
  * unsupervised method to organize documents into topics
  * Input: recordIO-protobuf or csv. words must be tokenized into integers
* Latent Dirichet Allocation (LDA)
  * Input: recordIO-protobuf or csv. Pipe mode only supported with recordIO
  * Training: single-instance CPU

### Images algorithms

* **Object detection**
  * Input: recordIO or image format (jpg/png). With image format, also a JSON file for annotation data for each image
  * Training optimized for GPU, can be trained on multi-machine
* **Image classification**
  * Input: Apache MXNet RecordIO (not protobuf!) or jpg/png images. Image format requires .lst files to associate image index, class label and path to image
  * GPU for training, multi-GPU and multi-machine supported
* **Semantic segmentation**
  * Input: jpg images and png annotations, also label maps to describe annotations. Augmented manifest image format is supported for Pipe mode
  * jpg images accepted for inference
  * Only single-machine GPU supported for training. Inference on CPU/GPU

### Clustering algorithms

* **Random cut forest**
  * Input: recordIO-protobuf or csv. Optional test channel for computing accuracy, precision, recall and F1
  * No GPU
* **K-means clustering**
  * Input: recordIO-protobuf or csv.
  * CPU and GPU, but CPU recommended

### Apache Spark & Sagemaker

* Allows combining pre-processing big data in Spark with training and inference in SageMaker
* pre-processes data as normal with Spark, generating DataFrames
* Uses sagemaker-spark library: SageMakerEstimators like KMeans, PCA, XGBoost and SageMakerModels
* You can connect notebook to a remote EMR cluster running Spark, or use Zeppelin
* Training df should have: feature column that's a vector of doubles, and optional labels column of Doubles. Then call fit() on SGEstimator to get a SGModel. Call transform() on SGModel to make inferences. This works with Spark Pipelines as well

### Sagemaker tools

* SG Data Wrangler: import, transform, analyze, export data within SG Studio
  * Provides a Data Quality and Insights report that automatically verifies data quality (such as missing values, duplicate rows, and data types) and helps detect anomalies (such as outliers, class imbalance, and data leakage) in your data
* SG Feature store: find, discover and share features in Studio
* SG JumpStart: one-click models and algorithms from model zoos
* SG Debugger
  * Stores gradients and tensors over time as model is trained
  * Defines rules for detecting unwanted conditions while training.
    * Monitor system bottlenecks
    * Profile model framework operations
    * Debug model parameters
  * Collects logs and fires Cloudwatch event when rule is met
  * Automatically generates training report
  * Built-in actions to receive notifications (email, sms) or stop training if rule is met
  * SG Debugger Insights Dashboard: see all about the Debugger in visual form
* Model monitor
  * No-code system get alerts on quality deviations on deployed models
  * Monitoring types:
    * Model is overfitting
    * Data quality drift
    * Drift in model quality
    * Bias drift
    * Feature attribution drift (compares feature ranking of training vs. live data)
  * Data stored in S3 and metrics are in CloudWatch
  * Integration with Tensorboard, QuickSight, Tableau, or just visualize with SGStudio
* SG Canvas
  * No-code tool to build ML models
  * Upload csv data from S3, select column to predict, build and make predictions. Can do classification and regression, it does automatic data cleaning (missing values, outliers, duplicates) and shares models and datasets with SG Studio

### Pre-training bias metrics in Clarify

* Class imbalance (CI)
* Difference in proportions of labels (DPL)
  * Imbalance of positive outcomes between facet values
* Kullback-Leibler Divergence (KL), Jensen-Shannon Divergence (JS)
  * How much outcome distributions of facets diverge
* LP-norm (LP)
  * P-norm difference between distributions of outcomes from facets
* Total variation distance (TVD)
  * L1-norm difference between distributions of outcomes from facets
* Kolmogorov-Smirnov (KS)
  * Maximum divergence between outcomes in distributions from facets
* Conditional demographic disparity (CDD)
  * Disparity of outcomes between facets as a whole, and by subgroups

## High-level AI services

### Comprehend

* Extract key phrases, entities, sentiment, language, syntax detection, topics and document classificaction
* Can train on own data
* Supports custom entity recognition model to identify new entity types not supported as one of the preset generic entity types. Better solution than using regex or string matching

### Translate

* Deep learning for translation. Automatic language detection
* Supports custom dictionary, in CSV or TMX formatting, with their translations. Appropriate for proper names, brand names, etc.

### Transcribe

* Speech to text
  * Input in FLAC, MP3, MP4 or WAV in specified language
  * Streaming audio supported (HTTP/2 or WebSocket), but only for english, french and spanish
* Speaker identification, how many speakers
* Channel identification: two callers can be transcribed separatedly, merging based on timing of utterances
* Automatic language identification
* Support custom vocabularies: vocab lists (just list of special words)
* Supports vocabulary filtering, if a list of offensive words is provided
* Can do content redaction, but only for PII info, not for censoring offensive words

### Polly

* Text to speech
* Supports lexicons: customize pronunciation of specific words and phrases
* SSML (speech synthesis markup language)
  * Alternative to plain text, gives control over emphasis, pronunciation, breathing, whispering, speech rate, pitch, pauses
  * "Emphasis" tag exists, "pronunciation" tag doesn't
  * If something is pronounced wrong, use pronunciaton lexicons
* Speech marks: can encode when sentence/word starts and ends in the audio stream. Useful for lip-synching animation

### Rekognition

* Object and scene detection, image moderation, facial analysis, face comparison, celebrity recognition
* Text in image
* Video analysis
  * Objects/people/celebrities marked on timeline, people pathing
* Images come from S3, or provide image bytes as part of request
* Video must come from Kinesis Video Streams: H.264 encoded, 5-30FPS
* Supports custom labels, you can provide a small set of labeled images. Use your own labels for unique items

### Forecast

* Time series analysis
* AutoML chooses best model for time series
* Works with any time series. It can combine with associated data to find relationships

### Lex

* Chatbot engine
* Utterances invoke intents ("I want to oder a pizza")
* Lambda functions are invoked to fulfill the intent
* Slots specify extra information needed by the intent (pizza size, toppings etc.). Has to be coded
* Can be deployed to AWS Mobile SDK, Facebook Messenger, Slack, Twilio
* Alexa uses Transcribe and Polly for text-to-speech and speech-to-text

Amazon Lex Automated Chatbot Designer

* You provide existing conversation transcripts
* Lex applies NLP and deep learning to remove overlaps and ambiguity
* Intents, user requests, phrases, values for slots are extracted
* Ensures intents are well defined and separated

### Personalize

* Recommendation engine
* For big batch operation: add data to S3, give schema to Personalize and then it will monitor S3 for that data
* For real-time, send data through API
* Explicit schema in Avro format must be provided
* **GetRecommendations**
  * Returns recommended products, content, etc.
  * Returns similar items
* **GetPersonalizedRanking**
  * Rank a list of items provided
  * Allows editorial control/curation
* It can create recommendations for new users and new items that it hasn't seen before (the cold start problem). Just recommends popular items to new users. And for new items, they don't stay new for long, as soon as someone buys it, it starts building relationships to other items and Personalize recomputes this every two hours
* Intelligent user segmentation, automatically classify users into groups for marketing campaigns
* To maintain relevance, keep the dataset current: incremental data import. To do that real-time, use PutEvents API call to feed in real-time user behavior. Retrain the model, by default it updates every 2h. It should also do a full retrain (trainingMode=FULL) weekly.

### Other AI services

* Textract: OCR with forms, fields, tables support
  * Use Augmented AI (A2I) to get low-confidence results from Textract's AnalyzeDocument API operation reviewed by humans
* DeepRacer: research tool, RL-powered 1/18-scale race car
* Fraud detector: upload historical fraud data. It builds custom model from a template you choose. It accesses the risk based on if the account is new, guest checkout, "try before you buy" abuse, or online payments
* Contact Lens for Connect: contact lenses made for customer support call centers. Ingests audio from recorded phone calls. Allows search on calls and chats
* Kendra: Enterprise search for intranet with NLP. Combines data from filesystems, SharePoint, intranet, into one searchable repository
* Augmented AI (A2I): human review of ML *predictions*. Builds workflows for reviewing low-confidence predictions by leveraging the Mechanical Turk workforce

* DeepLens: research tool, DL-enabled video camera. Not suitable for commercial uses or surveillance camera. not designed to be mounted on walls, ceilings, posts
* Panorama: CV at the edge, at IP cameras. low latency than sending predictions to the cloud

* TorchServe: Model serving framework for PyTorch
* Neuron: SDK for ML inference specifically on AWS Inferentia chips (Inf1 instance type). Integrated with SageMaker or other DL AMIs
* CodeGuru: automated code reviews. Finds lines of code that hurt performance, resource leaks, race conditions. Offers recommendations. Supports Java and Python

* Lookout: anomaly detection from sensor data to detect equipment/metrics/vision issues
* Monitron: industrial equiment monitoring and predictive maintenance. Provides sensors, gateways, service and app

## Evaluation

* Confusion matrix
* rMSE
* Residual plot: used for regression, shows how far away (positive or negative) the predicted value is compared to the expected value. Whether the model is underestimating or overestimating on the target
* precision and recall, F1 score
  * recall: tp / tp + fn
  * false negative rate: fn / (fn + tp)
* ROC / AUC: AUC is area under the ROC curve
* Correlation: negative correlation coefficient means the bigger the x, the lower the y

## ML implementation and operations

### Docker

Structure of a training container

```
/opt/ml
---input
------config
---------hyperparameters.json
---------resourceConfig.json
------data
---------<channel_name>
------------<input data>
---model
------<model files>
---code
------<script files>
---output
------failure
```

Structure of training container:

* nginx.conf
* predictor.py (Flask web server to make predictions at runtime)
* serve/ (launches gunicorn server, multiple flask web servers defined in predictor)
* train/ (invoked when running the training)
* wsgi.py (wrapper to invoke flask app for serving results)

```Dockerfile
FROM tensorflow/tensorflow:2.0.0a0
RUN pip install sagemaker-containers
# copies training code inside container
COPY train.py /opt/ml/code/train.py
# defines train.py as script entrypoint
ENV SAGEMAKER_PROGRAM train.py
```

### SageMaker on the Edge

* **Neo**
  * Machine Learning for edge devices: ARM, Intel, Nvidia, can be embedded in anything
  * Optimizes code for specific devices: tensorflow, MXNet, PyTorch, ONNX, XGBoost
  * "Run ML models anywhere with up to 25x better performance"
  * Consists of a compiler and a runtime
* **Greengrass**
  * Neo-compiled models can be deployed to an HTTPS endpoint
    * Hosted on C5, M5, M4, P3 or P2 instances
    * Must be the same instance type used for compilation
  * Or you can deploy model to IoT Greengrass, without Neo
    * Inference at the edge with local data, using model trained in the cloud
    * Uses Lambda inference applications

### Security

* All files in `/opt/ml/` and `/tmp/` can be encrypted with a KMS key
* In transit, *inter-node training communication* can be encrypted, via console or API when setting up a training/tuning job, which requires the creation of a VPC. Increases training time eand cost. Complies with regulatory requirements
* Notebooks are Internet-enabled by default, which can be a security issue. If you disable this, the VPC needs an interface endpoint (PrivateLink) or NAT Gateway and allow outbound connections
* Training and Inference containers are also Internet-enabled by default. Network isolation is possible but this also prevents S3 access

### Inference

* In production you can set up automatic scaling: set a scaling policy to define target metrics, min/max capacity, cooldown periods
* SG automatically tries to distribute instances across AZs, but for this to work you need more than one instance. For that, deploy multiple instances for each production endpoint and configure VPCs with at least 2 subnets, each in a different AZ

#### Elastic inference

* To accelerate inference, cheaper than using a GPU instance
* Only works for Tensorflow, PyTorch and MXNet pre-built containers. ONNX can be used to export models to MXNet
* Only works with custom containers built with EI-enabled Tensorflow, PyTorch or MXNet
* Only works with image classification and object detection built-in algorithms

#### Serverless inference

* Serverless endpoints. Good option for infrequent or unpredictable traffic: it will scale down to zero when there are no requests
* Specify container, memory requirement, concurrency requirement

#### Inference recommender

* Recommends best instance type and config for your model and deploys to optimal inference endpoint
* Automates load testing, model tuning
* How it works:
  * Register model in model registry
  * Benchmark different endpoint configs
  * Collect and visualize metrics to decide on instance types
  * Existing models from zoos may have benchmarks already
* Instance recommendation: runs load test on recommended instance types, takes 45mins
* Endpoint recommendation: cuustom load test, you specify instances, traffic patterns, latency requirements, throughput requirements. Takes 2h

#### Inference pipelines

* Linear sequence of 2-15 containers
* Any combination of pre-trained built-in algorithms or your own algorithms in containers
* Combines pre-processing, predictions, post-processing
* SparkML and scikit-learn containers work well
  * SparkML can be run with Glue or EMR, it will be serialized into MLeap format
* Can handle both real-time inference and batch transforms
  * Batch transform uesful for inference on the whole dataset. It can exclude attributes before running predictions. You can also join the prediction results with partial or entire input data attributes when using data that is in CSV, text, or JSON format

#### SG Endpoint

* Sagemaker endpoints are by default not open to the public and needs AWS credentials to access it. For open-to-the-public-endpoints, use API Gateway
* Multi-model endpoint works for several models. They use a shared serving container which hosts several models. Improves endpoint utilization compared with using single-model endpoints, and reduces the deployment overhead. To increase availability, add SG instances of the same size and use the existing endpoint to host them
* You can test out many models on live traffic using Production Variants, to distribute traffic among different models.
