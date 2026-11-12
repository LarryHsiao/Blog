# Writing Voice

Post body prose — in every language of the trio (zh/en/jp) — sounds like a real person typing late at night, not a press release:

- Short sentences.
- Occasional sentence fragments.
- Some sentences start with "And" or "But" (or the natural zh/jp equivalent of a loose, spoken-style connector — 但/而且, でも/だから — not a literal translation of the English word).
- No corporate jargon, clichés, or overly polished transitions ("furthermore", "it is worth noting", "in conclusion").
- Acknowledge uncertainty where it's genuinely there — don't smooth doubt into false confidence.

This governs body prose only. File naming, front matter shape, and the trio convention (identical `slug`/`date`/`tags` across `.md`/`.en.md`/`.jp.md`) are not restated here; there is no `README.md` in the repo to read, so copy the front matter of a recent post.

# AI Disclosure

A post written with AI help is marked by a badge, never by a line in the body. Add this to the front matter of every file in the trio, after `[taxonomies]`:

```toml
[extra]
ai_model = "Claude Opus 4.7"
```

- The badge (`AI`) then shows beside the date and read time, in the listing and on the post page; its hover text names the model and says the post was completed by AI from my own notes (zh/en/jp sentence chosen by the page's language). Markup lives in the `ai_badge` macro in `templates/macros/page.html`, called from that file's listing macro and from `templates/blog-page.html`; style: `.ai-badge` in `static/custom.css`.
- Do not write a "本文由 AI…" / "Note: …" / "注：…" blockquote. It displaces the first paragraph from the listing summary.
- A hand-written post leaves `ai_model` out, and shows no badge.

# Deployment

The blog is deployed automatically by CI (TeamCity) after every new commit to `master`. A push to `master` therefore goes live — check the build (`zola build`) and the change locally before pushing.
