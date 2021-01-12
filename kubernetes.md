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
