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

<small><b>Note:</b> This post is aimed at developers who are familiar with using React. It assumes you know what components and hooks look like. It's also assumed your familiar with Promises, async, and await in JavaScript.<br /><br />If not, you can watch my under-the-hood YouTube video on <a href="https://youtu.be/fyGSyqEX2dw?si=MkRII6BoKW8Dm-Ml"><b>Promises, async, and await</b></a>.<br /><br />For a deep dive into every aspect of React from scratch, check out my course <a href="https://understandingreact.com"><b>Understanding React</b></a> where we dig into React's source code to understand how JSX, Fiber, components, hooks, forms, and more really work.</small>

## The DOM and Client Rendering
You don't lose state as you change things or make new requests.

## The DOM and Tree Reconciliation
![A representation of the reconciliation process inside React, showing current and work-in-progress branches of the tree which are compared to calculate what updates to make to the real DOM tree.](/assets/blogimages/ReactCompiler_Reconciliation.png)

## The DOM and Server Rendering
Moving forward in this story means moving backwards in time.

HTML renders fast (how the internet always worked)

You can ask for it again (but you lose state)

Close to the database or file storage for data access

Developers have been able to server-render React components (SSR) for a long time. The server generates an HTML string to send to the client, **but** the JavaScript code for those same React components also had to be sent to the client and executed, so the Virtual DOM could be built from them. React needs **both** trees to work.

This has been the balancing act for many years in web development: server-rendered HTML appears quickly, but DOM updates via client-side JavaScript let you make changes while maintaining the state of the page.

That balance hasn't changed. React has always primarily been about the client, stateful side of things. Server components add the ability to intermingle React components that execute on the server with React components that execute on the client *without* sending the server component's code over, and the possibility of initially rendering HTML on the server, before beginning to update the DOM in the browser.

How?

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

## Rendering HTML
Remember we said that initially rendering HTML from RSCs was a "possibility". That's because it's optional - it's up to the meta-framework if it does so or not. But it makes sense to do so.

Remember we said *perceived performance* was an important metric. If you're already executing code on the server, and you can stream back HTML, you should, because the browser will render that HTML quickly, resulting in a faster perceived experience for the user.

## Streams and Promises
But there are two kinds of performance: actual performance and perceived performance.

With streams the question isn't "what was sent" but "what has been sent *over time*".

## Server Rendering
Remember we said that initially rendering HTML from RSCs was a "possibility". That's because it's optional - it's up to the meta-framework if it does so or not. But it makes sense to do so.

Remember we said *perceived performance* was an important metric. If you're already executing code on the server, and you can stream back HTML, you should, because the browser will render that HTML quickly, resulting in a faster perceived experience for the user.

## Streaming Flight Data

But where does flight data stream *to* really? It must be somewhere in the React codebase. It turns out the answer to that question adds an important player to the RSC story.

## Bundlers and RSCs

## Streaming Flight Data

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