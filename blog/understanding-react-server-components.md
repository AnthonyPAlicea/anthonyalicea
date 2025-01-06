---
layout: post.njk
title: "Understanding React Server Components"
excerpt: A deep dive into the internals of React and NextJS to understand RSCs.
date: 2025-01-05
---
# {{ title }}

React Server Components have lifted server-rendering to be a first-class citizen of the React ecosystem. They allow developers to render some components on the server, while attempting to abstract away the divide between the client and server. Devs can interleave client and server components in their code as if all the code was running in one place.

Yet, abstractions always come at a cost. What are those costs? When *can* you use RSCs? Do they always reduce bundle size? When *should* you use RSCs (React Server Components)? What are the rules that devs have to follow to use them properly and why do those rules exist?

To answer these questions, let's dive together into how React Server Components really work, under-the-hood. We'll do this by examining two sides of the RSC story: React itself and React meta-frameworks. In particular, we'll look at both React and NextJS internals to form an accurate mental model of how the RSC story comes together.

<small><b>Note:</b> This post is aimed at developers who are familiar with using React. It assumes you know what components and hooks look like. It's also assumed your familiar with Promises, async, and await in JavaScript.<br /><br />If not, you can watch my under-the-hood YouTube video on <a href="https://youtu.be/fyGSyqEX2dw?si=MkRII6BoKW8Dm-Ml"><b>Promises, async, and await</b></a>.<br /><br />For a deep dive into every aspect of React from scratch, check out my course <a href="https://understandingreact.com"><b>Understanding React</b></a> where we dig into React's source code to understand how JSX, components, hooks, forms, and more really work.</small>

## The DOM and Server Rendering
HTML renders fast (how the internet always worked)
You can ask for it again (but you lose state)

## The DOM and Client Rendering
You don't lose state as you change things or make new requests.

This has been the balancing act for many years in web development: server-rendered HTML appears quickly, but DOM updates via client-side JavaScript let you make changes while maintaining the state of the page.

This balance hasn't changed. React has always primarily been about the client, stateful side of things. Server components add the *possibility* of initially rendering HTML on the server, before beginning to update the DOM in the browser.

## Data Access

## Streaming and ReadableStream

## The DOM and Tree Reconciliation
![A representation of the reconciliation process inside React, showing current and work-in-progress branches of the tree which are compared to calculate what updates to make to the real DOM tree.](/assets/blogimages/ReactCompiler_Reconciliation.png)

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

## Server Rendering

## Streaming Flight Data

## ServerRoot and React Elements

## Suspense, async, and await

## Out-of-Order Streaming

## Bundlers and RSCs

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