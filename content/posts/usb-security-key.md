+++
author = "Nny"
title = "Build your own Linux usb security key"
date = "2022-11-01"
description = "Sample article showcasing basic Markdown syntax and formatting for HTML elements."
tags = [
    "linux",
    "usb",
    "security",
    "key",
]
categories = [
    "linux",
    "security",
    "diy"
]
+++
<!--more-->

## Requirements

* Software
  * A Linux distro
  * Pam_usb
  * Root privilleges or Sudo
* Hardware
  * A common usb flash drive or Memory Card (no need for specific storage capacity)



## Intro

Recently a friend of mine, that works in a corporate environment, asked me if there is a way to lock or unlock his workstation when takes a break, but without using a password since he suspects that one of his collegues is watching every time he types something.

The solution is pretty simple and free. A **usb security key** using the **pam_usb module**.

Before we start building our usb security key we need to ensure that we have all the necessary software and hardware. 

In this guide we use pam_usb on Debian 11 Gnome/GDM (works on all major distros as well) and a card reader with a 2Gb memory card. Feel free to use any usb flash drive or memory card you like as long as you have write permissions on the storage medium. 



## Install pam_usb

Pam_usb is a PAM module that allow us to use hardware authentication using a regular usb flash dirve or an sd card. Since the original developer stopped further development we will use the Mcdope fork which is a pretty active project.

There are 2 ways to install pam_usb on your system. You can either build it from the source or use your distro package manager. I use the latter as it s easier but either is fine.

In order to install pam_usb using package manager go to Mcdope's [page](https://apt.mcdope.org/) and download the latest libpam-usb binary from the list.

You can also add the mcdope repo on your system. Just edit **/etc/apt/sources.list** and add the following line at the end of the file:

```bash
deb https://apt.mcdope.org/ ./
```

BE CAREFUL!!! There is a space before the dot and slash at the end of the line.

## Identify usb drive

First we need to identify our usb flash drive. I order to do so open a terminal and run:

```bash
lsusb
```
In our case we see: 

```bash
Bus 002 Device 014: ID 14cd:1212 Super Top microSD card reader (SY-T18)
```

## Configure pam_usb
Pam_usb comes with a set of very handy tools that make the configuration easier.


  * **pamusb-agent**: trigger actions (such as locking the screen) upon device authentication and removal.
  * **pamusb-conf**: configuration helper.
  * **pamusb-check**: integrate pam_usb's authentication engine within your scripts or applications.
  * **pamusb-keyring-unlock-gnome**: utility to unlock the gnome-keyring on login with pam_usb

Having the usb plugged in we run the command:

```bash
sudo pamusb-conf --add-device DEVICE_NAME
```
Replace the "DEVICE_NAME" with the name of your choice.

The output will be similar to this:

```bash
Please select the device you wish to add.
* Using "Mass Storage Device (121220160204)" (only option)

Which volume would you like to use for storing data ?
* Using "/dev/sdc1 (UUID: 5652-8CAC)" (only option)

Name		: DEVICE_NAME
Vendor		: Mass
Model		: Storage Device
Serial		: 121220160204
UUID		: 5652-8CAC

Save to /etc/security/pam_usb.conf? [Y/n]
```
If this is the device you want to use, hit Y and press enter.
If there are multiple devices detected then choose the one you would like to use.

Next we add the user to the pam_usb configuration. This can be done either manually by editing the **pam_usb.conf** file or automatically by using again the pam_usb-conf tool:

```bash
sudo pamusb-conf --add-user USERNAME
```
Again, replace the USERNAME with your username.

In order to check if the user and removable drive have been set correctly we can run the command:

```bash
pamusb-check <your_username>
```
### DONE! 
That was the basic setup but if you want to check further configuration options feel free to visit the configuration [page](https://github.com/mcdope/pam_usb/wiki/Configuration).

## Lock screen when usb is unplugged

One of the most handy feature of pam_usb is that it can execute a command or a script using trigger events. This can be done by using the pamusb-agent.

First we must create 2 scripts. One will lock the screen when we uplug the usb and the second will unlock the screen when we plug it back in. Create the "lock" and "unlock" script and save them at **/usr/local/bin/**.

The scripts are very simple.

**Lock:**

```bash
#!/bin/sh

SESSION=`loginctl list-sessions | grep USERNAME | awk '{print $1}'`

if [ -n $SESSION ]; then

        loginctl lock-session $SESSION

fi
```
**Unlock:**

```bash
#!/bin/sh

SESSION=`loginctl list-sessions | grep USERNAME | awk '{print $1}'`

if [ -n $SESSION ]; then

        loginctl unlock-session $SESSION

fi
```
Replace "USERNAME" in both scripts with the username you used configuring the usb security key.

Finally edit **/etc/security/pam_usb.conf** and add the location of the two scripts at the **<user id>** section. The result will be something like this:

```bash
<user id="USERNAME">

		<device>DEVICE_NAME</device>

		<!-- When the user "USERNAME" removes the usb device, lock the screen -->

		<agent event="lock">

        		<cmd>/usr/local/bin/lock</cmd>	        		 	

    		</agent>

    		<!-- Resume operations when the usb device is plugged back and authenticated -->

    		<agent event="unlock">      		

        		<cmd>/usr/local/bin/unlock</cmd>        		

    		</agent>

</user>
```
Do not forget to replace "USERNAME" with the username you used configuring the usb security key.

That's it! Reboot and test your new security key.


