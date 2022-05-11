# Kubernetes

1. [Concepts](#1-concepts)

## 1 Concepts

Kubernetes is a distributed systems application environment for building and constructing distributed systems that span across many machines.

### Node

Runs containers and proxies service requests: docker, kubelet, proxy

### Pods

* Collection of containers that are co-located on a single machine that share the same namespace
* Users can set environment variables, mount storage, feed information into a cotainer
* Pods run containers, each pod contains 1+ containers and controls the execution of them. When the containers exit, the pod dies

### Scheduler

Schedules pods to run on nodes, global scheduler for long running jobs, best fit chosen based on pod requirements

### Replication controller

Manages a replicated set of pods, creates pods from a template, ensures desired number of pods are running. It enables online resizing and self-healing

### ReplicaSets

* A low-level type, higher-level are Deployments or DaemonSets
* They manage the lifecycle of pods
* They ensure that a set of identically configured pods are running at the desired replica count. If a pod drops off, the ReplicaSets brings a new one online as a replacement

### Secrets

* Base 64 encoded "at rest" but the data is automatically decoded when attached to a pod
* Secrets can be attached as files or environment variables
* They are used to store non-public information, such as tokens, certificates or passwords
* They can be attached to pods at runtime so the secret data can be securely stored in the cluster

### Deployments

* They support rolling updates and rollbacks, they can be paused
* They are higher-order abstraction that control deploying and maintaining a set of pods
* Behind the scenes, they use ReplicaSets to keep the pods running but deployments offer sophisticated logic for deploying, updating and scaling a set of pods within a cluster

### DaemonSets

* They can be used for installing or configuring software on each host node
* They ensure that a copy of a pod is running on every node in the cluster. As the cluster grows and shrinks, the DaemonSet spreads these specially labelled pods across all nodes

### Ingresses

* They route traffic to and from the cluster. Internet <-> many clusters
* They provide a single SSL endpoint for multiple application
* One single external ingress point can accept traffic destined to many different internal services

### CronJobs

* They use common Cron syntax to schedule tasks
* They are part of the Batch API for creating short lived non-server tools
* They schedule the execution of pods, they are a good option for periodic tasks like backups, reports and automated tests

### CRDs

* They define a new resource type and inform Kubernetes about it
* Once a new resource type is added, new instances of that resource can be created
* The programmer can handle CRD changes. A common pattern is creating a custom controller that watches for new CRD instances, and responds accordingly
* CRDs provide an extension mechanism that cluster operators and developers can use to create their own resource type

### Checks

* Liveness check: boolean, whether a pod should be automatically restarted
* Readiness check: boolean, whether the ap is ready to serve

## [Kubernetes basics](https://www.youtube.com/playlist?list=PLLasX02E8BPCrIhFrc_ZiINhbRkYMKdPT)

## practice

1. create deploy.yaml saying how many replicas I want (3)
2. kubectl apply, 3 pods created, containers hosted on 3 VMs
3. App is up and running, now I want to expose it to someone that will consume it. I create a service, a load balancer that takes traffic from the outside world or from another service from inside the cluster and load balances that traffic down to those containers
4. The end-user can talk to the external IP address, traffic flows through the cloud load balancer to my service, the load balanced out to all my containers
5. when scaling up and down, deployment is done in a rolling way. the user doesn't notice anything.
6. When we change the deployment from v1 to v2, it takes some time to make effect. if it was immediate, where replicas are down and new replicas go up, the service might be briefly unavailable. if v2 has flaws and it's deployed immediately, the system crashes. The rollout from v1 to v2 is gradual


The API creates a new replica with v2, if the container passes its liveness check, the system continues to keep that container up and running, but it hasn't been added to the load balancer until the readiness check is passed. at that point, traffic is brought down to this new container.

Now the API tries to delete an old v1 container, but what if that container is receiving traffic or handling user data? With the termination grace period (default: 30s), there is a delay between the order to be deleted until the pod is actually terminated. In this time, the connection to the LB is severed but the container is still running during this period. The user requests being processed by this container are processed, and no new requests come. After 30s, the pod is deleted. Now, the API creates a new v2 pod, liveness check passes, readiness too, a second v1 pod dies, etc.

The deployment process is very configurable, with the amount of pods are inserted at each time.

[Serverless on k8s](https://www.youtube.com/watch?v=xL6lixC4D8Q&list=PLLasX02E8BPCrIhFrc_ZiINhbRkYMKdPT&index=6)

## Scheduler

The infrastructure is a bunch of VMs, the k8s API on top of it, and a pod that you want tke k8s API to run. Which VM should it run on?

The scheduler is continually watching for pods that have been created but not scheduled, it also continually watches the state of all the VMs/machines.

* Predicates: hard constraints, things that can't be violated. like minimum memory the container needs, or that the container should run on SSD
* Priorities: softer constraints, it would be nice if my application was spread over many number of failure domains, and so on. These constraints can be violated if necessary.

## Setting up a k8s build pipeline

You have your source code in a git repository somewhere. the container registry (CR) (azure, docker) is in the cloud. How to set up that the cluster only pulls images from my registry. with the admissions controller, it's a code that you run that validates every request coming to the cluster. In this case, we validate that the image field has myreg.acc.io/*. Writing the admissions controller can be a bit daunting, so the k8s policy controller that given a policy, it creates the admissions controller.

Now how to get our code into the CR. The build pipeline listens to our source control and builds images, it turns the code into the container image. Take the key from the CR to access it, and this key should only be present in your build pipeline and nowhere else. The keys to create pods in the k8s cluster should also be present in your build env, and nowhere else.

The build process should include code review, unit testing, vulnerability scanning (libraries that may have vulnerabilities), credential scanning (if passwords exist in the code), integration testing, etc.

## Volumes and storage in k8s

A volume is associated to the pod but mounted into a container at a particular path.

Simplest volume: a temporary volume associated with the pod (called empty dir), the lifespan of the volume is associated with the pod itself. Used for caching and temporary information.

Persistent volume: can be mapped to an azuredisk or nfs, iscsi or any other persistent volume types. These disks live longer than the lifespan of the pod. If the pod changes machine, these disks follow it around. 

more videos in the youtube playlist

* stateful applications in k8s
* Secret management in k8s
* Configuration management
* Role based access control
* Getting production ready
* Service meshes
* Simple application management with operators
* Monitoring and alerting
* Pods and the pod lifecycle
* Customizing and extending the k8s API with admission controllers

## EKS workshop

Orchestration: from managing one application to managing a set of applications, important when something has a certain scale.

docker: package apps, k8s: shift apps around, pool servers into a pool of resources. instead of thinking of servers, you start thinking in terms of apps.

with container orchestrators, we describe what it should look like when it's done

EKS is Amazon's k8s service, elastic k8s service. 

we can run k8s in aws, in our data center, and we get the same experience.

Nodes are machines that make up a k8s cluster, they can be physical or virtual.

* Control panel-node type, making up a control plane, the brains of the cluster
* Worker node type, making up the data plane, the actual container images (via pods)

Object: records of intent, what we expect to see when everything is perfect. Once created the cluster does its best to ensure it exists as defined. The cluster's 'desired state'. A deployment can be an object.

* Pod: a thin wrapper around 1+ containers. When containers should be scaled together, they should all be in one pod. If not, different pods
* DaemonSet: type of deployment, implements a single instance of a pod on a worker node. for example only worker nodes that have a certain GPU
* Deployment: details how to roll out (or roll back) across versions of your application
* ReplicaSet: ensure a defined number of pods are always running
* Job: ensures a pod properly runs to compilation
* Service: maps a fixed IP address to a logical group of pods
* Label: key/value pairs used for association and filtering

## k8s architecture

**kubectl** is a wrapper around the k8s api. The API connects to the data node via a **kubelet**

## eks

eks cluster creation workflow

1. create eks cluster
    * in eks, just a command
    * in diy mode, creating up the control node takes more work
    * create HA control plane
    * IAM integration
    * certificate management
    * setup load balancer
2. provision worker nodes
3. launch add-ons
4. launch workloads

When you create an eks you target a vpc that's in your account

new user workshop, pass nem
https://361936660388.signin.aws.amazon.com/console
log in with the account id, but workshop username and password

https://us-west-2.console.aws.amazon.com/cloud9/home/product create environment
it opens like a vscode inside aws

my cloud9: name eksworkshop or sth https://us-west-2.console.aws.amazon.com/cloud9/ide/7c52aab599df4afb96d53a138fb27582

```bash
workshop:~/environment $ eksctl delete cluster --name eksworkshop-eksctl
[ℹ]  eksctl version 0.31.0
[ℹ]  using region us-west-2
[ℹ]  deleting EKS cluster "eksworkshop-eksctl"
[ℹ]  deleted 0 Fargate profile(s)
[✔]  kubeconfig has been updated
[ℹ]  cleaning up AWS load balancers created by Kubernetes objects of Kind Service or Ingress
[ℹ]  2 sequential tasks: { delete nodegroup "nodegroup", delete cluster control plane "eksworkshop-eksctl" [async] }
[ℹ]  will delete stack "eksctl-eksworkshop-eksctl-nodegroup-nodegroup"
[ℹ]  waiting for stack "eksctl-eksworkshop-eksctl-nodegroup-nodegroup" to get deleted
[ℹ]  will delete stack "eksctl-eksworkshop-eksctl-cluster"
[✔]  all cluster resources were deleted
```

workshop position: https://www.eksworkshop.com/beginner/050_deploy/

backend crystal and nodejs, frontend ruby

## questions

* last week ecs, today kubernetes. elastic container/kubernetes service
* the environment in aws is it equivalent to the command line in our computer? or special access?


deployment: how it should be deployed, service: how do services in the cluster gain access to this

After running both backend services

```bash
workshop:~/environment/ecsdemo-crystal (master) $ kubectl get pods
NAME                               READY   STATUS    RESTARTS   AGE
ecsdemo-crystal-6d5f6f4b47-6t66n   1/1     Running   0          13s
ecsdemo-nodejs-7dd8987798-n7zjp    1/1     Running   0          20m

workshop:~/environment/ecsdemo-crystal (master) $ kubectl get services
NAME              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
ecsdemo-crystal   ClusterIP   10.100.102.92    <none>        80/TCP    21s
ecsdemo-nodejs    ClusterIP   10.100.179.218   <none>        80/TCP    19m
kubernetes        ClusterIP   10.100.0.1       <none>        443/TCP   34m
```

if we talk to the first IP address from the cluster and on port 80 it will port our traffic into any running pod that this service has, in this case, two. these backend services only get traffic from inside the cluster

now frontend. this service needs to tak traffic external into the cluster --> it needs ingress.

the kubernetes/service.yaml contains type: LoadBalancer: This will configure an ELB to handle incoming traffic to this service. for more sophisticated loadbalancers, we can use ingress

service.yaml for frontend. backend is identical but except the LoadBalancer. Backend has the default type, which is ClusterIP: This Exposes the service on a cluster-internal IP. Choosing this value makes the service only reachable from within the cluster

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ecsdemo-frontend
spec:
  selector:
    app: ecsdemo-frontend
  type: LoadBalancer
  ports:
   -  protocol: TCP
      port: 80
      targetPort: 3000
```

to deploy it

```bash
cd ~/environment/ecsdemo-frontend
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl get deployment ecsdemo-frontend
```

to scale to 3 replicas

```bash
kubectl scale deployment ecsdemo-crystal --replicas=3
```



https://www.eksworkshop.com/beginner/070_healthchecks/


### Hackathon

not good to create a cluster with a user, because then the user can't be removed. if the user is removed, cluster is lost. so one way to do it is creating roles and assigning this role to the cluster, even if the user is removed, the cluster can be accessed

1. assume role
2. create cluster

every time you want to access cluster, run command aws sts assume-role bla bla
save aws_Access_key_id, aws_secret_Access_key, aws_session_token in env variables, restart terminal/vscode.
whenever you assume the role, these 3 variables will change. you need to update them

ekstcl command to create cluster with the role, according to the cluster policy `cluster.yaml` with the vpc id. this config is used to eksctl to create the cloudformation to create the cluster.

load balancer in public subnet, workers in private subnet. and priv+pub x2 to ensure high availability


assume role

```bash
aws sts assume-role --role-arn "arn:aws:iam::529376911423:role hackathon-eks-role" --role-session-name AWSCLI-Session
```

update env variables with these new variables access_id, secret_access_key, session_token to the role's.

the way we did it, I overrule the user credentials in Users/aberasategi/.aws/credentials, so now I 'lost' my user.

```bash
aws eks update-kubeconfig --name hackaton-eksctl-team --region us-east-2
kubectl cluster-info
```

cluster autoscaler when there's more demand, it communicates with aws autoscaler. tags of the aws autoscaler aren't complete


kubectl get all -n default
kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler
kubectl apply -f Desktop/nginx.yaml
kubectl delete deployment cluster-autoscaler -n kube-system

https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html
https://aws.amazon.com/premiumsupport/knowledge-center/eks-cluster-autoscaler-setup/
https://docs.aws.amazon.com/eks/latest/userguide/dashboard-tutorial.html

aws sts assume-role --role-arn "arn:aws:iam::123456789012:role/example-role" --role-session-name AWSCLI-Session

kubectl get pods --all-namespaces

eksctl to create, delete, kubectl to manage