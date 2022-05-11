# Kubernetes course

Video from [Techworld With Nana](https://www.youtube.com/watch?v=s_o8dwzRlu4)

## Architecture

* Main node, contains a handful of important master processes. It's the only point of access to the cluster, so you need a backup of the master
  * API server, entrypoint to k8s cluster. This runs in a container too. Contains UI, API and CLI tools
  * Controller manager: overview of what's happening in cluster, start a new node if another node was terminated, etc.
  * Scheduler: ensures Pods replacement, it decides on which Node new Pod should be scheduled
  * etcd: k8s backing store, config and status data. Contains snapshots of previous states. Holds the current status of any k8s component
* Many worker nodes, each node has kubelet process running. Each node has different amount of containers running
  * High workload and they need many resources

The virtual network spans all the nodes that are part of the cluster

## Components

### Pod

Smallest unit in k8s, it is an abstraction over Docker containers, so you only make contact with the k8s layer. Usually 1 application per pod, like 1 pod for an app and 1 pod for the db. These 2 pods run in a node.

The cluster is in a virtual network so each pod gets its own IP address.

Pods are ephemeral, they die easy and then a new Pod is created in its place and it gets assigned a new IP address.

### Volumes

Stores db data persistently on local machine in pod, or remote (cloud, remote storage). If the Pod dies, the new Pod takes this persistent volume and all data is restored.

K8s doesn't manage data persistance so if you want it, you have to set it up yourself.

### Service

Service is a permanent IP address that can be attached to each pod. Lifecycle of Pod and Service are not connected, the IP address remains after re-creation of Pods.

External service opens the communication from external sources, so the app can be accessible through browser. But you would only certain pods to be open to the public, not the DB. You can create an external service for the external part of the app and internal service for the db. These services are a node-ip followed by a port. But we would want our URL to have a domain name and be secured through HTTPS.

### Ingress

A layer on top of service, the request from the Internet goes to Ingress first, and then to service.

### ConfigMap

ConfigMap is the external config of all your apps. It's connected to the Pod so it reads the URLs for apps that it needs. Db username and password are not appropriate for ConfigMaps, only for non-confidential

### Secrets

Similar to ConfigMap but used to stored secret data like db credentials. This is the default, you can also enable the built-in security mechanism and encrypt it in base64 encoding format.

Secret connects to Pods so they can read the data

### Deployment

K8s replicates everything on different servers. The Service endpoint is the same for both servers, primary and secondary. Kubernetes includes a load balancer.

To set up replication, defined a blueprint/deployment for Pods and specify how many replicas you want to have. In practice you don't manage Pods, you manage Deployments.

If one Pod dies, the service redirects the request to a healthy Pod.

Databases have state (data) so to replicate them, all dbs should access to one storage to avoid data inconsistencies. Deployments used for stateless apps.

### StatefulSet

To use with Stateful apps, mysql, elastic, mongodb. It replicates and scales Pods. Using StatefulSet is harder than Deployments, so people usually host DBs outside k8s cluster and only the stateless apps in the k8s cluster.

### DaemonSet



## Kubernetes configuration

You can send config requests (json/yml) to the API server in the cluster. It's a declarative format, number of pods, replicas, container name, image, envs and ports. What you write in this config, is what it should be. Controller manager checks if the actual state == desired state. If not, it makes adjustments.

Parts of configuration file:

* apiVersion: apps/v1, v1
* kind: Deployment, Service
* metadata
  * Name
* spec -> They are specific to the kind of component we're creating
  * Replicas
  * Selector
  * Template
  * Ports
* Status is automatically generated and added by k8s, and specifies desired vs. actual state. The actual state info comes fron the ´etcd´

Usually config files are stored together with the code.

## Minikube and kubectl setup

In a production setting, we have at least 2 master nodes and several worker nodes.

Minikube is 1 node cluster where master and worker nodes all run in one node, and it's a tool to test and local cluster setup.

Kubectl is a tool to interact with the cluster: create/destroy pods, create services... And it can be used for minikube or cloud cluster

```bash
minikube start
minikube status
kubectl get node
```

Demo: setup of a cluster with a webapp and a mongodb. K8s component overview:

* ConfigMap with the MongoDB endpoint
* Secret with MongoDB user and password
* Deployment + Service for MongoDB app with internal service
* Deployment + Service for webapp with external service

mongo-config.yaml:
```yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongo-config
data:
  mongo-url: mongo-service
```

data: mongo-url is the service name of MongoDB

mongo-secret.yml
```yml
apiVersion: v1
kind: Secret
metadata:
  name: mongo-secret
type: Opaque
data:
  mongo-user: bW9uZ291c2Vy
  mongo-password: bW9uZ29wYXNzd29yZA==
```

Deployment + Service all in one file:

mongo.yml
```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo-deployment
  labels:
    app: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongodb
        image: mongo:5.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME # the env name that mongodb expects
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: mongo-user
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: mongo-password
---
apiVersion: v1
kind: Service
metadata:
  name: mongo-service
spec:
  selector:
    app: mongo
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
```

The template is the configuration for the Pod, it has its own "metadata" and "spec" section.
containers: image is the name of the Docker Image we will be using from the Hub.
labels:app is the name of the app which we can choose what we want, so that all Pods have the common name (even though they all have a unique identifier)
selector:matchLabels identifies a set of resources, and selects which Pods belong to Deployment. In this case, all Pods that match the name `mongo` belong to this deployment.
`---` is a yaml separator, after that we have the service.

The requests will access the Mongo service `port` which is 27017. This service will call the `targetPort`, which port to forward the request to the Pods, which is 27017, which has to match the `containerPort`. It's common practice to have all the same ports for everything.

webapp.yml
```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-deployment
  labels:
    app: webapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nanajanashia/k8s-demo-app:v1.0
        ports:
        - containerPort: 3000
        env:
        - name: USER_NAME
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: mongo-user
        - name: USER_PWD
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: mongo-password
        - name: DB_URL
          valueFrom:
            configMapKeyRef:
              name: mongo-config
              key: mongo-url
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  type: NodePort # this makes the service external
  selector:
    app: webapp
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30100 # NodePort type requires a nodePort, and it has to be in a range. exposes the Service on each Node's IP at static port -> <NodeIP>:<NodePort>
```

To apply, in order:

```bash
kubectl apply -f mongo-config.yml
kubectl apply -f mongo-secret.yml
kubectl apply -f mongo.yml
kubectl apply -f webapp.yml
```


To interact with cluster:

```bash
kubectl get all
kubectl get configmap
kubectl get secret
kubectl describe pod POD_NAME
kubectl logs POD_NAME
```