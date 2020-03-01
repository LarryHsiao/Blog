+++
date = 2019-06-30
title = "Custom options for intent chosoer"
tag = "Android"
+++

In our day to day Android app development work. In most scenarios we have to provide action selection dialog for various Intent. Here is a alternative to custom a dialog, use a chooser Intent to create System provided selection dialog with custom selection.

The result on Android P
<p>
<img src="/chooser_intent.png" width="270" alt="The result on Android P"/>
</p>

We can do it by
```kotlin
startActivity(Intent.createChooser(
	Intent(MediaStore.ACTION_IMAGE_CAPTURE), // base Intent
	"Title here"
).apply {
	putExtra(
		Intent.EXTRA_INITIAL_INTENTS,
		arrayOf(
			Intent(ACTION_GET_CONTENT).also { // extra Intent
			it.type = "images/*"
			}
		)
	)
})
```

### Alternative

It`s there alternative for this? Seems the implementation a little bit complex which we may create simple wrapper in all of our project.
Here you go, [Aura][1], An Android library created by myself which provide ChooserIntent class to generate the chooser Intent. And make our work slightly simpler.

```kotlin
startActivity(ChooserIntent(
    "Title here",
    Intent(MediaStore.ACTION_IMAGE_CAPTURE),
    Intent(ACTION_GET_CONTENT).also{
         it.type = "images / *"
    }
).value())
```

[1]: https://github.com/LarryHsiao/Aura
