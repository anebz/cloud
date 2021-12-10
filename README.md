# Cloud learning ☁️

[![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)](http://commonmark.org)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/anebz/cloud/graphs/commit-activity)
[![Ask me anything](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://www.twitter.com/aberasategi)

This is a repository of notes and resources for cloud learning, primarily AWS.

## AWS certificates

1. [AWS certified cloud practitioner](Accreditations/aws_cloud_practitioner.md): [[pdf]](Accreditations/aws_cloud_practitioner.pdf)
2. [AWS cloud economics accreditation](Accreditations/aws_cloud_economics.md): [[pdf]](Accreditations/aws_cloud_economics.pdf)
3. [AWS developer associate](Accreditations/aws_developer_associate.md): [[pdf]](Accreditations/aws_developer_associate.pdf)

## Azure certificates

1. [Azure AZ-900 fundamentals](Accreditations/az_900.md): [[pdf]](Accreditations/az_900.pdf)
2. [Azure DP-100 data scientist associate](Accreditations/az_900.md): [[pdf]](Accreditations/az_dp_100.pdf)

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