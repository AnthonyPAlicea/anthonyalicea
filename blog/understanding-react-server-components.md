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

React Server Components have lifted server-rendering to be a truly first-class citizen of the React ecosystem. They allow developers to render some components on the server, while attempting to abstract away the divide between the client and server. Devs can interleave client and server components in their code as if all the code was running in one place.

Yet, abstractions always come at a cost. What are those costs? When *can* you use RSCs? Does reduced bundle size mean reduced bandwidth? When *should* you use RSCs (React Server Components)? What are the rules that devs have to follow to use them properly and why do those rules exist?

To answer these questions, let's dive together into how React Server Components really work, under-the-hood. We'll do this by examining two sides of the RSC story: React itself and React meta-frameworks. In particular, we'll look at both React and NextJS internals to form an accurate mental model of how the RSC story comes together.

<p>
<small>
<b class="note-header">Note</b>
This post is aimed at developers who are familiar with using React. It assumes you know what components and hooks look like.<br /><br />It's also assumed your familiar with Promises, async, and await in JavaScript.If not, you can watch my under-the-hood YouTube video on <a href="https://youtu.be/fyGSyqEX2dw?si=MkRII6BoKW8Dm-Ml"><b>Promises, async, and await</b></a>.<br /><br />For a deep dive into every aspect of React from scratch, check out my course <a href="https://understandingreact.com"><b>Understanding React</b></a> where we dig into React's source code to understand how JSX, Fiber, components, hooks, forms, and more really work.</small>
</p>

First, we must establish some fundamentals necessary to understanding how RSCs work.

## The DOM and Client Rendering
React co-opted the term "render". When we say the browser "renders" our page we are referring to the actual work of painting the DOM to the screen. The browser takes the DOM (the tree of elements) and the CSSOM (the tree of computed styles), calculates how elements should layout, and then paints the appropriate pixels to the screen.

React instead uses that same term to mean "calculating what the DOM should look like". The values our component functions return tell React what the DOM should look like.

Thus, in the world of React (and other frameworks who have since followed in React's footsteps), when we say "client rendering" we're talking about **our component functions being executed** ***in the browser***.

React's version of "rendering" doesn't always lead to actual browser rendering, since it's possible the DOM already looks the way React thinks it should.

> When React says "client rendering" we're talking about our component functions being executed ***in the browser***.

In fact, a major point of React's core architecture (along with all other JS frameworks) is to limit how much its internal code updates the DOM.

### Tree Reconciliation
Inside React's source code are calls to browser DOM APIs like <code>appendChild</code> to update the DOM in the client. React chooses when to execute those browser DOM APIs via tree reconciliation and diffing.

As we talked about in my post on [React Compiler](/blog/understanding-react-compiler), React keeps track of what the DOM both currently looks like and *should* look like in a tree of JavaScript objects, where each node is called a Fiber.

React calculates what the DOM should look like (called "Work-In-Progress") and compares it to what the DOM currently looks like (called "Current") in two branches of that JavaScript object tree.

It then reconciles the difference between those two trees, calculating the steps needed to convert the current tree into the work-in-progress tree. Those steps are the "diff" or "patch".

![A representation of the reconciliation process inside React, showing current and work-in-progress branches of the tree which are compared to calculate what updates to make to the real DOM tree.](/assets/blogimages/ReactCompiler_Reconciliation.png)

Once it finishes that calculation, all against simple JavaScript objects, it knows what steps to take in the *real* DOM. By finding the minimum number of steps to take, it minimizes how much it has to update the DOM, since updating the DOM is expensive and causes the browser to re-render (layout elements and paint pixels).

Updating the DOM in the client has the advantage of not losing state as you update the UI. For example, a user can type information into a form, React can update the UI based on some event, and the text stays in the form (unlike if the page refreshed).

Thus React is focused on updating the DOM in the client, while trying to be as efficient as it can in doing so, doing work first against a fake DOM. This fake copy of the DOM's structure in JavaScript is generally called the "Virtual DOM".

<p>
<small><b class="note-header">Is "Virtual DOM" the Right Phrase?</b>
 We used to call the collection of JavaScript objects in React that are structured like the DOM the "Virtual DOM". But React doesn't like that term now because you can target other things like native iOS and Android apps (React Native) to render to.<br /><br />In fact, there are multiple trees that React deals with, a tree of React Elements (JS objects) that your function components return and a Fiber tree (also JS objects) that React Elements are converted into and used to store state among other things.<br /><br />While I usually refer to these two trees more specifically, for this post I'll use the long-standing colloquial term "Virtual DOM" because it's useful in keeping track of how RSCs work.</small>
</p>

Calculating the Virtual DOM is what React refers to as "rendering": executing your function components to determine what the real DOM should look like. This all happens inside the JavaScript engine executing the functions, and until reconciliation doesn't touch the real DOM at all.

As it turns out, understanding that **React co-opted the term "render"** goes a surprisingly long way in helping explain RSCs accurately.

To understand RSCs we need to have clear in our minds the difference between what we usually mean in web dev by client and server rendering, and React's focus on the generation of the Virtual DOM.

I made the below image when preparing this post. A reminder that when React says "render" it doesn't mean you actually see anything happen :).
<p style="text-align: center;">
<img style="max-width: 350px;" alt="A cartoon sketch of a quivering atom saying "Oh I am rendering...in my mind." src="/assets/blogimages/tonyalicea_cartoon1_dark.png" />
</p>

Let's keep track of these various "render" meanings as we go. We'll call the typical (non-React) definitions "classical" and start building a dictionary entry for our web dev vocabulary:

<dl class="dictionary-entry">
  <dt class="dictionary-term">rend·er</dt>
  <dd class="dictionary-pronunciation">/ˈrendər/</dd>
  <dd class="dictionary-part-speech"><em>verb</em></dd>
  <dd class="dictionary-definition">
    <span class="definition-number">1.</span> <em>(Classical Client-Side)</em> To take the DOM and CSSOM, compute layout, and paint pixels to the screen.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">2.</span> <em>(React Client-Side)</em> To execute function components in order to build and update the Virtual DOM.
  </dd>
</dl>


## The DOM and Server Rendering
Moving forward in the RSC story means moving backwards in time. A core idea of the internet has long been HTML being delivered from a server.

Creating your HTML on the server (perhaps using server technologies like NodeJS or PHP) is classically called "server-side rendering" or "server rendering". This is already different than what we meant by classical client rendering. Historically server rendering has meant "generate strings of HTML" on the server.

This comes with some advantages. Browsers translate HTML into the DOM very quickly. As a result HTML *renders in the browser fast*. Updating the DOM via JavaScript is slower in comparison. Also, your server is closer to your database or file storage, so those operations are more efficient.

A downside is that, while the client can request the HTML again, you lose state (the page refreshes).

This has been the balancing act for many years in web development: server-rendered HTML appears quickly, but DOM updates via client-side JavaScript let you make changes while maintaining the state of the page.

React doing both is nothing new. While React does DOM updates via client-side JavaScript, developers have long been able to server-render React components (SSR) as well. 

The server (running its own JavaScript engine via something like NodeJS) executes the components and generates an HTML string to send to the client, but there's a big caveat: all the JavaScript code for those same components *also* had to be sent to the client and executed. 

Why? So the Virtual DOM could be built from what those function components return. The Virtual DOM is used to "hydrate" the real DOM, meaning for example we know what click event inside what function component to run when a button is clicked. Remember, React needs **both** trees (DOM and Virtual DOM) to exist in the client to work. So, SSR in React means executing your functions twice (once on the server to make HTML and once on the client to make the Virtual DOM).

Enter React Server Components. RSCs add the ability to intermingle React components that execute on the server with React components that execute on the client ***without* sending and re-executing the server components' JavaScript code**. This also comes with the possibility of initially rendering HTML on the server, before beginning to update the DOM in the browser.

How?

First, let's update our dictionary entry:

<dl class="dictionary-entry">
  <dt class="dictionary-term">rend·er</dt>
  <dd class="dictionary-pronunciation">/ˈrendər/</dd>
  <dd class="dictionary-part-speech"><em>verb</em></dd>
  <dd class="dictionary-definition">
    <span class="definition-number">1.</span> <em>(Classical Client-Side)</em> To take the DOM and CSSOM, compute layout, and paint pixels to the screen.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">2.</span> <em>(React Client-Side)</em> To execute function components in order to build and update the Virtual DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">3.</span> <em>(Classical Server-Side)</em> To generate HTML to be sent to the client to build the DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">4.</span> <em>(React Server-Side SSR)</em> To execute function components in order to generate HTML to be sent to the client to build the DOM.
  </dd>
</dl>
<p>
<small>
<b class="note-header">What About Server-Side Generation?</b>
  One thing we aren't talking about here is SSG (Server-Side Generation). That means pre-generating the HTML while <em>building</em> the app (that is, preparing it for deployment). You can do this for both client and server components.<br /><br />SSG would have the same definition as SSR in our dictionary entry. Differentiating SSG and SSR doesn't help us much in this post, so I won't talk about it much, but it is supported.
</small>
</p>

We said React needs both full trees, DOM and Virtual DOM, to be sitting in the browser's memory to work. So how do React Server Components get away with only executing on the server, without needing their JavaScript code to be downloaded and executed by the client? 

> React needs both full trees, DOM and Virtual DOM, to be sitting in the browser's memory to work.

In other words, how does React build the Virtual DOM in the *browser* for the part defined by functions executed on the *server*?

## Flight

In order to support executing function components on the server, and then building the Virtual DOM from their results on the client, React added the ability to *serialize* the React Element tree returned from server-executed functions.

Serialization and deserialization often end up meaning "convert objects in a computer's memory into a string" and "convert strings back into objects in a computer's memory".

In this case, the results of our component functions need to be serialized and sent to the client.

Let's suppose I'm making a simple app where I will track how many students have enrolled in my React course. I'll start with a basic RSC in NextJS. It will be executed on the server.

```js
export default function Home() {
  return (
    <main>
      <h1>understandingreact.com</h1>
    </main>
  );
}
```

<p>
<small>
<b class="note-header">Isomorphic Components</b>
If a component can be executed on the server <em>or</em> the client it's referred to as "isomorphic". My above function doesn't do anything server-specific (like connect directly to a database or read a file off the server), so it could instead have been executed on the client, and React could build the Virtual DOM from it's results directly as normal.<br /><br />If a function is isomorphic, then it can be shared. Both server and client components can import and use them.
</small>
</p>

To prevent having to send this function to the client for execution, it's results need to be serialized. Inside React's codebase this serialization format is called "flight" and the sum of data sent is called the "RSC Payload".

My simple function's result ends up serialized into this:

```js
"[\"$\",\"main\",null,{\"children\":[\"$\",\"h1\",null,{\"children\":\"understandingreact.com\"},\"$c\"]},\"$c\"]"
```

Let's format it for easier examination (credit for the excellent <a href="https://github.com/alvarlagerlof/rsc-parser" target="blank">RSC parser</a> from Alvar Lagerlöf):

```js
{
  "type": "main",
  "key": null,
  "props": {
    "children": {
    "type": "h1",
    "key": null,
    "props": {
      "children": "understandingreact.com"
    }
}
```

Can you see the structure of the Virtual DOM? Our <code>main</code> and <code>h1</code> elements are here as well as our plain text node. We can see what is being passed as props, specifically the standard "children" prop intrinsic to React.

We're simplifying here, there's more to the format than this, and a meta-framework may add more to it for their own purposes. For example, identifiers for what kind of thing is being placed in the tree "like 'f:' for 'flight'". But a simplified example is sufficient for our understanding.

While React is providing the serialization format, the meta-framework (in this case NextJS) must do the work of ensuring the payload is created and sent to the client.

NextJS, for example, has a function in its codebase called <code>generateDynamicRSCPayload</code>.

The meta-framework is ensuring that the payload is generated and sent to the client. Thanks to the payload, on the client React can build an accurate Virtual DOM and do its normal reconciliation work.

## Meta-Frameworks and Server Rendering
We said earlier that rendering HTML from RSCs was a "possibility". That's because it's optional - it's up to the meta-framework if it does so or not. But it makes sense to do so.

Remember we said *perceived performance* was an important metric. If you're already executing code on the server, and you can stream back HTML, you should, because the browser will render that HTML quickly, resulting in a faster perceived experience for the user.

If a meta-framework is perceived as slow, no one will use it. So React meta-frameworks implementing RSCs need to do *both* kinds of server rendering: the classical kind *and* the React kind.

Classical server rendering (generating HTML) gets you pages that render (painted by the browser) quickly, while React-style server rendering (RSC payload) gets you the Virtual DOM for future stateful updates.

Thus, in practice, an RSC will result in what is called the "double data problem". You will send the same information from the server in two different formats at the same time: HTML and Payload. You're sending the info needed to immediately build the DOM (HTML) and the Virtual DOM (Payload).

For our simple example, NextJS returns HTML, which the browser uses to build the DOM:

```html
<main>
  <h1>understandingreact.com</h1>
</main>
```
*and* the Payload, which React uses to build the Virtual DOM:

```js
{
  "type": "main",
  "key": null,
  "props": {
    "children": {
    "type": "h1",
    "key": null,
    "props": {
      "children": "understandingreact.com"
    }
}
```

The HTML being sent allows the page to be browser rendered quickly. The user sees something right away. The Payload being sent lets React finish the work of making the page interactive.

Sometimes it's argued that the cost of this repetition of data is negated by compression algorithms (like gzip) which servers use before sending responses. However, HTML and the JSON-ish payload are two different formats, so the repetition is obfuscated enough that the double data still makes an noticeable impact on bandwidth.

Abstractions have a cost. The cost here is sending the same information twice.

With all this in mind, though, we now have a complete list of 5 different definitions for "render"!

<dl class="dictionary-entry">
  <dt class="dictionary-term">rend·er</dt>
  <dd class="dictionary-pronunciation">/ˈrendər/</dd>
  <dd class="dictionary-part-speech"><em>verb</em></dd>
  <dd class="dictionary-definition">
    <span class="definition-number">1.</span> <em>(Classical Client-Side)</em> To take the DOM and CSSOM, compute layout, and paint pixels to the screen.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">2.</span> <em>(React Client-Side)</em> To execute function components in order to build and update the Virtual DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">3.</span> <em>(Classical Server-Side)</em> To generate HTML to be sent to the client to build the DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">4.</span> <em>(React Server-Side SSR)</em> To execute function components in order to generate HTML to be sent to the client to build the DOM.
  </dd>
  <dd class="dictionary-definition">
    <span class="definition-number">5.</span> <em>(React Server-Side RSC)</em> To execute function components in order to generate flight (payload) data to be sent to the client to build and update the Virtual DOM.
  </dd>
</dl>

Notice similarities across the React definitions? For React rendering *always* means "executing function components", and client and server components *both* provide what is needed to build and update the Virtual DOM.

## Streams
But there are two kinds of performance: actual performance and perceived performance.

With streams the question isn't "what was sent" but "what has been sent *over time*".

But where does flight data stream *to* really? It must be somewhere in the React codebase. It turns out the answer to that question adds an important player to the RSC story.

```js
{
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
     "$$type": "reference",
     "id": "d",
     "identifier": "L",
     "type": "Lazy node"
    }
   ]
  } 
}
```

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
It's worth noting here that you can also take RSCs and generate the HTML and Payload while building the app, thus SSG instead of SSR. However since SSG happens only once as part of deployment, and not when a user requests the page, there will never be anything new to refetch.

## The Bundle Size Confusion
***Bundle size and bandwidth usage are not the same thing.***

## When Should You Use RSCs?

## Looking Forward

## Diving Deeper