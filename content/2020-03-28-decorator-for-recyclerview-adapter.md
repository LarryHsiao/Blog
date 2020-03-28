+++
date = 2020-03-28
title = "RecyclerView使用Decorator模式實做無項目提示" 
category = "Android"
+++

使用RecyclerView實做清單，在現在的原生Android app開發上已經成為一個必須。相較於ListView元件，RecyclerView提供了較高的效能以及動畫的支援。但是相較於ListView，RecyclerView沒有單純的`setEmptyView()`，我們必須將空清單提示的狀態實做在我們的Adapter內。不過等等，無項目提示其實實物上是很常見的功能。我們一定得每次都寫一次這個功能嗎？我們這裡使用Decorator模式來簡化這段實做

<p>
<img src="/empty_list.png" width="270" alt="空清單提示"/>
</p>

##### 先看看結果吧

首先，我們有了一個清單實做
```Java
RecyclerView list = findViewById(R.id.recyclerView);
list.setAdapter(new ListAdapter());
```

接著，我們想增加無項目提示
```Java
RecyclerView list = findViewById(R.id.recyclerView);
list.setAdapter(new EmptyListAdapter(
	new ListAdapter(),g
	new EmptyView(context)
));
```
恩...看起來還算容易。我們只增加了一個EmptyListAdapter來為我們的清單增加空清單提示功能，就可以達到效果。
接著我們看看怎麼實做的吧。


##### RecyclerViewWrapper
首先，我們需要一個wrapper類別,用來包覆既有。
```Java
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView

open class RecyclerViewWrapper<T : RecyclerView.ViewHolder>(
    private val origin: RecyclerView.Adapter<T>
) : RecyclerView.Adapter<T>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): T {
        return origin.onCreateViewHolder(parent, viewType)
    }

    override fun getItemCount(): Int {
        return origin.itemCount
    }

    override fun onBindViewHolder(holder: T, position: Int) {
        return origin.onBindViewHolder(holder, position)
    }

    override fun onBindViewHolder(
        holder: T,
        position: Int,
        payloads: MutableList<Any>
    ) {
        origin.onBindViewHolder(holder, position, payloads)
    }

    override fun unregisterAdapterDataObserver(observer: RecyclerView.AdapterDataObserver) {
        origin.unregisterAdapterDataObserver(observer)
    }

    override fun onViewDetachedFromWindow(holder: T) { 
		origin.onViewDetachedFromWindow(holder)
    }

    override fun getItemId(position: Int): Long {
        return origin.getItemId(position)
    }

    override fun setHasStableIds(hasStableIds: Boolean) {
        origin.setHasStableIds(hasStableIds)
    }

    override fun onFailedToRecycleView(holder: T): Boolean {
        return origin.onFailedToRecycleView(holder)
    }

    override fun getItemViewType(position: Int): Int {
        return origin.getItemViewType(position)
    }

    override fun onAttachedToRecyclerView(recyclerView: RecyclerView) {
        origin.onAttachedToRecyclerView(recyclerView)
    }

    override fun onDetachedFromRecyclerView(recyclerView: RecyclerView) {
        origin.onDetachedFromRecyclerView(recyclerView)
    }

    override fun onViewRecycled(holder: T) {
        origin.onViewRecycled(holder)
    }

    override fun registerAdapterDataObserver(observer: RecyclerView.AdapterDataObserver) {
        origin.registerAdapterDataObserver(observer)
    }

    override fun onViewAttachedToWindow(holder: T) {
        origin.onViewAttachedToWindow(holder)
    }
}
```
##### EmptyListAdapter
接著，就是我們的EmptyListAdapter，這個類判斷計有adapter的item數量，數量為0時顯示空清單提示。

```Java
public final class EmptyListAdapter extends RecyclerViewWrapper<ViewHolder> {
    private static final int ITEM_TYPE_EMPTY = 4102001;
    private final Source<View> emptyView;

    public EmptyListAdapter(
        @NotNull RecyclerView.Adapter<ViewHolder> origin,
        Source<View> emptyView) {
        super(origin);
        this.emptyView = emptyView;
    }

    @Override
    public int getItemCount() {
        int actualCount = super.getItemCount();
        if (actualCount == 0) {
            return 1;
        }
        return actualCount;
    }

    @Override
    public void onBindViewHolder(@NotNull ViewHolder holder, int position) {
        if (ITEM_TYPE_EMPTY != getItemViewType(position)) {
            super.onBindViewHolder(holder, position);
        }
    }

    @NotNull
    @Override
    public ViewHolder onCreateViewHolder(
        @NotNull ViewGroup parent, int viewType) {
        if (ITEM_TYPE_EMPTY == viewType) {
            LinearLayout layout = new LinearLayout(parent.getContext());
            layout.setLayoutParams(
                new ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT)
            );
            layout.setGravity(CENTER);
            layout.addView(emptyView.value());
            return new ViewHolder(layout);
        } else {
            return super.onCreateViewHolder(parent, viewType);
        }
    }

    @Override
    public void onBindViewHolder(
        @NotNull ViewHolder holder, int position,
        @NotNull List<Object> payloads) {
        if (ITEM_TYPE_EMPTY == getItemViewType(position)) {
            onBindViewHolder(holder, position);
        } else {
            super.onBindViewHolder(holder, position, payloads);
        }
    }

    @Override
    public int getItemViewType(int position) {
        if (super.getItemCount() == 0) {
            return ITEM_TYPE_EMPTY;
        }
        return super.getItemViewType(position);
    }
}
```

##### 缺點
由於`ListAdapter`不知道被裝飾後的數量變動，當實際資料數量從0增加時呼叫`notifyItemInserted()`會拋出exception。所以這個ListAdapter在實做時候必須注意是否有Append的行為，並且在實際數量從0增加時要使用`notifiyDataSetChanged()`。
雖然看起來有點毛毛的，但是在實做簡單清單的情境底下，這個作法已經減少我們很多effort也很夠用了。

##### Aura
這個東西我本身有再用並且放在我整理的一個Library上可以用用看，[Aura][1]。


[1]: https://github.com/LarryHsiao/Aura
