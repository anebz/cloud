# [Practical data science specialization @ Coursera](https://www.coursera.org/specializations/practical-data-science)

This specialization is comprised of 3 courses:

1. [Analyze datasets and train ML models using AutoML](https://www.coursera.org/learn/automl-datasets-ml-models?specialization=practical-data-science)
2. [Build, train and deploy ML pipelines using BERT](https://www.coursera.org/learn/ml-pipelines-bert?specialization=practical-data-science)
3. [Optimize ML models and deploy human-in-the-loop pipelines](https://www.coursera.org/learn/ml-models-human-in-the-loop-pipelines?specialization=practical-data-science)

## 1. [Analyze datasets and train ML models using AutoML](https://www.coursera.org/learn/automl-datasets-ml-models?specialization=practical-data-science)

Creating a SageMaker session automatically creates an S3 bucket.

[AWS Data Wrangler](https://github.com/awslabs/aws-data-wrangler) is an AWS open source python initiative that extends the power of Pandas library to AWS connecting dataframes and AWS data related services (Amazon Redshift, AWS Glue, Amazon Athena, Amazon EMR, Amazon QuickSight, etc).

The data catalog features of **AWS Glue** and the inbuilt integration to Amazon S3 simplify the process of identifying data and deriving the schema definition out of the discovered data. Using AWS Glue crawlers within your data catalog, you can traverse your data stored in Amazon S3 and build out the metadata tables that are defined in your data catalog.

Using datawrangler, first create a database in Glue, then create a Table with our csv data referencing the location in the S3 bucket, table name, column types, etc. Then for the Athena part, first create a bucket (with wr) which will be used for Athena storage. Using `wr.athena.read_sql_query()` we can pass SQL queries to the database. This returns a df with the SQL response.

SageMaker Data Wrangler and Clarify help perform bias detection on the dataset. They can create reports of bias in your data.

* Data Wrangler: more visual experience: only lets you analyze a subset of the dataset
* Clarify: API-based approach: allows scale-out of the bias detection process

Clarify can additionally perform bias detection in trained and deployed models, it has explainability and drift capabilities as well. Clarify allows you to scale the bias detection process into a distributed cluster. To use Clarify, first import the library from sagemaker, then create the processor. Use instance_count and instance_type to scale up the cluster to the capacity you need.

```python
from sagemaker import clarify

bias_report_output_path = 'my_s3_path'
data_config_unbalanced = clarify.DataConfig(
    s3_data_input_path=..., # S3 object path containing the unbalanced dataset
    s3_output_path=..., # path to store the output
    label='...', # target column
    headers=df_unbalanced.columns.to_list(),
    dataset_type='text/csv'
)

# the column whose bias we want to explore
bias_config_unbalanced = clarify.BiasConfig(
    label_values_or_threshold=[1], # desired sentiment, in this case we're analyzing the sentiment 1 (positive)
    facet_name='product_category' # sensitive column (facet)
)

clarify_processor = clarify.SageMakerClarifyProcessor(
    role=role,
    instance_count=1,
    instance_type='ml.c5.2xlarge',
    sagemaker_session=sess)

# run the pre-training bias method
clarify_processor.run_pre_training_bias(
    data_config=bias_data_config,
    data_bias_config=bias_config,
    methods=["CI", "DPL", ...], # CI: class imbalance
    wait=False/True, # run in foreground/background
    logs=False/True
)
```

The processor will return a very detailed report on the bias of the dataset. 

### Using AutoML

```python
max_candidates = 3

automl = sagemaker.automl.automl.AutoML(
    target_attribute_name='sentiment',
    base_job_name=auto_ml_job_name,
    output_path=model_output_s3_uri,
    max_candidates=max_candidates,
    sagemaker_session=sess,
    role=role,
    max_runtime_per_training_job_in_seconds=1200,
    total_job_runtime_in_seconds=7200
)

automl.fit(
    path_autopilot,
    job_name=auto_ml_job_name, 
    wait=False, 
    logs=False
)

job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)

while 'AutoMLJobStatus' not in job_description_response.keys() and 'AutoMLJobSecondaryStatus' not in job_description_response.keys():
    job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
    print('[INFO] Autopilot job has not yet started. Please wait. ')
    # function `json.dumps` encodes JSON string for printing.
    print(json.dumps(job_description_response, indent=4, sort_keys=True, default=str))
    print('[INFO] Waiting for Autopilot job to start...')
    sleep(15)

print('[OK] AutoML job started.')


# takes like 10mins
%%time

job_status = job_description_response['AutoMLJobStatus']
job_sec_status = job_description_response['AutoMLJobSecondaryStatus']

if job_status not in ('Stopped', 'Failed'):
    while job_status in ('InProgress') and job_sec_status in ('Starting', 'AnalyzingData'):
        job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
        job_status = job_description_response['AutoMLJobStatus']
        job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
        print(job_status, job_sec_status)
        time.sleep(15)
    print('[OK] Data analysis phase completed.\n')
    
print(json.dumps(job_description_response, indent=4, sort_keys=True, default=str))
```

Feature engineering

```python
%%time

job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
job_status = job_description_response['AutoMLJobStatus']
job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
print(job_status)
print(job_sec_status)
if job_status not in ('Stopped', 'Failed'):
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    while job_status == 'InProgress' and job_sec_status == 'FeatureEngineering':
    ### END SOLUTION - DO NOT delete this comment for grading purposes
        job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
        job_status = job_description_response['AutoMLJobStatus']
        job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
        print(job_status, job_sec_status)
        time.sleep(5)
    print('[OK] Feature engineering phase completed.\n')
    
print(json.dumps(job_description_response, indent=4, sort_keys=True, default=str))
```

Training and tuning

```python
%%time

job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
job_status = job_description_response['AutoMLJobStatus']
job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
print(job_status)
print(job_sec_status)
if job_status not in ('Stopped', 'Failed'):
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    while job_status == 'InProgress' and job_sec_status == 'ModelTuning': # Replace all None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
        job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
        job_status = job_description_response['AutoMLJobStatus']
        job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
        print(job_status, job_sec_status)
        time.sleep(5)
    print('[OK] Model tuning phase completed.\n')
    
print(json.dumps(job_description_response, indent=4, sort_keys=True, default=str))


%%time

from pprint import pprint

job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
pprint(job_description_response)
job_status = job_description_response['AutoMLJobStatus']
job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
print('Job status:  {}'.format(job_status))
print('Secondary job status:  {}'.format(job_sec_status))
if job_status not in ('Stopped', 'Failed'):
    while job_status not in ('Completed'):
        job_description_response = automl.describe_auto_ml_job(job_name=auto_ml_job_name)
        job_status = job_description_response['AutoMLJobStatus']
        job_sec_status = job_description_response['AutoMLJobSecondaryStatus']
        print('Job status:  {}'.format(job_status))
        print('Secondary job status:  {}'.format(job_sec_status))        
        time.sleep(10)
    print('[OK] Autopilot job completed.\n')
else:
    print('Job status: {}'.format(job_status))
    print('Secondary job status: {}'.format(job_status))
```

Compare model candidates

```python
candidates = automl.list_candidates(
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    job_name=auto_ml_job_name, # Replace None
    sort_by='FinalObjectiveMetricValue' # Replace None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
)

while candidates == []:
    candidates = automl.list_candidates(job_name=auto_ml_job_name)
    print('[INFO] Autopilot job is generating the candidates. Please wait.')
    time.sleep(10)

print('[OK] Candidates generated.') 

print(candidates[0].keys())

while 'CandidateName' not in candidates[0]:
    candidates = automl.list_candidates(job_name=auto_ml_job_name)
    print('[INFO] Autopilot job is generating CandidateName. Please wait. ')
    sleep(10)

print('[OK] CandidateName generated.')

while 'FinalAutoMLJobObjectiveMetric' not in candidates[0]:
    candidates = automl.list_candidates(job_name=auto_ml_job_name)
    print('[INFO] Autopilot job is generating FinalAutoMLJobObjectiveMetric. Please wait. ')
    sleep(10)

print('[OK] FinalAutoMLJobObjectiveMetric generated.')

print(json.dumps(candidates, indent=4, sort_keys=True, default=str))

print("metric " + str(candidates[0]['FinalAutoMLJobObjectiveMetric']['MetricName']))

for index, candidate in enumerate(candidates):
    print(str(index) + "  " 
        + candidate['CandidateName'] + "  " 
        + str(candidate['FinalAutoMLJobObjectiveMetric']['Value']))


# review best candidate

candidates = automl.list_candidates(job_name=auto_ml_job_name)

if candidates != []:
    best_candidate = automl.best_candidate(
        ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
        job_name=auto_ml_job_name
        ### END SOLUTION - DO NOT delete this comment for grading purposes
    )
    print(json.dumps(best_candidate, indent=4, sort_keys=True, default=str))

while 'CandidateName' not in best_candidate:
    best_candidate = automl.best_candidate(job_name=auto_ml_job_name)
    print('[INFO] Autopilot Job is generating BestCandidate CandidateName. Please wait. ')
    print(json.dumps(best_candidate, indent=4, sort_keys=True, default=str))
    sleep(10)

print('[OK] BestCandidate CandidateName generated.')


while 'FinalAutoMLJobObjectiveMetric' not in best_candidate:
    best_candidate = automl.best_candidate(job_name=auto_ml_job_name)
    print('[INFO] Autopilot Job is generating BestCandidate FinalAutoMLJobObjectiveMetric. Please wait. ')
    print(json.dumps(best_candidate, indent=4, sort_keys=True, default=str))
    sleep(10)

print('[OK] BestCandidate FinalAutoMLJobObjectiveMetric generated.')

best_candidate_identifier = best_candidate['CandidateName']
print("Candidate name: " + best_candidate_identifier)
print("Metric name: " + best_candidate['FinalAutoMLJobObjectiveMetric']['MetricName'])
print("Metric value: " + str(best_candidate['FinalAutoMLJobObjectiveMetric']['Value']))
```

Deploy and test best candidate model

```python
inference_response_keys = ['predicted_label', 'probability']
autopilot_model = automl.deploy(
    initial_instance_count=1,
    instance_type='ml.m5.large',
    candidate=best_candidate,
    inference_response_keys=inference_response_keys,
    predictor_cls=sagemaker.predictor.Predictor,
    serializer=sagemaker.serializers.JSONSerializer(),
    deserializer=sagemaker.deserializers.JSONDeserializer()
)

print('\nEndpoint name:  {}'.format(autopilot_model.endpoint_name))

# test model

#sm_runtime = boto3.client('sagemaker-runtime')

review_list = ['This product is great!',
               'OK, but not great.',
               'This is not the right product.']

for review in review_list:
    
    # remove commas from the review since we're passing the inputs as a CSV
    review = review.replace(",", "")

    response = sm_runtime.invoke_endpoint(
        EndpointName=autopilot_model.endpoint_name, # endpoint name
        ContentType='text/csv', # type of input data
        Accept='text/csv', # type of the inference in the response
        Body=review # review text
        )

    response_body=response['Body'].read().decode('utf-8').strip().split(',')

    print('Review: ', review, ' Predicated class: {}'.format(response_body[0]))

print("(-1 = Negative, 0=Neutral, 1=Positive)")
```

## Sagemaker with built-in algorithms

```python
# please ignore warning messages during the installation
!pip install --disable-pip-version-check -q sagemaker==2.35.0
!pip install --disable-pip-version-check -q nltk==3.5

path = './womens_clothing_ecommerce_reviews_balanced.csv'

df = pd.read_csv(path, delimiter=',')
df.head()

import nltk
nltk.download('punkt')

def tokenize(review):
    # delete commas and quotation marks, apply tokenization and join back into a string separating by spaces
    return ' '.join([str(token) for token in nltk.word_tokenize(str(review).replace(',', '').replace('"', '').lower())])
    
def prepare_data(df):
    df['sentiment'] = df['sentiment'].map(lambda sentiment : '__label__{}'.format(str(sentiment).replace('__label__', '')))
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    df['review_body'] = df['review_body'].map(lambda review : tokenize(review)) # Replace all None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
    return df

# create a sample dataframe
df_example = pd.DataFrame({
    'sentiment':[-1, 0, 1], 
    'review_body':[
        "I don't like this product!", 
        "this product is ok", 
        "I do like this product!"]
})

# test the prepare_data function
print(prepare_data(df_example))

# Expected output:
#      sentiment                   review_body
# 0  __label__-1  i do n't like this product !
# 1   __label__0            this product is ok
# 2   __label__1      i do like this product !

df_blazingtext = df[['sentiment', 'review_body']].reset_index(drop=True)
df_blazingtext = prepare_data(df_blazingtext)
df_blazingtext.head()

from sklearn.model_selection import train_test_split

# Split all data into 90% train and 10% holdout
df_train, df_validation = train_test_split(df_blazingtext, 
                                           test_size=0.10,
                                           stratify=df_blazingtext['sentiment'])

labels = ['train', 'validation']
sizes = [len(df_train.index), len(df_validation.index)]
explode = (0.1, 0)  

fig1, ax1 = plt.subplots()

ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%', startangle=90)

# Equal aspect ratio ensures that pie is drawn as a circle.
ax1.axis('equal')  

plt.show()
print(len(df_train))
```

Training code

```python
image_uri = sagemaker.image_uris.retrieve(
    region=region,
    framework='blazingtext'
)

estimator = sagemaker.estimator.Estimator(
    image_uri=image_uri,
    role=role, 
    instance_count=1, 
    instance_type='ml.m5.large',
    volume_size=30,
    max_run=7200,
    sagemaker_session=sess
)

estimator.set_hyperparameters(mode='supervised',   # supervised (text classification)
        epochs=10,           # number of complete passes through the dataset: 5 - 15
        learning_rate=0.01,  # step size for the  numerical optimizer: 0.005 - 0.01
        min_count=2,         # discard words that appear less than this number: 0 - 100                              
        vector_dim=300,      # number of dimensions in vector space: 32-300
        word_ngrams=3)       # number of words in a word n-gram: 1 - 3

train_data = sagemaker.inputs.TrainingInput(
    train_s3_uri,
    distribution='FullyReplicated', 
    content_type='text/plain', 
    s3_data_type='S3Prefix'
)
validation_data = sagemaker.inputs.TrainingInput(
    validation_s3_uri,
    distribution='FullyReplicated', 
    content_type='text/plain', 
    s3_data_type='S3Prefix'
)

data_channels = {
    'train': train_data,
    'validation': validation_data
}

estimator.fit(
    inputs=data_channels,
    wait=False
)

%%time

estimator.latest_training_job.wait(logs=False)

estimator.training_job_analytics.dataframe()

training_job_name = estimator.latest_training_job.name
print('Training Job Name:  {}'.format(training_job_name))

# deploys to EC2 managed by sagemaker
# sagemaker also creates REST API
# see endpoint in sagemaker -> endpoints
%%time

text_classifier = estimator.deploy(initial_instance_count=1,
                                   instance_type='ml.m5.large',
                                   serializer=sagemaker.serializers.JSONSerializer(),
                                   deserializer=sagemaker.deserializers.JSONDeserializer())

print()
print('Endpoint name:  {}'.format(text_classifier.endpoint_name))

# predict
import nltk
nltk.download('punkt')
reviews = ['This product is great!',
           'OK, but not great',
           'This is not the right product.'] 
tokenized_reviews = [' '.join(nltk.word_tokenize(review)) for review in reviews]

payload = {"instances" : tokenized_reviews}
print(payload)

predictions = text_classifier.predict(data=payload)
for prediction in predictions:
    print('Predicted class: {}'.format(prediction['label'][0].lstrip('__label__')))
```

## 2. [Build, train and deploy ML pipelines using BERT](https://www.coursera.org/learn/ml-pipelines-bert?specialization=practical-data-science)

```python
from transformers import RobertaTokenizer

PRE_TRAINED_MODEL_NAME = 'roberta-base'
tokenizer = RobertaTokenizer.from_pretrained(PRE_TRAINED_MODEL_NAME)

def convert_to_bert_input_ids(review, max_seq_length):
    encode_plus = tokenizer.encode_plus(
        review, # raw text to be encoded
        add_special_tokens=True,
        max_length=128, # should be higher than the max_seq_length, how long your sequences are
        return_token_type_ids=False,
        padding='max_length',
        return_attention_mask=True,
        return_tensors='pt',
        truncation=True
    )
    return encode_plus['input_ids'].flatten().tolist()
```

SageMaker processing jobs

```python
from sagemaker.sklearn.processing import SKLearnProcessor
from sagemaker.processing import ProcessingInput, ProcessingOutput

processor = SKLearnProcessor(
    framework_version='<scikit learn version>',
    role=role,
    instance_type='ml.c5.4xlarge',
    instance_count=2
)
processor.run('<parameters>')

code = 'preprocess-scikit-text-to-bert.py' # scikit-learn script to execute
inputs = [
    ProcessingInput(
        input_name='raw-input-data',
        source=raw_input_data_s3_uri,
        ...
    )
]
outputs = [
    ProcessingOutput(
        output_name='bert-train',
        s3_upload_mode='EndOfJob',
        source='/opt/ml/processing/output/bert/train', # output from the processing job
        ...
    )
]
```

Create SageMaker Feature Store

```python
from sagemaker.feature_store.feature_group import FeatureGroup

reviews_feature_group_name = 'reviews_distilbert_max_seq_length_128'
reviews_feature_group = FeatureGroup(
    name=...,
    feature_definitions=...,
    sagemaker_session=sagemaker_session)
)

reviews_feature_group.create(
    s3_uri=f"s3://{bucket}/{prefix}",
    record_identifier_name=record_identifier_feature_name,
    event_time_feature_name=event_time_feature_name,
    role_arn=role
)

reviews_feature_group.ingest(
    data_frame=df_records, # our df
    max_workers=3,
    wait=True
)

# retrieve features directly from s3
reviews_feature_store_query = reviews_feature_group.athena_query()
reviews_feature_store_table = reviews_feature_store_query.table_name

# query string
query_string = f'SELECT review_body, input_ids, input_mask, segment_ids, label_id FROM "{reviews_feature_store_table}" LIMIT 5'

# execute query
reviews_feature_store_query.run(query_string)
```

## Debug and profile models

Amazon SageMaker Debugger can be used to profile machine learning models, helping to identify and fix training issues caused by hardware resource usage. Setting some parameters in the SageMaker estimator, without any change to the training code, you can enable the collection of infrastructure and model metrics such as: CPU and GPU, RAM and GPU RAM, data loading time, time spent in ML operators running on CPU and GPU, distributed training metrics and many more. In addition, you can visualize how much time is spent in different phases, such as preprocessing, training loop, and postprocessing. If needed, you can drill down on each training epoch, and even on each function in your training script.

Define Debugger Rules as described here: https://docs.aws.amazon.com/sagemaker/latest/dg/debugger-built-in-rules.html

```python
from sagemaker.debugger import Rule, rule_configs
from sagemaker.pytorch import PyTorch as PyTorchEstimator

rules = [
    Rule.sagemaker(rule_configs.loss_not_decreasing()),
    Rule.sagemaker(rule_configs.overtraining())
]

estimator = PyTorchEstimator(
    entry_point='train.py',
    ...
    rules=rules
)
```

Profile training job

```python
from sagemaker.debugger import ProfilerRule, rule_configs
from sagemaker.debugger import ProfilerConfig, FrameworkProfile

rules = [
    ProfilerRule.sagemaker(rule_configs.LowGPUUtilization()),
    ProfilerRule.sagemaker(rule_configs.ProfilerReport())
]

profiler_config = ProfilerConfig(
    system_monitor_interval_millis=500,
    framework_profile_params=FrameworkProfile(num_steps=10)
)

estimator = PyTorchEstimator(
    entry_point='train.py',
    ...
    rules=rules,
    profiler_config=profiler_config
)
```

## Sagemaker pipelines

* Machine Learning development lifecycle (MLDC) != Software development lifecycle (SDLC)
* A model may be a small part of an overall solution
* Multiple people spanning the MLDC, infrastructure engineers, customer support...
* Integration with traditional IT practices

Without MLOps:

1. Data engineer ingests and analyzes data, and hands off to data scientist
2. Data scientist builds model. Talks to data engineer about hyperparameters etc.
3. ML engineer deploys the model, and this person usually sees the model as a black box
4. Software engineer makes model integration
5. DevOps operates the system

There's multiple handoffs, increased rework and limited visibility and transparency.

Accelerating the path to production

1. Data engineer obtains raw data and ingests and analyzes it
2. Model training/retraining pipeline
   1. Data scientist does data preparation, train model script and evaluate model
   2. ML engineer deploys model from model registry and starts the deployment pipeline
3. Model integration: done by software engineer
4. DevOps will operate and monitor the model

The model monitors are provided back to the data scientist and ml engineer

Automation vs. Orchestration

* Automation: automating a step (e.g. data preparation) to perform a specific task or produce defined artifacts based on the inputs or triggers of that ask without human intervention.
  * Raw data -> Process data -> Transformed data
* Orchestration: orchestrate steps of a workflow that contain a collection of tasks
  * Orchestration layer: ingest data, prepare data, build model, deploy model

Improve the quality of deployed models:

* Data engineer accepts/rejects access
* Data scientist tracks model performance and metric thresholds
* ML engineer does A/B testing metrics
* Software engineer tracks pass/fail of integration tests
* DevOps does model monitoring (e.g. data drift)

When creating a machine learning pipeline, it's important to define triggers: new data, change in code or hyperparameters.

Also keep track of traceability, a central view of how pipeline artifacts are built.

1. Ingest and analyze
   1. Instead of asking an authorized person to send us the data set, we can store it in a data lake, and everyone who needs it (like the ML pipeline) can access it with an access key
2. Prepare and tansform
   1. An algorithm does this step, split data etc.
   2. Traceability ensures that we can see versions of artifacts, e.g. raw data v1, and training/val/test data v13
   3. You can check data quality, statistical bias, check data schema
3. Train and tune
   1. Train and tune algorithm and hypermarameters
   2. Produce model candidates, and evaluate
4. Deploy and manage
   1. Get best performing model and deploy it for consumption
      1. Batch mode deployment: send batch requests for prediction
      2. Real-time/persistent endpoint: with a web server and request proxy
   2. Logging: model data, system data
   3. Monitoring: collect metrics, set up alerts, trigger automated flows

With dashboards, everyone can see monitoring, logging, pipeline status, system/model performance etc.

Pipeline orchestration, bringing it all together

* Steps within Task can be automated
* each set of tasks has inputs and artifacts produced as part of those steps
* Orchestration is required to coordinate the execution of tasks and steps within the tasks

Model lineage: tracking of model artifacts. For each version of a trained model, we want to track:

* Versions of data used
* Version of code/hyperparameters
* Version of algorithm/framework
* Version of training Docker image
* Version of packages/libraries

Model registry: centrally manage model metadata and model artifacts. Track which models are deployed across environments

## Sagemaker pipelines

* Create and visualize automated workflows
* Choose the best performing model
* Automatic tracking of models
* Bring CICD to ML

Sagmaker offers 3 services:

* Pipelines: model building, batch predictions
* Model registry: store model metadata, deployment approval
* SG Projects: encapsulates the previous 2, it takes source code control with built-in triggers and includes a model deployment pipeline. Good for CICD practices

You have your dataset and processing script stored in S3. A SG processing job takes this as input, uses a Sklearn container image and prepares data, and stores train/val/test datasets in S3

```python
processing_inputs = [
    ProcessingInput(
        input_name='customer-reviews-input-data'),
        source='s3://...',
        destination='/opt/ml/processing/input/data/',
        s3_data_distribution_type='ShardedByS3Key'
    )
]

processing_outputs = [
    ProcessingOutput(...)
]

processing_step = ProcessingStep(
    name='Processing',
    code='src/prepare_data.py',
    processor=processor,
    inputs=processing_inputs,
    outputs=processing_outputs,
    job_arguments=[
        '--train-split-percentage',
        str(train_split_percentage.default_value)
    ]
    ...
)

from sagemaker.pytorch import PyTorch as PyTorchEstimator

estimator = PyTorchEstimator(
    entry_point='train.py',
    source_dir='src',
    role=role,
    instance_count=train_instance_count,
    instance_type=train_instance_type,
    volume_size=train_volume_size,
    py_version='py3',
    framework_version='1.6.0',
    hyperparameters=hyperparameters,
    metric_definitions=metric_definitions,
    input_mode=input_mode
)

training_step = TrainingStep(
    name='Train',
    estimator=estimator,
    inputs={
        'train':TrainingInput(
            s3_data=processing_step.properties.ProcessingOutputConfig.Outputs['sentiment-train'].S3Output.S3Uri,
            content_type='text/csv'
        ),
        'validation': TrainingInput(...)
    }
)
```

## [Course 3: Optimize ML Models and Deploy Human-in-the-Loop Pipelines](https://www.coursera.org/learn/ml-models-human-in-the-loop-pipelines?specialization=practical-data-science)

### Deployment strategies

* Blue/Green
  * Create deployment, get it working, then swap prediction request traffic. Easy to rollback
* Shadow/Challenger
  * Parallel prediction request traffic, validate new version without impact
  * Traffic goes to both endpoints at the same time, the new version captures the results but doesn't server them to the user. The user gets their result from old version
* Canary
  * Split traffic, target smaller specific users for the new version, shorter validation cycles, minimize risk of low performing model
* A/B
  * Split traffic, target larger users for the new version, longer validation cycles, minimize risk of low performing model
  * Gather live data about new models
  * Usually run for longer times than canary tests
* Multi-armed bandits
  * The only dynamic approach in the list, use RL to automatically decide when and how to distribute traffic
  * Exploit & explore
    * Exploit: reward the winning model with more traffic
    * Explore: continue to send traffic to the non-winning model/s in case behavior changes

