+++
date = 2018-04-22
title = "Handling orientation for scrolling position"
category = "Android"
+++

Orientation is a common event which can be trigger easily by user. Handling orientation to keep the views states which increase user experiences, Users don\`t need to do the same thing all the time after orientation.

Here is a sample which handling orientation with a ListView on the screen which we want to retains the scrolling position after orientation.

XML
---

```xml
	<FrameLayout
		android:layout_width="match_parent"
		android:layout_height="match_parent">
		
		<ListView
			android:id="@+id/listView"
			android:layout_width="match_parent"
			android:layout_height="match_parent"/>
	</FrameLayout>
```	

Activity
---

```kotlin
	class MainActivity : AppCompatActivity() {
		override fun onCreate(savedInstanceState: Bundle?) {
			super.onCreate(savedInstanceState)
			setContentView(R.layout.activity_main)
	
		    val array = Array(100, { position ->
				"Item $position"
			})

	        val listView = findViewById<ListView>(R.id.listView)
	  		listView.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, array)
		}
	}
```
As shown that we did not do any extra work to handling orientation. 
And here is the result:

{{ yt(id="yk7JL20INuw")}}

We can see that the scrolling position remains.

Conclusion
---

By default, Orientation change triggers restarting the Activity. And if we want to retains the value in Activity, we need to implement the save/restore methods which provided by Android framework and save our dynamic values for the recreated Activity.

But in this case which we want to retains the scrolling position, we don\`t have to do the save/restore implementation for the scrolling position. Views also retains it states, so we don\`t have to do that again, just focus on how to retain our data and Android framework will do the rest. 

Just make sure setup views before system restore the states (before `super.onRestoreInstanceState()`) then no extra work to retain the scrolling position.


 
