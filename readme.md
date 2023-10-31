

## difference between Docker compose & K8s
1.1 compose - Each entry can optionally get docker compose to build an image
1.2 k8s - Kubernetes expects all images to already be built

2.1 compose- Each entry represents a container we want to create
2.2 k8s - One config file per object we want to create

3.1 compose - Each entry defines the networking requirements
3.2 k8s - We have to manually set up all networking

## Local kubernetes development
- **install Kubectl:** CLI for interacting with our master
- **Install a VM driver virtualbox:** Used to make a VM that will be your single node
- **Install minikube**: Runs a single node on that vm

## Working with K8s:
- Development: Minikube
- Production: Amazon Elastic Container(EKS), Google Cloud Kubernetes Engine (GKE), Do it yourself


*kubectl*- used for managing containers in the (local + prod)
*minikube*- used for managing the VM itself (local)

## Kubernetes what and why:
1. **What**: System for running many different containers over multiple different machines
3. **Why**: When you need to run many different containers with different images

## Multi container application:
Workflow:
- user --> submit-number--> React app -->Express server -->Redis <----> Worker
-                                                       -->Postgreess
## Multi step  Docker builds:
**Build phase**
- use node:alpine
- copy the package.json file
- install dependencies
- run npm build

**Run phase**
- use nginx
- copy over the result of 'npm run build' (previous stage)
- start nginx

## Why do we need nginx:
While we can use development server to develop our application, but the development server is not used in production. For example, react application uses webpack as its web server for the local development. But when we make a production build using   `npm run build`, it only prepares the correponding html and js file. So there is no web server for production build. Here we need an aditional web server like nginx to serve the html and js file. 

Thus we need a nginx server.


## Docker Volume:
Docker volume is essentially a folder mapping from local environment to docker container much like port mappin g.

Syntax:
`docker run -p 3000:3000 --name=container_name -v /app/node_modules -v $(pwd):/app image_name/id`

- `-v $(pwd):/app` meaning map the present working directory into the app folder
- `-v /app/node_modules` meaning put a bookmark on the node_modules folder

## Hot module reloading
We come to this problem often when we change something in the local environment, the corresponding docker container does not reflect the changes. First of all it is the normal behaviour as we haven't specified any instruction to propagate those changes in the container. Morever, when we build an image we took a snapshot of the local environment and build an image out of that. This image with the snapshot of the local environment then forms a container. So there is no direct communication between the container and local codebases. So whenever we change something the chaged code refection doesn't happen in the container.

**The solution is to use Docker volume** which enables us to propagate changes in local environment to docker container. Docker volume is similar to port mapping. For docker volume it is folder mapping.

## Development workflow:
Developement --> Test--> Deploy (repeat the process) 

Flow specification:                    

Developer <--> Feature branch --->(pull request)---> Master branch ---> Travis CI(Tests run)---> Merge PR with master - --> Code pushed to Travis CI ---> Deploy to AWS elastic beanstock (Hosting)


## Docker compose commands:
- `docker-compose up` equivalent to `docker run image_name/id`
- `docker-compose up --build` equivalent to `docker build . + docker run image_name/id`
- automatic container restart:
    - add `restart :always/on-failure/unless-stopped` configuration in the container
    
## Docker compose:
- A separate CLI that gets installed along with Docker
- Used to start up multiple Docker Containers at the same time
- Automates some of the long winded arguments we were passing to docker run

docker build -t imran/web-app . && docker run  -p 5000:5000 imran/web-app --> docker-compose.yml --> docker-compose CLI 

## Minimizing cache busting:
By default, when we build an image from a docker file, Docker keeps track of every line in dockerfile and tries to use cache. Any corresponding line represents a change, it will try to rebuild the consequtive lines instead of using caching. We should try to avoid such cases so that all build process happenning again.
## Docker build vs docker create vs docker start vs docker run
- `docker build .` converts your Dockerfile into an image.
- `docker create image_id/name` creates a container from your image from step 1.
- `docker start container_id` starts the container from step 2.
- `docker run image` is a shortcut for 2. and 3. (`docker create image + docker start container_id`).

## Difference between image and container:

- **Image**: An image is a specified snapshot of your filesystem and includes the starting command of your container. An image occupies just disk-space, it does not occupy memory/cpu. To create an image you usually create instructions how to build that image in aDockerfile. FROM and RUN commands in the docker file create the file-snapshot. One may build an image from a docker file with `docker build <dockerfile>`

- **Container**: You can create new containers with an image. Each container has a **file-snapshot** which is based on the file-snapshot created by the image. If you start a container it will run the command you specified in your docker file CMD and will use part of your memory and cpu. You can start or stop a container. If you create a container, its not started by default. This means you can't communicate to the container via ports etc. You have to start it first. One may create an container from an image by `docker create <image>`. When a container has been created it shows the id in the terminal. One may start it with` docker start <container_id>`

## Port mapping:
- Port mapping is very crucial as it allows to forward requests from the host machine to the container port.
- By default containers have access to outside world(i.e network access) but Host machine by default do not have access to containers network. So we have to strictly follow this rules in order communicate the request from host machine to container
- Port mapping COMMAND:
    `docker run -p host_port:container_port image_name/id`
- Port forwarding stuff is only a runtime constraint. so no need to add port mapping in docker file instead use `docker run -p host_port:container_port` command

## Manual Image generation from a docker container with docker command:
- Linux version: `docker commit -c 'CMD ["redis-server"]' CONTAINERID`
- Windows version: `docker commit -c "CMD 'redis-server'" CONTAINERID`

## Creating a docker file:
- Dockerfile: Configuration to define how should our container behave
    - Dockerfile --> Docker client --> Docker server --> usable image --> run image --> container
    - Steps to create a Dockerfile:
        1. specify a base image
        2. Run some commands to install additional programms
        3. Specify a command to run on container startup
    - The most important instructions are:
        1. `FROM` **base-image**
        2. `RUN`  **instruction to install any dependency**
        3. `CMD` **[Tell the image what to do when it starts as container]**
- Docker file create command: `docker build dockercontext` or if Dockerfile is on root directory  `docker build .`
- To add a docker image name(aka tag) simply add a tagname like this `docker build -t imran/redis:latest .` The convention is used for image tag as follows:
    - your_docker_id/repo_or_project_name:version
- To build a custom named docker file:
    - `docker build -t imran/react -f Dockerfile.dev(custom name) .`
        

## Docker commands:
- **creating and running a container from an image**:  `docker run imagename`
- `docker run` = `docker create` + `docker start`
    - create a container: `docker create imagename`
    - start a container: `docker start -a container_id` optional -a (attach the output of the container to our terminal)
- **Delete all the exited containers**: `docker system prune` the command is executed for the below criteria
    - all stopped containers
    - all networks not used by at least one container
    - all dangling images
    - all dangling build cache
- **Retrieving log outputs after starting a docker container**: `docker logs container_id`
- **Stop a container**: `docker stop container_id` ( emits `sigterm- terminate signal`, essentially tell the docker container to stop the process which takes **a little bit of time** . So when a stop container command is issued, it takes max 10 seconds to stop. if the time exceeds and docker container is not stopped, it automatically fallbacks to the kill command)
- **Kill a container**: `docker kill container_id` (emit `sigkil- kill signal`, essentially tell the docker container to stop **immediately**)
- **Executing commands in running container**s: `docker exec -it container_name command`
- `-it` flag meaning:  `-i` represents interactive mode(keeping standard stream) `-t` represents terminal. In short combining both we can interact with command executed by  `docker exec -it container_name command` in a terminal by giving standard input
- creating a container from image and entering it's terminal: `docker run -it imagename command`

## How docker runs a container?
- Docker container is an instance of a running image. When we run an image:
    - The command gets executed in docker client(i.e. terminal)
    - The client run the command in docker server(i.e. docker daemon)
    - Docker server checks a local copy of that image in image cache
    - If the image is found it runs the image and a container gets created.
    - If the images is not found docker server try to pull the image from docker hub and save that image into the local image cache
    - Now the image is saved in the local image cache and get executed and a container is created.
- The orchestration of how it is happend [url]("https://drive.google.com/file/d/1kzP__HR-EqtqylMyI7zqCKEuPluYNZOY/view?usp=sharing")

## What is Docker?
- Docker makes it really easy to install and run software without worrying about setup or dependencies. Docker is a platform or ecosystem around creating and running containers.
    - **Docker Image**:  Single file with all the deps and configs required to run a program
    - **Docker Container**: Instance of an image runs a program
    - **Docker client**: Docker CLI (Tool that we use to issue commands)
    - **Docker Server**: Docker Daemon(Tool that is responsible for creating for creating images, running containers etc)
    - **Docker Machine**
    - **Docker Hub**: A central place where public image is stored, much like github
    - **Docker compose** 

## Keywords:
- **namespaces**: Isolating resources per process or group of process (i.e. processes, harddrive, network, users, hostname, inter process communication)
- **control groups**: Limits amount of resources(memory, cpu usage, HD I/O, Network bandwidth ) used per processes. Namespacing and control groups are belong to linux not in mac or windows

