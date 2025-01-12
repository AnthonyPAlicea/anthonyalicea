---
layout: post.njk
title: "Understanding React Server Components"
excerpt: A deep dive into the internals of React and NextJS to understand RSCs.
date: 2025-01-05
---

{% block head %}
<style>
.dictionary-entry {
    background: #2a2a2a;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
    font-family: 'Noto Sans', sans-serif;
}

.dictionary-term {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-highlight);
    margin-bottom: 0.25rem;
}

.dictionary-pronunciation {
    font-family: monospace;
    color: #999;
    font-size: 0.9rem;
    margin: 0 0 0.25rem 0;
}

.dictionary-part-speech {
    color: #999;
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
}

.dictionary-definition {
    margin: 0 0 0.75rem 1.5rem;
    position: relative;
    line-height: 1.4;
}

.dictionary-definition:last-child {
    margin-bottom: 0;
}

.definition-number {
    position: absolute;
    left: -1.5rem;
    color: var(--color-highlight);
}

.dictionary-definition em {
    color: #999;
    font-style: normal;
}
</style>
{% endblock %}

# {{ title }}

React Server Components have lifted server-rendering to be a first-class citizen of the React ecosystem. They allow developers to render some components on the server, while attempting to abstract away the divide between the client and server. Devs can interleave client and server components in their code as if all the code was running in one place.

Yet, abstractions always come at a cost. What are those costs? When *can* you use RSCs? Do they always reduce bundle size? When *should* you use RSCs (React Server Components)? What are the rules that devs have to follow to use them properly and why do those rules exist?

To answer these questions, let's dive together into how React Server Components really work, under-the-hood. We'll do this by examining two sides of the RSC story: React itself and React meta-frameworks. In particular, we'll look at both React and NextJS internals to form an accurate mental model of how the RSC story comes together.

<small>This post is aimed at developers who are familiar with using React. It assumes you know what components and hooks look like.<br /><br />It's also assumed your familiar with Promises, async, and await in JavaScript.If not, you can watch my under-the-hood YouTube video on <a href="https://youtu.be/fyGSyqEX2dw?si=MkRII6BoKW8Dm-Ml"><b>Promises, async, and await</b></a>.<br /><br />For a deep dive into every aspect of React from scratch, check out my course <a href="https://understandingreact.com"><b>Understanding React</b></a> where we dig into React's source code to understand how JSX, Fiber, components, hooks, forms, and more really work.</small>

First, we must establish some fundamentals necessary to understanding how RSCs work.

## The DOM and Client Rendering
React co-opted the term "render". It usually refers to the actual work of painting the DOM to the screen. React uses the term to mean calculating what the DOM should look like.

Thus, in the world of React, when we say "client rendering" we're talking about **React executing our component functions** ***in the browser***.

React's version of "rendering" doesn't always lead to actual browser rendering, since it's possible the DOM already looks the way React thinks it should. In fact, a major point of React's core architecture (along with all other JS frameworks) is to limit how much its internal code updates the DOM.

> When React says "client rendering" we're talking about React executing our component functions ***in the browser***.

### Tree Reconciliation

This has the advantage of not losing state as you update the UI.
![A representation of the reconciliation process inside React, showing current and work-in-progress branches of the tree which are compared to calculate what updates to make to the real DOM tree.](/assets/blogimages/ReactCompiler_Reconciliation.png)

Understanding that **React co-opted the term "render"** goes a surprisingly long way in helping explain RSCs accurately.

To understand RSCs we need to have clear in our minds the difference between what we usually mean in web dev by client and server rendering, and React's focus on the generation of the Virtual DOM (i.e. the Fiber tree).

I made this little image to remind you that when React says "render" it doesn't mean you actually see anything happen:
<p style="text-align: center;">
<img style="max-width: 350px;" alt="A cartoon sketch of a quivering atom saying "Oh I am rendering...in my mind." src="/assets/blogimages/tonyalicea_cartoon1_dark.png" />
</p>

Let's keep track of these various "render" meanings as we go. We'll call the typical (non-React) definitions "classical". Let's start building a dictionary entry for our web dev vocabulary:

<dl class="dictionary-entry">
  <dt class="dictionary-term">rend·er</dt>
  <dd class="dictionary-pronunciation">/ˈrendər/</dd>
  <dd class="dictionary-part-speech"><em>verb</em></dd>
  <dd class="dictionary-definition">
    <span class="definition-number">1.</span> <em>(Classical Client-Side)</em> To update the DOM using browser APIs (e.g. <code>el.appendChild(...);</code>).
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">2.</span> <em>(React Client-Side)</em> To execute function components in order to update the virtual DOM.
  </dd>
</dl>


## The DOM and Server Rendering
Moving forward in this story means moving backwards in time.

HTML renders fast (how the internet always worked)

You can ask for it again (but you lose state)

Close to the database or file storage for data access

Developers have been able to server-render React components (SSR) for a long time. The server generates an HTML string to send to the client, **but** the JavaScript code for those same React components also had to be sent to the client and executed, so the Virtual DOM could be built from them. React needs **both** trees to work.

This has been the balancing act for many years in web development: server-rendered HTML appears quickly, but DOM updates via client-side JavaScript let you make changes while maintaining the state of the page.

That balance hasn't changed. React has always primarily been about the client, stateful side of things. Server components add the ability to intermingle React components that execute on the server with React components that execute on the client *without* sending the server component's code over, and the possibility of initially rendering HTML on the server, before beginning to update the DOM in the browser.

How?

Let's update our dictionary entry:

<dl class="dictionary-entry">
  <dt class="dictionary-term">rend·er</dt>
  <dd class="dictionary-pronunciation">/ˈrendər/</dd>
  <dd class="dictionary-part-speech"><em>verb</em></dd>
  <dd class="dictionary-definition">
    <span class="definition-number">1.</span> <em>(Classical Client-Side)</em> To update the DOM using browser APIs (e.g. <code>el.appendChild(...);</code>).
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">2.</span> <em>(React Client-Side)</em> To execute function components in order to update the virtual DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">3.</span> <em>(Classical Server-Side)</em> To generate HTML intended to be sent to the client which will then use it to build the DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">4.</span> <em>(React Server-Side SSR)</em> To execute function components in order to generate HTML intended to be sent to the client which will then use it to build the DOM.
  </dd>
</dl>

<small>
  One thing we aren't talking about here is SSG (Server-Side Generation). That means pre-generating the HTML while <em>building</em> the app (that is, preparing it for deployment). You can do this for both client and server components.

  However, once you generate that HTML the user can't request that it be re-generated and its contents can't be unique per user. This doesn't help us much in the goal of understanding RSCs so I won't talk more about it, but it is supported.
</small>

## Streaming and ReadableStream


## Flight Data

```js
"[\"$\",\"main\",null,{\"children\":[[\"$\",\"h1\",null,{\"children\":\"Understanding React\"},\"$c\"],[\"$\",\"$Ld\",null,{},\"$c\"]]},\"$c\"]"
```

```js
{
 "type": "model",
 "id": "b",
 "value": {
  "type": "main",
  "key": null,
  "props": {
   "children": [
    {
     "type": "h1",
     "key": null,
     "props": {
      "children": "understandingreact.com"
     }
    },
    {
     "type": {
      "$$type": "reference",
      "id": "d",
      "identifier": "L",
      "type": "Lazy node"
     },
     "key": null,
     "props": {}
    }
   ]
  }
 }
```

Credit for the excellent <a href="https://github.com/alvarlagerlof/rsc-parser" target="blank">RSC parser</a> from Alvar Lagerlöf.

## Streams and Promises
But there are two kinds of performance: actual performance and perceived performance.

With streams the question isn't "what was sent" but "what has been sent *over time*".

## Meta-Frameworks and Server Rendering
We said earlier that rendering HTML from RSCs was a "possibility". That's because it's optional - it's up to the meta-framework if it does so or not. But it makes sense to do so.

Remember we said *perceived performance* was an important metric. If you're already executing code on the server, and you can stream back HTML, you should, because the browser will render that HTML quickly, resulting in a faster perceived experience for the user.

If a meta-framework is perceived as slow, no one will use it. So React meta-frameworks implementing RSCs need to do *both* kinds of server rendering: the classical kind *and* the React kind.

Classical server rendering (generating HTML) gets you pages that render (painted by the browser) quickly, while React-style server rendering (RSC payload) gets you the Virtual DOM for future stateful updates.

Thus, in practice, an RSC will result in what is called the "double data problem". You will send the same information from the server in two different formats at the same time: HTML and Payload. You're sending the info needed to immediately build the DOM (HTML) and the Virtual DOM (Payload).

Sometimes its argued that repetition is negated by compression algorithms (like gzip) which servers use before sending responses. However, HTML and the JSON-ish payload are two different formats, so the repetition is obfuscated enough that the double data still makes an noticeable impact on bandwidth.

We now have a complete list of 5 different definitions for "render":

<dl class="dictionary-entry">
  <dt class="dictionary-term">rend·er</dt>
  <dd class="dictionary-pronunciation">/ˈrendər/</dd>
  <dd class="dictionary-part-speech"><em>verb</em></dd>
  <dd class="dictionary-definition">
    <span class="definition-number">1.</span> <em>(Classical Client-Side)</em> To update the DOM using browser APIs (e.g. <code>el.appendChild(...);</code>).
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">2.</span> <em>(React Client-Side)</em> To execute function components in order to update the virtual DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">3.</span> <em>(Classical Server-Side)</em> To generate HTML intended to be sent to the client which will then use it to build the DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">4.</span> <em>(React Server-Side SSR)</em> To execute function components in order to generate HTML intended to be sent to the client which will then use it to build the DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">5.</span> <em>(React Server-Side RSC)</em> To execute function components in order to generate flight (payload) data intended to be sent to the client which will use it to build the Virtual DOM.
  </dd>
</dl>

## Streaming Flight Data

But where does flight data stream *to* really? It must be somewhere in the React codebase. It turns out the answer to that question adds an important player to the RSC story.

## Bundlers and RSCs

## ServerRoot and React Elements

## Suspense, async, and await

Here's an example from the React documentation:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);
  
  // NOTE: not awaited, will start here and await on the client. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}

// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

## Out-of-Order Streaming

## Interleaving
One of React's core tenants has always been component composition. You can split the work of deciding what the DOM should look like across many functions, and compose (that is, combine) that work together by having components be children of each other.

For RSCs to not be a dramatic shift of this core tenant, you need to be able to interleave (or weave) server and client components. **Client components need to be able to be children of server components and vice versa.** That includes being able to pass props (function arguments) to each other.

What that really means is that in your component hierarchy *some* of your functions will run on the server and *some* on the client. In the end though, they all will be doing work that calculates how the part of the DOM that they generate should be structured and what it should contain.

It is the responsibility of the meta-frameworks and bundlers to make this happen, and they do. But remember abstractions have a cost. Often that cost is special rules you have to learn to use the abstraction. In this case, abstracting away some of the separation of server and client means following rules to prevent breaking the limitations of the abstraction.

## Hooks and RSCs
Now that we've seen how RSCs are rendered and their content ends up in the browser, how do they fit in with the normal client-side React functionality?

## To Hydrate or Not to Hydrate
### RSCs Are Non-Interactive

### But RSCs Are In The Virtual DOM

## Refetching and Reconciliation

## The Bundle Size Confusion
***Bundle size and bandwidth usage are not the same thing.***

## When Should You Use RSCs?

## Looking Forward

## Diving Deeper