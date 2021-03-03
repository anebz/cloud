# AWS Certified developer associate

* [Acloudguru course](https://learn.acloud.guru/course/aws-certified-developer-associate/dashboard)
* [Braincert practice exams (DVA-C01)](https://www.braincert.com/course/lecture/14950-AWS-Certified-Developer-Associate-June-2018-Practice-Exams/18335)
* [Udemy course](https://www.udemy.com/course/aws-certified-solutions-architect-associate-exam/)
* [Udemy practice exams](https://www.udemy.com/course/aws-certified-developer-associate-practice-tests-dva-c01)

Table of contents

* [Compute](#compute)
  * [EC2](#ec2)
  * [EBS](#ebs)
  * [Monitoring](#monitoring)
  * [X-Ray](#x-ray)
* [Networking](#networking)
  * [Elastic load balancer](#elastic-load-balancer)
  * [Route 53](#route-53)
  * [Internet Gateway](#internet-gateway)
* [IaaS: CloudFormation](#iaas-cloudformation)
* [Storage and databases](#storage-and-databases)
  * [S3](#s3)
  * [RDS](#rds)
  * [Aurora](#aurora)
  * [DynamoDB](#dynamodb)
  * [Elasticache](#elasticache)
* [Security](#security)
  * [IAM](#iam)
  * [Encryption](#encryption)
* [PaaS: Elastic beanstalk](#paas-elastic-beanstalk)
* [Notifications](#notifications)
  * [SQS](#sqs)
  * [SNS](#sns)
  * [SES](#ses)
  * [Kinesis](#kinesis)
* [Serverless](#serverless)
  * [Amazon API Gateway](#amazon-api-gateway)
  * [Lambda](#lambda)
  * [Lambda + VPC](#lambda--vpc)
  * [X-ray SDK](#x-ray-sdk)
  * [CodePipeline](#codepipeline)
  * [CodeCommit](#codecommit)
  * [CodeBuild](#codebuild)
  * [CodeDeploy](#codedeploy)
  * [ECS](#ecs)

## Compute

### EC2

* For storing sensitive or confidential data in EC2, use Systems Manager (SSM). The data can be accessed from other AWS resources
* By default, user data runs only during the boot cycle when the instance is first launched. And by default, scripts entered as user data have root user privileges for executing, so they don't need sudo command.
* To take high CPU load off EC2 servers, create an HTTPS listener on the ALB with SSL termination. To use the listener, you must deploy at least one SSL/TLS certificate on the LB via *AWS certificate manager or via IAM*, when the region is not supported by ACM
* Burstable performance instances, such as T3, T3a and T2, are designed to provide a baseline level of CPU performance with the ability to burst to a higher level when required by the workload. If your AWS account is less than 12 months old, you can use a t2.micro instance for free within certain usage limits

For reserving instances, you can reserve it for an AZ (zonal RI) or region (regional AI). The difference is that zonal RIs provide a capacity reservation, and regional doesn't.

> Auto scaling

When creating auto scaling launch configuration, usually only basic monitoring is activated and not detailed monitoring. When using CLI or SDK, detailed monitoring is activated by default. Auto scaling works with ALB and NLBs. Auto scaling can't add a volume to an existing instance if the existing volume is approaching capacity.

If one instance is reported as unhealthy, the AS group will terminate it and create a new one.

ASG can contain EC2 instances in multiple AZs within the same region, and cannot sapn multiple regions. ASGs attempt to distribute instances evenly between the AZs that are enabled for the ASG.

### EBS

Highly available (automatically replicated within a single AZ) and scalable storage volume that can be attached to the EC2 instance. Upon launch of an instance, at least one EBS volume is attached to it. EBS volumes are AZ locked. Types:

* **gp2**: general purpose SSD, boot disks and general applications. the only option that can be a boot volume. up to 16k IOPS per volume
* **io1**: provisioned IOPS SSD: higher IOPS, many read/writes per second. For large dbs, latency-sensitive workloads. highest performance option, most expensive. **io2**, new generation, more IOPS per GiB.
* **st1**: throughput optimized HDD: for read-intensive workloads, for frequently accessed workloads that need to store mountains of data, big data, data warehouses. large I/O sizes
* **sc1**: cold HDD: lowest cost option, workloads where performance isn't a factor

The maximum ratio of provisioned IOPS to the requested volume size (in GB) is 50:1. For example, a 100GB volume can be provisioned witih up to 5000 IOPS.

You can create an EBS volume from a snapshot. If this snapshot is encrypted, the volume will be encrypted.

### Monitoring

* Cloudwatch: 
  * host level metrics: CPU, network, disk and status check. For RAM utilization, you have to activate a custom metric. For custom metrics, the minimum granularity you can have is 1min.
  * By default, Cloudwatch stores the log data indefinitely, but you can change the retention
  * You can retrieve data from any terminated instance after its termination
* CloudTrail: monitors API calls in the AWS platform, and AWS config records the state of your AWS env and can notify you of changes
* AWS Budgets, it needs approximately 5 weeks of usage data to generate budget forecasts.

### X-Ray

Analyzes and debugs production, distributed apps. It helps understand how the app and the underlying services are performing to identify and troubleshoot the root cause of performance issues and errors. X-Ray provides an end-to-end view of requests as they travel through your app, and shows a map of the app's underlying components. X-Ray can be used to collect data **across AWS** accounts.

With X-Ray sampling, you can control the amount of data that you record, and modify sampling behavior on the fly without modifying or redeploying your code.

In order for X-Ray to work in an EC2 instance, the daemon must be installed, and the instance role needs xray:PutTraceSegments and xray:PutTelemetryRecords permissions.

If no data is available, check that the IAM role exists, to give X-Ray permissions to users and compute resources.

## Networking

### Elastic load balancer

* **ALB**: proxies HTTP and HTTPS requests. adds a few ms to each request, slightly slower than NLB, and don't scale quickly. with host/path based routing, it can handle multiple domains. It doesn't support TCP passthrough
  - ALB access logs: detailed info about requests sent to the LB. Each log contains the time the request was received, the client's IP address, latencies, request paths, and server responses.
  - ALB request tracing: tracks HTTP requests. The LB adds a header with a trace identifier to each request it receives.
  - If the target groups have no registered targets, the error shown is HTTP 503.
* **NLB**: routes network packets, balance TCP traffic where extreme performance is required, they handle millions of requests per second. Allows TCP passthrough. Cannot handle path based routing.
* Classic LB: load balance HTTP/HTTPS apps and user layer7 specific features, and also use strict layer4 load balancing for apps that rely purely on TCP protocol. If it returns 504, it means the gateway has timed out. The app might be failing in the web server or db server.

An user makes a request to the LB at a certain IP address, which then calls the EC2 instance. This instance only sees the LB IP address, not the user's public IP. But it can obtain this by X-Forwarded-For header

### Route 53

Amazon's DNS service, maps domain names to IP addresses (EC2 instances, load balancers or S3 buckets). For a specific domain name, specify CNAME.

### Internet Gateway

For internet connectivity to be established in an EC2 instance:

* The network ACL associated with the subnet must have rules to allow in/outbound traffic on port 80 and 443.
* The route table in the instance's subnet must have a route to an Internet Gateway

The instance's subnet is always associated with a route table, and can only be associated with one route table at a time.

> ACM

HTTPS is a contributor to the high CPU load. To reduce it, configure an SSL/TLS certificate on an ALB via ACM. This is needed to create an HTTPs listener. And then, create an HTTPS listener on the ALB with SSL termination.

## IaaS: CloudFormation

AWS resources defined in a YAML script. CF should be used for VP configs, security groups, LBs, deployment pipelines, IAM roles. DynamoDB tables, Kinesis streams, AutoScaling settings or S3 buckets are better managed in another way.

* **Transforms** required field. if this is used, it means the document is a SAM template
* **Resources** required field. defines the resources and their properties
* **Conditions** section includes conditions that control whether certain resource properties are assigned a value during stack creation or update
* **Parameters** to pass values to the template at runtime. Does not allow conditions
* **Mappings** of keys and values that can specify conditional parameter values. You can match a key to a corresponding value by using the `Fn:FindinMap` intrinsic function in the resources and outputs sections
* **Outputs** declares output values that you can import into other stacks, return in response or view on CF console.

Intrinsic functions in templates are used to assign values to properties that aren't available until runtime. `Ref` returns the value of the specified parameter or resource, but cannot import values. `!GetApp` returns the value of an attribute from a resource in the template.
For the map of the base AMIs, you must invoke the `!FindinMap` function with the map name, toplevel key and secondlevelkey. `!FindinMap` returns the value corresponding to keys in a two-level map that is declared in the Mappings section

if part of the CF deployment fails due to a misconfiguration, CF rollbacks the entire stack. If one of the resources in a stack can't be created, previously created resources get deleted and the stack creation terminates. Termination Protection stack option prevents accidental deletion of an entire CloudFormation stack. 

Nested stacks allow you to re-use the CF code, useful for frequently used configs. By saving the CF template in s3, you can reference it in the resources section of any CF template using the stack resource type.

If Stack B and Stack C depend on Stack A, stack A must be deleted last. All imports must be removed before deleting the exporting stack. You can't delete Stack A first because it's being referenced in the other Stacks.

With a cross-stack reference, you can export resources from one AWS CF stack to another. With a cross-stack reference, owners of the web app stacks don't need to create or maintain networking rules or assets. For this, use the Exports output field to flag the value of VPC from the network stack.

## Storage and databases

### S3

Serverless storage service, best suited for objects and BLOB data. A single PUT can upload objects up to 5GB. For uploading larger files, use multi-part upload. Data can be secured with access control lists in file level (ACL) and bucket policies in bucket level. Users can download a private file directly from a static website hosted on S3 by a pre-signed URL link on the site.

To minimize upload speed, use S3 transfer acceleration. S3 has a pricing for every TB for month. With many requests, request pricing gets high. For log files, if objects change frequently it needs update buffering. Avoid using reduced redundancy and don't use S3 for static web hosting, since HTTPS is not allowed.

Cross region replication is a replication of a bucket in another region. Cross-origin resource sharing (CORS): if enabled in bucket2, allows bucket1 to access files from bucket2. S3 Bucket Versioning is a requirement to configure S3 Cross-Region Replication and must be enabled before S3 Cross-Region Replication can even be configured. For replication to succeed, source bucket owner must have permissions to replicate objects on the destination S3 bucket.

Encryption, in transit it's called SSL/TLS, at rest:

* Server side encryption. Can be enforced by using a bucket policy that denies S3 PUT requests that don't include the SSE parameter in the request header. Useful to audit trail of who has used the keys.
  * S3 managed keys (SSE-S3)
  * AWS KMS managed keys (SSE-KMS), you can set up an envelope key which encrypts the key
  * Server side encryption with customer provided keys (SSE-C). Then the customer needs to send the keys and encryption algorithm with each API call.
  * The header required for SSE is: `x-amz-server-side-encryption`
* Client side encryption

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

It's a read-only db instance, updates to source are *asynchronously* replicated to read replica (eventual consistency). For accessing it, use the DNS endpoint. Querying a read replica might mean you receive stale or old data. When to use read replica?

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

RDMS are monolithic, very coupled layers, if one is slow they are all slow. if one fails, they all fail. can't operate or scale independently. Aurora is a self-healing cloud optimized relational db, distributed and elastic: it breaks apart the monolithic stack to enable a db that can scale out.

Aurora moves out the logging and storage layers of the db into a multi tented, scale out db optimized storage service. In Aurora global, the primary region allows read & write, while the secondary region is read only. Aurora is not serverless by default, but can be made serverless.

### DynamoDB

Non-relational serverless db stored on SSD, spread across 3 geographically distinct data centers, immediately consistent and highly durable (unlike Redis). Can be used for web sessions, JSON docs, and metadata for S3 objects, scalable session handling, as well as Elasticache. For fetching multiple items in a single API call, use BatchGetItem.

With an IAM policy, you can specify conditions when granting permissions. Read-only access to certain items/attributes, or write-only based upon the identity of the user.

> Consistency

Strongly consistent reads apply onle while using the read operation (Query, Scan and GetItem)

Choice of 2 consistency models: Default: eventual consistent reads and Strongly consistent reads. Strongly consistent RCU (per second always!!) is 4KB/s. A file of 15KB would need 4 reads. And for 100 strongly consistent reads, 100*4 = 400. WCU is 1KB/s. Eventual consistency read is always double the strongly consistent read capacity.

1 RCU = 1 strongly consistent read/s = 2 eventualle consistent reads/s. For the highest throughput questions, choose eventual consistency, maximum reads capacity * max item size.

> Security

All DynamoDB tables are encrypted at rest with an AWS owned key by default. Access is controled using IAM policies. Fine grained access control using IAM condition parameter: `dynamodb:LeadingKeys` to allow users to access only the items where the partition key value matches their user ID.

You can create a local secondary index at the time of table creation, or a global secondary index at any time.

Query results are always sorted in ascending order by the sort key if there is one, and query operation is generally more efficient than a scan. If querying in an attribute *not* part of partition/sort key, querying that is the same as scanning.

Parallel scans while limiting the rate minimize the execution time of a table lookup.

The number of tables per account and number of provisioned throughput units per account can be changed by raising a request. A conditional action is an action only to be taken if certain attributes of the item still have the values you expect.

Unlike RDS, DynamoDB requires data operations to be done by your app, that means all data needs to be sent over the network. Pricing is depending on requests. Storage pricing is 10 times higher than S3. You can get on-demand or provisioned option. Do not use local indexes, they might be immediately consistent but once you create them, all records sharing the same partition key need to fit in 10GB. Global indexes don't constrain your table size in any way, but reading from them is eventually consistent.

|    On-demand capacity     |               Provisioned capacity               |
| :-----------------------: | :----------------------------------------------: |
|     Unknown workloads     |      Forecast read and write capacity reqs       |
| Unpredictable app traffic |             Predictable app traffic              |
|     Pay-per-use model     | App traffic is consistent or increases gradually |
| Spiky, short lived peaks  |                                                  |

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
  * Time to live (TTL): soecify number of seconds until the data expires to avoid keeping stale data in the cache
* Write-through: adds/updates data to the cache whenever data is written to the db. Data in the cache is never stale, but write penalty: every write involves a write to the cache and resources are wasted if the data is never read. Elasticache node failure means that data is missing until added or updated in the database

## Security

For creating CloudFront key pairs, root access is needed. Non-root access for EC2 instance pairs, IAM user access keys and for IAM user password.

### IAM

With policies, all requests are denied by default. An explicit allow overrides a default deny. An explicit deny overrides an explicit allow. Types of policies:

- Managed policy: default, AWS-managed. It can be assigned to multiple users, groups or roles and it is available for use by any AWS account. You can't change the default permissions defined in the policy
- Customer managed policy. It can be assigned to multiple users, groups or roles in your account
- Inline policy: managed by the customer and embedded in a single user, group or role. useful if you want to maintain a strict one-to-one relationship between a policy and the identity that it's applied to. The policy will be deleted if you delete the user, group or role it is associated with

By setting up cross-account access, you can delegate access to resources that are in different AWS accounts, and you don't need to create individual IAM users in each account.

Users need to have IAM activated if they want access to Billing and Cost management console. 

With IAM variables, you can use policy variables and create a single policy that applies to multiple users. You can make a policy that gives each user in the group full programmatic access to a user-specific object (their own "home directory") in S3.

To check a profile's permissions, use the CLI --dry-run option, which checks the permissions but doesn't make the request.

To check unused IAM roles, use Access advisor feature on IAM console. IAM access analyzer lets you see AWS resources that are shared with an external entity, it lets you identify unintended access to your resources and data. 

> Cognito

Web identity federation (WIF) allows users to authenticate with a WI provider (WIP): Google, Facebook, Amazon. The user authenticates first with the Web ID provider and receives an authentication token, which is exchanged for a temp AWS credentials allowing them to assume an IAM role.

* Cognito **user pools**: manage user directories, user sign-up and sign-in directly, or via WIPs. It acts as an identity broker, handling all interaction with WIPs and uses push sync with SNS to push updates and sync user data across devices. User pools let you create customizable authentication and authorization solutions for your REST APIs.
* Cognito **identity pools** allow temporary, privilege-limited access for users. unique identities for your users and authenticate them with identity providers
* Cognito **Sync** allows cross device data sync without requiring your own backend.

STS is a web service enabling you to request temporary, limited-privilege credentials for IAM users or for users you authenticate. But it's not supported by API gateway.

STS AssumeRoleWithWebIdentity is part of the security token service, it allows users who have authenticated with a web identity provider to access AWS resources. If successful, STS returns temporary credentials. AssumedRoleUser ARN and assumedRoleID are used to programatically reference the temporary credentials, not an IAM role or user.

### Encryption

* KMS, key management service, for creating and storing encryption keys. useful for sensitive information. KMS encryption keys are regional. Up to 4KB can be encrypted. For anything bigger, consider envelope encryption.
* CMK, customer master key, can encrypt/decrypt the data key, and this data key is used to encrypt/decrypt your data. This is called envelope encryption, and the reason to use it is that this way only the data key goes over the network, not the data.
* To request server-side encryption using the object creation REST APIs, provide the x-amz-server-side-encryption request header.

## PaaS: Elastic beanstalk

Deploy and scale web apps. Beanstalk takes care of provisioninig load balancers, security groups, launching EC2 instances, autoscaling groups, creating S3 buckets and dbs. It integrates with CloudWatch and CloudTrail and includes its own health dashboard.

For deployment updates, it deploys to all hosts concurrently, in batches, and deploys the new version to a fresh group of instances before deleting the old instances. Deployments are immutable, the new versions use another instances, they don't touch the ones until now.

Traffic splitting / canary testing: installs the new version on a new set of instances like an immutable deployment. Forwards a percentage of incoming client traffic to the new app version for a specified evaluation period. If the new instances are healthy, all traffic is sent to the new version. Rollback requires another rolling update.

You can deploy RDS inside the elastic beanstalk env or outside

1. Inside: launch the RDS from within the elastic beanstalk console
  * if beanstalk is terminated, RDS too
  * good for dev and test deployments
2. Launch EB by itself, and start the RDS from the AWS CLI
  * better for production
  * Needs an additional security group to the env's autoscaling group to allow the network communication
  * provide connection string info to the app servers using EB env properties

Beanstalk worker environments support SQS dead letter queues, where worker can send messages that for some reason can't be successfully processed. Dead letter queue provides the ability to sideline, isolate and analyze the unsucessfully processed messages.

If Beanstalk takes too long, use pre-baked AMIs to preload and prepackage dependencies instead of having to configure it at launch.

Elasticache should be defined in .ebextensions/, but RDS database should be referenced externally and reference through env variables. All the EBS config files should be under this folder with the .config extension.

By enabling log file rotation to S3 within the ELB configuration, developers can access the logs without logging into the app servers.

## Notifications

### SQS

* Highly-durable pull-based queue in the cloud
* Allows horizontal scaling depending on work demand
* No strict ordering and duplicates
  * Can get strict ordering and no duplicates with FIFO, but then you have a limit of 300 messages/second
  * To ensure that messages are delivered in order, use FIFO queues + use sequence info in the messages with Standard queues.
* Number of consumers: 1
* Higher cost for Kb x messages / day
* Underlying data structure is multiple queues. Once an SQS message gets consumed, it gets deleted from the queue
* Default standard queues have unlimited transactions and guarantee that a message is delivered at least once and provide best-effort ordering, which means that occasionally there might be duplicate messages or out of order.
* FIFO option, the order is strictly preserved, exactly-once processing and no duplicates. max 300 transactions per second limit
* No message limits for storing in SQS, but 'in-flight messages' (received from a queue by a consumer, but not yet deleted from queue) do have limits, max 120k inflight messages

Settings:

* Visibility timeout: amount of time that the message is invisible in the SQS after a reader picks up the message. Makes sure that the message isn't read by any other consumer while it's being processed by one. Default is 30s, can be increased if necessary, max 12h. If the job isn't processed in that time, the msg becomse visible again and another reader will process it
* Short polling: returns a response immediately even if the msg queue is empty --> if queue is empty, lots of empty responses --> additional cost
* Long polling: periodically poll the queue, response is returned only when a msg arrives or the long poll times out. Can save money. ReceiveMessageWaitTimeSeconds

SQS delay queue: postpone delivery of new messages when they're first added to the queue, default delay is 0s, max 900s. In this time, messages are invisible. For larger messages, you can use S3 to store the messages and Amazon SQS extended client library for Java to manage them, and also the AWS SDK for Java.

To prevent data loss, you can set up dead letter queue. SWF assigns tasks only once and ensures there are no duplicates. Security in messages:

* Use SQS server side encryption
* Restrict access as per policy defined
* Use HTTP over STL
* Encrypt message before pushing into SQS

### SNS

Push-based asynchronous simple notification service with durable storage to send notifications from the cloud. It can deliver push notifications, SMS and emails to any HTTP endpoint, and it can trigger a Lambda function. Can't receive anything.

It uses a pub-sub model (publish and subscribe). Apps can push msgs to a topic, and subscribers receive these from the topic. Consumers must subscribe to a topic to receive the notifications. SNS can be used in conjunction with SQS to fan a single message out to multiple SQS queues.

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

SAM is the serverless application model, to define and provision serverless apps using CloudFormation.

### Amazon API Gateway

It's a service to manage APIs at any scale. Users would make a request to the API gateway, and this would redirect this request to EC2, Lambda, etc. Functionality:

* Expose HTTPS endpoints to define a RESTful API
* Serverless-ly connect to Lambda, DynamoDB
* Send each API endpoint to a different target
* Can track and control usage with an API key
* Throttle requests to prevent attacks
* Connect to CloudWatch to log all requests for monitoring

API caching allows you to cache the Gateway response. Popular requests are cached and are retrieved with much less latency. You can throttle API gateway to prevent attacks. Frontend: method, backend: integration.

When changing the API, you need to redeploy it to an existing stage or to a new stage. Lambda authorizer is a Lambda function controlling access to the API. This helps in access control

### Lambda

Lambda is priced based on number of requests (first 1M free, then $0.2 per 1M requests) and duration. Lambda automatically scales out, not up. Lambda functions are independent, 1 event = 1 function. The maximum execution duration for a Lambda request is 900s=15mins.

With Alias you can create many versions of Lambda functions. `$LATEST` is always the last version of code you uploaded to Lambda. Use Lambda versioning and aliases to point the apps to a specific version if you don't want to use `$LATEST`. If the app has an alias instead of `$LATEST`, it won't automatically use new code when you upload it.

Lambda has a limit to the number of functions that can run simultaneously in a region. Default is 1000 per second per region, the error you get is `TooManyRequestsException`, HTTP status code 429. Avoid recursion!

With **step functions** you can visualize serverless applications, they automatically trigger and track each step so if something goes wrong you can track what went wrong where. With step functions you can track flows executed by Lambda functions.

The maximum deployment package size is 50MB, and the max size of code/dependencies zipped into a deployment package is 250MB.

With Lambda authorizer, a 3rd party authorization mechanism is used to invoke the Lambda function.

> Concurrency: \# requests that a Lambda function is serving at a time.

If a function is invoked while a request is still undergoing, another instance is allocated, increasing the functions' concurrency. Reaching the concurrency limit leads to latency bottlenecks. To enable the function to scale without fluctuations in latency, use provisioned concurrency. By allocationg this before an increase in invocations, you can ensure that all requests are served by initialized instances with very low latency. You can also configure application auto scaling to manage provisioned concurrency on a schedule or based on use. To increase provisioned concurrency automatically as needed, use the app auto scaling API to register a target and create a scaling policy.

You can set up reserved concurrency for the Lambda function so that it throttles if it goes above a certain concurrency limit. This is used to limit the maximum concurrency for a given Lambda function.

You can give a Lambda function from account A permissions to assume a role from account B to access AWS resources. Create an execution role in acc A that gives the function permission. Then create a role in acc B that the function from A assumes to gain access to the cross-acount AWS resource. **Modify the trust policy of the role in B** to allow the execution role of Lambda to assume this role. Finally, update the function code to add the AssumeRole API call.

To improve the performance of a function, package only the modules the function requires and move the initialization of the RDS connection outside the handler function.

Environment variables can't exceed 4KB, so if encrypted data must be passed to the function, use envelope encryption and reference the data as file within the code. Using an envelope encryption, the network load is much lower. For lower files, you can use Encryption SDK and pack the encrypted file with the Lambda function.

### Lambda + VPC

To enable Lambda to access a private VPC, it needs the following VP configuration information:

* Private subnet ID
* Security group ID (with required access)
* Lambda uses this information to set up ENIs using an available IP address from your private VPC

### X-ray SDK

You can debug what's happening in the serverless function. It collects data about requests that the app serves and provides tools to view, filter and gain insight into the data to identify issues and opportunities for optimization. To configure, you need X-Ray SDK, X-Ray daemon, and instrument the app with these 2. X-Ray integrates with ELBs, Lambda and API gateway. Provides:

* Interceptors to add to the code to trace incoming HTTP requests
* Client handlers to instrument AWS SDK clients that the app uses to call other AWS services
* An HTTP client to instrument calls to other internal and external HTTP web services

### CodePipeline

Manages the whole workflow whenever a change is detected in the source code. If a stage needs approval, use an approval action in that stage

### CodeCommit

Ssource and version control. Allows access through git credentials, SSH keys and AWS access keys

### CodeBuild

automated build, runs tests, produce packages

  - If the build fails, run it locally using CodeBuild Agent. Then, you can test the integrity and content of a buildspec.yml file locally, test and build an app locally before commiting
  - If the build failed, check CloudWatch logs for debugging

For very big dependencies, bundle them all in the source coude during the last stage of CodeBuild. You can reduce the build time by caching dependencies.

Integrates with CloudWatch to show \# total builds, failed builds, etc. You can export log data to S3. CloudWatch events can be integrated too, but this doesn't store logs anywhere.

### CodeDeploy

automated deployments to EC2, Lambda, on-premises. If the deployment fails and is getting rolled back, CodeDeploy first deploys to the failed instances.

* in place/rolling: app is stopped on each instance and new release installed. 3 phases: de-registering from LB, installation, re-registering with LB. Capacity is reduced during deployment, Lambda not supported. Rolling back is not so easy, re-deploy the previous version. 
* Rolling deployment avoids downtime and minimizes reduced availability, at a cost of a longer deployment time. In a fleet of instances, rolling deployment deploys in batches. Some instances start with the new version while the rest has old version, then more and more instances get the new version.
* Rolling with additional batch means that an extra batch of instances is launched. The **bandwidth** is maintained, the availability too. But it takes longer than the Rolling deployment.
* blue/green or immutable: slower deployment method, new instances provisioned, new release is installed on the new instance. No capacity reduction, green instances can be created ahead of time, easy to switch between old and new, and you pay for 2 envs until you terminate the old servers. Rolling back is easy, send the load balancer to the blue instances (prev version)
* the deployment config file, appspec.yml file must be in the root folder of the repo
  - When working with Lambda, specify the version in appspec.yml
  - the hooks section determines the scripts that are run in the lifecycle event hooks: some BeforeInstall, some AfterInstall, some when ApplicationStart...
  - ValidateService hook event: to verify the deployment success

### ECS

A container orchestration service supporting docker. It uses Fargate for serverless, or you can use EC2 for more control. First upload the image to ECR, elastic container registry. ECS connects to ECR and deploys the images.

* To allow the container to access SQS, the policy must be attached to the ECS Task's execution role
* To use X-Ray with ECS, create a separate Docker image to run the X-Ray daemon
* If the container should share storage, use Fargate launch

When you use ECS with a load balancer deployed across multiple AZs, you get a scalable and highly available REST API.