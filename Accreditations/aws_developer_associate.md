# AWS Certified developer associate

* [Acloudguru course](https://learn.acloud.guru/course/aws-certified-developer-associate/dashboard)
* [Braincert practice exams (DVA-C01)](https://www.braincert.com/course/lecture/14950-AWS-Certified-Developer-Associate-June-2018-Practice-Exams/18335)
* [Udemy course](https://www.udemy.com/course/aws-certified-solutions-architect-associate-exam/)
* [Udemy practice exams](https://www.udemy.com/course/aws-certified-developer-associate-practice-tests-dva-c01)

Table of contents

* [Compute](#compute)
  * [EC2](#ec2)
  * [EBS volume](#ebs-volume)
  * [Cloudwatch](#cloudwatch)
* [Networking](#networking)
  * [Elastic load balancer](#elastic-load-balancer)
  * [Route 53](#route-53)
* [IaaS: CloudFormation](#iaas-cloudformation)
* [Storage and databases](#storage-and-databases)
  * [S3](#s3)
  * [RDS](#rds)
  * [Aurora](#aurora)
  * [DynamoDB](#dynamodb)
  * [Elasticache](#elasticache)
* [Security](#security)
  * [IAM](#iam)
  * [KMS](#kms)
* [PaaS](#paas)
  * [Elastic beanstalk](#elastic-beanstalk)
* [Notifications](#notifications)
  * [SQS](#sqs)
  * [SNS](#sns)
  * [SES](#ses)
  * [Kinesis](#kinesis)
    * [Kinesis data streams](#kinesis-data-streams)
* [Serverless](#serverless)
  * [Amazon API Gateway](#amazon-api-gateway)
  * [Lambda](#lambda)
  * [Lambda + VPC](#lambda--vpc)
  * [X-ray SDK](#x-ray-sdk)
  * [DevOps](#devops)
  * [ECS](#ecs)

## Compute

### EC2

For storing sensitive or confidential data in EC2, use Systems Manager (SSM). The data can be accessed from other AWS resources.

### EBS volume

Highly available (automatically replicated within a single AZ) and scalable storage volume that can be attached to the EC2 instance. Upon launch of an instance, at least one EBS volume is attached to it. Types:

* **gp2**: general purpose SSD, boot disks and general applications. the only option that can be a boot volume. up to 16k IOPS per volume
* **io1**: provisioned IOPS SSD: higher IOPS, many read/writes per second. For large dbs, latency-sensitive workloads. highest performance option, most expensive. **io2**, new generation, more IOPS per GiB.
* **st1**: throughput optimized HDD: for read-intensive workloads, for frequently accessed workloads that need to store mountains of data, big data, data warehouses. large I/O sizes
* **sc1**: cold HDD: lowest cost option, workloads where performance isn't a factor

You can create an EBS volume from a snapshot. If this snapshot is encrypted, the volume will be encrypted.

### Cloudwatch

Performance monitoring service. Host level metrics are CPU, network, disk and status check. For RAM utilization, you have to activate a custom metric. By default, Cloudwatch stores the log data indefinitely, but you can change the retention at any time. Also, you can retrieve data from any terminated instance after its termination. For custom metrics, the minimum granularity you can have is 1min.

CloudTrail monitors API calls in the AWS platform, and AWS config records the state of your AWS env and can notify you of changes.

## Networking

### Elastic load balancer

Balances the load across multiple servers.

* **ALB**: proxies HTTP and HTTPS requests.their proxy approach adds a few ms to each request, they're slightly slower than NLB, and they don't scale quickly. with host/path based routing, it can handle multiple domains. It doesn't support TCP passthrough
* **NLB**: routes network packets, balance TCP traffic where extreme performance is required, they handle millions of requests per second. Allows TCP passthrough. Cannot handle path based routing.
* Classic LB: load balance HTTP/HTTPS apps and user layer7 specific features, and also use strict layer 4 load balancing for apps that rely purely on tcp protocol. If it returns 504, it means the gateway has timed out. The app might be failing in the web server or db server.

An user makes a request to the LB at a certain IP address, which then calls the EC2 instance. This instance only sees the LB IP address, not the user's public IP. But it can obtain this by X-Forwarded-For header

### Route 53

Amazon's DNS service, maps domain names to IP addresses (EC2 instances, load balancers or S3 buckets).

## IaaS: CloudFormation

AWS resources are defined in a YAML script. CF should be used for VP configs, security groups, LBs, deployment pipelines, IAM roles. DynamoDB tables, Kinesis streams, AutoScaling settings or S3 buckets are better managed in another way.

**Transforms** are used to reference code located in S3 and also for specifying the use of the Serverless Application Model for Lambda deployments. The **Resources** section defines the resources you are provisioning.

if part of the CF deployment fails due to a misconfiguration, CF rollbacks the entire stack.

Nested stacks allow you to re-use the CF code, useful for frequently used configs. By saving the CF template in s3, you can reference it in the resources section of any CF template using the stack resource type.

Termination Protection stack option can be enabled to prevent accidental deletion of an entire CloudFormation stack.

## Storage and databases

### S3

Serverless storage service. Data can be secured with access control lists in file level (ACL) and bucket policies in bucket level. Users can download a private file directly from a static website hosted on S3 by a pre-signed URL link on the site.

To minimize upload speed, use S3 transfer acceleration.

Cross region replication is a replication of a bucket in another region.Cross-origin resource sharing (CORS): if enabled in bucket2, allows bucket1 to access files from bucket2.

Encryption, in transit it's called SSL/TLS, at rest:

* Server side encryption. Can be enforced by using a bucket policy that denies S3 PUT requests that don't include the SSE parameter in the request header
  * S3 managed keys (SSE-S3)
  * AWS KMS managed keys (SSE-KMS), you can set up an envelope key which encrypts the key
  * Server side encryption with customer provided keys (SSE-C)
  * The header required for SSE is: `x-amz-server-side-encryption`
* Client side encryption

S3 has a pricing for every TB for month. With many requests, request pricing gets high. For log files, if objects change frequently it needs update buffering. Avoid using reduced redundancy and don't use S3 for static web hosting, since HTTPS is not allowed.

### RDS

Multi-AZ provides a high availability, fault tolereant solution and the backup AZ provides the secondary host. Primary host handles all traffic, and replicates to the secondary host in a *synchronous* manner: a write to the primary host is written to the secondary host as well.

Multi-AZ doesn't improve performance of the db, secondary host doesn't handle active write traffic. The writing to a multi-AZ database is a bit slower, and it costs double as single-AZ. RDS is not serverless

> Pricing

4 drivers for the cost

* Instance hours
* Database storage
* Backup storage, free if it's smaller than db storage
* Data transfer, outgoing traffic only

> Failovers

Occur when

* AZ outage
* DB instance fails
* DB instance class is changed
* software patching
* manual failover, host rebooted manually in console

Failovers take 1-2mins, but starting hew hosts for secondary takes more time.

> Read replica

It's a read-only db instance, updates to source are *asynchronously* replicated to read replica (eventual consistency). Querying a read replica might mean you receive stale or old data. When to use read replica?

* Scaling: redirect excess read traffic to 1+ read replicas. you can create up to 5 read replicas
* Source db unavailable. continue to serve read traffic while the source db instance is unavailable
* Reporting or data warehouse. read replicas are excellent for businses reporting and data warehousing scenarios which only need read operations
* Disaster recovery: promote a read replica to a standalone instance as a disaster recovery solution
* Lower latency: hosting a cross region read replica can reduce latency for cross region applications

> Backups

They only store the difference, first snapshot of a db contains all the data, and next ones are incremental. In single AZ, when taking a backup there's a brief I/O suspension. in mutlti-AZ, no impact except in SQL server.

* Automatic
  * daily EBS snapshot of the secondary RDS host
  * you can restore any point in time, this is enabled by Transaction logs
  * have to configure backup window (when backup should be taken) and retention period (how long a backup should be kept, default 7days)
* Manual snapshot
  * EBS snapshot of secondary RDS host, activated manually and retained until no longer needed

Restoring a backup creates a new db instance. You should retain parameter group and security group. Full performance requires some time.

> Security

* Network isolation: VPC
  * public subnet makes it secure from public routes on the internet
  * security groups: db instance ip firewall protection, lets you securely control network configuration
  * classiclink: network with non-vpc resources
  * directconnect: replicate with an onprem db
  * vpc peering: share between vpcs
* Access control: IAM
* Encryption at rest: done at volume level, no impact to the app
  * free, enabled by AWS KMS using industry standard AES-256 encryption algorithm
  * If primary is encrypted, all nodes are encrypted, including backups and snapshots
  * Access to keys is logged
  * Encrypt once: can rotate keys but can't unencrypt
  * Two tier encryption: master keys created by you, each instance with its own data key. it enables key rotation
* SSL for db connectivity
  * no one is able to sniff traffic between your db and your client/app
  * the db can't be tampered when 'in-flight'
  * you're connecting to the db you intended to

### Aurora

RDMS are monolithic, very coupled layers, if one is slow they are all slow. if one fails, they all fail. can't operate or scale independently.

Aurora is a self-healing cloud optimized relational db: it breaks apart the monolithic stack to enable a db that can scale out, it leverages the distributed and elastic nature of the cloud.

Aurora moves out the logging and storage layers of the db into a multi tented, scale out db optimized storage service. In Aurora global, the primary region allows read & write, while the secondary region is read only. Aurora is not serverless by default, but can be made serverless.

### DynamoDB

Non-relational serverless db stored on SSD, spread across 3 geographically distinct data centers, immediately consistent and highly durable (unlike Redis).

Choice of 2 consistency models: Default: eventual consistent reads and Strongly consistent reads. All DynamoDB tables are encrypted at rest with an AWS owned key by default.

Access is controled using IAM policies. Fine grained access control using IAM condition parameter: `dynamodb:LeadingKeys` to allow users to access only the items where the partition key value matches their user ID.

You can create a local secondary index at the time of table creation, or a global secondary index at any time.

Query results are always sorted in ascending order by the sort key if there is one, and query operation is generally more efficient than a scan.

Unlike RDS, DynamoDB requires data operations to be done by your app, that means all data needs to be sent over the network. Pricing is depending on requests. Storage pricing is 10 times higher than S3. You can get on-demand or provisioned option. Do not use local indexes, they might be immediately consistent but once you create them, all records sharing the same partition key need to fit in 10GB. Global indexes don't constrain your table size in any way, but reading from them is eventually consistent.

|    On-demand capacity     |               Provisioned capacity               |
| :-----------------------: | :----------------------------------------------: |
|     Unknown workloads     |      Forecast read and write capacity reqs       |
| Unpredictable app traffic |             Predictable app traffic              |
|     Pay-per-use model     | App traffic is consistent or increases gradually |
| Spiky, short lived peaks  |                                                  |

DynamoDB accelerator (DAX) is a fully managed, clustered in-memory cache for DynamoDB. It improves response times for eventually consistent reads only. You point the API calls th the DAX cluster instead of your table. It's not suitable for apps requiring strongly consistent reads, or write intensive apps, or apps that don't read much, or apps that don't require microsecond response time.

* **DynamoDB TTL** is a time to leave attribute to remove irrelevant or old data which sets the time in Unix/Posix epoch times, the \#seconds since 1970/1/1.
* **DynamoDB streams** is a time-ordered sequence of item level modifications in the DynamoDB tables, can be used as an event source for Lambda to take action based on events in the table.

### Elasticache

Web service that makes it easy to deploy, operate and scale an in-memory cache in tle cloud. It can be used to improve latency and throughput for many read-heavy apps or compute-intensive workloads. Elasticache can also be used to store session states.

Elasticache is used when a db is under a lot of load and the db is very read-heavy and not prone to frequent changing. If the db is running many OLAP transactions, use Redshift.

Types of Elasticache

* Memcached: simple object caching system to offload a db. AWS treats it as a pool that can grow and shrink. No multi-AZ capability
* Redis: in-memory key-value store that supports sorted sets, lists. Use this if you want multi-AZ redundancy. AWS treats this more like a RDS, with sorting and ranking datasets in memory

Strategies for caching:

* Lazy loading: loads data into the cache only when necessary. only the requested data is cached. It can have cache miss penalty, and the data can get stale. If the data in the db changes, the cache doesn't automatically get updated
  * Time to live (TTL): soecify number of seconds until the data expires to avoid keeping stale data in the cache
* Write-through: adds/updates data to the cache whenever data is written to the db. Data in the cache is never stale, but write penalty: every write involves a write to the cache and resources are wasted if the data is never read. Elasticache node failure means that data is missing until added or updated in the database

## Security

### IAM

Types of policies

- Managed policy: default, AWS-managed. It can be assigned to multiple users, groups or roles and it is available for use by any AWS account. You can't change the default permissions defined in the policy
- Customer managed policy. It can be assigned to multiple users, groups or roles in your account
- Inline policy: managed by the customer and embedded in a single user, group or role. useful if you want to maintain a strict one-to-one relationship between a policy and the identity that it's applied to. The policy will be deleted if you delete the user, group or role it is associated with

Web identity federation (WIF) allows users to authenticate with a WI provider (WIP): Google, Facebook, Amazon. The user authenticates first with the Web ID provider and receives an authentication token, which is exchanged for a temp AWS credentials allowing them to assume an IAM role.

Cognito uses user pools to manage user sign-up and sign-in directly, or via WIPs. It acts as an identity broker, handling all interaction with WIPs and uses push sync with SNS to push updates and sync user data across devices.

With Cognito identity pools you can create unique identities for your users and authenticate them with identity providers. With an identity, you can obtain temporary, limited-privilege AWS credentials to access other AWS services.

STS AssumeRoleWithWebIdentity is part of the security token service, it allows users who have authenticated with a web identity provider to access AWS resources. If successful, STS returns temporary credentials. AssumedRoleUser ARN and assumedRoleID are used to programatically reference the temporary credentials, not an IAM role or user.

By setting up cross-account access, you can delegate access to resources that are in different AWS accounts, and you don't need to create individual IAM users in each account.

### Encryption

KMS, key management service. useful for sensitive information. KMS encryption keys are regional.

CMK, customer master key, can encrypt/decrypt the data key, and this data key is used to encrypt/decrypt your data. This is called envelope encryption, and the reason to use it is that this way only the data key goes over the network, not the data.

To request server-side encryption using the object creation REST APIs, provide the x-amz-server-side-encryption request header.

## PaaS

### Elastic beanstalk

Deploy and scale web apps. Beanstalk takes care of provisioninig load balancers, security groups, launching EC2 instances, autoscaling groups, creating S3 buckets and dbs. It integrates with CloudWatch and CloudTrail and includes its own health dashboard.

For deployment updates, it deploys to all hosts concurrently, in batches, and deploys the new version to a fresh group of instances before deleting the old instances. Deployments are immutable, the new versions use another instances, they don't touch the ones until now.

Traffic splitting / canary testing: installs the new version on a new set of instances like an immutable deployment. Forwards a percentage of incoming client traffic to the new app version for a specified evaluation period. If the new instances are healthy, all traffic is sent to the new version. If you need to roll back, this requires a further rolling update.

You can deploy RDS inside the elastic beanstalk env or outside

1. Inside: launch the RDS from within the elastic beanstalk console
  * if beanstalk is terminated, RDS too
  * good for dev and test deployments
2. Launch EB by itself, and start the RDS from the AWS CLI
  * better for production
  * Needs an additional security group to the env's autoscaling group to allow the network communication
  * provide connection string info to the app servers using EB env properties

## Notifications

### SQS

* Highly-durable pull-based queue in the cloud
* No strict ordering and duplicates
  * Can get strict ordering and no duplicates with FIFO, but then you have a limit of 300 messages/second 
* Number of consumers: 1
* No capacity management
* Higher cost for Kb x messages / day
* Underlying data structure is multiple queues. Once an SQS message gets consumed, it gets deleted from the queue
* Default standard queues have unlimited transactions and guarantee that a message is delivered at least once and provide best-effort ordering, which means that occasionally there might be duplicate messages or out of order.
* FIFO option, the order is strictly preserved, exactly-once processing and no duplicates. max 300 transactions per second limit

Settings:

* Visibility timeout: amount of time that the message is invisible in the SQS after a reader picks up the message. Default is 30s, can be increased if necessary, max 12h. If the job isn't processed in that time, the msg becomse visible again and another reader will process it
* Short polling: returns a response immediately even if the msg queue is empty --> if queue is empty, lots of empty responses --> additional cost
* Long polling: periodically poll the queue, response is returned only when a msg arrives or the long poll times out. Can save money

It's possible to postpone delivery of new messages, default delay is 0s, max 900s. In this time, messages are invisible. For larger messages, you can use S3 to store the messages and Amazon SQS extended client library for Java to manage them, and also the AWS SDK for Java.

### SNS

Push-based simple notification service with durable storage to send notifications from the cloud. It can deliver push notifications, SMS and emails to any HTTP endpoint, and it can trigger a Lambda function. Can't receive anything.

It uses a pub-sub model (publish and subscribe). Apps can push msgs to a topic, and subscribers receive these from the topic. Consumers must subscribe to a topic to receive the notifications. SNS can be used in conjunction with SQS to fan a single message out to multiple SQS queues.

### SES

Scalable and highly available email service. Pay as you go model, you can send and receive emails. It can trigger SNS and Lambda. It can be used for automated emails, online purchases, marketing emails. SES is not a valid target for CloudWatch Events.

### Kinesis

Family of services to analyze streaming data in real time. Streams are made of shards, each shard is a sequence of 1+ data records and provides a fixed unit of capacity. Default is 5reads/s, max 2MB. 1k writes/s, max is 1MB/s.

* Streams: stream data/video
* Firehose: capture, transform, load streams into AWS data stores
* Data analytics: analyze, query and transform streamed data in real-time using standard SQL and save in an AWS data store

The Kinesis client library ensures that for every shard there is a record processor. You should ensure that the \#instances >! \#shards. No need to use multiple instances to handle the processing load of one shard. One worker can process multiple shards. Resharding, increasing the number of shards, doesn't mean you need more instances.

#### Kinesis data streams

* Highly durable linked list in the cloud optimized for sequential reads and sequential writes.
* Strict ordering and duplicates
* Number of consumers: unlimited
* Needs shared monitoring
* Cheaper than SQS
* Underlying data structure: consumed messages get added to a list in a stable order, and get deleted after its retention period (usually 24h)

## Serverless

SAM is the serverless application model, to define and provision serverless apps using CloudFormation.

### Amazon API Gateway

It's a service to manage APIs at any scale. Users would make a request to the API gateway, and this would redirect this request to EC2, Lambda, etc. Functionality:

* Expose HTTPS endpoints to define a RESTful API
* Serverless-ly connect to Lambda, DynamoDB
* Send each API endpoint to a different target
* Can track and control usage with an API key
* Throttle requests to prevent attacks
* Connect to CloudWatch to log all requests for monitoring

How to configure:

1. Define API (container)
2. Define resources and nested resources (URL paths)
3. For each resource:
   1. Select supported HTTP methods (verbs)
   2. Set scurity
   3. Choose target (EC2, Lambda, etc)
   4. Set requests and response transformations
4. Deploy API to a stage
   1. Uses API Gateway domain by default but can use custom domain

API caching allows you to cache the Gateway response. Popular requests are cached and are retrieved with much less latency. You can throttle API gateway to prevent attacks.

### Lambda

Lambda is priced based on number of requests (first 1M free, then $0.2 per 1M requests) and duration. Lambda automatically scales out, not up. Lambda functions are independent, 1 event = 1 function.

With Alias you can create many versions of Lambda functions. `$LATEST` is always the last version of code you uploaded to Lambda. Use Lambda versioning and aliases to point the apps to a specific version if you don't want to use `$LATEST`. If the app has an alias instead of `$LATEST`, it won't automatically use new code when you upload it.

Lambda has a limit to the number of functions that can run simultaneously in a region. Default is 1000 per second per region, the error you get is `TooManyRequestsException`, HTTP status code 429.

With **step functions** you can visualize serverless applications, they automatically trigger and track each step so if something goes wrong you can track what went wrong where.

### Lambda + VPC

To enable Lambda to access a private VPC, it needs the following VP configuration information:

* Private subnet ID
* Security group ID (with required access)
* Lambda uses this information to set up ENIs using an available IP address from your private VPC

```bash
aws lambda update-function-configuration --function-name my-function --vpc-config SubnetIds=subnet-1122aabb,SecurityGroupIDs=sg-51530134
```

or in the console, in the Lambda function in the VPC section. The execution role (in the function, n the 'execution role' section) assigned to the Lambda function should also have permission to create elastic network interfaces (ENI)

### X-ray SDK

You can debug what's happening in the serverless function. It collects data about requests that the app serves and provides tools to view, filter and gain insight into the data to identify issues and opportunities for optimization.
Provides:

* Interceptors to add to the code to trace incoming HTTP requests
* Client handlers to instrument AWS SDK clients that the app uses to call other AWS services
* An HTTP client to instrument calls to other internal and external HTTP web services

To configure, you need X-Ray SDK, X-Ray daemon, and instrument the app with these 2. X-Ray integrates with ELBs, Lambda and API gateway.

### DevOps

* CodePipeline: manages the whole workflow whenever a change is detected in the source code
* CodeCommit: source and version control
* CodeBuild: automated build, runs tests, produce packages
* CodeDeploy: automated deployments to EC2, Lambda, on-premises
  - in place/rolling: app is stopped on each instance and new release installed. 3 phases: de-registering from LB, installation, re-registering with LB. Capacity is reduced during deployment, Lambda not supported. Rolling back is not so easy, re-deploy the previous version
  - blue/green: new instances provisioned, new release is installed on the new instance. No capacity reduction, green instances can be created ahead of time, easy to switch between old and new, and you pay for 2 envs until you terminate the old servers. Rolling back is easy, send the load balancer to the blue instances (prev version)
  - the deployment config file, appspec.yml file must be in the root folder of the repo
    + the hooks section determines the scripts that are run in the lifecycle event hooks: some BeforeInstall, some AfterInstall, some when ApplicationStart...

### ECS

A container orchestration service supporting docker. It uses Fargate for serverless, or you can use EC2 for more control. First upload the image to ECR, elastic container registry. ECS connects to ECR and deploys the images.

Docker commands:

```bash
docker build -t myimagerepo .
docker tag myimagerepo:latest 725...eu-central-1.amazonaws.com/myimagerepo:latest
docker push 725...:latest
```

To allow the container to access SQS, the policy must be attached to the ECS Task's execution role.

To use X-Ray with ECS, create a separate Docker image to run the X-Ray daemon.

