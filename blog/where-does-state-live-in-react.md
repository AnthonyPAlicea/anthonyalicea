---
layout: post.njk
title: "Where Does State Live in React?"
excerpt: A deep dive into React's internal state storage mechanism and the linked list structure that powers Hooks.
date: 2025-07-16
og_image: 'assets/react-state.png'
---

# {{ title }}

When you write `const [count, setCount] = useState(0)` in a React component, where does that state actually live? Most developers understand that state persists between re-renders, but few understand the elegant data structure that React uses to store and manage that state.

The answer lies in a linked list of JavaScript objects attached to nodes in React's internal Fiber tree. Each call to `useState`, `useReducer`, or any other hook creates a node in this linked list, and React navigates through it systematically on every render.

Understanding this internal mechanism not only satisfies intellectual curiosity but also explains the "Rules of Hooks" and helps you debug stateful components more effectively. Let's dive into how React really stores your state.

<small>To gain a complete, accurate mental model of React by deep diving into its internals, check out my new course <b><a href="https://understandingreact.com">Understanding React</a></b> where we dig into React's source code. I've found a deep understanding of React's internals greatly helps even devs with years of React experience.</small>

## The Fiber Tree and State Storage

React doesn't just keep track of your component tree in memory. It maintains a sophisticated data structure called the Fiber tree, where each node represents a component or DOM element. These Fiber nodes are JavaScript objects that contain not just information about what should be rendered, but also where to store state, effects, and other stateful data.

When you create a component that uses hooks, React attaches a linked list of hook objects to that component's Fiber node. Each hook you call in your component creates a new node in this linked list.

Let's examine a simple component:

```js
function Counter() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    const [items, setItems] = useState([]);
    
    return (
        <div>
            <p>{count}</p>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

Inside React's Fiber tree, the node for this `Counter` component has a `memoizedState` property that points to the first hook in a linked list. Each hook object contains:

- `memoizedState`: The current state value
- `next`: A pointer to the next hook in the list
- `queue`: Information about pending updates
- `baseState`: The base state for calculating updates

Here's what the linked list looks like for our `Counter` component:

```js
// Fiber node for Counter component
{
    memoizedState: {
        memoizedState: 0,           // useState(0)
        next: {
            memoizedState: '',       // useState('')
            next: {
                memoizedState: [],   // useState([])
                next: null
            }
        }
    }
}
```

This linked list structure is why the Rules of Hooks exist. React navigates through this list in order during each render, so the number and order of hook calls must be consistent.

## Exploring State in the Browser

You can actually see this linked list structure in action. Here's how to explore React's internal state storage:

1. Open your browser's developer tools
2. Select a DOM element that was rendered by a component using hooks
3. In the console, type `$0` (this references the selected element)
4. Navigate to the React Fiber node: `$0._reactInternalFiber` (or similar property)
5. Examine the `memoizedState` property

For example, if you inspect a counter component's button element:

```js
// In browser console
$0._reactInternalFiber.memoizedState
// This shows you the first hook in the linked list

$0._reactInternalFiber.memoizedState.next
// This shows you the second hook

$0._reactInternalFiber.memoizedState.next.next
// This shows you the third hook
```

<small>Note: The exact property name may vary between React versions. You might need to look for `_reactInternalInstance`, `__reactInternalInstance`, or similar properties.</small>

## useState is Just useReducer

One of the most interesting discoveries when exploring React's source code is that `useState` is not a primitive hook. It's actually a wrapper around `useReducer`, which is the foundational state management hook in React.

Here's what `useState` looks like inside React's source code (simplified):

```js
function useState(initialState) {
    return useReducer(
        (state, action) => {
            return typeof action === 'function' ? action(state) : action;
        },
        initialState
    );
}
```

When you call `useState(0)`, React internally creates a reducer that:
- Returns the action directly if it's a value
- Calls the action if it's a function (for functional updates)

This is why you can do both:
```js
setCount(5);                    // Direct value
setCount(prev => prev + 1);     // Functional update
```

The functional update syntax works because React's internal reducer checks if the action is a function and calls it with the current state.

## The Hook Lifecycle

Understanding how hooks work through the component lifecycle helps explain React's internal state management:

### Initial Render (Mount)
1. React creates a new Fiber node for your component
2. Each hook call creates a new hook object and adds it to the linked list
3. Initial state values are stored in `memoizedState`
4. React stores references to updater functions

### Subsequent Renders (Update)
1. React navigates through the existing linked list
2. Each hook call reads from the corresponding position in the list
3. If state updates are pending, React processes them
4. New state values are calculated and stored

### Hook Navigation
React maintains a pointer to the current hook in the list. Each hook call advances this pointer:

```js
// Simplified React internals
let currentHook = null;
let workInProgressHook = null;

function useState(initialState) {
    if (currentHook === null) {
        // First hook in the component
        currentHook = fiber.memoizedState;
    } else {
        // Subsequent hooks
        currentHook = currentHook.next;
    }
    
    // Process the hook and return [state, setState]
    return [currentHook.memoizedState, currentHook.dispatch];
}
```

## State Updates and Batching

React doesn't immediately update state when you call `setState`. Instead, it schedules updates and batches them for performance. The hook objects contain a `queue` property that holds pending updates:

```js
// Hook object structure
{
    memoizedState: 0,
    queue: {
        pending: null,           // Linked list of pending updates
        dispatch: setCountFunction,
        lastRenderedState: 0
    },
    next: null
}
```

When you call `setState(1)`, React:
1. Creates an update object
2. Adds it to the hook's update queue
3. Schedules a re-render
4. Processes all pending updates during the next render

This batching mechanism is why multiple `setState` calls in the same event handler don't cause multiple re-renders.

## The Rules of Hooks Explained

Now you can understand why the Rules of Hooks exist:

### Rule 1: Only Call Hooks at the Top Level
```js
// L Wrong - conditional hook call
function Component() {
    if (condition) {
        const [state, setState] = useState(0);
    }
    return <div />;
}

//  Correct - hook always called
function Component() {
    const [state, setState] = useState(0);
    return <div />;
}
```

If you call hooks conditionally, React might advance to the wrong position in the linked list on subsequent renders, causing state to be associated with the wrong hook.

### Rule 2: Only Call Hooks from React Functions
Hooks rely on React's internal machinery to maintain the linked list and current hook pointer. They won't work in regular JavaScript functions.

## Debugging State Issues

Understanding React's internal state storage helps you debug common issues:

### Stale Closures
```js
function Counter() {
    const [count, setCount] = useState(0);
    
    const handleClick = () => {
        setTimeout(() => {
            setCount(count + 1); // May use stale value
        }, 1000);
    };
    
    return <button onClick={handleClick}>Count: {count}</button>;
}
```

The issue here is that `count` is captured in the closure when `handleClick` is created. Use the functional update form to avoid this:

```js
setCount(prevCount => prevCount + 1); // Always uses current value
```

### Hook Order Changes
If you accidentally change the order of hooks between renders, React will associate state with the wrong hooks because it navigates the linked list positionally.

## Performance Implications

React's linked list approach for hook storage has several performance benefits:

1. **Memory Efficiency**: Hook objects are small and only contain necessary data
2. **Fast Navigation**: Linked list traversal is O(n) but n is typically small
3. **Batching**: Updates are efficiently batched before processing
4. **Sharing**: Multiple components can share the same hook logic without overhead

## Looking at Real React Code

You can explore React's actual hook implementation in the React repository. Look for files like:

- `ReactFiberHooks.js` - Main hook implementation
- `ReactUpdateQueue.js` - Update batching logic
- `ReactFiberReconciler.js` - Fiber tree management

The real code is more complex than our simplified examples, but the core concepts remain the same.

## Conclusion

State in React lives in a linked list of hook objects attached to Fiber nodes. Each hook call creates or accesses a node in this list, and React navigates through it systematically during each render. Understanding this internal mechanism:

- Explains why the Rules of Hooks exist
- Helps you debug state-related issues
- Provides insight into React's performance characteristics
- Reveals that `useState` is just a wrapper around `useReducer`

The next time you write `const [state, setState] = useState(value)`, you'll know exactly where that state lives: in a JavaScript object, in a linked list, attached to a Fiber node, in React's internal tree structure.

## Dive Deeper

If you found this exploration helpful, you might be interested in my course **<a href="https://understandingreact.com">Understanding React</a>** where we dive deep into React's source code together. We explore not just hooks and state, but the entire React ecosystem from the ground up.

Understanding how your tools work under the hood makes you a more effective developer. It's the difference between knowing what to do and understanding why.

-- Tony