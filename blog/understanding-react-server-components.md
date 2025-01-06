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

<small><b>Note:</b> This post is aimed at developers who are familiar with using React. It assumes you know what components and hooks look like.<br /><br />For a deep dive into every aspect of React from scratch, check out my course <b><a href="https://understandingreact.com">Understanding React</a></b> where we dig into React's source code to understand how JSX, components, hooks, forms, and more really work.</small>

## The DOM and Server Rendering
HTML renders fast (how the internet always worked)
You can ask for it again (but you lose state)

## The DOM and Client Rendering
You don't lose state as you change things or make new requests

## Streaming and ReadableStream

## The DOM and Tree Reconciliation
![A representation of the reconciliation process inside React, showing current and work-in-progress branches of the tree which are compared to calculate what updates to make to the real DOM tree.](/assets/blogimages/ReactCompiler_Reconciliation.png)

## React: Flight Data

## React: Streams and Promises

## NextJS: Server Rendering

## NextJS: Streaming Flight Data

## NextJS: ServerRoot and React Elements

## Suspense, async, and await

## Out-of-Order Streaming

## Hooks and RSCs
We now turn out attention to the client. That is, the browser.

## To Hydrate or Not to Hydrate
### RSCs Are Non-Interactive

### But RSCs Are In The Tree

## Refetching and Reconciliation

## The Bundle Size Confusion

## When Should You Use RSCs?

## Other Meta-Frameworks

## Dive Deeper