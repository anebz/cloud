# Terraform

if terraform plan fails due to error at acquiring the state lock, 

go to azure, main storage account, states container, and there's a .tfstate file there. Break lease
https://jackwesleyroper.medium.com/fixing-terraform-error-acquiring-state-lock-in-azure-ec1a5d9d5cbd

https://julie.io/writing/terraform-on-azure-pipelines-best-practices/

## terraform questions

for variables, why sometimes $() and why sometimes ${{}}. even sometimes '$()'

---

terraform state file
terraform import to merge existing infrastructure with terraform without recreating

terraform init makes a .tfstate file, saying what's the current state of infrastructure

terraform import azurerm_resource_group.import /subscription/.../resourceGroups/example-resources

in main.tf
resource "azure_resource_group" "import" {
	name = "example-resources" <-- resource has to already exist in Azure!
	location = "West Europe"
}

terraform state list -> lists resources from the workspace
to remove the imported resource: terraform state rm azurerm_resource_group.import

terraform validate

the storage account for the state must be created before the terraform. in pipeline, azure cli command to create these state files -> then start tf deployment


terraform backend means that the state is stored in a file

azure pipeline

trigger: what branch or in what cases this ppl should run. main -> whenever sth is commited to main branch, ppl runs automatically
pool: runtime for pipeline
steps: tasks to execute

creating service connection, manual azure resource manager, verify
job: aggregation of steps
step: smallest unit of multi-stage-pipeline (storage is shared between steps)

info is not shared between stages -> upload + download -> when downloading, permission issue (due to ubuntu runtime) -> chmod -R 700 terraform-live

in production, no need to chmod because they don't do upload-download. they upload-download from storage account, this doesn't preserve unix permissions -> no chmod necessary

without approvals or stops, one stage will run after the other automatically -> environment. in azure devops only "deployment jobs" can specify an environment, make sure you refer to your own environment.

keyvault store credentials
set up content deployment pipeline
16:40
check last recording bzw. after 03:40:00

this pipeline produces the public web address of storacc as output, and it also created a secret with the storacc primary key in an existing kv. with libraries, we can link kvs to download secrets and confidential info from a kv in your pipeline.


storage account's primary key can be stored in a secure way using key vault as a secret. This kv can be linked to DevOps using a Library.

second pipeline will deploy to storage account. to authenticate, the primary key of the account will be used by the pipeline.
