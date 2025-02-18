+++
author = "Nny"
title = "Self-Hosting Series: Part 2"
date = "2025-02-18"
type = "posts"
description = "Docker and Portainer"
tags = [
    "linux",
    "server",
    "self-host",
    "guide",
    "part 2",
]
categories = [
    "linux",
    "guide",
    "diy",
    "docker",
    "portianer",
    "containers"
]
+++
<!--more-->

## Requirements

* Software
  * A Linux distro (Guide is based on Debian)
  * Root access (or a user with sudo privileges)
  * A basic understanding of Linux commands
  * Docker
  * Portainer
* Hardware
  * A good ol' computer (laptop or desktop)



## Intro

Docker is an essential tool for self-hosting, allowing you to deploy and manage applications in isolated environments (containers).

Portainer is a powerful web-based management tool for Docker, making it easier to **deploy** and **manage** containers without complex CLI commands.

In this guide, we’ll walk through installing Docker and Portainer on a Debian system step by step.


## Step 1: Install Docker and Docker Compose

The easiest way to install docker is by running the following script. This will install Docker engine and its dependencies:

**Note**: NEVER run a script without knowing what's inside. Always examine carefully before run.
```bash
curl -fsSL https://get.docker.com | sh
```
**Optional**: If we want to run docker as a regular user and without sudo command, we should add the user to the docker group:
```bash
sudo usermod -aG docker <yourusername>
```
Verify Docker is installed:
```bash
docker --version
```
Next, install Docker Compose:
```bash
sudo apt install docker-compose -y
```
Verify installation:
```bash
docker-compose --version
```
Run the following command to test if Docker is working:
```bash
docker run hello-world
```
If everything is set up correctly, you should see a message confirming that Docker is installed and working.

## 2: Ensure docker is running

Portainer runs as a Docker container, so let's make sure Docker is running:
```bash
sudo systemctl status docker
```
## 3: Create a Docker Volume for Portainer

Portainer stores data in a Docker volume to persist settings and configurations. Create it with:
```bash
docker volume create portainer_data
```
## 4: Deploy Portainer Container

Run the following command to start Portainer as a containerized service:
```bash
docker run -d \
  --name=portainer \
  --restart=always \
  -p 8000:8000 \
  -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```
**Explanation of Flags** :

    -d → Runs the container in detached mode (in the background).
    --name=portainer → Names the container portainer.
    --restart=always → Ensures Portainer starts automatically on reboot.
    -p 8000:8000 → Opens port 8000 for the Portainer agent.
    -p 9443:9443 → Opens port 9443 (default Portainer web UI over HTTPS).
    -v /var/run/docker.sock:/var/run/docker.sock → Allows Portainer to communicate with Docker.
    -v portainer_data:/data → Uses the created volume for storing Portainer’s persistent data.

## 5: Access the Portainer Web UI

Once the container is running, open your browser and navigate to:
```bash
https://your-server-ip:9443
```
You'll see a security warning because Portainer uses a self-signed SSL certificate by default. Click "**Advanced**" → "**Proceed**" to continue.

## 6: Create an Admin User

  On the Portainer setup page , create an admin username and password.
  Click "**Create User**".

Done! Now that docker and Portainer are installed, you can start deploying multiple self-hosted applications with ease! 

## Next Steps in This Series

✅ Deploying services using **Docker Compose** and **Portainer**. (PART 3)

✅ Setting up a cloudflare tunnel.

✅ Connect our server to our private vpn secure access.

✅ Hosting your own media server (Jellyfin/Plex),password manger
and many more!

**Stay tuned** as we turn your server into a **powerful** self-hosted ecosystem! 🚀



