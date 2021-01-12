# CloudHealth + Lambda + S3

> This task consists of creating a Lambda function that makes a GET request to the CloudHealth API, obtains the accounts status, and saves them to an S3 bucket: green.txt, yellow.txt, unknown.txt

These are the steps to complete this task:

1. Find how to get info from CloudHealth API
    * [Link to CloudHealth API](https://apidocs.cloudhealthtech.com/#account_aws-accounts-in-cloudhealth)
    * With this GET request we get the first page and 100 accounts `https://chapi.cloudhealthtech.com/v1/aws_accounts?page=1&per_page=100`
2. Obtain info from CloudHealth API with [Postman](https://www.postman.com/downloads/), set CloudHealth API Key in the TokenBearer tab
    * Get CloudHealth API Key: go to [CloudHealth profile](https://apps.cloudhealthtech.com/profile) -> Settings -> API Access -> Get API Key
    * Postman -> New request -> Write GET request from step 1 -> Authorization, Token Bearer -> Insert CloudHealth API Key
    * Send request, and see that the response includes AWS account names and their status with level `green`, `yellow` or `unknown`
2. Write code in Python/Node.js to get this information with code. Example of GET
    * Also can be done with [serverless](https://www.serverless.com/framework/docs/providers/aws/guide/functions/) and [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html)
    * Python template
    ```python
    import json
    import urllib3
    url = urllib3.PoolManager()
    try: 
        res = url.request('GET','https://www.web.com', retries=False)
    except:
        print('ERROR - Connection failed.')
    data = json.loads(res.data.decode('utf8'))
    ```
3. Data processing to get `id`, `name` and `status` from the response
4. Make an AWS Lambda function
    * [Learn how AWS Lambda works](https://aws.amazon.com/lambda/getting-started/)
    * Create a new function -> select runtime -> write your code -> adapt to Lambda syntax with the `lambda_handler(event, context)` format
    * If you change the code, make sure to click the *Deploy* button to save the changes
    * Write the cloudhealth api in *Environment variables* and access it in the code with `CH_API = os.environ['CH_API']`
    * Create a test event (at the top of the Lambda function page), configure the input (in this case irrelevant) and run test. The logs will show if it was successful or not
5. Create S3 bucket
    * Go to AWS S3 page -> create bucket -> give it a name, in my case *account-status* -> block all public access -> Create bucket
6. Write info to S3
    * How does AWS Lambda get permissions to write to S3? IAM -> new role -> use case: Lambda -> Attach permission policy *AWSLambdaExecute* (this policy provides Put, Get access to S3 and full access to CloudWatch Logs) -> Give it a name -> Create role
    * Attach this role to the Lambda function: in the Lambda page, Permissions -> Execution role, edit -> attach the previous role, increase timeout to 10s (it takes some seconds to wite to s3), save
    * Python template to write data to s3 bucket:
    ```python
    import boto3
    s3 = boto3.resource('s3')
    s3.Object('account-status', 'green.txt').put(Body='text_to_write')
    ```
    * Deploy changes in the Lambda code
    * Run test

## Python code for this challenge

```python
import os
import sys
import json
import boto3
import logging
import urllib3

logging.basicConfig(level=logging.INFO)

# obtain data from CloudHealthAPI given API key. Iterate all pages until there is no more data
def data_from_cloudhealth(CH_API):
    url = urllib3.PoolManager()
    all_status = {}
    page = 0

    while True:
        # make the query, exit if it fails
        try:
            query = 'https://chapi.cloudhealthtech.com/v1/aws_accounts?api_key='+CH_API+'&page='+str(page)+'&per_page=100'
            res = url.request('GET', query, retries=False)
        except:
            print("Error occurred in the GET request")
            sys.exit(-1)
        
        page_accounts = json.loads(res.data.decode('utf8'))['aws_accounts']
        if len(page_accounts) == 0:
            break

        # iterate the results and separate by status (green, yellow, unknown)
        for account in page_accounts:
            acc_info = str(account['owner_id']) + ' ' + account['name']
            acc_status = account['status']['level']
            # append to list if list already exists, otherwise create a new one
            if acc_status in all_status:
                all_status[acc_status].append(acc_info)
            else:
                all_status[acc_status] = [acc_info]
        page += 1
    
    logging.info(f'''
    status 'green': {len(all_status['green'])} accounts
    status 'yellow': {len(all_status['yellow'])} accounts
    status 'unknown': {len(all_status['unknown'])} accounts
    ''')
    return all_status
    
def write_to_s3(acc_data):
    s3 = boto3.resource("s3")
    s3.Object('account-status', 'green.txt').put(Body='\n'.join(acc_data['green']))
    s3.Object('account-status', 'yellow.txt').put(Body='\n'.join(acc_data['yellow']))
    s3.Object('account-status', 'unknown.txt').put(Body='\n'.join(acc_data['unknown']))
    return

# main function
def lambda_handler(event, context):
    CH_API = os.environ['CH_API']
    all_status = data_from_cloudhealth(CH_API)
    try:
        write_to_s3(all_status)
        return {
            'statusCode': 200,
            'body': json.dumps('Data stored in S3 bucket')
        }
    except:
        return {
            'statusCode': 500,
            'body': json.dumps('Data couldn"t be stored in S3 bucket')
        }
```
