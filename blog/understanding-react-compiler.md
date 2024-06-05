---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Memoize All The Things
date: 2024-06-01
---
# {{ title }}

Removing pain points is the goal of any software designer. 

## What React Does At Its Core

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