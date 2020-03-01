+++
date = 2018-11-24
title = "UI testing with CI"
category = "Android"
+++

It is always a pain running automatic Android UI testing on CI Servers. Especially when we don`t have much resources for CI server to run a emulator. Here is our way to make it work.

We have:
 - A TeamCity Server at Remote
 - Build Agent for building project at Remote
 - Several Android Phones 
 - PC for development at local
 
Our build process can handle all the task but leave only one puzzle left, phones to run the UI tests. 

### SSH tunnel
We find a way, use SSH tunnel to do that.
```bash
ssh -fNR 5037:localhost:5037 ${REMOTE_SERVER}
adb start-server # if adb not running at local
```
And we good to go. Everything we can do with ADB now available on the Build Agents. Just run the build script.

### ADB script
But the Gradle tasks which runs UI tests effects to all device connecting to ADB, we need some workaround. Make the UI testing only runs on our old Android.
```bash
./gradlew uninstallAll
./gradlew installDebug
./gradlew installDebugAndroidTest
adb -s {{DEVICE_SERIAL}} shell am instrument -w ${PACKAGE_NAME}/androidx.test.runner.AndroidJUnitRunner 
```
Note:
- We are using Androidx packages, replace it with appcompat one if you not using Androidx yet.
- Use adb with specific phone which we not use it on day to day work.

### Optional: autossh 
we can use autossh to maintain the connection then we don`t need to run the ssh when we lost the connection.
```bash
autossh -M 50001 -fNR 5037:localhost:5037 ${REMOTE_SERVER}
```

### Result
As result, our old Android device no longer lonely! Just plug all the phones to you computer, CI server will keep them busy.



[1]: https://www.jetbrains.com/teamcity/
