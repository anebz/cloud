# [AWS cloud economics](https://www.aws.training/Details/eLearning?id=36904)

- [AWS cloud economics](#aws-cloud-economics)
  - [1. Introduction to business value](#1-introduction-to-business-value)
    - [Cloud value framework](#cloud-value-framework)
  - [2. Cost savings](#2-cost-savings)
    - [2.1. How to lower costs](#21-how-to-lower-costs)
    - [2.2. AWS flywheel](#22-aws-flywheel)
    - [2.3. Migration challenges](#23-migration-challenges)
      - [2.3.1. Sunk infrastructure costs](#231-sunk-infrastructure-costs)
      - [2.3.2. Migration costs](#232-migration-costs)
    - [2.4. Cloud readiness](#24-cloud-readiness)
    - [2.5. Cost savings analyses](#25-cost-savings-analyses)
    - [2.6. Customer cost savings analysis best practices](#26-customer-cost-savings-analysis-best-practices)
    - [2.7. Cost savings analysis best practices](#27-cost-savings-analysis-best-practices)
    - [2.8. Delivering cost savings](#28-delivering-cost-savings)
  - [3. Staff productivity](#3-staff-productivity)
  - [4. Operational resilience](#4-operational-resilience)
    - [4.1. Cornerstones of operational resilience](#41-cornerstones-of-operational-resilience)
  - [5. Business agility](#5-business-agility)
  - [6. Cloud financial management](#6-cloud-financial-management)
    - [6.1. Measurement and accountability](#61-measurement-and-accountability)
    - [6.2. Cost optimization](#62-cost-optimization)
      - [6.2.1. Choosing the right pricing model](#621-choosing-the-right-pricing-model)
      - [6.2.2. Optimizing storage](#622-optimizing-storage)
    - [6.3. Planning and forecasting](#63-planning-and-forecasting)
    - [6.4. Cloud financial operations](#64-cloud-financial-operations)
  - [7. Migration portfolio assessment (MPA)](#7-migration-portfolio-assessment-mpa)
  - [8. Cost savings with MPA](#8-cost-savings-with-mpa)
    - [8.1. Best practices to avoid common mistakes](#81-best-practices-to-avoid-common-mistakes)
  - [**9 Presenting AWS Solutions to customers**](#9-presenting-aws-solutions-to-customers)
    - [9.1. Discovery](#91-discovery)
    - [9.2. Presenting the solution](#92-presenting-the-solution)
      - [9.2.1. Objection handling best practices](#921-objection-handling-best-practices)
      - [9.2.2. Common objection responses](#922-common-objection-responses)
      - [9.2.3. Customer meeting best practices](#923-customer-meeting-best-practices)
    - [9.3. Delivering a POC](#93-delivering-a-poc)
  - [10 Looking ahead of the POC](#10-looking-ahead-of-the-poc)
  - [10.1. Solution implementation](#101-solution-implementation)
  - [10.2. Modernization](#102-modernization)
  - [11 APN resources](#11-apn-resources)
    - [11.1. APN partner benefits](#111-apn-partner-benefits)
    - [11.2. Training](#112-training)

Cloud economics = Business value + cloud financial management

* **Business value**: what you discuss with your customers before a sale to help them understand the value of AWS and how AWS can help them -> total cost of ownership (TCO)
* **Cloud financial management**: helping AWS customers be successful in financially managing their cloud infrastructure -> Migration portfolio assessment (MPA)

## 1. Introduction to business value

* Capex: capital expenditure: you pay up front, fixed sunk cost
* Opex: operational expenditure: pay for what you use, like utility bililng

### Cloud value framework

* Section 2: **Cost savings** (TCO) also called capex
    - financial benefits of moving to the cloud
    - the most common focus because it involves concrete numbers, unlike the other 3
* Section 3: **Staff productivity**
    - efficiency gained from reducing or eliminating tasks that are no longer needed with the cloud
* Section 4: **Operational resilience**
    - benefit gained from improved availability and security. More uptime, less downtime, and decreased risk
* Section 5: **Business agility**
    - being able to respond faster and experiment more
    - Higher user productivity and revenue

---

## 2. Cost savings

### 2.1. How to lower costs

* Consumption-based model
    - only pay for what you use. In an on-premises environment, you might overprovision (order more servers than you need), or underprovision. In both cases, you have inefficiency and financial loss. With AWS, you get the infrastructure you need when you need it.
* AWS pricing model
    - You can match the usage model to the requirements of workloads by maturity and behavior
        + Maturity: does the customer have enough data to determine a usage baseline so they can use a Reserved instance (RI)?
        + Behavior: is data usage too spiky for Reserved instances? Will spot instances work better?
    - Typically customers start with on-demand instances to gauge their needs, and then switch to RI once they know their demand baseline. RIs cost much less than on-demand
    - Spot instance: AWS excess capacity sold for a deep discount. This can reduce costs even further
* Frequent price reductions

### 2.2. AWS flywheel

It's a cycle of:

* Reduced prices
* More customers
* More AWS usage
* More infrastructure
* Economies of scale
* Lower infrastructure costs
* Reduced prices
* ...

### 2.3. Migration challenges

#### 2.3.1. Sunk infrastructure costs

Customers want to retire hardware but they haven't fully depreciated it and they haven't recovered the non-depreciated value of their investments by selling it.

* Depreciation: what's the asset's depreciation considered?
* Recovery value: can any value be recovered by selling the asset? Maybe another company can take over the operational costs. Or not pay for the whole data center, but a part of it.

#### 2.3.2. Migration costs

A customer moves their existing footprint to the cloud, shuts down their data center, which requires time and effort. Models can be used to get an approximation of the migration costs. The migration portfolio assessment (MPA) tool can help here.

---

> ROI = Cost savings / (Sunk costs + migration costs)

Agree with your customer on a target ROI, and knowing the cost savings and sunk costs, calculate the migration cost and divide by the number of servers. If this value is low, evaluate other components. Improve cost savings, decrease sunk costs, or lower ROI. If the break even value per server is high, the customer is on the safe side of the equation.

Customers sometimes struggle with shifting to opex (all operational expenses) from the traditional capital expense model (capex). It is commonly said that one dollar of opex is worth two dollars in capex.

### 2.4. Cloud readiness

* Human factor: team readiness
    - the skills and experience of the customer's team required to transition to the cloud
* Applications
    - the readiness of the customer's legacy applications or workloads to move to the cloud
    - What are the app dependencies?
    - Which apps are communicating with other apps?
        + 2 apps might be speaking to each other frequently with high dependency on one another, and migrating one without the other might pose a significant risk due to the latency for them to communicate
    - What apps can be translated easily?
* Entrenched IT department: the IT department might be irrationally and continuously against the AWS migration

Cost savings engagement might require multiple discussions with different audiences:

* DevOps team: focus on technical specs and features that will simplify their lives. In most cases, costs are not a primary issue for them
* IT support team: they will want to know the changes, and they focus on the costs
* Procurement group: focus on pricing and payment models
* C-level team members and investors: focus on big picture, bottom line, and growing the business or revenue.

### 2.5. Cost savings analyses

This is used when you want to help a customer compare costs and build a business case for transitioning to AWS.

> A cost savings analysis calculates the total cost of ownership (acquisition and operating cost) for running an end-to-end traditional IT environment on-premises vs. deploying to AWS.

Perceived IT costs

* Server costs
    - Hardware: server + maintenance
    - Software: OS + virtualization licenses + maintenance
* Storage costs
    - Hardware: storage disks
* Network costs
    - Network hardware: LAN switches, load balancer bandwidth costs
* IT labor costs
    - Server admin, virtualization admin

Actual costs: the perceived costs + facilities cost (space, power, cooling)

* IT labor costs: previous + storage admin, network admin, support admin
* Extras: project planning, advisors, legal, contractors, managed services, training, cost of capital

### 2.6. Customer cost savings analysis best practices

Do:

* All stakeholders (finance, procurement, IT support, engineering) are included in the first conversation and continuously kept in the loop
* Work collaboratively with the customer. The customer should own the analysis
* Use realistic peak CPU and peak RAM usage percentages. If the customer doesn't have this data, agree to use industry averages or use a scanning tool to find out

Don't:

* Focus purely on pricing and discounts, rather than cost analysis
* Compare a duplicate of an on-premises environment. If a process is inefficient in one environment, why move it as-is to another?
* Base all decisions and vision on an unchecked cost analysis, and fail to capture the true costs of IT, data center, and on-premises
* Bring up the cost savings discussion late in the decision-making process

Only start the cost analysis if the customer asks for it.

### 2.7. Cost savings analysis best practices

Do:

* Use realistic on-premises refresh cycles: typically, 3-5year refresh windows
* Use 3-year standard reserved pricing
* Use realistic on-premises ratios, such as the number of virtual machines to physical hosts
* Use actual peak usage percentages
* Include the benefits of automation and task efficiency

Don't:

* Forget to include overhead costs: expenses related to power, space and cooling
* Forget administration costs: procurement, design, build, operations, network, security
* Forget rent/real estate: building deprecation, taxes, shared service staff
* Forget software and hardware maintenance costs
* Forget the cost of redundancy

### 2.8. Delivering cost savings

* Kickoff
    - Cost savings overview
    - Timeline, scope, and roles
* Data collection (2-4 weeks)
* Initial assessment
    - Review data
    - Identify open questions, assumption
* Q&A (~1 week)
* Full assessment
    - Incorporate new data
    - Repeat as needed
* Iterate and finalize (~1 week)
* Customer report out

You can use AWS TCO tools and the MPA tool for the cost analysis.

---

## 3. Staff productivity

Using AWS, administrators use more VMs, manage more TBs, and have less incidents. Typical functions of IT:

* Server, Network, Storage - administrators, implementers, engineers
* Application - DB administrators, QA, support
* Facilities
* Security

---

## 4. Operational resilience

The impacts of downtime costs include:

* **Business disruption costs**: damage to company brand, lost opportunities, reputation damage
* **Lost revenue**
* Third-party fees
* Equipment replacement
* Recovery activities and costs
* Detection costs associated with initial discovery and subsequent investigation
* Unproductive IT staff and end-user costs

### 4.1. Cornerstones of operational resilience

* *Operations*: causes of failure
    - Human error: lack of clearly defined procedures or user privilege
    - Configuration error in hardware or OS setting
    - Procedural errors: restoring the wrong backup or forgetting to restart a device
    - Commonplace accidents
    - AWS helps by: leveraging automation, managing services from end to end, providing system-wide visibility for usage, performance and operational metrics, enabling security and governance configuration of AWS resources, and monitoring API access
* *Security*: causes of failure
    - Malware: worms, viruses, Trojan horses
    - Network attacks: open ports, SYN floods, fragmented packets
    - Unpatched applications or OS
    - Security issues: password disclosures, social engineering
    - Poor or limited authetication
    - AWS helps by: leveraging automation, providing AWS IAM (identity access management), reducing and eliminating 'rogue servers'
* *Software*: causes for failure:
    - Resource exhaustion: runaway processes, memory leaks
    - Computational or logic errors: faulty references, de-allocated memory, corrupt pointers
    - Inadequate monitoring
    - Failed upgrades
    - AWS helps by: offering blue and green deployments, automating CICD, runs smaller code deployments to reduce unit, integration and system bugs, provides current and secure resources with OS patching
* *Infrastructure*: causes for failure:
    - Hardware failure of servers, storage or networks
    - Natural disasters
    - Power outages
    - Volumetric attacks: DDoS, DNS, UDP/ICMP floods
    - AWS helps by: data centers on a massive scale, AZs and regions, redundancy over AZs and regions

---

## 5. Business agility

Customers have more opportunities to experiment and respond faster. Focus on 3 key performance indicators (KPI):

* Time to market for new applications
* Features per release
* Value or revenue per release

DevOps practices help customers deliver software faster, more reliably and with fewer errors. Some practices:

* Code throughput: how frequently a team is able to deploy code (deployment frequency) and how quickly it can move from commiting code to deploying it (lead time for changes)
* Systems stability: how quickly a system can recover from downtime (mean time to recover, MTTR) and how many changes succeed vs. how many fail (change failure rate)

---

## 6. Cloud financial management

Second part of the cloud economics part

* Measurement and accountability
* Cost optimization
* Planning and forecasting
* Cloud financial operations

### 6.1. Measurement and accountability

Establishing cost transparency and accountability through the necessary steps to ensure visibility into spend. Customers can use five tags to label their resources so they can manage them:

1. Cost center it belongs to
2. Application or workload it supports
3. User who owns it
4. Expiration date
5. Automation: shut down on weekend

Tools should use all the cost and usage data provided by AWS to generate automated reporting and recommendations.

1. You can do it yourself, create a custom dashboard
2. Use APN's cloud management tools (CMT). CloudHealth by VMware is an automated tagging tool
3. AWS tools: AWS cost explorer: helps customers dive deeper into cost and usage data to identify trends, pinpoint cost drivers, and detect anomalies

### 6.2. Cost optimization

Identify waste, build cloud-friendly architectures that scale based on demand, and improve cost efficiency. Best practices

* Right-sizing instances: select the lowest cost instance available that meets performance requirements. Look at CPU, RAM, storage and network usage to identify potential instances that can be downsized. Use Amazon CloudWatch metrics
* Increasing elasticity: turn off non-production instances: look for dev/test, non-production instances that are running always-on and turn them off. [AWS Lambda + CloudWatch = Automated scheduling](https://aws.amazon.com/premiumsupport/knowledge-center/start-stop-lambda-cloudwatch/)

#### 6.2.1. Choosing the right pricing model

* On demand: pay a fixed hourly/second rate, no commitment
* **Reserved instances (RIs)**: typically RIs are used for workloads that need to run most or all of the time. In some cases customers can take advantage of regional benefits, making the RIs AZ-agnostic and allowing the RI to be applied for the whole AWS region. RIs require a 1-3 year commitment
* Customers can combine regional RIs with capacity reservations to benefit from billing accounts. This means reserving capacity for EC2 instances in a specific AZ for a duration, ensuring access to EC2 capacity. This is charged the equivalent on-demand rate, regardless of whether the instances are run.
* **Capacity reservations**: zonal RI billing discounts don't apply to capacity reservations, they can't be created in placement groups and can't be used with dedicated hosts.
* In convertible RIs, customers can modify reservations across families, sizes, OS and tenancy. The only thing they cannot modify is Region
* **Spot instances**: spare, on-demand capacity available for discounts of up to 90% off on-demand prices. There is no commitment necessary, and should be used for workloads that have some variability in requirements. The best workloads for spot instances are fault-tolerant, flexible and stateless.
* A spot instance is an unused EC2 instance that's available for less than the on-demand price, they run whatever capacity is available and the maximum price per hour for your request exceeds the spot price
* Spot instances should be used for processes that have an end time, not for processes that must always be kept running
* 3 rules for EC2 spot instances:
    + Spots are the same instances that customers would get with on-demand, or RIs. the only difference is the term of the price points and that AWS can reclaim it with 2min notice. the price changes similar to the stock market
    + Spot pricing is set based on long-term trends and supply and demand. The price point is a lot smoother, there aren't many fluctuations.
    + Diversify: use diverse instance fleets (instance types and sizes) to spin up 1MM core clusters
    + Spot is an interruptible product, but this happens rarely. Only the workloads that are stateless, fault-tolerant, loosely coupled and flexible should be put into spots.
    + Anything containerized is generally a good target for spot. Also, big data analysis, CI/CD, web services, and HPC.

#### 6.2.2. Optimizing storage

6 different storage classes

* *S3 standard: general-purpose storage of frequently accessed data
* *S3 intelligent-tiering: data with unknown changing access patterns. Data is stored in 2 tiers: one for frequent access, another low-cost tier optimized for infrequent access. S3 monitors access to objects and moves the objects between tiers, according to their use. S3 charges a per-object monitoring fee. For smaller objects, the monitoring fee is smaller
* *S3 standard-infrequent access (IA) and S3 one-zone-IA: long-lived, less frequently accessed data
* *S3 glacier and S3 glacier deep archive: long-term archive

### 6.3. Planning and forecasting

The AWS pricing calculator creates a cost estimate for a new product that wil be built using AWS services. To programatically access pricing details, use AWS Price List API.

### 6.4. Cloud financial operations

Identify and invest in people, processes, tools and automation.

a center of excellence (CoE) brings together the people who are spending money, and the people who are paying for it. APN partners should encourage customers to establish a CoE to help bridge the gap between finance and IT.

A company's overall AWS cost should be evaluated as a unit cost ratio with respect to another defined metric: Unit cost = total cost / individual or unit cost. Examples:

* Unit cost per customer or active subscriber
* Unit cost per revenue generated
* Unit cost per product or business unit
* ...

The AWS instance scheduler enables customers to easily configure custom start and stop schedules for their EC2 and RDS instances.

## 7. Migration portfolio assessment (MPA)

MPA is a web application that automates the portfolio analysis process. MPA can be used in the discovery stage, to determine feasibility factors, and help migration planning. Key features include:

* Guided data import
* EC2 and EBS recommendations
* On-premises cost estimation and comparison
* Migration pattern recommendation
* Migration project cost estimation

## 8. Cost savings with MPA

1. Log in to MPA using APN credentials
2. Start portfolio assessment
3. Create new portfolio, choose from test portfolio or existing portfolio.
4. Import data into portfolio
    1. Select data type (server, application, app to server mapping)
    2. Click begin import
    3. Browse the on-premises data file
5. Validate the auto schema matching and the automatic unit selection
6. Remove the duplicate records
7. Validate and import the data into the portfolio

### 8.1. Best practices to avoid common mistakes

* Double-check that the data is correct and has correct units
* Check for data redundancy
* Validate storage IOPS
* Download results of data validation and verify with customer

## **9 Presenting AWS Solutions to customers**

### 9.1. Discovery

Information-gathering meeting to help you understand the customer's challenges. In the meeting, ask targeted and open-ended questions. Dive deep with the 5 whys, and uncover the real desired outcomes. Use whiteboarding to keep track of the conversation, illustrate workflows and ideation.

### 9.2. Presenting the solution

Consult with peers, illustrate the solution, include variation to have various solutions, with trade-offs that you learned about during discovery. Create a presentation. In a meeting to present findings, and propose your AWS solutions. Be sure to explain why you selected each one solution. After this meeting you might have to go back to the whiteboard to apply changes. If you do, present them to the customer again. If general agreement is reached, offer to build a POC.

The customer might have questions, concerns, or objections.

* Connect, identify the customer's point of view
* Condense: identify the core concerns
* Continue: take steps towards resolution

#### 9.2.1. Objection handling best practices

* Data-driven approach
* Use case studies
* Dive deep
* Have backbone: have confidence in your responses and leverage supporting materials to strenghten your position. If you are not sure of the correct information right away, assure them that you will find the information and get back to them quickly
* Keep the momentum going: don't let a few questions or objections derail your interaction

#### 9.2.2. Common objection responses

* Security
* Cost or cost savings
* Scalability and response

#### 9.2.3. Customer meeting best practices

* Prepare: familiarize yourself with all related acronyms, FAQs, pricing models, and service documentation
* Anticipate: anticipate the customer's questions, concerns and questions
* Stay on message

Do not:

* Use words like definitely, never or guaranteed
* Use acronyms or technical jargon
* Focus on technology, especially in the early meetings
* Focus on the short/mid-term
* Read the slides

### 9.3. Delivering a POC

Once the customer agrees to a potential solution, deliver a proof of concept (POC) where they evaluate the solution in their own environment.

A POC is a small scale, practical example of the proposed solution that will run the customer's application for a period of time. The customer evaluates this solution alongside their current production environment and determines the advantages, disadvantages, and what they think might want to change. Do not just simply demonstrate AWS services, but focus on meeting business requirements.

## 10 Looking ahead of the POC

## 10.1. Solution implementation

The migration process

1. Assessment
    * Identify readiness for operating on the cloud
    * Identify potential business outcomes for the migration
2. Readiness and planning
    * Address gaps in the customer's readiness
    * Analyze their environment
    * Determine migration strategies (rehost, replatform)
    * Create a well-architected Landing Zone
3. Migration
    * Design, migrate and validate each application.
    * Automatically or manually migrate the applications from physical, virtual or cloud-based environments to AWS.
    * One-time migration of a large volume of data to AWS
4. Operations and optimizations
    * Operate, manage and optimize workloads in the cloud
    * Improve operating model

A **minimum viable product** (MVP) is a functional product (or solution) with just enough features to satisfy customer's requirements at initial adoption, but leaving room for feedback for future product/solution development. Avoid "big bang" solutions that only have value at the end of a product development cycle. Instead, start with something basic to gather feedback as you get more complex.

When going to production, best practices:

* Involve AWS account team (solutions architect or technical account manager)
* Be aware of customer-specific regulatory requirements. Reach out to AWS security teams or solutions architects

The AWS Well-architected tool ensures that the product fulfills the well-architected review (section 3.3.).

## 10.2. Modernization

* Retire expensive legacy solutions
* Reduce TCO, improve cost optimization
* Gain agility through automation
* Free up resources to drive innovation

Ways to modernize architectures with AWS:

* [Serverless](https://aws.amazon.com/serverless/)
    - These applications don't require provisioning, maintaining and administering servers for backend components such as compute, databases, storage, stream processing, message queueing, etc. There is no longer a worry over fault tolerance and availability.
* [Containers](https://aws.amazon.com/containers/)
    - Your applications code can be packaged, as well as configuration, dependencies and runtime engine. Containers share an OS installed on the server and run as resource-isolated processes, ensuring quick, reliable and consistent deployments, regardless of environment. Usecases:
        + Microservices
        + Batch processing
        + Machine learning
        + Hybrid applications
        + Application migration to the cloud
        + Platform as a service
* [Data lakes and analytics](https://aws.amazon.com/big-data/datalakes-and-analytics/)
    - Data in different silos can be difficult to access and analyze. Data can be stored in a "data lake", in a single place, where it is easy to read data and obtain insights. Solutions on AWS:
        + Amazon Athena for interactive analysis
        + Amazon EMR for big data processing
        + Amazon Redshift for data warehousing
        + Amazon Kinesis for real-time analytics
        + Amazon Elasticsearch service for operational analysis
        + Amazon QuickSight for dashboards and visualizations

## 11 APN resources

APN is a global partner program for businesses who use AWS to build solutions and services for customers. AWS provides valuable business, technical and marketing support.

[APN consulting partners](https://aws.amazon.com/partners/consulting/) have several benefits depending on their tier (Registered, Select, Advanced, Premier). These companies have an partner-only section, where partners can access AWS training, request support, etc.

### 11.1. APN partner benefits

Partner programs and competencies:

* The Managed service provider (MSP) program, which teaches cloud infrastructure and application migration in 4 key areas: plan and design, build and migrate, run and operate and optimize
* The AWS Solution provider program is for system integrators, managed service providers, value-added resellers, and public sector partners to resell AWS services to end customers.
* The AWS SaaS factory is for APN partners looking to grow their Software as a Service offering.

APN marketing resources:

* APN marketing central: self-service marketing campaigns, launch solution-based campaigns
* AWS sponsorships: inp-erson access to customers, prospects and experts via AWS events
* How-to guides: learn marketing best practices, extend skills, showcase your products and services

APN partner acceleration funding program

* Training and certification funding
* Market development funding
* Partner opportunity acceleration (POA) funding

### 11.2. Training

* [AWS technical professional](https://aws.amazon.com/partners/training/path-tech-pro/)
    - fundamental technical knowledge of AWS Cloud computing
* AWS business professional
    - basic understanding of AWS services and core business value propositions
* AWS professional services
    - develop and extend professional services competencies

The APN partner team guides you through your Partner journey. The first point of contact is your Partner Development Representative (DPR) who helps you with onboarding. Next, the Partner Development Manager (PDM) manages the relationship between you and AWS.
