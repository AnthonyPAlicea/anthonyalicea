---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Memoize All The Things
date: 2024-06-01
og_image: 'assets/react-compiler.png'
---
# {{ title }}

React's core architecture calls the functions you give it (i.e. your components) over and over. This fact both contributed to its popularity by simplifying its mental model, and caused a performance inflection point. In general, if your functions do expensive things, then your app will be slow.

Performance tuning, therefore, became a pain point for devs, as they had to manually tell React which functions should be re-run and when. The React team has now provided a tool called the React Compiler to do that manual work performance tuning for devs, by rewriting their code.

What does React Compiler do to your code? How does it work under-the-hood? Should you use it? Let's dive in.

## React's Core Architecture


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


## Abstractions and Debugging


## Dive Deeper
I read every line of React's source code, and then every line of React Compiler's source code. Why? So I could explain React from the internals level, under-the-hood.

I find that most devs using React have an inaccurate mental model of how it works, which greatly impacts how they build and debug React-based applications. But you <em>can</em> understand React deeply.

If you found this blog post helpful, you might be interested in doing a similar deep dive across all of React's features in my 16.5 course <a href="https://understandingreact.com">Understanding React</a>. You get lifetime access, all source code, and a certificate of completion.

New content on React 19 features and React Compiler is coming to the course, free to students who are already enrolled. I invite you to <a href="https://understandingreact.com">enroll now</a> and join me on a journey of, not imitating, but understanding.

-- Tony