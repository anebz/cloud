# Cloud learning ☁️

[![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)](http://commonmark.org)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/anebz/cloud/graphs/commit-activity)
[![Ask me anything](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://www.twitter.com/aberasategi)

This is a repository of notes and resources for cloud learning, primarily AWS.

## AWS Cloud practicioner certificate

1. [AWS certified cloud practitioner](Accreditations/aws_cloud_practitioner.md) [[pdf]](Accreditations/aws_cloud_practitioner.pdf)
2. [AWS cloud economics accreditation](Accreditations/aws_cloud_economics.md) [[pdf]](Accreditations/aws_cloud_economics.pdf)

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

## Books

* [Building secure and reliable systems, O'Reilly](https://sre.google/static/pdf/building_secure_and_reliable_systems.pdf)
* [The site reliability workbook, O'Reilly](https://sre.google/workbook/table-of-contents/): Chapters in web
* [Site reliability engineering, O'Reilly](https://sre.google/sre-book/table-of-contents/): Chapters in web

## Cheatsheet

Python & AWS

```bash
aws configure --profile 'newprofile'
# insert user's data
```

```python
import boto3
session = boto3.Session(profile_name='shotty')
ec2 = session.resource('ec2')
```
