+++
author = "Nny"
title = "Φτιάξε το δικό σου Linux usb security key"
date = "2022-11-01"
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

## Απαιτήσεις

* Software
  * Μια Linux διανομή
  * Pam_usb
  * Δικαιώματα Root ή Sudo
* Hardware
  * Ένα κοινό usb flash drive ή Memory Card (δεν μας ενδιαφέρει η χωριτικότητα)



## Εισαγωγή

Πρόσφατα ένας φίλος μου, ο οποίος δουλεύει σε εταιρικό περιβάλλον, με ρώτησε αν υπάρχει τρόπος να κλειδώνει και να ξεκλειδώνει τον υπολογιστή
του οταν κανει διάλειμμα, χωρις να πληκτρολογει το password του καθως υποψιάζεται οτι κάποιος συνάδελφός του τον παρακολουθεί καθε φορα που πληκτρολογεί.

Η λύση είναι αρκετά απλή. Ένα **usb security key** χρησιμοποιόντας το **pam_usb module**.

Πριν ξεκινήσουμε πρέπει πρώτα να βεβαιωθούμε οτι έχουμε ολα τα απαραίτητα εργαλεία. 

Σε αυτόν τον οδηγό θα χρησιμοποιήσουμε το pam_usb module σε Debian 11 με Gnome και GDM. (Υποστηρίζεται απο όλες τις βασικές διανομές) και έναν card reader με μια καρτα μνήμης των 2Gb. Μπορείτε να χρησιμοποιησετε οποιο άλλο αποθηκευτικό μέσο θέλετε αρκεί το συστημά σας να έχει δυνατότητα εγγραφής σε αυτό. 

## Εγκατάσταση του pam_usb

Το Pam_usb είναι PAM module που μας επιτρέπει να χρησιμοποιούμε έλεγχο ταυτότητας υλικού χρησιμοποιώντας ένα κανονικό flash drive USB ή μια κάρτα SD. Εφόσον ο αρχικός προγραμματιστής σταμάτησε την περαιτέρω ανάπτυξη, θα χρησιμοποιήσουμε το fork του Mcdope που είναι ένα αρκετά ενεργό έργο.

Υπάρχουν 2 τρόποι για να εγκαταστήσετε το pam_usb στο σύστημά σας. Μπορείτε είτε να το δημιουργήσετε από την πηγή είτε να χρησιμοποιήσετε τον διαχειριστή πακέτων διανομής. Χρησιμοποιώ το δεύτερο καθώς είναι πιο εύκολο, αλλά όποιο απο τα δυο και να επιλέξετε είναι εντάξει.

In order to install pam_usb using package manager go to Mcdope's [page](https://apt.mcdope.org/) and download the latest libpam-usb binary from the list.

Για να εγκαταστήσετε το pam_usb χρησιμοποιώντας το διαχείριστη πακέτων, μεταβείτε στη [σελίδα] του Mcdope (https://apt.mcdope.org/) και κατεβάστε το πιο πρόσφατο αρχείο libpam-usb από τη λίστα.

Μπορείτε επίσης να προσθέσετε το repo του ΜcΔope στο σύστημά σας. Απλώς επεξεργαστείτε το **/etc/apt/sources.list** και προσθέστε την ακόλουθη γραμμή στο τέλος του αρχείου:

```bash
deb https://apt.mcdope.org/ ./
```

ΠΡΟΣOXH!!! Υπάρχει ένα κενό πριν από την τελεία και την κάθετο στο τέλος της γραμμής.

Στη συνέχεια εισάγουμε το signature key δίνοντας την εντολή:

```bash
sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 913558C8A5E552A7
```
Τέλος κάνουμε update τα repo του συστήματος και υστερα εγκαθιστουμε το pam_usb:

```bash
sudo apt update && sudo apt install libpam-usb -y
```

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

Next we add the user to the pam_usb configuration. This can be done either manually by editing the pam_usb.conf file or automatically by using again the pam_usb-conf tool:

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


