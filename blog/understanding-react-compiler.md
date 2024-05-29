---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Memoize All The Things
date: 2024-06-01
---
# {{ title }}

*In Progress*

All software development tools have pain points. In the case of React, a pain point is performance tuning.

Many JavaScript frameworks and libraries, like Solid JS, Svelte, Qwik, and Angular deal with performance by designing their core architecture with performance in mind (such as by relying on Signals), and often by including a compiler as part of their toolchain. The React team has created its own compiler, to help developers using React to improve their app's performance with no work on the developer's part required.

How does React Compiler accomplish this? What is really happening under-the-hood? How will it help you build more performant apps? To understand that fully, we need to understand a bit about React's core architecture as well as the concepts of memoization and caching. Let's dive in.

## Memoization and Caching


## Hook Storage
It is extremely common in a React application to see code like this:

```js
function FriendList() {
    let id = useState();

    return <Friend />;
}
```
What is really happening here when we see ```useState```?

## Memoization in React


## Compilers, Transpiler, and Optimizers


## Compilation in React


## Wait, There's Transpilation Too!


## Trading Processor Cycles for Device Memory