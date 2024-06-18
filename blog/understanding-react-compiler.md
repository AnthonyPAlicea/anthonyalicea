---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Memoize All The Things
date: 2024-06-01
og_image: 'assets/react-compiler.png'
---
# {{ title }}

React's core architecture calls the functions you give it (i.e. your components) over and over. This fact both contributed to its popularity by simplifying its mental model, and created a point of possible performance issues. In general, if your functions do expensive things, then your app will be slow.

Performance tuning, therefore, became a pain point for devs, as they had to manually tell React which functions should be re-run and when. The React team has now provided a tool called the React Compiler to automate that manual work performance tuning for devs, by rewriting their code.

What does React Compiler do to your code? How does it work under-the-hood? Should you use it? Let's dive in.

<small>For a deep dive through *all* the features of React, check out my new course <a href="https://understandingreact.com">Understanding React</a> where we dig into React's source code.</small>

## Compilers, Transpiler, and Optimizers

We hear the terms compiler, transpiler, and optimizer thrown about the modern JavaScript ecosystem. What are they?

<h3>Transpilation</h3>

A transpiler is a program that analyzes your code and outputs functionally equivalent code in a different programming language, or an adjusted version of your code in the same programming language.

React devs have been using a transpiler for years to convert JSX to the code that is actually run by the JavaScript engine. JSX is essentially shorthand for building trees of nested function calls (which then build trees of nested objects). 

Writing nested function calls is cumbersome and error-prone, so JSX makes the developer's life easier, and a transpiler is needed to analyze the JSX and convert it into those function calls.

<small>Note that, for ease of reading, all code in this blog post is intentionally oversimplified.</small>

<h3>Compilation and Optimization</h3>

So what's the difference between a transpiler and a compiler? It depends on who you ask, and what their education and experience is. If you come from a computer science background you might have mostly been exposed to compilers as a program that converts the code you write into machine language (the binary code that a processor actually understands). 

However, "transpilers" are also called "source-to-source compilers". Optimizers are also called "optimizing compilers". Transpilers and optimizers are types of compilers!

Naming things is hard, so there will be disagreement about what constitutes a transpiler, compiler, or optimizer. The important thing to understand is that transpilers, compilers, and optimizers are programs that take a text file containing your code, analyze it, and produce a new text file of different but functionally equivalent code. They may make your code better, or add abilities that it didn't have before by wrapping bits of your code in calls to other people's code. 

<blockquote>Compilers, transpilers, and optimizers are programs that take a text file containing your code, analyze it, and produce different but functionally equivalent code.</blockquote>

That last part is what React Compiler does. It creates code functionally equivalent to what you wrote, but wraps bits of it in calls to code the React folks wrote. In that way, your code is rewritten into something that does what you intended, plus more. We'll see exactly what the "more" is in a bit.

<h3>Abstract Syntax Trees</h3>

When we say your code is "analyzed", we mean the text of your code is literally parsed and algorithms are run against it to figure out how to adjust it, rewrite it, add features to it, etc. The analyzing usually results in an abstract syntax tree (or AST).

While that sounds fancy, it really is just a tree of data that represents your code. It is then easier to analyze the tree, rather than the code you wrote.

For example, let's suppose the React code you write looks like this:

```js
function App() {
    const item = { id: 0, desc: 'Hi' };
    return <Item item={item} />;
}

function Item({ item }) {
    return (
        <ul>
            <li>{ item.desc }</li>
        </ul>
    )
}
```
<small>Note that, for ease of reading, all code in this blog post is intentionally oversimplified.</small>

the conversion of the <code>const</code> line of code into an abstract syntax tree might end up looking something like this:

```js
{
    type: VariableDeclarator,
    id: {
        type: Identifier,
        name: Item
    },
    init: {
        type: ObjectExpression,
        properties: [
            {
                type: ObjectProperty,
                key: id,
                value: 0
            },
            {
                type: ObjectProperty,
                key: desc,
                value: 'Hi'
            }
        ]
    }
}
```

When you imagine what is happening to your code when it is run through a transpiler/compiler/etc., you should have this mental model. People wrote a program that takes your code, converts it into a data structure, and performs analysis and work on it.

The code that is generated ultimately comes from this AST as well as perhaps some other intermediate languages. You can perhaps imagine looping over this data structure and outputting text (new code in the same as the original language or another).

When it comes to compilers, transpilers, optimizers, and the like, don't think of these tools as mysterious black boxes. Think of them as things that you could build, if you had the time.

## React's Core Architecture

```js
function App() {
    const item = { id: 0, desc: 'Hi' };
    return <Item item={item} />;
}

function Item({ item }) {
    return (
        <ul>
            <li>{ item.desc }</li>
        </ul>
    )
}
```


## Memoization and Caching


## Hook Storage
React stores state on the client's device. How? Let's take the beginnings of a React app that will render and interact with a list of items. Suppose we will eventually store a selected item, process the items client side for rendering, handle events, and sort the list. Our app might start to look something like below.

```js
function App() {
    // TODO: fetch some items here
    return <List items={items} />;
}

function List({ items }) {
    const [selItem, setSelItem] = useState(null);
    const [itemEvent, dispatcher] = useReducer(reducer, {});
    const [sort, setSort] = useState(0);

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

<small>How hooks are stored also explains the "rule of hooks" that you can't call a hook inside a loop or an if-statement. Every time you call a hook, React moves to the next item in the linked list. Thus, the number of times you call hooks must be consistent, or React would sometimes be pointing at the wrong item in the linked list.</small>

Ultimately, hooks are just objects designed to hold data (and functions) in the user's device memory. This is key to understanding what React Compiler really does. But there's more.

## Memoization in React


## React Compiler


## Trading Processor Cycles for Device Memory


## Abstractions and Debugging

Compilation in all its forms amounts to a layer of abstraction between the code you write and the code that is actually being run.

In the case of React Compiler, to understand what is actually sent to the browser, you need to take your code and run it through React Compiler, and then take <em>that</em> code and run it through a JSX transpiler.

There is a downside to adding layers of abstraction to our code. They can make our code harder to debug. That doesn't mean we shouldn't use them. But you should keep clearly in mind that the code you need to debug isn't just yours, but the code the tool is generating.

What makes a real difference in your ability to debug code generated from an abstraction layer, is to have an accurate mental model of the abstraction. Fully understanding how React Compiler works will give you the ability to debug the code it writes, improving your dev experience and lowering the stress your dev life.

## Dive Deeper
If you found this blog post helpful, you might be interested in doing a similar deep dive across all of React's features in my 16.5 hour course **<a href="https://understandingreact.com">Understanding React</a>**. You get lifetime access, all source code, and a certificate of completion.

I read every line of React's source code, and then every line of React Compiler's source code. Why? So I could explain React from the internals level, under-the-hood.

React itself is a massive abstraction layer on top of web fundamentals. As is the case with so many abstractions, I find that most devs using React have an inaccurate mental model of how it works, which greatly impacts how they build and debug React-based applications. But you <em>can</em> understand React deeply.

New content on React 19 features and React Compiler is coming to the course, free to students who are already enrolled. I invite you to **<a href="https://understandingreact.com">enroll now</a>** and join me on a journey of, not just imitating someone else writing code, but truly understanding what you're doing.

-- Tony