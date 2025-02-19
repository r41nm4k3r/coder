+++
author = "Nny"
title = "Self-Hosting Series: Intro"
date = "2025-02-18"
type = "posts"
description = "Basic configuration"
tags = [
    "linux",
    "server",
    "self-host",
    "guide",
    "part 1",
]
categories = [
    "linux",
    "guide",
    "diy"
]
+++
<!--more-->

## Requirements

* Software
  * A Linux distro (Guide is based on Debian)
  * Root access (or a user with sudo privileges)
  * A basic understanding of Linux commands
* Hardware
  * A good ol' computer (laptop or desktop)



## Intro

The cloud is convenient, but self-hosting gives you full control over your data, enhances security, and often reduces costs. This guide kicks off a **series on self-hosting**, covering everything from setting up a **Linux server** to deploying services like password managers, media servers, and cloud storage solutions.

In this first guide, we'll walk you through preparing a Linux server—laying the foundation for secure and reliable self-hosted applications. Whether you're using **a dedicated server, VPS, or a home server**, these steps will ensure your system is optimized, secure, and ready for deployment.



## Step 1: Connect to Your Server via SSH

If you're using a remote VPS or dedicated server, connect via SSH:
```bash
ssh user@your-server-ip
```
For a local machine, just open a terminal.

## Step 2: Update/Upgrade the System and install essential tools

Ensure your server has the latest security patches:
```bash
sudo apt update && sudo apt upgrade -y
```
Next we will install some essential tools:
```bash
sudo apt install curl wget git unzip -y
```
## Step 3: Create a New User (For Security)

Using the default root user is risky. Create a new user and assign privileges:
```bash
adduser <yourusername>
usermod -aG sudo <yourusername>
passwd <yourusername>
```
Now lets add our new user to the sudo group:
```bash
sudo usermod -aG sudo <yourusername>
```
Now switch to the new user:
```bash
su - <yourusername>
```
**Note**: Do not forget to change the "yourusername" with a name of your own choosing.

## Step 4: Configure SSH for Security

Edit the SSH configuration file:
```bash
sudo nano /etc/ssh/sshd_config
```
Uncomment the following:
```bash
PermitRootLogin no  
PasswordAuthentication no  
```
Save and restart SSH: 
```bash
sudo systemctl restart ssh
```
## Step 5: Reboot and Verify Everything

That's it! Reboot and test your new security key.
```bash
sudo reboot
```
After rebooting, reconnect via SSH and verify system access.


That's it! We finished the basic configuration of our **personal server**.

## Next Steps in This Series


With our Linux server configured, we are ready to self-host applications. In the next guides, we'll cover:

✅ Install & configure containers using **Docker** and **Portainer**. ([**part 2**](https://nnyx.io/projects/self-hosting-part-2/))

✅ Setting up a **Cloudflare** tunnel.

✅ Connect our server to our private vpn secure access.

✅ Hosting your own media server (Jellyfin/Plex),password manger
and many more!

**Stay tuned** as we turn your server into a **powerful** self-hosted ecosystem! 🚀



