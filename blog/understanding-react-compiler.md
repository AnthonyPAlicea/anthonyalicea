---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Memoize All The Things
date: 2024-06-01
og_image: 'assets/react-compiler.png'
---
# {{ title }}

React's core architecture means it calls the functions you give it (i.e. your components) over and over. This fact both contributed to its popularity by simplifying its mental model, and caused a performance inflection point. In general, if your functions do expensive things, then your app will be slow.


## React's Core

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