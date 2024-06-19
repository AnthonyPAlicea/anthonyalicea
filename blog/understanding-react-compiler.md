---
layout: post.njk
title: "Understanding React Compiler"
excerpt: Cache all the things. How React Compiler works under-the-hood.
date: 2024-06-19
og_image: 'assets/react-compiler.png'
tags: ['post','front-page']
---
# {{ title }}

React's core architecture calls the functions you give it (i.e. your components) over and over. This fact both contributed to its popularity by simplifying its mental model, and created a point of possible performance issues. In general, if your functions do expensive things, then your app will be slow.

Performance tuning, therefore, became a pain point for devs, as they had to manually tell React which functions should be re-run and when. The React team has now provided a tool called the React Compiler to automate that manual work performance tuning for devs, by rewriting their code.

What does React Compiler do to your code? How does it work under-the-hood? Should you use it? Let's dive in.

<small>For a deep dive through *all* the features of React, check out my new course <b><a href="https://understandingreact.com?coupon_code=COMPILER">Understanding React</a></b> where we dig into React's source code.</small>

## Compilers, Transpiler, and Optimizers

We hear the terms compiler, transpiler, and optimizer thrown about the modern JavaScript ecosystem. What are they?

<h3>Transpilation</h3>

A transpiler is a program that analyzes your code and outputs functionally equivalent code in a different programming language, or an adjusted version of your code in the same programming language.

React devs have been using a transpiler for years to convert JSX to the code that is actually run by the JavaScript engine. JSX is essentially shorthand for building trees of nested function calls (which then build trees of nested objects). 

Writing nested function calls is cumbersome and error-prone, so JSX makes the developer's life easier, and a transpiler is needed to analyze the JSX and convert it into those function calls.

For example, if you wrote the following React code using JSX:

<small>Note that, for ease of reading, all code in this blog post is intentionally oversimplified.</small>
```js
function App() {
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

it becomes, after transpilation:

```js
function App() {
  return _jsx(Item, {
    item: item
  });
}

function Item({ item }) {
  return _jsx("ul", {
    children: _jsx("li", {
      children: item.desc
    })
  });
}
```
This is the code that is actually sent to the browser. Not HTML-like syntax, but nested function calls passing plain JavaScript objects that React calls 'props'.

<small>The result of transpilation shows why you can't use if-statements easily inside JSX. You can't use if-statements inside function calls.</small>

You can quickly generate and examine the output of transpiled JSX using <a href="https://babeljs.io/repl">Babel</a>.

<h3>Compilation and Optimization</h3>

So what's the difference between a transpiler and a compiler? It depends on who you ask, and what their education and experience is. If you come from a computer science background you might have mostly been exposed to compilers as a program that converts the code you write into machine language (the binary code that a processor actually understands). 

However, "transpilers" are also called "source-to-source compilers". Optimizers are also called "optimizing compilers". Transpilers and optimizers are types of compilers!

Naming things is hard, so there will be disagreement about what constitutes a transpiler, compiler, or optimizer. The important thing to understand is that transpilers, compilers, and optimizers are programs that take a text file containing your code, analyze it, and produce a new text file of different but functionally equivalent code. They may make your code better, or add abilities that it didn't have before by wrapping bits of your code in calls to other people's code. 

<blockquote>Compilers, transpilers, and optimizers are programs that take a text file containing your code, analyze it, and produce different but functionally equivalent code.</blockquote>

That last part is what React Compiler does. It creates code functionally equivalent to what you wrote, but wraps bits of it in calls to code the React folks wrote. In that way, your code is rewritten into something that does what you intended, plus more. We'll see exactly what the "more" is in a bit.

<h3>Abstract Syntax Trees</h3>

When we say your code is "analyzed", we mean the text of your code is parsed character-by-character and algorithms are run against it to figure out how to adjust it, rewrite it, add features to it, etc. The parsing usually results in an abstract syntax tree (or AST).

While that sounds fancy, it really is just a tree of data that represents your code. It is then easier to analyze the tree, rather than the code you wrote.

For example, let's suppose you have a line in your code that looks like this:

```js
const item = { id: 0, desc: 'Hi' };
```

the abstract syntax tree for that line of code might end up looking something like this:

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
The generated data structure describes your code as you wrote it, breaking it down into small defined pieces containing both what type of thing the piece is and any values associated with it. For example <code>desc: 'Hi'</code> is an <code>ObjectProperty</code> with a <code>key</code> called 'desc' and a <code>value</code> of 'Hi'.

This is the mental model you should have when you imagine what is happening to your code in a transpiler/compiler/etc. People wrote a program that takes your code (the text itself), converts it into a data structure, and performs analysis and work on it.

The code that is generated ultimately comes from this AST as well as perhaps some other intermediate languages. You can imagine looping over this data structure and outputting text (new code in the same language or a different one, or adjusting it in some way). 

In the case of React Compiler it utilizes both an AST and an intermediate language to generate new React code from the code you write. It's important to remember that React Compiler, like React itself, is just <em>other people's code</em>.

When it comes to compilers, transpilers, optimizers, and the like, don't think of these tools as mysterious black boxes. Think of them as things that you could build, if you had the time.

## React's Core Architecture
Before we move on to React Compiler itself, there's a few more concepts we need to have clear.

Remember that we said React's core architecture is both a source of its popularity, but also a potential performance issues? We saw that when you write JSX, you're actually writing nested function calls. But you are giving your functions to React, and it will decide when to call them.

Let's take the beginnings of a React app for dealing with a large list of items. Let's suppose our <code>App</code> function gets some items, and our <code>List</code> function processes and shows them.

```js
function App() {
    // TODO: fetch some items here
    return <List items={items} />;
}

function List({ items }) {
    const pItems = processItems(items);
    const listItems = pItems.map((item) => <li>{ item }</li>);
    return (
        <ul>{ listItems }</ul>
    )
}
```
Our functions return plain JavaScript objects, like a <code>ul</code> object which contains its children (which here will end up being multiple <code>li</code> objects). Some of these objects like <code>ul</code> and <code>li</code> are built-in to React. Others are the ones we create, like <code>List</code>.

Ultimately, React will build a tree from all these objects called the Fiber tree. Each node in the tree is called a Fiber or Fiber node. The idea of creating our own JavaScript object tree of nodes to describe a UI is called creating a "Virtual DOM".

![React Fiber Tree](/assets/blogimages/ReactCompiler_FiberTree.png)

React will compare the results of this tree to the real DOM in the browser, and decide how to update the DOM so that the DOM matches the tree created from what our functions return. This process is called "reconciliation".

Then, depending on what other functionality we add to our app, React may choose to call our <code>List</code> function over and over, whenever it thinks the UI might need to be updated. This makes our mental model fairly straightforward. Whenever the UI might need to be updated (for example, in response to a user action like clicking a button), the functions that define the UI will be called again, and React will figure out how to update the actual DOM in the browser to match how our functions say the UI should look.

But if the <code>processItems</code> function is slow, then every call to <code>List</code> will be slow, and our whole app will be slow as we interact with it!

## Memoization
A solution in programming to deal with repeated calls to expensive functions is to cache the results of the function. This process is called memoization.

For memoization to work, the function must be "pure". That means that if you pass the same inputs to the function, you <em>always</em> get the same output. If that's true, then you can take the output and store it in a way that it's related to the set of inputs. 

The next time you call the expensive function, we can write code to look at the inputs, check the cache to see if we've already run the function with those inputs, and if we have, then grab the stored output from cache rather than calling the function again. No need to call the function again since we know the output will be the same as the last time those inputs were used.

If the <code>processItems</code> function from the previous used implemented memoization it might look something like:

```js
function processItems(items) {
    const memOutput = getItemsOutput(items);
    if (memOutput) {
        return memOutput;
    } else {
        // ...run expensive processing
        saveItemsOutput(items, output);
        return output;
    }
}
```
We can imagine that the <code>saveItemsOutput</code> function stores an object that saves both items and the associated output from the function. The <code>getItemsOutput</code> will look to see if <code>items</code> is already stored, and if it is we return the related cached output without doing any more work.

For React's architecture of calling functions over and over, memoization becomes a vital technique for helping to keep apps from becoming slow. 

## Hook Storage
There's one more piece of React's architecture to understand in order to understand React Compiler.

React will look at calling your functions again if the "state" of the app changes, meaning the data that the creation of the UI is dependent on. For example a piece of data might be "showButton" which is true or false, and the UI should show or hide the button based on the value of that data.

React stores state on the client's device. How? Let's take the React app that will render and interact with a list of items. Suppose we will eventually store a selected item, process the items client side for rendering, handle events, and sort the list. Our app might start to look something like below.

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
React combines the idea of memoization and its idea of hook storage. You can memoize the results of entire functions you give React that are part of the Fiber Tree (like <code>List</code>), or individual functions you call within them (like <code>processItems</code>).

Where is the cache stored? On the Fiber tree, just like state! For example the <code>useMemo</code> hook stores the inputs and outputs on the node that calls <code>useMemo</code>.

So, React already has the idea of storing the results of expensive functions in linked lists of JavaScript objects that are part of the Fiber Tree. That's great, except for one thing: maintenance.

Memoization in React can be cumbersome, because you have to explicitly tell React what inputs the memoization depends on. Our call to <code>processItems</code> becomes:

```js
const pItems = useMemo(processItems(items), [items]);
```

The array at the end being the list of 'dependencies', that is the inputs that, if changed, tell React the function should be called again. You have to make sure you get those inputs right, or memoization won't work properly. It becomes a clerical chore to keep up with.

## React Compiler
Enter React Compiler. A program that analyzes the text of your React code, and produces new code ready for JSX transpilation. But that new code has some extra things added to it.

Let's look at what React Compiler does to our app in this case. Before compilation it was:

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
after compilation it becomes:
```js
function App() {
  const $ = _c(1);

  let t0;

  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <List items={items} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }

  return t0;
}

function List(t0) {
  const $ = _c(6);

  const { items } = t0;
  useState(null);
  let t1;

  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {};
    $[0] = t1;
  } else {
    t1 = $[0];
  }

  useReducer(reducer, t1);
  useState(0);
  let t2;

  if ($[1] !== items) {
    const pItems = processItems(items);
    let t3;

    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
      t3 = (item) => <li>{item}</li>;

      $[3] = t3;
    } else {
      t3 = $[3];
    }

    t2 = pItems.map(t3);
    $[1] = items;
    $[2] = t2;
  } else {
    t2 = $[2];
  }

  const listItems = t2;
  let t3;

  if ($[4] !== listItems) {
    t3 = <ul>{listItems}</ul>;
    $[4] = listItems;
    $[5] = t3;
  } else {
    t3 = $[5];
  }

  return t3;
}
```
That's a lot! Let's break down a bit of the now rewritten <code>List</code> function to understand it.

It starts off with:

```js
const $ = _c(6);
```
That <code>_c</code> function (think "c" for "cache") creates an array that's stored using a hook. React Compiler analyzed our <code>Link</code> function and decided, to maximize performance, we need to store six things. When our function is first called, it stores the results of each of those six things in that array.

It's the subsequent calls to our function where we the cache in action. For example, just looking at the area where we call <code>processItems</code>:

```js
if ($[1] !== items) {
    const pItems = processItems(items);
    let t3;

    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = (item) => <li>{item}</li>;
        $[3] = t3;
    } else {
        t3 = $[3];
    }

    t2 = pItems.map(t3);
    $[1] = items;
    $[2] = t2;
} else {
    t2 = $[2];
}
```
The entire work around <code>processItems</code>, both calling the function and generating the <code>li</code>s, is wrapped in a check to see if the cache in the second position of the array (<code>$[1]</code>) is the same input as the last time the function was called (the value of <code>items</code> which is passed to <code>List</code>).

If they are equal, then the third position in the cache array (<code>$[2]</code>) is used. That stores the generated list of all the <code>li</code>s when <code>items</code> is mapped over. React Compiler's code says "if you give me the same list of items as the last time you called this function, I will give you the list of <code>li</code>s that I stored in cache the last time".

If the <code>items</code> passed is different, then it calls <code>processItems</code>. Even then, it uses the cache to store what <em>one</em> list item looks like. 

```js
if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = (item) => <li>{item}</li>;
    $[3] = t3;
} else {
    t3 = $[3];
}
```
See the <code>t3 =</code> line? Rather than recreating the arrow function that returns the <code>li</code>, it stores the <em>function itself</em> in the fourth position in the cache array (<code>$[3]</code>). This saves the JavaScript engine the work of creating that small function the next time <code>List</code> is called. Since that function never changes, the initial if-statement is basically saying "if this spot in the cache array is empty, cache it, otherwise get it from cache".

In this way, React caches values and memoizes the results of function calls automatically. The code it outputs is functionally equivalent to the code we wrote, but includes code to cache these values, saving performance hits when our functions are called over and over by React.

React Compiler is caching, though, at a more granular level than what a dev typically does with memoization, and is doing so automatically. This means devs don't have to manually manage dependencies, or memoization. They can just write code, and from it React Compiler will generate new code that utilizes caching to make it faster.

It's worth noting that React Compiler is still producing JSX. The code that is <em>actually</em> run is the result of React Compiler after JSX transpilation.

The <code>List</code> function actually run in the JavaScript engine (sent to the browser or on the server) looks like this:

```js
function List(t0) {
  const $ = _c(6);
  const {
    items
  } = t0;
  useState(null);
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {};
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  useReducer(reducer, t1);
  useState(0);
  let t2;
  if ($[1] !== items) {
    const pItems = processItems(items);
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
      t3 = item => _jsx("li", {
        children: item
      });
      $[3] = t3;
    } else {
      t3 = $[3];
    }
    t2 = pItems.map(t3);
    $[1] = items;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  const listItems = t2;
  let t3;
  if ($[4] !== listItems) {
    t3 = _jsx("ul", {
      children: listItems
    });
    $[4] = listItems;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  return t3;
}
```
React Compiler added an array for caching values, and all the needed if-statements to do so. The JSX transpiler converted the JSX into nested function calls. There is a not-insignificant difference between what you wrote and what the JavaScript engine runs. We are trusting other people's code to produce something that matches our original intent.

## Trading Processor Cycles for Device Memory
Memoization and caching in general means trading processing for memory. You save on the processor having to execute expensive operations, but you avoid that by using up space in to store things in memory.

If you use React Compiler, that means you are saying "store as much as you can" in the device's memory. If the code is running on the user's device in the browser, that's an architectural consideration to keep in mind.

Likely, this won't be a real problem for many React apps. But if you are dealing with large amounts of data in your apps, then device memory usage is something you should at least be aware of and keep an eye on if you use React Compiler once it leaves the experimental stage.

## Abstractions and Debugging

Compilation in all its forms amounts to a layer of abstraction between the code you write and the code that is actually being run.

As we saw, in the case of React Compiler, to understand what is actually sent to the browser you need to take your code and run it through React Compiler, and then take <em>that</em> code and run it through a JSX transpiler.

There is a downside to adding layers of abstraction to our code. They can make our code harder to debug. That doesn't mean we shouldn't use them. But you should keep clearly in mind that the code you need to debug isn't just yours, but the code the tool is generating.

What makes a real difference in your ability to debug code generated from an abstraction layer, is to have an accurate mental model of the abstraction. Fully understanding how React Compiler works will give you the ability to debug the code it writes, improving your dev experience and lowering the stress your dev life.

## Dive Deeper
If you found this blog post helpful, you might be interested in doing a similar deep dive across all of React's features in my 16.5 hour course **<a href="https://understandingreact.com?coupon_code=COMPILER">Understanding React</a>**. You get lifetime access, all source code, and a certificate of completion.

I read every line of React's source code, and then every line of React Compiler's source code. Why? So I could explain React from the internals level, under-the-hood.

React itself is a massive abstraction layer on top of web fundamentals. As is the case with so many abstractions, I find that most devs using React have an inaccurate mental model of how it works, which greatly impacts how they build and debug React-based applications. But you <em>can</em> understand React deeply.

New content on React 19 features and React Compiler is coming to the course, free to students who are already enrolled. I invite you to **<a href="https://understandingreact.com?coupon_code=COMPILER">enroll now</a>** and join me on a journey of, not just imitating someone else writing code, but truly understanding what you're doing.

-- Tony