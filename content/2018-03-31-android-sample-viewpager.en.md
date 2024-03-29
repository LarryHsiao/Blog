+++
date = 2018-03-31
title = "Android Sample: ViewPager"
slug = "android-sample-viewpager"
category = "Android"
+++

ViewPager is a common component in Android applications. Here is an sample written in Kotlin.

Sample feature:

 - Pages has color background.
 - User is able to trigger moving page to second page of right.

{{ youtube(id="hTH3_iUBSuI") }}

#### Layout XML
We need two elements in the main structure: Button and ViewPager.
Button used for making the two page changing.
ViewPager contains the color pages we have.

Here just showing the structure of view.

```html
<LinearLayout android:orientation="vertical" >
    <Button android:id="@+id/main_jump"/> 
    <ViewPager android:id="@+id/main_viewPager" />
</LinearLayout> 
```

### Page Fragments
Now define an Fragment as Page which contains in ViewPager.Implements views which we want to present in `onCreateView()`.

```java
class Page : Fragment() {
    override fun onCreateView(inflater: LayoutInflater?, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val colors: Array<Int> = arrayOf(Color.BLACK, Color.GREEN, Color.CYAN, Color.YELLOW, Color.LTGRAY)
        val view = TextView(context)
        view.layoutParams = ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT)
        view.text = arguments.getString("title")
        view.gravity = Gravity.CENTER
        view.setBackgroundColor(colors[Integer.valueOf(view.text.toString()) % colors.size])
        return view
    }
}
```

### Main Activity

##### Setup ViewPager
Setup what page to show up. Implements `getitem()` for item views and `getCount()` for number of pages.

Here we pass position to Fragments for displaying different content in pages.

```java
val viewPage = findViewById<ViewPager>(R.id.main_viewPager)
viewPage.adapter = object : FragmentPagerAdapter(supportFragmentManager) {
    override fun getItem(position: Int): Fragment {
        val bundle = Bundle()
        bundle.putString("title", position.toString())
        val page = Page()
        page.arguments = bundle
        return page
    }
    override fun getCount(): Int = 10
}
```

##### Setup user event

And catching the event of Button for triggering the page jumping.
Although the event itself is pointless. Just showing how to jump page programmatically by user trigger. We can replace it with any user events.

```java
findViewById<View>(R.id.main_jump).setOnClickListener {
    viewPage.setCurrentItem((viewPage.currentItem + 2) % 10, true)
}
```

### Conclusion

This sample shows how to display Pages with ViewPager.As we can see, constructing pages with ViewPager has two main thing to implement:

- Adapter : What page to show up.
- Pages(Fragment) : What contents to present on the page.

[Source code](https://github.com/LarryHsiao/Sample_Android_ViewPager)

You can also check out the [official tutorial](https://developer.android.com/training/animation/screen-slide.html) for more details.
