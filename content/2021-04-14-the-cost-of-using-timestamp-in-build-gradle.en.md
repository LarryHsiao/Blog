+++
title = "The cost of using timestamp in build.gradle and how to reduce it."
date = 2021-04-14
slug = "reduce-the-cost-of-using-timestamp-in-build-gradle"
category = "Android"
+++

In reality of Android application development, we build apk with timestamp to identify what version of the app is running on the user's hand.

But it comes a cost, the timestamp changed by time passing, right? So every time we build the project the value is changed. And this leads our project do whatever the things when we change the source code which we actually not. 

And it makes the building time much longer then not using it.

So, here I want to proposing is the solution to have the dynamic timestamp and not slow us down.
Use buildType:

```groovy
android{
    buildTypes{
        release{
            buildConfigField "String", "BUILD_TIMESTAMP", "\"${getTimeStamp()}\"" //getTimeStamp() generates the string by time
        }
        debug{
            buildConfigField "String", "BUILD_TIMESTAMP", "\"{{placeholder}}\""
        }
    }
}
```

And as result, the build duration reduced.(In my case 30s -> 2s when we do change nothing.)
