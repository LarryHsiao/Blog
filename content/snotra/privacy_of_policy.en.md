+++
title = "Snotra PRIVACY POLICY"
description = "What data Snotra handles: only on your phone while signed out, on a server in Japan once you sign in, and how to delete your data and account."
path = "en/snotra/privacy_policy"
template = "about.html"
+++

Last Updated: 2026/10/27

Snotra is a client relationship management app. You can use it **without creating an account**, and your data stays only on your phone; if you want to sync across several devices, you create an account then. This policy explains, for each of the two cases, where your data is kept, who can see it, and how to delete it.

## 1. What data we handle

What you enter in the app:

- Contacts: name, phone number, notes, group
- Groups (name, follow-up interval in days), quick-pick tags, gift catalogue
- Meeting and gift records (date, tags, notes, gifts given)
- Important dates (name, date, whether it repeats every year, how many days ahead to remind you)
- Reminder time-window settings

This contact data is **personal data of your clients or friends**. You are the one who manages it, so please make sure you have the right to collect and use it.

Only when you create an account:

- Email address and password (the password is stored only as a bcrypt hash; the server does not keep the plain-text password)
- The device token used for push notifications (push token), and the reminder window and time zone you set

The app contains no ads and no analytics or crash-reporting tools, and it does not track you.

## 2. Where your data is kept

**When you are not signed in:** The app can be opened and used without an account (on first launch you go straight in, and the app reminds you that signing in keeps your data and syncs it across devices). All data exists only on your phone, in the app's folder, and on most phones it is protected by the phone system's storage encryption (a screen lock must be set); the app does not encrypt the database separately.
The data does not leave your phone, and the app does not connect to Google's push service until you sign in. Reminders are scheduled locally on the phone, and the notification text is generic and does not contain contact names.

**After you sign in:** The data on your phone is synced with your account and stored on our server (larryhsiao.com, running in Docker on a self-managed VPS, with the data held in a PostgreSQL database; both the server and the database are located in Japan), and it is transmitted over HTTPS. Your data is therefore stored within Japan.
A local copy remains on your phone. When syncing, the server keeps the identifiers of deleted items (without their content) for 90 days, so that other devices that were offline can also delete them when they come back; push device tokens that have not been updated for over 90 days are purged.

**Push notifications:** After you sign in, the server sends reminders through Google Firebase Cloud Messaging (and, on iOS, also through the Apple Push Notification service); these services receive your device token and the notification content.
The notification text is generic and does not contain contact names.

**Web version:** There is currently no web version.

**Backup:** The app's "Backup and restore" encrypts your data with a password you set and produces a piece of text for you to keep yourself.
We do not keep backups, and we cannot restore one if you forget the password.
The database on your phone is also kept out of system backups, so that your clients' data does not travel through system backups to Apple's or Google's servers:
Android's automatic backup is turned off, and on iOS the database is excluded from iCloud and computer backups.
When you change phones, use the app's backup and restore, or sign in to sync.

## 3. How we use your data

Only to provide the app's functions: showing and managing your data, syncing, working out the overdue list, and sending reminders.
We do not sell data, we do not use it for advertising, and we do not share it with third parties (except the push services above).

## 4. Retention and deletion

- **Delete the data on this device:** Settings → Account settings → Delete data on this device (if you are signed in, you are signed out at the same time; data on the server is not affected).
- **Delete your account:** Settings → Account settings → Delete account. This permanently deletes your account and all your data on the server,
  and also deletes the data on this phone (creating an encrypted backup first is recommended). Copies in the server's database backups do not disappear immediately;
  they disappear as newer backups replace older ones (see "Database backups" below).
  If the account on the server has been deleted but the data on this phone cannot be deleted for some reason, the app signs you out and tells you, and you should delete it yourself in Account settings.
- **Export:** After you sign in, you can export all of your data on the server in Account settings.
- Uninstalling the app removes the database on the phone; data on the server is kept until you delete your account.
- **Server logs:** The server and its front-end reverse proxy record the time, source IP address, path and status code of each request, for debugging and operations; the content of the data you enter is not recorded. Logs are kept for 90 days.
- **Database backups:** The server's database is backed up regularly (roughly every few days). Only the most recent backups are kept, and older ones are replaced by newer ones; there is no fixed retention period. Therefore, after you delete your account, your data may remain in the most recent backups until they are replaced by newer ones.

## 5. Your rights

You can at any time access, correct (by editing in the app), export and delete your data.
For help, please email larryhsiao@larryhsiao.com.

## 6. Children

Snotra is not designed for children under 13, and we do not knowingly collect personal data from children.

## 7. Changes to this policy

When the policy is updated, we update the "Last Updated" date on this page; major changes will be announced in the app or on the website.
