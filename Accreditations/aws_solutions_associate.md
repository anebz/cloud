# AWS Certified solutions associate

* [Udemy practice exams](https://www.udemy.com/course/aws-certified-solutions-architect-associate-amazon-practice-exams-saa-c02/)
* [Whizlab practice exams](https://www.whizlabs.com/aws-solutions-architect-associate/)
* [ExamTopics questions](https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-associate-saa-c02)
* [DataCumulus courses](https://courses.datacumulus.com/)
* [AWS FAQs](https://aws.amazon.com/faqs/)

---

- [AWS Certified solutions associate](#aws-certified-solutions-associate)
	- [Compute](#compute)
		- [EC2](#ec2)
			- [Autoscaling](#autoscaling)
		- [ECS](#ecs)
		- [Lambda](#lambda)
		- [EMR](#emr)
		- [Glue](#glue)
	- [X. Storage](#x-storage)
		- [X.Y. S3](#xy-s3)
			- [S3 notification feature](#s3-notification-feature)
		- [X.Y. DynamoDB](#xy-dynamodb)
		- [X.Y. Aurora](#xy-aurora)
		- [X.Y. RDS](#xy-rds)
		- [X.Y. EBS](#xy-ebs)
		- [Redshift](#redshift)
	- [Security](#security)
		- [Access management](#access-management)
		- [Monitoring](#monitoring)
		- [Redis](#redis)
	- [CloudFront](#cloudfront)
	- [Networking](#networking)
		- [Route 53](#route-53)
		- [Load balancers](#load-balancers)
	- [Encryption](#encryption)
		- [AWS Secrets manager](#aws-secrets-manager)
	- [CloudWatch](#cloudwatch)
	- [Messaging](#messaging)
		- [SQS](#sqs)
		- [MQ](#mq)
		- [API Gateway](#api-gateway)


## Compute

### EC2

Multi-AZ uses synchronous replication ensuring almost no RPO (recovery point objective). Read replicas take longer.

Billing for on-demand is only when instance is not pending anymore and it's running. You won't be billed if the instance is stopping. For spot instances, you're not billed if the instance is in stopping state. For reserved instances, you're billed until the end of the term, even if it's terminated.

To access the instance ID, public keys and public IP address of the instances, check the instance metadata.

Amazon Machine Image (AMI) provides the info required to launch an instance.

If the instance has data stored in RAM and the instance has to be shut down for some time, enable hibernation and hibernate the instance before shutdown. Snapshotting the instance won't help because RAM contents are reloaded.

* Standard reserved instance: more discount, can't exchange instances but can change Availability Zone, scope, network platform, or instance size.
* Convertible reserved instance: flexibility to change families, OS types and tenancies

To monitor custom metrics, you must install the CloudWatch agent on the instance.

If the instance should send/receive traffic over the Internet, it should have a public IP address associated with it.

If you start and stop an EC2 instance, the EBS volume associated with it is preserved but the data is erased. Also, the underlying host for the instance is also possibly changed. The Elastic IP address remains associated with the instance, and the ENI (elastic network interface) stays attached as well.

If you purchased a reserved instance but you want to stop it, terminate the RI asap to avoid getting billed at the on-demand price when it expires and go to AWS RI marketplace and sell it. 

There is a vCPU-based on-demand instance limit per region, if you want more you can submit the limit increase form to AWS and retry the failed requests once approved.

#### Autoscaling

For highly available instances, deploy in at least 2 AZ. If we need to have at least 2 instances running, we need 2 AZ and 2 instances in each. Worst case, one AZ fails but we still have 2 instances running. If we only had 1 instance in the unaffected AZ, Autoscaling would deploy the second instance but it would take some time, for a while there would be only 1 instance. Which we don't want. Max. capacity is 6, 3 in each AZ.

For predictable load changes, e.g. when expecting a load at 9AM when people come to work, you can configure a scheduled scaling policy to perform scaling at specified times.

Cooldown period: ensures that Auto scaling group doesn't launch/terminate any instances before the previous scaling activity takes effect. Default value is 300s.

If there is a new AMI, create a new autoscaling launch configuration. Autoscaling uses this to launch instances.

### ECS

Which services run the containers?

* EC2 instances (which have the ECS container agent running)
* Fargate launch type (serverless). Has less capacity than EC2

ECS tasks can be run on CloudWatch events, e.g. when a file is uploaded to a certain S3 bucket using a S3 PUT operation. You can also declare a reduced number of ECS tasks whenever a file is deleted on the S3 bucket using the DELETE operation.

First, create an Event **rule** for S3 that watches for object-level operations (PUT, DELETE). For object-level operations, it is required to create a CloudTrail trail first. On the Targets section, select the "ECS task" and input the needed values such as the cluster name, task definition and the task count. You need two rules – one for the scale-up and another for the scale-down of the ECS task count.

To insert sensitive data into containers, you can store it in Secrets Manager secrests or SYstem Manager Parameter Store parameters. Then you can reference them in the container definition. This feature is supported by tasks using both the EC2 and Fargate launch types.

* Use the `secrets` container definition parameter to inject sensitive data as environment variables
* Use the `secretOptions` container definition parameter to inject sensitive data in the log configuration of a container

They can also handle bursts in traffic but it takes minutes to set up new containers.

### Lambda

You can use aliases when updating functions, to have the Lambdas versioned. This enables canary deployment (e.g. only sending 20% to the updated function)

They can be used to handle bursts of traffic in seconds in serverless applications.

For sensitive info in env variables, create a new KMS key and use it to enable encryption helpers that leverage on KMS to store and encrypt the sensitive info. Lambda encrypts the environment variables in the function by default, but the info is still visible to other users who have access to the Lambda console. Lambda uses a default KMS key to encrypt the variables, which is usually accessible by other users.

* Provisioned concurrency: keep instances provisioned, more expensive
* Reserved concurrency: dedicated reservations of parallel execution for your function.  This number will be subtracted from your default account soft limit of 1000 parallel executions
	- Guarantees that this concurrency level is always possible for your function
	- But concurency can't be exceeded
	
Lambda@Edge: allows you to execute code at different times when the CloudFront distribution is called

### EMR

Managed cluster platform for big data framework (Apache Hadoop, Spark). Processes and analyzes vast amounts of data. EMR can be used to transform and move large amounts of data into and out of other AWS datstores and dbs.

### Glue

AWS Glue is a serverless ETL service that crawls data, builds a data catalog, performs data preparation, transformation and ingestion. But doesn't allow the usage of big data frameworks.

### Fargate

Useful for microservices and launching containers in a serverless way, also helps with container cluster management. For ECS & Fargate, specify CPU and memory at the task definition

## X. Storage

![image.png](http://media.tutorialsdojo.com/aws-storage-services.png)

* Amazon FSx For Lustre: high-performing *parallel* file system for fast processing of workloads
* Amazon FSx For Windows File Server: fully managed Microsoft Windows filesystem with support for SMB protocol, Windows NFTS, Microsoft Active Directory integrations. Useful for app workloads that require shared file storage.
* AWS Storage gateway: integrate the on-premises network to AWS but doesn't migrate apps. If using a fileshare in Storage Gateway, the on-premises systems are still kept. Hybrid storage solutions. Enables Active Directory users to deploy storage on their workstations as a drive. mounted as a disk for on-premises desktop computers. To access the data moved to S3, use File Gateway, not S3 API.
* AWS DataSync: upload all data to AWS, 100% cloud architecture. nothing stored on-prem.
* EFS: only supports Linux workloads

---

* AWS Snowball edge: type of Snowball device with on-board storage and compute power. Each Snowball Edge device can transport data at speeds faster than the internet. The AWS Snowball Edge device differs from the standard Snowball because it can bring the power of the AWS Cloud to your on-premises location, with local storage and compute functionality. Can't directly integrate backups to S3 Glacier, only to S3.
* AWS Snowmobile exabyte-scale data transfer service. Up to 100PB per Snowmobile

### X.Y. S3

Amazon Macie is a ML-powered service that monitors and detects usage patterns on S3 data, it can detect anomalies, risk of unauthorized access or inadvertent data leaks. It can recognize PII (personally identifiable info) or IP.

S3 select: retrieve only a subset of the data by using simple SQL expressions

CORS (cross-origin resource sharing) allows webapps loaded in one domain to interact with resources in a different domain. For instance, to add JavaScript to the webapp.

Use pre-signed URLs to access specific objects.
To control traffic to trusted buckets (expecting there to be a lot of buckets), set an endpoint policy. You can also create bucket policies but it takes a lot of time.

S3 object lock allows you to store objects using a write-once-read-many (WORM) model. Changes to objects are allowed but their previous versions should be preserved and remain retrievable. If you enabled S3 Object Lock, you won't be able to upload new versions of an object. This feature is only helpful when you want to prevent objects from being deleted or overwritten for a fixed amount of time or indefinitely.

* S3 Standard - Infrequent Access: is used for infrequently-accessed data, but rapid access. Not for backup
* One Zone-IA: for infrequent access
* S3 Glacier (+ deep archive) for archiving
	- Expedited retrieval: allows you to quickly access data if you have an urgent request. Provisioned capacity ensures that retrieval capacity for expedited retrievals is available when you need it.

With lifefycle policy, you can specify that the data is moved to another storage class (like for archiving).

> Retention modes

* 𝗚𝗼𝘃𝗲𝗿𝗻𝗮𝗻𝗰𝗲 - overwrites/deletes are only possible with specific rights
* 𝗖𝗼𝗺𝗽𝗹𝗶𝗮𝗻𝗰𝗲 - no deletes or overwrites possible for the duration of the retention period

To securely serve private content via CloudFront:

* Require that users access the private content by using special CloudFront signed URLs or signed cookies
* Requre that users access S3 content via cloudfront urls, not s3 urls. set up an origin access identity (OIA) for the bucket and give it permission to read files in the bucket

#### S3 notification feature

The S3 notification feature can send notifications when certain events happen in a bucket. S3 event notifications are designed to be delivered at least once and to one destination only. You cannot attach two or more SNS topics or SQS queues for S3 event notification. Therefore, you must send the event notification to Amazon SNS. SQS and Lambda are also correct destinations

First add notification config saying which event should S3 publish and the destination for the notification, which can be the following:

* SNS: the fanout scenario is when a message published to an SNS topic is replicated and pushed to multiple endpoints (SQS, HTTP(s), Lambda). This allows for parallel asynchronous processing
	- you can create a topic and use two Amazon SQS queues to subscribe to the topic. If Amazon SNS receives an event notification, it will publish the message to both subscribers
	- For example, you can develop an application that publishes a message to an SNS topic whenever an order is placed for a product. Then, SQS queues that are subscribed to the SNS topic receive identical notifications for the new order. An Amazon Elastic Compute Cloud (Amazon EC2) server instance attached to one of the SQS queues can handle the processing or fulfillment of the order. And you can attach another Amazon EC2 server instance to a data warehouse for analysis of all orders received

![image.png](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2017/11/16/event_driven_sns_compute_slide05.png)

### X.Y. DynamoDB

DynamoDB is a multi-AZ, NoSQL db (suitable for key-value stores) that can handle frequent schema changes and doesn't have downtime with schema changes.

* Provisioned capacity: specify the capacity units for the table and get billed for them. Useful foor steady load or known patterns
* On-demand: paying per request (good for unpredictable traffic). Pricing is pay-per-request for read and write requests.

A document in DynamoDB doesn't have a fixed schema. Each table defines the primary key, the unique identifier for each table and it must be provided when inserting a new item:

* Simple (single field): also the partition key
* Composite: build-up via the partition and range key. Range key can be used with expressions

Internally, DynamoDB has different partitions where the items are stored. The partition key runs through a hash function whose result determines the partition. A good partition should be equally distributed.

This is important because the read/write capacity units are distributed among partitions. If items aren't well distributed, your requests are more likely of being throttled because you'll have hot partitions /partitions receiving high load).

* Query: looks for items at a specific partition. You're billed only for the retrieved items. Query works on indexes (partition & range key, if any). Cheaper and faster than a scan.
* Scan: runs through the table looking for items that match your expression. You're billed by the items that are scanned

To keep shared data updated in real time where users from around the world submit data, use AppSync with DynamoDB

---

Secondary indexes:

* Local (local secondary index - LSI): needs to have the same hash/partition key, but an alternative range key. max 5 per table
* Global (GSI): partition & range key can be different. max 20 per table

---

Backups:

* On-demand: regularly trigger on-demand backups. A lambda function that triggers backups via aws-sdk. EventBridge rule that invokes the function regularly
* Continuous backups via point-in-time-recovery: more costly, allows you to restore the table to any state within the last 35 days.

With global tables, you can have synchronized tables in different regions.

CloudWatch by default captures: user read capacity units, user write capacity units, throttles

DynamoDB and ElastiCache provide high performance storage of key-value pairs.

DynamoDB Stream allows the invocation of other services if items are created/updated/deleted. A stream record contains info about data modifications. You can configure the stream so that the record captures additioanl info, e.g. the before/after images of modified items. You can set up triggers so that a specific change in a table triggers a Lambda function.

![image.png](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/images/StreamsAndTriggers.png)

![keys.png](https://img-c.udemycdn.com/redactor/raw/2018-10-23_05-24-29-74b3e6dadc8ce683ccd2a5bd00f99889.png)

By default, tables are encrypted with KMS. You can use a customer-managed key (CMK).


### X.Y. Aurora

Relational db, supports dynamic storage scaling and can conduct table joins. Automatically scales to accomodate data growth.

For certain Aurora tasks, different instances perform different roles. The primare instance handles all data definition language (DDL) and data manipulation language (DML) statements. Up to 15 Aurora Replicas handle read-only query traffic. Using endpoints, you can ap each connection to the appropriate instance based on your use case. The custom endpoint provides load-balanced database connections based on criteria other than the read-only or read-write capability of the DB instances.

An Aurora serverless DB cluster is a DB cluster that automatically starts up, shuts down and scales up/down based on the app's needs. It's a simple, cost-effective option for infrequent, intermittent sporadic or unpredictable workloads. You can create a db endpoint without specifying the DB instance class size, you only set the min and max capacity. The endpoint connects to a proxy fleet that routes the workload to a fleet of resources that are automatically scaled.

Non serverless clusters use the *provisioned* db engine mode.

Aurora Global db is designed for globally distributed apps. It supports storage-based replication (RPO) with a latency of <1s. If there's an unplanned outage, one of the secondary regions you assigned can be promoted to read and write capabilities (RPO) in <1min.

* Reader endpoint: load-balances each connection request among the Aurora replicas
* Cluster/writer endpoint: connects to the primary db instance, used for write operations

### X.Y. RDS

If an instance of RDS in 1 AZ fails very often, enable Multi-AZ deployment, which has synchronous replication. Making a snapshot allows a backup, but it doesn't provide immediate availability in case of AZ failure.

In a Multi-AZ db if the primary db fails, the canonical name record (CNAME) switches from the primary to standby instance.

RDS has storage autoscaling to scale storage capacity with zero downtime.

* ElastiCache: caches database query results

### X.Y. EBS

They can only be attached to instances in the same AZ.

| Features | SSD | HDD |
|-|-|-|
| Best for | small, random I/O operations | large, sequential I/O operations |
| Can be used as a bootable volume? | Yes | No |
| Suitable use cases | Transactional workloads, sustained IOPS performance, large db workloads | large streaming workloads, big data, data warehouses, throughput-oriented storage for large volumes of data that's infrequently accessed |
| Cost | Moderate/high | Low |

* General purpose
* Provisioned IOPS: I/O intensive
* Throughput optimized: large operations (large data)
* For infrequently accessed data, always cold HDD

To back up all EBS volumes, use Amazon Data lifecycle manager (DLM) to automate the creation of snapshots.

EBS volumes spport live config changes in production, you can change volume type, size and IOPS capacity without service interruptions.

EBS volumes are off-instance, they can persist independently from the life of an instance. To prevent EBS from being deleted when an instance terminates, set the value of DeleteOnTermination to False.

### Redshift

Cloud data warehouse, it allows SQL and BI tools. You can run complex analytic queries against TB or PT of structured/semi-structured data.

## Security

* GuardDuty: threat detection service that monitors for malicious activity and unauthorized behavior in your AWS accounts and workloads
* Inspector: automated security assessment service that helps improve the security and compliance of apps deployed on AWS
* Shield: detect and mitigate DDoS attacks
	- Shield standard: network and transport layer protection
	- Shield advanced: additional detection and mitigation. Near real-time visibility into attacks, integration with WAF
* WAF: blocks common attack patterns such as SQL injection or cross-site scripting
	- AWS Firewall manager: simplify WAF administration and maintenance tasks across multiple accounts and resources
	- To mitigate DDoS: create a cloudfront distribution, set an ALB as origin. Create a rate-based ACL rule using WAF and associate it to the cloudfront

### Access management

Default policy is everything denied, this is overruled by an explicit allow. This is overruled by an explicit deny. Each policy contains 1+ statements. Statement contains:

* Effect: allow/deny
* Action: list of actions
* Resource: list of resources for which the actions are granted

Policies can be:

* Identity based: attached to a user/group/role
* Resource based: attached to a resource
	- Needs a principal: for which account/user/role is getting the effect

If a company is using Active Directory in their on-premise system, AWS Directory Service AD connector for easier integration. If the roles on-prem are already assigned using groups, in AWS use IAM roles or use Microsoft AD federation service.

Use IAM users only when creating new credentials, if the company already has then on-premises, they can be imported some other way.

IAM groups is a collection os IAM users that lets you specify permissions for multiple users.

To manage AWS resources centrally, use AWS organizations and AWS RAM (resource access manager) which enables you to share resources with any account or within organizations. You can share AWS Transit Gateways, Subnets, AWS License Manager configurations, and Amazon Route 53 Resolver rules resources with RAM.

MySQL and PostgreSQL dbs instance can be authenticated with IAM DB authentication and then you only need an authentication token to access it.

[awsu.me](https://awsu.me) is a CLI tool to work with different roles in AWS.

* *Trusted advisor*: reviews permissions for unnecessary rights or best practice violations and checks that you've enabled AWS security features for services.
* *Policy simulator*: build, validate and troubleshoot policies.

### Monitoring

* CloudTrail: check who made changes to AWS resources
* AWS Config: assesses, audits and evaluates resources. Can automate the evaluation of recorded configs against desired configs. By creating an AWS Config rule, you can enforce your ideal configuration in your AWS account
	- CloudTrail can track changes, can't enforce rules to comply with your policies

### Redis

If users need to authenticate, use Redis AUTH by creating a new Redis Cluster with bot hthe `--transit-encryption-enabled` and `--auth-token` parameters enabled. The second parameters asks users for a password.

## CloudFront

Low-latency and high-transfer speed content delivery network

To block access for certain coutries, use CloudFront geo restriction.

To reduce delay around the world, use Lambda@Edge which allows Lambda functions to execute the authentication process in AWS locations closer ot the users.

If users around the world have HTTP 504 errors, set up an origin failover by creating an origin group with 2 origins: specify one as the primary origin, the other as secondary origin which CloudFront automatically switches to when the primary origin returns specific HTTP status code failure updates.

You can also deploy the app to multiple AWS regions and set up a Route53 record with latency routing policy to route incoming traffic to the region that provides the best latency, but this has more costs.

* Lambda@Edge: run general-purpose code on regional edge locations. Executed in one of AWS' 13 regional edge caches. Supports JS/Python, 5s (viewer), 30s (origin triggers), max memory is 128MB (viewer) & 10GB (origin), has network access. Used in scenarios:
	- Viewer request/response: invoked at the start/end of all requests
	- Origin request/response: only when cloudfront requests the origin/retrieves a response
* Cloudfront functions: lightweight version of Lambda@Edge, less capabilities but better latency and cheaper. Executed in one of 218 edge locations. Used for access control & authorization, HTTP redirects, cache manipulation.
	- Supports JS, max exec time is 1ms, max memory is 2MB, has no network access.

## Networking

To check all healthy instances, use multivalue answer routing policy to help distribute DNS responses across multiple resources. For example, use multivalue answer routing when you want to associate your routing records with a Route 53 health check.

Inbound rules for EC2 instances are evaluated starting the lowest numbered rule:

* If rule #100 says allow and rule #* says deny, #100 is evaluated first -> allow. if source is allowed on rule #100, it won't further evaluate rule #101 etc.

### VPN

A VPN allows you will be able to connect your Amazon VPC to other remote networks securely using private sessions with IP security (IPSec) or transport layer security (TLS) tunnels.

AWS Site-to-Site VPN: to connect on-prem and AWS, cheap option with limited bandwidth and limited traffic.

To connect from on-prem to VPCs with a VPN, the customer side needs a Customer Gateway.

![networking.png](https://img-c.udemycdn.com/redactor/raw/2018-10-27_22-45-01-dbcb3de60063eaba73e8d2d12c61d6dc.png)

* Security group: firewall for EC2 instances
	- Supports allow rules only
* NACL (network access control list): firefall for associated subnets
	- Supports allow + deny rules

### Route 53

DNS web service, it redirects traffic via domain names to your apps. (DNS == resolving domains into their IP addresses.) 3 main functions:

* Domain registration
* DNS routing (from example.com to the IP address, from an email account to the email server, from a subdomain to the IP address)
	- Simple routing: used for single resources that are performing given functions in your domain. Can't create multiple records with the same name for this type
	- Weighted routing: you can define multiple records for the same (sub-)domain name and let you choose how much traffic is routed to each one of them. Useful for load balancing
	- Geolocation routing: route traffic based on the grographic location of users
	- Geoproximity routing: routes traffic based on the geographic location of the users+resources. By specifying *bias*, you can choose how much of the traffic should be routed
	- Latency routing: serves user requests from the AWS region with lowest latency. Users from the same location might get sent to different regions
	- Health checking
		+ Active-active failover: when you want all of your resources to be available the majority of the time. When a resource becomes unavailable, Route 53 can detect that it's unhealthy and stop including it when responding to queries.
		+ Active-passive failover: when you want a primary resource or group of resources to be available the majority of the time and you want a secondary resource or group of resources to be on standby in case all the primary resources become unavailable. 

Each record includes the name of the (sub)domain, a record type (A, MX..) and other info.

---

To set up DNS failover to a static website, use Route 53 with the failover option to a static S3 website bucket or CloudFront distribution.

To route traffic to a website hosted on a S3 bucket: the bucket should be configured to host a static website, the bucket name = domain/subdomain name. You need a registered domain name (you can use Route 53 for that), and Route 53 must be the DNS service for the domain.

Security groups are stateful, everything is blocked by default. the security group specifies what's allowed.

VPC endpoints for Amazon S3 provide secure connections to S3 buckets that do not require a
gateway or NAT instances.

### Subnets

Each subnet maps to a single AZ, and each subnet is automatically associated with the main route table for the VPC.

To create an IPv6 subnet, you need to create IPv4 subnet first.

For 2 EC2 instances inside a VPC to communicate (each instance in its own subnet), the Network ACL should allow communication between the 2 subnets and the security groups allow the app host to communicate to the other instance on the right port and protocol.

The online application must be in public subnets to allow access from clients' browsers. The database cluster must be in private subnets to meet the requirement that there be no access from the Internet. A NAT Gateway is gives private subnets access to the Internet. **NAT Gateways must be deployed in public subnets.** For resouces in various AZs, to improve resilieny, create one NAT Gateway per AZ and configure routing so that resources use the NAT in their AZ.

An ALB sends requests to healthy instances only. It performs periodic health checks on targets in a target group, if an instance fails the health check a configurable amount of times it'll be marked as unhealthy and won't receive traffic until it passes another health check.

An ENI (elastic network interface) is a logical networking component in a VPC that represents a virtual network card. It includes a primary private IPv4 address, 1+ secondary private IPv4 addresses, 1 Elastic IPv4 per private IPv4 address, 1 public IPv4, 1+ IPv6.

To route traffic to an ELB load balancer, use Route 53, create an alias record that points to the LB. It's similar to the CNAME record but o can create the alias record for the root domain + subdomains (CNAME can only be used for subdomains). To enable IPv6 resolution, create a second resource record

* Alias with type "MX" record set: for mail servers
* Alias with type "CNAME" record set: can't be created for zone apex
* Non-Alias with type "A" record set: for IP addresses
* Alias type with "A" record set: for domains
* Alias type with "AAAA" record set: for subdomains

---

To allow only clients connecting from the IP addres XXX should have access to the host, set the security group inbound rule, protocol tcp, range-22, source XXX/32. /32 is to specify one IP address, /0 refers to the entire network.

> 2 VPCs with peering connections with each other

Peering connection is just within the VPCs, not with the connections that the other VPC has.

> Windows Bastion

A bastion host is a special purpose computer on a network specifically designed and configured to withstand attacks, it's equivalent to an EC2 instance. It should be in a public subnet with either a public or Elastic IP address with sufficient RDP or SSH access defined in the security group. Users log on to the bastion host via SSH or RDP and then use that session to manage other hosts in the private subnets.

The best way to implement a bastion is to create a small EC2 instance which only has a security group only allowing access on port 22 from a particular IP address for maximum security. This blocks any SSH brute force attacks on the host. Use a private key (.pem) file to connect to the host. Recommended to create a small instance, since this only acts as a jump server to connect to other instances.

> Elastic IP address

Static IPv4 (can only connecto to NLB) address masks the failure of an instance by rapidly remapping the address to another instance. You can also specify the elastic IP in a DNS record of your domain, so that your domain points to your instance.

Can be used to use the trusted IPs as Elastic IP addresses (EIP) to the NLB.

### Load balancers

* Network load balancer: 4th layer of the OSI model
* Application load balancer: supports path-based routing, host-based routing, bi-directional communication with WebSockets

## Encryption

If the encryption keys must be stored on premises, use SSE-C (server-side, customer provided keys) but in this case the key is sent to AWS as part of the request. or use client-side encryption to provide at-rest encryption.

If the master key and the unencrypted data can't be sent to AWS, we need client-side encryption.

Client-side encryption means encrypting data before sending it to AWS.

### AWS Secrets manager

Secrets can be db credentials, passwords, API keys etc. It allows automatic rotation for all the credentials. Secrets Manager enables you to replace hardcoded credentials with an API call to the Secrets Manager.

## CloudWatch

CloudWatch by default monitors CPU, network and disk read activity on EC2 instances. To get memory utilization, need to have a custom metric.

Install the CloudWatch agent in the EC2 instances that gathers all the metrics (memory usage for ex.). View the custom metrics in the CloudWatch console.

## Kinesis

Kinesis data streams is an ordered sequence of data records meant to be written to and read from in real-time. Data records are temporarily stored in shards in the stream, default is 24h.

Kinesis data firehose loads streaming data into data stores and analytics tools e.g. S3, Redshift, Elasticsearch, Splunk.

## AWS Backup

Centralized backup service, can be used with a retention of X days.

## Messaging

### SQS

Decouples downstream operations that don't need to be synchronous. Messages for Lambda triggers can be aggregated together into batches, so one function invocation processes several messages at a time. Messages can contain up to 256kbs of text and can be in json/xml format.

SQS polling is not real time. If we receive empty messages when polling, enable long polling: set ReceiveMessageWaitTimeSeconds to higher than 0. In long polling, SQS waits until a message is available before sending a response to a ReceiveMessage request.

SNS works real-time. Lambda is a valid subscriber. EventBridge is not a valid SNS destination

For users with different priority, create one SQS queue for each priority type. Consume messages from the high priority queue until it's empty, then the lower priority queue.

You cannot set a priority to individual items in the queue.

* Standard queue: guarantees that messages are delivered at least once, no guarantee for order
* FIFO: limit 300 transactions/s, guarantees ordering, guarantees one-time processing of all messages, support for message groups

With Message groups and their identifiers, messages with the same ID are processed in order. Useful for processing messages of the same customer in order. Messages for one customer are delivered in FIFO, but messages for other customers are in parallel and FIFO is not guaranteed.

Visibility timeout: message is hidden from other consumers while it's being processed. If successfully processed, deleted. Else, message available again. Default timeout is 30s, max 12h.

SQS has a retention period from 1 minute to 14 days, default is 4 days. After that, messages are deleted.

DLQ: dead letter queues: if a message is considered unprocessable, it's sent to this queue. This helps unblock messaging systems without losing messages.

Max in-flight msgs 120k, for FIFO 20k.


### MQ

MQ is used for migrating messaging services to the cloud quickly and easily.

Managed message broker service for Apache ActiveMQ that makes it easy to set up and operate message brokers in the cloud and hybrid architecture. The user case is when migraing to a managed message broker to automate software administration and maintenance, without having to re-write existing applications.

### API Gateway

Enables you to build RESTful APIs and WebSocket APIs optimized for serverless workloads. You pay only for the API calls you receive and the amount of data transferred out.

API Gateway has three major parts:

* Request flow: authentication, authorization
* Integration (what the client wants to do), e.g. a Lambda function
* Response flow: what happens after the integration, e.g. transformation

*Authorizer*s protect routes of the API. Protects downstream services and allows forwarding a security context, e.g. the details of an authenticated user. [More info on twitter thread](https://twitter.com/tpschmidt_/status/1466079626749526021)

---

Amazon API Gateway provides throttling at multiple levels including global and by a service call. Throttling limits can be set for standard rates and bursts. For example, API owners can set a rate limit of 1,000 requests per second for a specific method in their REST APIs, and also configure Amazon API Gateway to handle a burst of 2,000 requests per second for a few seconds

API Gateway can scale using AWS Edge locations, but for bursts of API, you need to configure throttling limits. Any request over the limit will receive a 429 HTTP response.




---

* SSO: single sign-on, central management of access to AWS accounts and resources
* STS: security token service, create temporary credentials for AWS resources