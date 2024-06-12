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

<small>For a deep dive through *all* the features of React, check out my new course <a href="https://understandingreact.com">Understanding React</a> where we dig into React's source code.</small>

## React's Core Architecture


## Memoization and Caching


## Hook Storage
React stores state on the client's device. How? Let's take the beginnings of a React app that will render and interact with a list of items. Suppose we will eventually store a selected item, process the items client side for rendering, handle events, and sort the list. Our app might start to look something like this:

```js
function App() {
    return <List items={items} />;
}

function List(items) {
    const [selItem, setSelItem] = useState(...);
    const [itemEvent, dispatcher] = useReducer(...);
    const [sort, setSort] = useState(...);

    const pItems = processItems(items);
    const listItems = pItems.map((item) => <li>{ item }</li>);
    return (
        <ul>{ listItems }</ul>
    )
}
```
What is really happening here when the ```useState``` and ```useReducer``` lines are executed by the JavaScript engine? The node of the Fiber tree created from our ```List``` component has some more JavaScript objects attached to it to store our data. Each of those objects is connected to each other in a data structure called a linked list.

<small>By the way, a lot of devs think ```useState``` is the core unit of state management in React. But it isn't! It's actually a wrapper for a simple call to ```useReducer```.</small>

<div class="video"><video loop autoplay muted playsinline aria-labelledby="video-label" src="/assets/blogvideos/ReactCompiler_Hooks.mp4"></video></div>

So, when you call ```useState``` and ```useReducer```, React will attach the state to the Fiber tree that sits around while our app runs. Thus state remains available as our functions keep re-running.

## Memoization in React


## Compilers, Transpiler, and Optimizers


## Compilation in React


## There's Always Been Transpilation


## Trading Processor Cycles for Device Memory


## Abstractions and Debugging


## Dive Deeper
If you found this blog post helpful, you might be interested in doing a similar deep dive across all of React's features in my 16.5 hour course **<a href="https://understandingreact.com">Understanding React</a>**. You get lifetime access, all source code, and a certificate of completion.

I read every line of React's source code, and then every line of React Compiler's source code. Why? So I could explain React from the internals level, under-the-hood.

I find that most devs using React have an inaccurate mental model of how it works, which greatly impacts how they build and debug React-based applications. But you <em>can</em> understand React deeply.

New content on React 19 features and React Compiler is coming to the course, free to students who are already enrolled. I invite you to **<a href="https://understandingreact.com">enroll now</a>** and join me on a journey of, not imitating, but understanding.

-- Tony