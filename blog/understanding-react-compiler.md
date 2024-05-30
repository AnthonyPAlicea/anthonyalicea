---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Memoize All The Things
date: 2024-06-01
---
# {{ title }}

*In Progress*

All software development tools have pain points. In the case of React, a pain point is performance tuning.

Many JavaScript frameworks and libraries, like Solid JS, Svelte, Qwik, and Angular deal with performance by designing their core architecture with performance in mind (such as by relying on Signals), and often by including a compiler as part of their toolchain.

React, on the other hand, while it has made large strides in improving its underlying architecture over the years, has a core performance bottleneck that developers have had to deal with manually. To deal with this, the React team has created its own compiler, to help developers using React to improve their app's performance with no work on the developer's part required.

How does React Compiler accomplish this? What is really happening under-the-hood? How will it help you build more performant React apps? To understand that fully, we need to understand a bit about React's core architecture and how it implements the concepts of memoization and caching. Let's dive in.

## Memoization and Caching


## Hook Storage
React stores state on the client's device. How? Let's take a simplistic React app:

```js
function Counter() {
    let clicks = useState(0);

    return <CounterView clicks={clicks} />;
}

function CounterView(clicks) {
    return <p>{ clicks }</p>;
}
```
What is really happening here when the ```useState``` line is executed by the JavaScript engine?

## Memoization in React


## Compilers, Transpiler, and Optimizers


## Compilation in React


## Wait, There's Transpilation Too!


## Trading Processor Cycles for Device Memory