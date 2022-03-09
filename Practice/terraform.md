# Terraform

if terraform plan fails due to error at acquiring the state lock, 

go to azure, main storage account, states container, and there's a .tfstate file there. Break lease
https://jackwesleyroper.medium.com/fixing-terraform-error-acquiring-state-lock-in-azure-ec1a5d9d5cbd

https://julie.io/writing/terraform-on-azure-pipelines-best-practices/