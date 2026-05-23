+++
date = "2026-05-23"
title = "Frame0, HTML, ASCII: Three Ways to Wireframe"
slug = "wireframe-three-ways"
[taxonomies]
tags = ["AI", "Software", "Tools"]
+++

I've been talking with Claude about a GPS app design these past few days — specifically, what the "accept radius" should be. 20m? 50m? 100m? Numbers alone don't give the intuition; I wanted a sketch to compare.

I just measured [Frame0 vs. ASCII](/en/frame0-vs-ascii-wireframe/) costs a couple of days ago — that was a complex 93-shape UI wireframe. This time the scene is much simpler — one intersection, three concentric circles — but I wanted to weigh one more option: HTML+SVG.

So the question is: in an AI conversation, what's the right way to draw this?

```
                       100 m
                  .------+------.
              .---'             '---.
            .'        50 m           '.
          .'      .----+----.          '.
         /      .'   20 m    '.          \
        /      /   .---+---.   \          \
       |      |   |        |    |          |
  -----+------+---+--------+----+----------+-----
       |      |   |        |    |          |
        \      \   '---+---'   /          /
         \      '.            .'         /
          '.      '----+----'          .'
            '.                       .'
              '---.             .---'
                  '------+------'
```

### Three options

1. **Frame0** — gives the AI drawing ability via MCP. Comes with a shape library, can export to PNG, and the user can keep dragging shapes around in the Frame0 app.
2. **HTML + SVG** — write a snippet of web source code; open it in a browser.
3. **ASCII** — plain text, written directly into the message.

All three can render "one intersection with three concentric circles." The question is — how much does each cost?

### Measuring it

I asked the AI to draw the same scene: two crossing roads, three concentric circles (20m, 50m, 100m), with labels.

HTML+SVG version (opened in a browser):

<figure>
<img src="../html-gps-radii.png" alt="HTML+SVG version: clean concentric circles at an intersection"/>
</figure>

Frame0 version (exported PNG):

<figure>
<img src="../frame0-gps-radii.png" alt="Frame0 version: hand-drawn concentric circles inside a window frame"/>
</figure>

You've already seen the ASCII version above. Once all three were produced I counted characters — and crucially, **both the outbound write AND the inbound return** need counting. Every Frame0 `create_*` call sends the full shape descriptor back into context; that can't be skipped.

| Method | Outbound | Inbound | Round-trip total | Token estimate | Relative cost |
|--------|---------:|--------:|-----------------:|---------------:|--------------:|
| Frame0 (MCP tool calls) | 2,361 | 2,395 | **4,756** | ~1,490 | 6.0× |
| HTML + SVG | 1,343 | ~100 | **1,443** | ~405 | 1.8× |
| ASCII | 692 | ~100 | **792** | ~200 | 1.0× |

ASCII being the cheapest is no surprise. The bigger surprise was how much wider the Frame0–HTML gap actually is — Frame0 isn't just heavy on the outbound side; every `create_*` return carries another full descriptor, so the round-trip is roughly twice the outbound. HTML finishes with just a "file written" confirmation — almost no inbound cost.

There's a hidden expense the table doesn't show: Frame0's `export_page_as_image` pushes the PNG directly into the AI's context, equivalent to roughly 600–1,500 image tokens. HTML doesn't have this — the user opens it in the browser themselves; the image never enters the AI's context.

### And the read-back cost

Writing is only half the story. If the AI needs to re-read the canvas later, that's another bill. I measured what `get_page` returns:

| Method | Read-back chars | Vs. original write |
|--------|----------------:|-------------------:|
| Frame0 (`get_page`) | 2,557 | 1.08× |
| HTML file | 1,343 | 1.00× |
| ASCII file | 692 | 1.00× |

This was better than I feared — Frame0's read-back is only slightly larger than the input (added ids, parent refs, computed geometry), not the doubled bloat I'd worried about.

But don't forget: the read-back's character count itself isn't the scary part — **to be able to read back, the 4,756-character round-trip up front has already been paid**. Frame0's cost is settled at creation time, not deferred to read time.

### But cost isn't everything

Cheap doesn't mean best. Each of the three has its own strength:

| What you want | What fits |
|---------------|-----------|
| One-off small sketch, save tokens | **ASCII** |
| Clean output for a blog post, git-storable | **HTML + SVG** |
| Want to keep dragging shapes around, 15+ elements for a real UI | **Frame0** |

ASCII reads most directly in the message. HTML's strength is being diffable, instantly viewable in a browser, drop-in for a static site; SVG's coordinate system is the same as Frame0's, so converting back isn't painful. Frame0 really earns its keep when the shape count is high enough — when you're drawing a real UI mock with a phone frame, navigation bar, dozens of buttons and list items, the built-in component library amortizes the per-element boilerplate enough that "overall it's still cheaper." I estimate that threshold is somewhere around 15+ shapes.

### Three axes at a glance

Cost, speed, and output side by side:

| Method | Cost | Speed | Output |
|--------|:----:|:-----:|:------:|
| ASCII | ▰▱▱ | ▰▰▰ | ▰▱▱ |
| HTML+SVG | ▰▰▱ | ▰▰▰ | ▰▰▱ |
| Frame0 | ▰▰▰ | ▰▱▱ | ▰▰▰ |

Reading: more bars means higher on that named axis — costlier, faster, more polished output. The overall pattern: if you want cheap and fast, you accept a lighter output; if you want polished output, you pay in tokens and time.
