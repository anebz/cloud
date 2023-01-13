# AWS Machine Learning Specialty

## Data engineering

### S3

S3 Analytics gives recommendations to when to transition objects to the right storage class. Only works for Standard and Standard IA. Creates a report daily

### Kinesis Video Stream

* Provides video playback
* Data retention 1h - 10 years

Producers, with Producer SDK. One producer per video stream (all cameras compose 1 producer)

* Cameras
* DeepLens
* Audio feeds
* RADAR data
* RTSP camera

Consumers:

* Rekognition
  * Automatically classifies images
* SageMaker
* EC2 consumer tensorflow MXNet
* Fargate: can decode frames

Consumers store checkpoints and processing status in DynamoDB. Inference results can be sent to KDS.

### Data pipelines

ETL service to manage task dependencies. ETL runs in EC2. Data sources might be on-premises.

Highly available, retries and notifications on-failure.

For example, it can move data from RDS to S3 weekly.

### AWS Batch

Serverless service to run batch jobs as Docker images. Dynamic provisioning of instances (EC2 and spot).
Automatically determines optimal quantity and type based on volume of jobs and requirements.

Can schedule Batch jobs using CloudWatch events, or using Step functions.

### Step functions

Service to orchestrate workflows. Supports advanced error handling and retry mechanism outside the code. Supports audit of the workflow history.

Max execution time of 1 year.

## Exploratory data analysis

scikit_learn
data distributions
trends and seasonality

## Analyis tools

### Athena
### Quicksight
### EMR
### Apache Spark

## Feature engineering

Imputations methods
Outliers
Binning
Log transforms
One-hot encoding
Scaling and normalization

Sagemaker ground truth manages human labeling, and also dynamically creates a model so fewer and fewer samples have to be labeled in the future.

## Modeling

### Sagemaker

#### Machine learning

* Linear learner
  * Preprocessing: automatically normalizes and shuffles data
  * Training: stochastic gradient descent, can select optimization algorithm, tunes L1 and L2 regularization
  * Trains multiple models in parallel and selects the most optimal one
* XGBoost
  * Input can be recordIO-protobuf, parquet, csv
  * Models are de/serialized with pickle
  * Can be used as framework within notebooks, or as a built-in sagemaker algorithm
  * Difficult to tune all of its hyperparameters
    * To prevent overfitting: use subsample and Eta, max_depth not too big
    * To help with unbalanced classes, use scale_pos_weight
  * Training can be parallelized across mchines
* DeepAR
  * Forecasting 1D time series data with RNNs. The same model is trained over several related time series. Finds frequencies and seasonality
  * Input is JSON format in Gzip or Parquet
    * Each record must contain Start: the starting time stamp and Target (time series values)
    * Optionally they can contain dynamic_features and categorical features
    * The entire time series is used for training, testing and inference
* K-nearest-neighbors
  * Used for classification and regression
  * Input: recordIO-protobuf or csv (first column is the label). File or pipe mode
  * Hyperparams: k (how many neighbors), sample_size
  * Train: CPU or GPU. Inference: CPU (lower latency) or GPU (higher throughput on large batches)
* PCA
  * Dimensionality reduction, unsupervised
  * Input: recordIO-protobuf or csv, file or pipe mode
  * Hyperparams: algorithm_mode, subtract_mean (used to unbias data)
  * CPU or GPU, depending on the input data
* Factorization machines
  * Supervised method, classification or regression to deal with sparse data
  * Input: recordIO-protobuf with Float32. csv isn't practical for sparse data
  * Hyperparams: initialization methods for bias, factors and linear terms
  * CPU and GPU, but CPU recommended because GPU only works with dense data
* IP insights
  * Unsupervised learning of IP address usage patterns, identify suspicious behavior
  * Input: csv only. Usernames, account IDs can be fed directly, no need to pre-process
  * Hyperparams: num_entity_vectors, vector_dm (if too big, overfitting)
  * GPU recommended, can use multi-GPU
* Reinforcement learning
  * Uses deep learning framework with Tensorflow and MXNet
  * Can distribute training and/or environment rollout
  * Supports multi-core and multi-instance
  * Key terms
    * Environment: layout of the board/maze/etc
    * State: where the player/pieces are
    * Action: move in a given direction
    * Reward: value associated with the action from that state
    * Observation: surroundings in a maze, state of chess board
  * Recommended to use GPUs
* Automatic model tuning
  * Define hyperparams and ranges, and metrics you're optimizing for
  * Sagemaker creates a HyperParam tuning job that trains as many combinations as you decide. The set of hyperparams producing the best results can be deployed as a model
  * Don't optimize too many hyperparams at once. Limit your ranges to as small a range as possible
  * Don't run too many training jobs concurrently

#### Text

* Seq2seq
  * Input: recordIO-protobuf, tokens must be integers. Text files must be tokenized
  * Input data must contain training and val data and vocabulary file
  * Pre-trained models and public datasets are available
  * Training can onle be done in one machine
* BlazingText
  * Supervised method for text classification
  * Uses word2vec
  * Input: one sentence per line, first word in the sentence is "__label__" followed by the label
* Object2vec
  * Similar to word2vec but for arbitrary objects
  * Creates low-dimensional embedding layer
  * Input: data must be tokenized into integers. Training data consists of pairs of tokens and/or sequences of tokens
  * Training: two input channels, two encoders (which network to choose is a hyperparam), and a comparator that decides the output label
  * Can only trained on a single machine (CPU or GPU)
  * Use INFERENCE_PREFERRED_MODE envvar to optimize for encoder embeddings

#### Images

* Object detection
  * Input: recordIO or image format (jpg/png). With image format, also a JSON file for annotation data for each image
  * Hyperparams: mini_batch_size, learning_rate, optimizer
  * Training optimized for GPU, can be trained on multi-machine
* Image classification
  * Input: Apache MXNet RecordIO (not protobuf!) or jpg/png images. Image format requires .lst files to associate image index, class label and path to image
  * Same hyperparams as for object detection
  * GPU for training, multi-GPU and multi-machine supported
* Semantic segmentation
  * Input: jpg images and png annotations, also label maps to describe annotations. Augmented manifest image format is supported for Pipe mode. jpg images accepted for inference
  * Only single-machine GPU supported for training. Inference on CPU/GPU

#### Clustering

* Random cut forest
  * Input: recordIO-protobuf or csv. Can use file or pipe mode. Optional test channel for computing accuracy, precision, recall and F1
  * Hyperparams: num_trees (increasing it reduces noise), num_samples_per_tree should be similar to the ratio of normal to anomalous data)
  * No GPU
* K-means clustering
  * Input: recordIO-protobuf or csv. Train channel, optional test. File or pipe mode
  * Hyperparams: K, mini_batch_size, extra_center_factor, init_method
  * CPU and GPU, but CPU recommended

### Topic modeling

What's a document about

* Neural topic modeling
  * unsupervised method to organize documents into topics
  * Input: recordIO-protobuf or csv. 4 data channels, train, optional: val, test and auxiliary. words must be tokenized into integers. File or pipe mode
  * Hyperparams: mini_batch_size, learning_rate. Lowering these reduces validation loss but increases training time. Num_topics is the amount of topics you want to have
* Latent Dirichet Allocation (LDA)
  * Input: recordIO-protobuf or csv. Train channel + optional test channel. Each document has counts for every word in vocab. Pipe mode only supported with recordIO
  * Hyperparams: num_topics, alpha (initial guess for concentration parameter. smaller values generate sparse topic mixtures. larger values >1 produce uniform mixtures)
  * Training: single-instance CPU

Apache Spark & Sagemaker:

allows combining pre-processing big data in Spark with training and inference in SageMaker.

pre-processes data as normal with Spark, generating DataFrames. Uses sagemaker-spark library: SageMakerEstimators like KMeans, PCA, XGBoost and SageMakerModels.

You can connect notebook to a remote EMR cluster running Spark, or use Zeppelin. Training df should have: feature column that's a vector of doubles, and optional labels column of Doubles. Then call fit() on SGEstimator to get a SGModel. Call transform() on SGModel to make inferences. This works with Spark Pipelines as well.

* SG Studio: native IDE
* SG Data Wrangler: import, transform, analyze, export data within SG Studio
* SG Feature store: find, discover and share features in Studio
* SG Edge manager: software agent for edge devices, model optimized for SG Neo
* SG JumpStart: one-click models and algorithms from model zoos
* SG Experiments: organize, capture, compare and search ML jobs
* SG Debugger: saves internal model state and periodical intervals
  * Stores gradients and tensors over time as model is trained
  * Supports Tensorflow, Pytorch, MXNet, XGBoost and SG generic estimator
  * Debugger API is in Github. You can construct hooks and rules for CreateTrainingJob and DescribeTrainingJobs APIs. SMDebug client library allows registering hooks for accessing training data
  * Defines rules for detecting unwanted conditions while training
    * Monitor system bottlenecks
    * Profile model framework operations
    * Debug model parameters
  * A debug job is run for each rule you configure
  * Automatically generates training report
  * Built-on actions to receive notifications (email, sms) or stop training
  * Collects logs and fires cloudwatch event when rule is hit
  * SG Debugger Insights Dashboard: see all about the Debugger in visual form
* SG training compiler
  * Automaticaly compiles & optimizes training job, accelerates training up to 50%
  * Converts models into hardware-optimized instructions
  * Integrated into AWS DL containers (DLCs), can't bring your own container
  * Works for any model, including HuggingFace
  * Incompatible with SG distributed training libraries
  * Best practices
    * Ensure GPU instances are used (ml.p3, ml.p4)
    * PyTorch models must use Pytorch/XLA's model save function
    * Enable debug flag in compiler_config parameter to enable debugging
* Autopilot / AutoML: algorithm selection, data preprocessing, model tuning. Can have human guidance
  * Load input data from S3 (must be csv)
  * Select target column
  * Automatic model creation, model notebook is available
    * Problem types: binary/multiclass classificaiton, regression
    * Algorithm types: linear learner, XGBoost, deep learning
  * Model leaderboard with ranked list of recommended models, you can pick one
  * Deploy and monitor the model, refine via notebook if needed
  * Integrates with SG Clarify for explainability, uses SHAP/shapley values, assigns each feature an importance value for a given prediction
* Model monitor: no-code system get alerts on quality deviations on deployed models
  * Monitoring types:
    * Data quality drift
    * Drift in model quality
    * Bias drift
    * Feature attribution drift (compares feature ranking of training vs. live data)
  * Data stored in S3
  * Metrics are in CloudWatch
  * Integration with Tensorboard, QuickSight, Tableau, or just visualize with SGStudio
* SG Canvas: no-code UI. Upload csv data from S3, select column to predict, build and make predictions. Can do classification and regression, it does automatic data cleaning (missing values, outliers, duplicates) and shares models and datasets with SG Studio
  * S3 bucket needs CORS permissions
  * Import from Redshift can be set up
  * Time series forecasting must be enabled via IAM
  * Can run within VPC
  * Pricing is $1.9/h plus a charge baesd on number of training cells in model

#### Pre-training bias metrics in Clarify

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

### High-level AI services

#### Comprehend

* NLP and text analytics
* Extract key phrases, entities, sentiment, language, syntax, topics and document classificaction
* Can train on own data

#### Translate


#### Polly


#### Transcribe


#### Lex


#### Rekognition


#### Personalize/forecast/textract


#### DeepLens



## Evaluation and tuning

* Confusion matrix
* rMSE
* precision and recall, F! score
* ROC / AUC

## ML implementation and operations

Using containers
Security in SM
A/B testing
Tensorflow integration
Neo and Greengrass
Pipes
Elastic inference
Inference pipelines