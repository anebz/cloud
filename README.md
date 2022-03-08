# Cloud learning ☁️📚

[![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)](http://commonmark.org)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/anebz/cloud/graphs/commit-activity)
[![Ask me anything](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://www.twitter.com/anebzt)

![ ](https://images.unsplash.com/photo-1494599948593-3dafe8338d71)

This repository contains **certification notes** 🧑‍🎓 and resources for learning cloud.

## AWS certifications

1. AWS cloud economics accreditation: [Markdown notes](Certifications/aws_cloud_economics.md) | [PDF version](Certifications/aws_cloud_economics.pdf)
2. ⭐️ AWS certified cloud practitioner: [Markdown notes](Certifications/aws_cloud_practitioner.md) | [PDF version](Certifications/aws_cloud_practitioner.pdf)
3. ⭐️⭐️ AWS developer Associate: [Markdown notes](Certifications/aws_developer_associate.md) | [PDF version](Certifications/aws_developer_associate.pdf)
4. ⭐️⭐️ AWS solutions Associate: [Markdown notes](Certifications/aws_solutions_associate.md) | [PDF version](Certifications/aws_solutions_associate.pdf)

## Azure certifications

1. 🔷 Azure AZ-900 Azure fundamentals: [Markdown notes](Certifications/az_900.md) | [PDF version](Certifications/az_900.pdf)
2. 🔷 Azure AI-900 Azure AI fundamentals: [Markdown notes](Certifications/az_ai_900.md) | [PDF version](Certifications/az_ai_900.pdf)
3. 🔷🔷 Azure DP-100 Data Scientist Associate: [Markdown notes](Certifications/az_dp_100.md) | [PDF version](Certifications/az_dp_100.pdf)
4. 🔷🔷 Azure AI-102 AI Engineer Associate: [Markdown notes](Certifications/az_ai_102.md) | [PDF version](Certifications/az_ai_102.pdf)

## Learning

* [Kubernetes](kubernetes.md)

## Practice

* [Save CloudHealth accounts status to S3 bucket with Lambda](Practice/cloudhealth_lambda_s3.md)
* [AWS Lambda with Docker and Serverless](Practice/lambda_docker_serverless.md)

## Resources

* [Lambda the Terraform way](https://github.com/nsriram/lambda-the-terraform-way)
  * Similar [repo](https://github.com/antonbabenko/serverless.tf)
* [AWS copilot CLI: toolkit for containerized apps in ECS and AWS Fargate](https://aws.github.io/copilot-cli/)
* [Why the serverless revolution has stalled](https://www.infoq.com/articles/serverless-stalled/)
* [DevOps exercises](https://github.com/bregman-arie/devops-exercises) and [DevOps resources](https://github.com/bregman-arie/devops-resources)
* [Scool of SRE](https://linkedin.github.io/school-of-sre/)
* [Katacoda](https://www.katacoda.com/)

## Books

* [Building secure and reliable systems, O'Reilly](https://sre.google/static/pdf/building_secure_and_reliable_systems.pdf)
* [The site reliability workbook, O'Reilly](https://sre.google/workbook/table-of-contents/): Chapters in web
* [Site reliability engineering, O'Reilly](https://sre.google/sre-book/table-of-contents/): Chapters in web
* [The good parts of AWS (pdf)](https://b-ok.cc/book/5458006/1ebc63)
  * Cloudformation automatic deployments (page 66)
  * Cloudformation load balancing (page 84)
  * Cloudformation scaling (page 102)
  * Cloudformation production (page 113)
  * Route53 custom domains (page 129)
  * Migrate endpoint from HTTP to HTTPS (page 139)
  * Network security: NAT, ASGs (page 159)
* ❗️❗️ [The Cloud Resume Challenge](https://cloudresumechallenge.dev/)
  * ⭐️ AWS version contains: S3, CloudFront, Route 53, ACM, DynamoDB, Lambda, API Gateway, AWS SAM and Github Actions
  * 🔷 Azure version contains: Azure Storage, CDN, Azure DNS, CosmosDB, Azure API, Functions, ARM and Github Actions
  * 🔻GCP version contains: Google Cloud Storage, Cloud CDN, Cloud Domains, Firestore, API, Google Cloud Functions, Terraform and Cloud Build

## Cheatsheet

Access an EC2 instance from bash

```bash
chmod 400 mynvkp.pem
ssh ec2-user@public-ipv4-address -i mynvkp.pem
```

Configure AWS profile
```bash
aws configure --profile 'newprofile'
# insert user's data

nano ~/.aws/credentials
nano ~/.aws/config
# check that info and profile name has been stored correctly

export AWS_PROFILE=newprofile
# start using your profile

aws iam get-user
# should return your Username, UserId, and ARN
```

```python
import boto3
session = boto3.Session(profile_name='shotty')
ec2 = session.resource('ec2')
```