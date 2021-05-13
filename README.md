# Docker Lab

What is Docker? Docker is what virtualization to servers is, but for applications. Similar to the revolutionary changes when we were able to decouple the operating system from the physical machine, we're now able to decouple the application from the operating system. In traditional environments, in order to scale an application, it often meant deploying more virtual machines to host the application. With that methodology, the struggle became managing all of the application machines, patches, dependencies, programming language versions, and reliability.

Containerization is used to manage the application regardless of the hardware or operating system. This allows developers to bundle their code, desired operating system, dependencies, and other required files in a single image. That image can then be distributed and run on any Docker runtime environment.

We're going to dive into the lifecycle of a Docker container. Here are a few fundamental terms that will be used throughout this readme.

Docker Image - This is the foundation of Docker. A Docker image is like a snapshot of a operating system, files, dependencies, configuration, application code, and more. Docker allows you to use public images, which can be found on [Docker Hub](https://hub.docker.com) or private images, which are created by an organization and stored in a private image repository.

Image Repository - This is a collection of images. Repository will have a particular image with various tags. The tags are used to determine which particular image you want to use. Tags are applicable to the lifecycle of the container. You may have a container with the "latest" which may be the latest version of your production app. Image repositories can be public or private. Many popular software titles provide a public version of their container with various versions and tags. For instance, if you're using Postgres, you can use proper tag for the version you require for your application.

Container - A container is a running image. A "container" can run on a virtual machine using IaaS, or many PaaS services including App Services, Azure Container Instances, Azure Kubernetes Service, and more. A container should only run a single process and when that process ends, the container will be stopped automatically.

## Getting Started

The lab will cover a few topics which will require a few components. First, if you want to load your Docker image to a public repository, you will need a [Docker Hub](https://hub.docker.com) account, which is free. You will also need Docker installed on your local machine. If you're running Windows, you can install Docker Desktop for Windows, which will require Hyper-V to be installed. 

We will follow the Docker container lifecycle with a simulated SDLC. We will start with making changes to some code in a branch, then put or code changes in a Docker image, and push the Docker image to Docker Hub. Once the image is on Docker Hub, we can download the image and run it on our local machines OR on another workstation.

## The Code

This lab will use a very simple NodeJS address book application. The NodeJS application uses a local json file for its address book contents and provides a simple web interface to read all the entries in the address book. Although this application is written in NodeJS, the process is largely the same across most programing languages.

### Step #1

Start by cloning of forking this repository. This single repo has everything we will need for this lab. This repo will likely be updated to support additional labs in the future, so keep an eye out for those as well.

Once you have the code cloned, we can begin working with Docker.

### Step #2

Create a new Docker Image. The Docker Image is a snapshot of everything required to run the application. In this demo, we need the latest version of NodeJS, the NPM dependencies which are identified in the address-book-app/package.json file, and the application code itself. We can use a Dockerfile to intrust Docker on how to build the image including what files are required and the commands that must be ran to setup the application in the container image.

Lets review the Dockerfile in this root of this repo.

```Dockerfile
# Identify the base image - https://hub.docker.com/_/node
# in this case, we're going to use the official node image running on Alpine Linux
FROM node:alpine

# Specify the working directory for your application
WORKDIR /usr/src/app

# instruct docker to copy the required files from the local filesystem
COPY ./address-book-app .

# run the npm install command to download the required dependencies
RUN npm install

# expose a tcp port to the container allowing network connectivity to a specific port
EXPOSE 3000

# provide the command required to start the application process inside the container
CMD [ "node", "server.js" ]
```

Using this Dockerfile will result in an image with our application, dependencies, and the latest version of the NodeJs runtime.

### Step #3

Now that we have a Dockerfile, we can use that to create our image. This requires a command to be ran on a Docker host, either running locally or a remote host. When building a Docker image, we can add tags to more easily identify the image on our system or others. Lets create the image with a tag that identifies our docker hub username, the repository, and the version.

```bash
docker build . -t tpeterson66/docker-lab:latest
```

When you run the command, it will download the base image to your local machine, in this case, it will download node:alpine. After the image is download, Docker will follow the instructions in the Dockerfile to build the image.

You can add additional tags when building the image or after the image is built. You do not have to provide the username or repository, however, it makes it more identifiable.

We can verify the image was created by running the following command:

```bash
docker images

# ================================= SAMPLE OUTPUT =================================
# REPOSITORY                                      TAG       IMAGE ID       CREATED          SIZE
# tpeterson66/docker-lab                          latest    d4f19fef016c   40 seconds ago   129MB
```

### Step #4

Now that we have the image on our local machine, we can upload our image to Docker Hub using a public repository. This step is not required, if you would like to skip uploading your image to Docker Hub, you can proceed to the next step. If the image contains real application code, consider using a private repository instead. We can use the following commands to upload our image.

```bash
docker login
# enter your account credentials
docker push tpeterson66/docker-lab:latest
```

Make sure you update the command to include your username and repository name. If you get an error back, you may have to create the repository first before you can push to it, especially if you're using a private repository on Docker Hub or a private registry like Azure Container Registry.

You can confirm the image has been pushed to the repository and at this point, anyone with access can download the image and use it in their environments.

### Step #5

The next step would be to run the container to access the application and begin using the container. This can be done on either the same machine used to build the image or any other machine running Docker. For this lab, go ahead and use the same machine and run the following commands to start your contianer.

```bash
docker run -d -p 3000:3000 tpeterson66/docker-lab:latest
```

The docker run command takes a few arguments to start a container. In this example we use the -d flag to run the contianer as a deamon, which will allow the container to run in the background and will not tie up current terminal session. The -p 3000:3000 command is used to expose port 3000 on the local machine to port 3000 of the container. Without the -p argument, the container will have no inbound network connectivity. The last argument of the command is the image. Since we created the image with a tag, we can use that tag in the command. By default, if you provide the image name without a tag, it will use the "latest" tag.

To confirm your container is running, you can run the following commands:

```bash
docker ps
# This will output a list of the running containers on the docker host
# if you do not provide a container name in the run command, docker will provide a friendly name for the container.
# These are usually pretty funny!

docker ps -a
# This will output a list of all containers on the host including stopped and running containers

docker logs -f <container name>
# will allow you to follow the logs from the container

docker stats
# provide an output of current resource usage of the running containers
```

### Step 6

Now that we have the container running, we can access the application by browsing to <https://localhost:3000> of the machine running Docker. You will be able to see the application, which is the simple address book reading a local file in the container.

When you're all done testing the application, reviewing the logs, etc. go ahead and use the following commands to cleanup your environment.

```bash
docker stop <container name>
# this will stop the container

docker rm <container name>
# this will remove the docker container from your local system

docker image prune
# this will remove all unused images from your local machine
```

## Review

This concludes the steps required to build an image, start a new container, and access the application. Additional automation can be used to increase the efficiency of this process including CI/CD. Lets quickly review what we learned.

* Images are the basis of containerization
* Dockerfiles are used to instruct Docker on how to build the image for us
* Tags are added to images to be able to identify them within the repository
* Multiple tags can be applied to the same image
* A container is just a running image

What's Next?

If you're up for a challenge here are some things you can do to increase your proficiency around Docker.

1. Make a minor change to the code and repeat the process to see if your changes make it to the new image. You will need to provide a different tag or you will overwrite your latest tagged image.
2. Explore other Docker Hub images and how to start containers using the public image
3. Look into CI/CD possibilities to build and push the image
4. Dive into Kubernetes to host your container applications
5. Look into Docker Compose to build multiple images for an entire solution

## Considerations

* A single container should only run a single process and when that process ends, the container should stop.
* By default, no network access is allowed to a container, you must define and expose the required ports in the Dockerfile.
* Files stored in the container are removed when the container is deleted unless stored in an attached volume.
