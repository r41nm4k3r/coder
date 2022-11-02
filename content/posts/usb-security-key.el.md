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

Στη συνέχεια εισάγουμε το GPG key δίνοντας την εντολή:

```bash
sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 913558C8A5E552A7
```
Τέλος κάνουμε update τα repo του συστήματος και υστερα εγκαθιστουμε το pam_usb:

```bash
sudo apt update && sudo apt install libpam-usb -y
```

## Προσδιορίστε τη μονάδα USB

Πρώτα πρέπει να αναγνωρίσουμε τη μονάδα usb μας. Ανοίγουμε ένα τερματικό και δίνουμε:

```bash
lsusb
```
Στην περίπτωσή μας βλέπουμε: 

```bash
Bus 002 Device 014: ID 14cd:1212 Super Top microSD card reader (SY-T18)
```

## Διαμόρφωση του pam_usb
Το Pam_usb συνοδεύεται από ένα σετ πολύ εύχρηστων εργαλείων που διευκολύνουν τη διαμόρφωση.


  * **pamusb-agent**: ενεργοποίηση ενεργειών (όπως το κλείδωμα της οθόνης) κατά τον έλεγχο ταυτότητας και την αφαίρεση της συσκευής.
  * **pamusb-conf**: βοηθός διαμόρφωσης.
  * **pamusb-check**: ενσωματώστε τη μηχανή ελέγχου ταυτότητας του pam_usb στα σενάρια ή τις εφαρμογές σας.
  * **pamusb-keyring-unlock-gnome**: βοηθητικό πρόγραμμα για ξεκλείδωμα του gnome-keyring κατά τη σύνδεση με pam_usb

Έχοντας το usb συνδεδεμένο εκτελούμε την εντολή:
```bash
sudo pamusb-conf --add-device DEVICE_NAME
```
Αντικαταστήστε τη συσκευή "DEVICE_NAME" με το όνομα της επιλογής σας.

Το αποτέλεσμα θα ειναι κάπως ετσι:

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
Εάν αυτή είναι η συσκευή που θέλετε να χρησιμοποιήσετε, πατήστε Y και ύστερα enter.
Εάν έχουν εντοπιστεί πολλές συσκευές, επιλέξτε αυτή που θέλετε να χρησιμοποιήσετε.

Στη συνέχεια προσθέτουμε τον χρήστη. Αυτό μπορεί να γίνει είτε χειροκίνητα με επεξεργασία του αρχείου **pam_usb.conf** είτε αυτόματα χρησιμοποιώντας ξανά το εργαλείο pam_usb-conf:

```bash
sudo pamusb-conf --add-user USERNAME
```
Ομοίως, αντικαταστήστε το "USERNAME" με το όνομα χρήστη σας.

Για να ελέγξουμε εάν ο χρήστης και η αφαιρούμενη μονάδα έχουν ρυθμιστεί σωστά, μπορούμε να εκτελέσουμε την εντολή:

```bash
pamusb-check <your_username>
```
### ΤΕΛΕΙΩΣΑΜΕ!

Αυτή ήταν η βασική ρύθμιση, αλλά αν θέλετε να ελέγξετε περαιτέρω επιλογές, μπορείτε να επισκεφτείτε τη [σελίδα](https://github.com/mcdope/pam_usb/wiki/Configuration).

## Κλείδωμα οθόνης όταν το usb είναι αποσυνδεδεμένο

Ένα από τα πιο εύχρηστα χαρακτηριστικά του pam_usb είναι ότι μπορεί να εκτελέσει μια εντολή ή ένα script χρησιμοποιώντας συμβάντα ενεργοποίησης. Αυτό μπορεί να γίνει χρησιμοποιώντας τον παράγοντα pamusb-agent.

Πρώτα πρέπει να δημιουργήσουμε 2 script. Το ένα θα κλειδώσει την οθόνη όταν αποσυνδέσουμε το usb και το δεύτερο θα ξεκλειδώσει την οθόνη όταν το συνδέσουμε ξανά. Δημιουργήστε το script "lock" και "unlock" και αποθηκεύστε τα στο **/usr/local/bin/**.

Τα scripts είναι πολύ απλά.

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
Αντικαταστήστε το "USERNAME" και στα δύο scripts με το όνομα χρήστη που χρησιμοποιήσατε για τη διαμόρφωση του κλειδιού ασφαλείας usb.

Τέλος επεξεργαστείτε **/etc/security/pam_usb.conf** και προσθέστε τη θέση των δύο scripts στην ενότητα **user id"**. Το αποτέλεσμα θα είναι κάπως έτσι:

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
Μην ξεχάσετε να αντικαταστήσετε το "USERNAME" με το όνομα χρήστη που χρησιμοποιήσατε για τη διαμόρφωση του κλειδιού ασφαλείας usb.

Αυτό είναι! Κάντε επανεκκίνηση και δοκιμάστε το νέο κλειδί ασφαλείας σας.


