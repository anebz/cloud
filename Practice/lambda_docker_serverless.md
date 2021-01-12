# [AWS Lambda with Docker and Serverless](https://www.philschmid.de/serverless-bert-with-huggingface-aws-lambda-docker)

The architecture

![ ](https://www.philschmid.de/static/40699c51c9b076cb14e14c31f432fc19/21482/architektur.png)

[Install Serverless](https://www.serverless.com/framework/docs/getting-started/)

```bash
serverless create --template aws-python3 --path my-project
```

This creates a new directory with `handler.py`, `.gitignore`, `serverless.yaml`. You can create your Python modules in the directory and adapt the handler. Add your requirements and write the `Dockerfile`:

```Dockerfile
FROM public.ecr.aws/lambda/python:3.8

# Copy function code and models into our /var/task
COPY ./ ${LAMBDA_TASK_ROOT}/

# install our dependencies
RUN python3 -m pip install -r requirements.txt --target ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD ["handler.handler"]
```

Add `.dockerignore`:

```.dockerignore
README.md
*.pyc
*.pyo
*.pyd
__pycache__
.pytest_cache
serverless.yaml
get_model.py
```

Run and test docker:

```bash
docker build -t my-lambda .
docker run -p 8080:8080 my-lambda
```

We can test the app in a separate terminal

```bash
curl --request POST \
  --url http://localhost:8080/2015-03-31/functions/function/invocations \
  --header 'Content-Type: application/json' \
  --data '{"body":"{\"context\":\"We introduce a new language representation\",\n\"question\":\"What is the GLUE score for Bert?\"\n}"}'

# the data should be a stringified json with the input to the handler you wrote for your app.
# {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true}, "body": "{\"answer\": \"80 . 5 %\"}"}%
```

Deploy custom docker image to ECR.

```bash
aws ecr create-repository --repository-name my-lambda > /dev/null
```

Before pushing images to ECR, we need to log in.

```bash
aws_region=us-east-2
aws_account_id=your_account_id_numbers

aws ecr get-login-password \
    --region $aws_region \
| docker login \
    --username AWS \
    --password-stdin $aws_account_id.dkr.ecr.$aws_region.amazonaws.com
```

We rename our previously created image to the ECR format, which is `{AccountID}.dkr.ecr.{region}.amazonaws.com/{repository-name}`.

```bash
docker tag my-lambda $aws_account_id.dkr.ecr.$aws_region.amazonaws.com/my-lambda
```

The new image should be apparent when running `docker images`. If it's there, push the image to ECR.

```bash
docker push $aws_account_id.dkr.ecr.$aws_region.amazonaws.com/my-lambda
```

Use this ECR docker image to deploy the AWS lambda function. In `serverless.yml`, add the aws provider, region and function. Add the account ID numbers and the AWS Region.

```yml
service: serverless-my-lambda-docker

provider:
  name: aws # provider
  region: us-east-2 # aws region
  memorySize: 5120 # optional, in MB, default is 1024
  timeout: 30 # optional, in seconds, default is 6

functions:
  questionanswering:
    image: ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/my-lambda:latest #ecr url
    events:
      - http:
          path: qa # http path
          method: post # http method
```

Deploy with serverless

```bash
serverless deploy
```

Done! To test the Lambda function, use Postman or a REST client, add the json with the inputs that your handler needs.
