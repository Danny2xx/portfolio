---
title: "Building this site"
description: "The stack and a few decisions behind this portfolio, including a GPT tokenizer that runs in your browser."
date: 2026-07-15
---

I wanted the site to be the proof, not just a description of it. If I'm going to say I build fast, accessible software, the site should be an example.

So I set myself three rules.

Nothing loads from a CDN. The fonts, icons and scripts all ship with the page. It works offline and it never waits on someone else's server.

It's accessible out of the box. Keyboard navigation, plus a small panel for contrast, text size, a dyslexia-friendly font and reduced motion. Your settings stick between visits.

The Lab runs real demos instead of screenshots.

For the stack I used Astro with a few React islands for the interactive parts. Astro ships no JavaScript unless a component needs it, so the static parts stay static and only the demos hydrate. Styling is plain CSS with a light and dark theme. The type is Hanken Grotesk, with Geist Mono for anything technical.

My favourite part is the tokenizer in the Lab. It runs the same BPE tokenizer as GPT-3.5 and 4, fully in the browser, with no API. Type a sentence and you can watch it break into tokens. "Tokenization" becomes two tokens, "GPT-4" becomes three, and an emoji becomes a handful of bytes.

That's the whole idea. Everything here is meant to be clicked.

More notes when I have them. If there's something you'd want me to write about, tell me.
