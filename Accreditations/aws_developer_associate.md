# AWS Certified developer associate

* [Acloudguru course](https://learn.acloud.guru/course/aws-certified-developer-associate/dashboard)
* [Braincert practice exams (DVA-C01)](https://www.braincert.com/course/lecture/14950-AWS-Certified-Developer-Associate-June-2018-Practice-Exams/18335)
* [Udemy course](https://www.udemy.com/course/aws-certified-solutions-architect-associate-exam/)
* [Udemy practice exams](https://www.udemy.com/course/aws-certified-developer-associate-practice-tests-dva-c01)

Table of contents

* [Compute](#compute)
  * [EC2](#ec2)
  * [EBS](#ebs)
* [Networking](#networking)
* [Storage and databases](#storage-and-databases)
  * [S3](#s3)
  * [RDS](#rds)
  * [Aurora](#aurora)
  * [DynamoDB](#dynamodb)
  * [Elasticache](#elasticache)
* [Security](#security)
* [IaaS: CloudFormation](#iaas-cloudformation)
* [PaaS: Elastic beanstalk](#paas-elastic-beanstalk)
* [Notifications](#notifications)
  * [SQS](#sqs)
  * [SNS](#sns)
  * [SES](#ses)
  * [Kinesis](#kinesis)
* [Serverless](#serverless)
  * [Amazon API Gateway](#amazon-api-gateway)
  * [Lambda](#lambda)
  * [X-Ray](#x-ray)
* [Developer tools](#developer-tools)
  * [CodePipeline](#codepipeline)
  * [CodeCommit](#codecommit)
  * [CodeBuild](#codebuild)
  * [CodeDeploy](#codedeploy)
  * [ECS](#ecs)

## Compute

### EC2

* For storing sensitive or confidential data in EC2, use Systems Manager (SSM). The data can be accessed from other AWS resources
* By default, user data runs only during the boot cycle when the instance is first launched. And by default, scripts entered as user data have root user privileges for executing, so they don't need sudo command
* Burstable performance instances, such as T3, T3a and T2, are designed to provide a baseline level of CPU performance with the ability to burst to a higher level when required by the workload. If your AWS account is less than 12 months old, you can use a t2.micro instance for free within certain usage limits

For reserving instances, you can reserve it for an AZ (zonal RI) or region (regional AI). The difference is that zonal RIs provide a capacity reservation, and regional doesn't.

EC2 only allows in-place or blue/green deployment. Blue/green minimizes interruptions caused by the changes of a new version.

> Auto scaling

* When creating from the console, only basic monitoring by default. When creating through CLI/SDK, detailed monitoring by default.
* If one instance exceeds capacity, ASG creates a new one. If it's unhealthy, the AS group will terminate it and create a new one
* ASGs attempt to distribute instances evenly between the AZs that are enabled for the ASG
* ASG can contain EC2 instances in multiple AZs within the same region, and cannot span multiple regions.

### EBS

Highly available (automatically replicated within a single AZ but AZ locked) and scalable storage volume that can be attached to the EC2 instance. An EBS volume can be created from a snapshot. If this snapshot is encrypted, the volume will be encrypted. Upon launch of an instance, at least one EBS volume is attached to it. Types:

* **gp2**: general purpose SSD, boot disks and general applications. the only option that can be a boot volume. up to 16k IOPS per volume
* **io1**: provisioned IOPS SSD: higher IOPS, many read/writes per second. For large dbs, latency-sensitive workloads. highest performance option, most expensive. **io2**, new generation, more IOPS per GiB.
* **st1**: throughput optimized HDD: for read-intensive workloads, for frequently accessed workloads that need to store mountains of data, big data, data warehouses. large I/O sizes
* **sc1**: cold HDD: lowest cost option, workloads where performance isn't a factor

The maximum ratio of provisioned IOPS to the requested volume size (in GB) is 50:1. For example, a 100GB volume can be provisioned witih up to 5000 IOPS.

> Monitoring

* Cloudwatch: 
  * host level metrics: CPU, network, disk and status check. For RAM utilization, you have to activate a custom metric. For custom metrics, the minimum granularity you can have is 1min.
  * By default, Cloudwatch stores the log data indefinitely, but you can change the retention
  * You can retrieve data from any terminated instance after its termination
* CloudTrail: monitors API calls in the AWS platform
* AWS config records the state of your AWS env and can notify you of changes
* AWS Budgets it needs approximately 5 weeks of usage data to generate budget forecasts

## Networking

> Elastic load balancer

* **ALB**: proxies HTTP and HTTPS requests. adds a few ms to each request, slightly slower than NLB, and don't scale quickly. with host/path based routing, it can handle multiple domains. It doesn't support TCP passthrough
  - ALB access logs: detailed info about requests sent to the LB. Each log contains the time the request was received, the client's IP address, latencies, request paths, and server responses.
  - ALB request tracing: tracks HTTP requests. The LB adds a header with a trace identifier to each request it receives.
  - If the target groups have no registered targets, the error shown is HTTP 503.
* **NLB**: routes network packets, balance TCP traffic where extreme performance is required, they handle millions of requests per second. Allows TCP passthrough. Cannot handle path based routing.
* Classic LB: load balance HTTP/HTTPS apps and user layer7 specific features, and also use strict layer4 load balancing for apps that rely purely on TCP protocol. If it returns 504, it means the gateway has timed out. The app might be failing in the web server or db server.

An user makes a request to the LB at a certain IP address, which then calls the EC2 instance. This instance only sees the LB IP address, not the user's public IP. But it can obtain this by X-Forwarded-For header

> Route 53

Amazon's DNS service, maps domain names to IP addresses (EC2 instances, load balancers or S3 buckets). For a specific domain name, specify CNAME.

> Internet Gateway

For internet connectivity to be established in an EC2 instance:

* The network ACL associated with the subnet must have rules to allow in/outbound traffic on port 80 and 443.
* The route table in the instance's subnet must have a route to an Internet Gateway

The instance's subnet is always associated with a route table, and can only be associated with one route table at a time.

> ACM, certificate manager

HTTPS is a contributor to the high CPU load. To reduce it, configure an SSL/TLS certificate on an ALB via ACM or via IAM, when the region is not supported by ACM. This is needed to create an HTTPs listener. And then, create an HTTPS listener on the ALB with SSL termination.

## Storage and databases

### S3

Serverless storage service, best suited for objects and BLOB data. A single PUT can upload objects up to 5GB. For uploading larger files, use multi-part upload. Data can be secured with access control lists in file level (ACL) and bucket policies in bucket level. Users can download a private file directly from a static website hosted on S3 by a pre-signed URL link on the site. For get-intensive S3 buckets, use random prefix and CloudFront to cache the requests.

To minimize upload speed, use S3 transfer acceleration. S3 has a pricing for every TB for month. With many requests, request pricing gets high. For log files, if objects change frequently it needs update buffering. Avoid using reduced redundancy and don't use S3 for static web hosting, since HTTPS is not allowed.

To replicate a bucket in another region, first enable S3 bucket versioning, then enable cross-region replication by enabling cross-origin resource sharing (CORS): a bucket1 from region A can access files from bucket2. For that, bucket1 needs permission to replicate objects from bucket2.

Encryption, in transit it's called SSL/TLS, at rest:

* Server side encryption. Can be enforced by using a bucket policy that denies S3 PUT requests that don't include the SSE parameter in the request header. Useful to audit trail of who has used the keys.
  * S3 managed keys (SSE-S3)
  * AWS KMS managed keys (SSE-KMS), you can set up an envelope key which encrypts the key
  * Server side encryption with customer provided keys (SSE-C). Then the customer needs to send the keys and encryption algorithm with each API call.
  * The header required for SSE is: `x-amz-server-side-encryption`
* Client side encryption: used for encryption **in transit**

### RDS

Multi-AZ provides a high availability, fault tolereant solution and the backup AZ provides the secondary host. Primary host handles all traffic, and replicates to the secondary host in a *synchronous* manner: a write to the primary host is written to the secondary host as well.

Multi-AZ doesn't improve performance of the db, secondary host doesn't handle active write traffic. The writing to a multi-AZ database is a bit slower, and it costs double as single-AZ. RDS is not serverless

> Read replica

It's a read-only db instance, updates to source are *asynchronously* replicated to read replica (eventual consistency). For accessing it, use the DNS endpoint. Querying a read replica might mean you receive stale or old data. When to use read replica?

* Scaling: redirect excess read traffic to 1+ read replicas. you can create up to 5 read replicas
* Source db unavailable. continue to serve read traffic while the source db instance is unavailable
* Reporting or data warehouse. read replicas are excellent for businses reporting and data warehousing scenarios which only need read operations
* Disaster recovery: promote a read replica to a standalone instance as a disaster recovery solution
* Lower latency: hosting a cross region read replica can reduce latency for cross region applications

### Aurora

RDMS are monolithic, very coupled layers, if one is slow they are all slow. if one fails, they all fail. can't operate or scale independently. Aurora is a self-healing cloud optimized relational db, distributed and elastic: it breaks apart the monolithic stack to enable a db that can scale out.

Aurora moves out the logging and storage layers of the db into a multi tented, scale out db optimized storage service. In Aurora global, the primary region allows read & write, while the secondary region is read only. Aurora is not serverless by default, but can be made serverless.

### DynamoDB

Non-relational serverless db stored on SSD, spread across 3 geographically distinct data centers, immediately consistent and highly durable (unlike Redis). Can be used for web sessions, JSON docs, and metadata for S3 objects, scalable session handling, as well as Elasticache. For fetching multiple items in a single API call, use BatchGetItem.

> Consistency and throughput

Strongly consistent reads apply onle while using the read operation (Query, Scan and GetItem).

1 RCU = 1 strongly consistent read/s, or 2 eventually consisteny read/s for an item up to 4kb in size. For larger files, additional RCU units must be consumed. Strongly consistent reads consume twice the RCU as eventually consisten reads. A file of 15KB would need 4 reads. And for 100 strongly consistent reads, 100*4 = 400. WCU is 1KB/s.

For the highest throughput questions, choose eventual consistency, maximum reads capacity * max item size.

> Security

All DynamoDB tables are encrypted at rest with an AWS owned key by default. Access is controled using IAM policies. Fine grained access control using IAM condition parameter: `dynamodb:LeadingKeys` to allow users to access only the items where the partition key value matches their user ID.

With an IAM policy, you can specify conditions when granting permissions. Read-only access to certain items/attributes, or write-only based upon the identity of the user.

> Table settings

A local secondary index can only be created at the time of table creation, but a global secondary index can be created at at any time. Local indexes are immediately consistent but once you create them, all records sharing the same partition key need to fit in 10GB. Global indexes don't constrain your table size in any way, but reading from them is eventually consistent.

Query results are always sorted in ascending order by the sort key if there is one, and query operation is generally more efficient than a scan. If querying in an attribute *not* part of partition/sort key, querying that is the same as scanning. Parallel scans while limiting the rate minimize the execution time of a table lookup.

The number of tables per account and number of provisioned throughput units per account can be changed by raising a request. A conditional action is an action only to be taken if certain attributes of the item still have the values you expect.

DynamoDB accelerator (DAX) is a fully managed, clustered in-memory cache for DynamoDB. It improves response times for eventually consistent reads only. You point the API calls th the DAX cluster instead of your table. It's not suitable for apps requiring strongly consistent reads, or write intensive apps, or apps that don't read much, or apps that don't require microsecond response time.

* **DynamoDB TTL** is a time to leave attribute to *remove* irrelevant or old data which sets the time in Unix/Posix epoch times, the \#seconds since 1970/1/1.
* **DynamoDB streams** is a time-ordered sequence of item level modifications in the DynamoDB tables, can be used as an event source for Lambda to take action based on events in the table.

For backup, DynamoDB has 2 built-in backup methods: on-demand and point-in-time recovery. Both write to S3, but you can't access the s3 buckets for a download.

### Elasticache

Web service that makes it easy to deploy, operate and scale an in-memory cache in tle cloud. It can be used to improve latency and throughput for many read-heavy apps or compute-intensive workloads. Elasticache can also be used to store session states.

Elasticache is used when a db is under a lot of load and the db is very read-heavy and not prone to frequent changing. If the db is running many OLAP transactions, use Redshift. Redshift is not suitable for workloads that need to capture data.

Types of Elasticache:

* Memcached: simple object caching system to offload a db. AWS treats it as a pool that can grow and shrink. No multi-AZ capability
* Redis: in-memory key-value store that supports sorted sets, lists. Use this if you want multi-AZ redundancy. AWS treats this more like a RDS, with sorting and ranking datasets in memory

Strategies for caching:

* Lazy loading: loads data into the cache only when necessary. only the requested data is cached. It can have cache miss penalty, and the data can get stale. If the data in the db changes, the cache doesn't automatically get updated
* Write-through: adds/updates data to the cache whenever data is written to the db. Data in the cache is never stale, but write penalty: every write involves a write to the cache and resources are wasted if the data is never read. Elasticache node failure means that data is missing until added or updated in the database

## Security

For creating CloudFront key pairs, root access is needed. Non-root access for EC2 instance pairs, IAM user access keys and for IAM user password.

To avoid data leaks and identify security weaknesses, try SQL injections, penetration tests (with AWS approval) and hardening tests. Code checks only check performance issues.

> IAM

With policies, all requests are denied by default. An explicit allow overrides a default deny. An explicit deny overrides an explicit allow. Types of policies:

- Managed policy: default, AWS-managed. It can be assigned to multiple users, groups or roles and it is available for use by any AWS account. You can't change the default permissions defined in the policy
- Customer managed policy. It can be assigned to multiple users, groups or roles in your account
- Inline policy: managed by the customer and embedded in a single user, group or role. useful if you want to maintain a strict one-to-one relationship between a policy and the identity that it's applied to. The policy will be deleted if you delete the user, group or role it is associated with

By setting up cross-account access, you can delegate access to resources that are in different AWS accounts, and you don't need to create individual IAM users in each account.

Users need to have IAM activated if they want access to Billing and Cost management console. 

With IAM variables, you can use policy variables and create a single policy that applies to multiple users. You can make a policy that gives each user in the group full programmatic access to a user-specific object (their own "home directory") in S3.

* To check a profile's permissions, use the CLI --dry-run option, which checks the permissions but doesn't make the request.
* To check unused IAM roles, use Access advisor feature on IAM console
* IAM access analyzer lets you see AWS resources that are shared with an external entity, it lets you identify unintended access to your resources and data. 

> Cognito

Web identity federation (WIF) allows users to authenticate with a WI provider (WIP): Google, Facebook, Amazon. The user authenticates first with the Web ID provider and receives an authentication token, which is exchanged for tmp AWS credentials allowing them to assume an IAM role. Cognito works with MFA authentication.

* Cognito **user pools**: manage user directories, user sign-up and sign-in directly, or via WIPs. It acts as an identity broker, handling all interaction with WIPs and uses push sync with SNS to push updates and sync user data across devices. User pools let you create customizable authentication and authorization solutions for your REST APIs.
* Cognito **identity pools** allow temporary, privilege-limited access for users. unique identities for your users and authenticate them with identity providers
* Cognito **Sync** allows cross device data sync without requiring your own backend.

STS is a web service enabling you to request temporary, limited-privilege credentials for IAM users or for users you authenticate. But it's not supported by API gateway.

STS AssumeRoleWithWebIdentity is part of the security token service, it allows users who have authenticated with a web identity provider to access AWS resources. If successful, STS returns temporary credentials. AssumedRoleUser ARN and assumedRoleID are used to programatically reference the temporary credentials, not an IAM role or user.

> Encryption

* KMS, key management service, for creating and storing encryption keys. useful for sensitive information. KMS encryption keys are regional. Up to 4KB can be encrypted. For bigger keys, envelope encryption.
* CMK, customer master key, can encrypt/decrypt the data key, and this data key is used to encrypt/decrypt your data. This is called envelope encryption, and the reason to use it is that this way only the data key goes over the network, not the data

## IaaS: CloudFormation

AWS resources defined in a YAML script. CF should be used for VP configs, security groups, LBs, deployment pipelines, IAM roles. DynamoDB tables, Kinesis streams, AutoScaling settings or S3 buckets are better managed in another way.

* **Transforms** required field. if this is used, it means the document is a SAM template
* **Resources** required field. defines the resources and their properties
  * Can reference a nested stack, which must be saved in S3.
  * `!GetApp` returns the value of an attribute from a resource in the template
* **Conditions** section includes conditions that control whether certain resource properties are assigned a value during stack creation or update
* **Parameters** to pass values to the template at runtime. Does not allow conditions
* **Mappings** of keys and values that can specify conditional parameter values
  * `!FindinMap` returns the value of a key of a variable in the section. Use this for the map of the base AMIs.
* **Outputs** declares output values that you can import into other stacks, return in response or view on CF console.

Intrinsic functions in templates are used to assign values to properties that aren't available until runtime. `Ref` returns the value of the specified parameter or resource, but cannot import values.

If part of the CF deployment fails due to a misconfiguration, CF rollbacks the entire stack. If one of the resources in a stack can't be created, previously created resources get deleted and the stack creation terminates. Termination Protection stack option prevents accidental deletion of an entire CloudFormation stack. 

If Stack B and Stack C depend on Stack A, stack A must be deleted last. All imports must be removed before deleting the exporting stack. You can't delete Stack A first because it's being referenced in the other Stacks.

With a cross-stack reference, you can export resources from one AWS CF stack to another. With a cross-stack reference, owners of the web app stacks don't need to create or maintain networking rules or assets. For this, use the Exports output field to flag the value of VPC from the network stack.

## PaaS: Elastic beanstalk

Deploy and scale web apps. Beanstalk takes care of provisioninig load balancers, security groups, launching EC2 instances, autoscaling groups, creating S3 buckets and dbs. It integrates with CloudWatch and CloudTrail and includes its own health dashboard.

For deployment updates, it deploys to all hosts concurrently, in batches, and deploys the new version to a fresh group of instances before deleting the old instances. Deployments are immutable, the new versions use another instances, they don't touch the ones until now.

Traffic splitting / canary testing: installs the new version on a new set of instances like an immutable deployment. Forwards a percentage of incoming client traffic to the new app version for a specified evaluation period. If the new instances are healthy, all traffic is sent to the new version. Rollback requires another rolling update.

If Beanstalk takes too long, use pre-baked AMIs to preload and prepackage dependencies instead of having to configure it at launch.

Elasticache should be defined in .ebextensions/, but RDS database should be referenced externally and reference through env variables. All the EBS config files should be under this folder with the .config extension.

By enabling log file rotation to S3 within the ELB configuration, developers can access the logs without logging into the app servers.

## Notifications

### SQS

* Highly-durable pull-based queue
* No strict ordering and duplicates
  * FIFO: strict ordering, exactly one-time processing and no duplicates, but then you have a limit of 300 messages/second
  * To ensure that messages are delivered in order, use FIFO queues + use sequence info in the messages with Standard queues
* Default standard queues have unlimited transactions and guarantee that a message is delivered at least once and provide best-effort ordering, which means that occasionally there might be duplicate messages or out of order
* No message limits for storing in SQS, but 'in-flight messages' (received from a queue by a consumer, but not yet deleted from queue) max 120k inflight messages
* SQS doesn't automatically delete messages, the app has to issue the command
* Each sender's messages must be processed in order, by configuring each sender with a unique MessageGroupId, this is a flag that specifies that a message belongs to a specific message group. Messages that belong to a group are always processed one by one, in a strict order relative to the message group.

Settings:

* Delay queue: postpone delivery of new messages when they're first added to the queue, default delay is 0s, max 900s. In this time, messages are invisible. For larger messages, you can use S3 to store the messages and Amazon SQS extended client library for Java to manage them, and also the AWS SDK for Java.
* Dead letter queue: to prevent data loss, they sideline, isolate and alayze the unsucessfully procesed messages
* Visibility timeout: amount of time that the message is invisible in the SQS after a reader picks up the message. Makes sure that the message isn't read by any other consumer while it's being processed by one. Default is 30s, can be increased if necessary, max 12h. If the job isn't processed in that time, the msg becomse visible again and another reader will process it
* Short polling: returns a response immediately even if the msg queue is empty --> if queue is empty, lots of empty responses --> additional cost
* Long polling: periodically poll the queue, response is returned only when a msg arrives or the long poll times out. Can save money. ReceiveMessageWaitTimeSeconds

Security in messages:

* Use SQS server side encryption
* Restrict access as per policy defined
* Use HTTP over TSL
* Encrypt message before pushing into SQS

### SNS

* Push-based asynchronous simple notification service with durable storage to send notifications from the cloud
* It can deliver push notifications, SMS and emails to any HTTP endpoint, and it can trigger a Lambda function. Can't receive anything
* Pub-sub model (publish and subscribe). Apps can push msgs to a topic, and subscribers receive these from the topic. Consumers must subscribe to a topic to receive the notifications
* SNS can be used in conjunction with SQS to fan a single message out to multiple SQS queues

### SES

Scalable and highly available email service. Pay as you go model, you can send and receive emails. It can trigger SNS and Lambda. It can be used for automated emails, online purchases, marketing emails. SES is not a valid target for CloudWatch Events.

### Kinesis

Family of services to analyze streaming data in real time. Streams are made of shards, each shard is a sequence of 1+ data records and provides a fixed unit of capacity. Default is 5reads/s, max 2MB. 1k writes/s, max is 1MB/s. Kinesis gives you the ability to consume records according to a sequence number applied when data is written to the Kinesis shard.

* Streams: stream data/video
* Firehose: capture, transform, load streams into AWS data stores
* Data analytics: analyze, query and transform streamed data in real-time using standard SQL and save in an AWS data store

If your data rate increases, you can increase or decrease the number of shards allocated to your stream. The Kinesis client library ensures that for every shard there is a record processor. You should ensure that the \#instances >! \#shards. No need to use multiple instances to handle the processing load of one shard. One worker can process multiple shards. Resharding, increasing the number of shards, doesn't mean you need more instances.

> Kinesis data streams

* Highly durable linked list in the cloud optimized for sequential reads and sequential writes.
* Strict ordering and duplicates
* Number of consumers: unlimited
* Needs shared monitoring
* Cheaper than SQS
* Underlying data structure: consumed messages get added to a list in a stable order, and get deleted after its retention period (usually 24h)

For encryption that don't require code changes: KMS encryption for data at rest, and encryption in flight with HTTPS endpoint.

## Serverless

SAM is the serverless application model, to define and provision serverless apps using CloudFormation. For launching a templatized serverless app, use CF package then CF deploy.

### Amazon API Gateway

It's a service to manage APIs at any scale. Users would make a request to the API gateway, and this would redirect this request to EC2, Lambda, etc. 

* Expose HTTPS endpoints to define a RESTful API
* Send each API endpoint to a different target
* Can track and control usage with an API key
* Throttle requests to prevent attacks
* Connect to CloudWatch to log all requests for monitoring

API caching allows you to cache the Gateway response. Popular requests are cached and are retrieved with much less latency. You can throttle API gateway to prevent attacks. Frontend: method, backend: integration.

When changing the API, redeploy it to an existing stage or to a new stage. Lambda authorizer is a Lambda function controlling access to the API. This helps in access control

### Lambda

Lambda is priced based on number of requests (first 1M free, then $0.2 per 1M requests) and duration. Lambda automatically scales out, not up.

> Function

With an alias you can create many versions of Lambda functions. `$LATEST` is always the last version of code you uploaded to Lambda. Use Lambda versioning and aliases to point the apps to a specific version if you don't want to use `$LATEST`. If the app has an alias instead of `$LATEST`, it won't automatically use new code when you upload it.

Package only the modules the function requires and move the initialization of the RDS connection outside the handler function.

Environment variables can't exceed 4KB, so if encrypted data must be passed to the function, use envelope encryption and reference the data as file within the code. Using an envelope encryption, the network load is much lower. For lower files, you can use Encryption SDK and pack the encrypted file with the Lambda function.

For temporary storage that won't be necessary after the function finishes, use /tmp directory up to 512MB and delete the files at the end of the function.

> Limits

* Maximum execution duration for a Lambda request is 900s=15mins
* The maximum deployment package size is 50MB, and the max size of code/dependencies zipped into a deployment package is 250MB
* Lambda has a limit to the number of functions that can run simultaneously in a region. Default is 1000 per second per region, the error you get is `TooManyRequestsException`, HTTP status code 429. Avoid recursion!


> Monitoring and security

With **step functions** you can visualize serverless applications, they automatically trigger and track each step so if something goes wrong you can track what went wrong where. With step functions you can track flows executed by Lambda functions, and you can control multiple Lambda functions.

With Lambda authorizer, a 3rd party authorization mechanism is used to invoke the Lambda function.
Lambda works on S3 events asynchronously and for asynchronous invocations, Lambda retries function errors twice.

> Concurrency: \# requests that a Lambda function is serving at a time.

If a function is invoked while a request is still undergoing, another instance is allocated, increasing the functions' concurrency. Reaching the concurrency limit leads to latency bottlenecks. To enable the function to scale without fluctuations in latency, use provisioned concurrency. By allocationg this before an increase in invocations, you can ensure that all requests are served by initialized instances with very low latency. You can also configure application auto scaling to manage provisioned concurrency on a schedule or based on use. To increase provisioned concurrency automatically as needed, use the app auto scaling API to register a target and create a scaling policy.

You can set up reserved concurrency for the Lambda function so that it throttles if it goes above a certain concurrency limit. This is used to limit the maximum concurrency for a given Lambda function.

You can give a Lambda function from account A permissions to assume a role from account B to access AWS resources. Create an execution role in acc A that gives the function permission. Then create a role in acc B that the function from A assumes to gain access to the cross-acount AWS resource. **Modify the trust policy of the role in B** to allow the execution role of Lambda to assume this role. Finally, update the function code to add the AssumeRole API call.

### X-Ray

Prerequisites: install X-Ray daemon in the instance, create IAM role, give X-Ray permission: xray:PutTraceSegments and xray:PutTelemetryRecords and instrument the app with daemon and SDK.

Analyzes and debugs **distributed** apps' performance, identify and troubleshoot performance issues and errors. Provides an end-to-end view of requests as they travel through the app, and shows a map of the app's underlying components. X-Ray can be used to collect data **across AWS** accounts.

X-Ray sampling allows to control the amount of data to be recorded, and modify sampling behavior on the fly without modifying or redeploying your code.

X-Ray integrates with ELBs, Lambda and API gateway. Provides:

* Interceptors to add to the code to trace incoming HTTP requests
* Client handlers to instrument AWS SDK clients that the app uses to call other AWS services
* An HTTP client to instrument calls to other internal and external HTTP web services

## Developer tools

### CodePipeline

Manages the whole workflow whenever a change is detected in the source code. If the pipeline needs **needs approval**, add a manual approval step at the end of the flow.

### CodeCommit

Ssource and version control. Allows access through git credentials, SSH keys and AWS access keys

### CodeBuild

Automated build, runs tests, produce packages

* If the build fails, run it locally using CodeBuild Agent. Then, you can test the integrity and content of a buildspec.yml file locally, test and build an app locally before commiting. Check CloudWatch logs for debuggingd

For very big dependencies, bundle them all in the source coude during the last stage of CodeBuild. You can reduce the build time by caching dependencies.

Integrates with CloudWatch to show \# total builds, failed builds, etc. You can export log data to S3. CloudWatch events can be integrated too, but this doesn't store logs anywhere.

### CodeDeploy

Automated deployments to EC2, Lambda, on-premises. Steps: ApplicationStop --> BeforeInstall --> AfterInstall -> ApplicationStart --> ValidateService (to verify success)

If the deployment fails and is getting rolled back, CodeDeploy first deploys to the failed instances.

* All at once: if failed, downtime. Very fast, for rollback it needs manual redeploy. Code is deployed to existing instances.
* in place/rolling
  * The app is stopped on each instance and new release installed. Code is deployed to the existing instances
  * Capacity is reduced during deployment
  * Rolling back requires manually re-deploying the previous version
  * If failed deployment, single batch out of service.
  * In a fleet of instances, rolling deployment deploys in batches. Some instances start with the new version while the rest has old version, then more and more instances get the new version
* Rolling with additional batch
  * An extra batch of instances is launched, code deployed to new and existing instances
  * **Bandwidth** and availability maintained
  * Takes longer than the Rolling deployment
  * If failed deployment, similar to rolling
* blue/green
  * new env created from scratch, another LB. The switch is performed at DNS level routing the traffic from the OLD to the NEW when the new environment is ready and healthy. Instant complete switch from old to new version
  * slowest deployment method
  * new instances provisioned, new release is installed on the new instance
  * No capacity reduction, green instances can be created ahead of time, easy to switch between old and new, and you pay for 2 envs until you terminate the old servers
  * Rolling back is easy, send the load balancer to the blue instances (prev version)
  * DNS change, for rollback swap the URLs
* Immutable
  * created in the same environment, under the same LB. a new autoscaling group created alongside the other one. Since the first new instance is created it starts to serve traffic. When the new instances are all healthy the old ones are switched off
  * New instances serve traffic alongside the old ones during deployment
  * no DNS change, for rollback terminate the new instances

The deployment config file, appspec.yml file must be in the root folder of the repo
  - When working with Lambda, specify the version in appspec.yml
  - the hooks section determines the scripts that are run in the lifecycle event hooks

### ECS

A container orchestration service supporting docker. It uses Fargate for serverless, or you can use EC2 for more control. First upload the image to ECR, elastic container registry. ECS connects to ECR and deploys the images.

To log in, run `aws ecr get-login`, use the output to login to ECR, and then pull the image with `docker pull REPOSITORY URI : TAG`

* To allow the container to access SQS, the policy must be attached to the ECS Task's execution role
* To use X-Ray with ECS, create a separate Docker image to run the X-Ray daemon
* If the container should share storage, use Fargate launch

When you use ECS with a load balancer deployed across multiple AZs, you get a scalable and highly available REST API.