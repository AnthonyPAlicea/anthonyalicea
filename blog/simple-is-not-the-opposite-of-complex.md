---
layout: post.njk
title: Simple Is Not the Opposite of Complex
excerpt: Complex is Easy, Simple is Hard
date: 2014-05-22
tags: ['post','front-page']
---
![Pool table](/assets/blogimages/billiards1.jpeg)
# {{title}}

My college life was all about education. Mathematics, arts, and sciences were thrown at high speed for high credits. Yet some of the longest lasting lessons didn't come from the classroom - at least not the ones I was paying for. One lesson in particular informed the way I would look at software development and user experience for the rest of my life. It came from pool.

## (Life) Lessons in Billiards

I was a commuter in college, and hung out in the 'commuter lounge'. It wasn't very fancy - there were some lockers, a TV, tables and sofas. But the centerpiece of the inner half of the room was the pool table, and it drew me to the place every day.

I fell hard for the game, playing constantly (for better or worse in regards to my GPA). A graduate student saw my love of it, took pity on me, and offered to train me. He was good. Very good. I accepted, and learned a ton.

One day we were watching two students battling in a game full of tough shots. A crowd had formed, cheering as each student holed a particularly difficult bank shot, or combo, or even the occasional felt-ripping masse.

As one student waved his arms, celebrating his hard-fought victory, I mentioned how good the two students were. My billiards mentor said something to me that I'll never forget:

>"The guy that makes hard shot after hard shot isn't the one you have to worry about; the guy making easy shot after easy shot is. The guy who always has easy shots knows how to leave the cue ball where he wants - the guy who has to keep making hard shots has no control."

It was so obvious once he said it. The victorious student celebrating in front of me morphed from the best player in the room to the most pitiable. Later, I reduced the thought to:

>The best make the problem look easy to solve. The rest celebrate solving the problems they create.

I see this truth again and again, especially in the realm of software. It manifests in software requirements, software architecture, and user experience design. Let's talk about how.

## Requirements: What You Need, Not What You Want
How many features does your software need? If you ask anyone who has to pay for software: 'should it do X', the answer is almost always 'Yes'. Ask someone who has to use the software on a daily basis, and the answer may be quite different. Why?

Because those using software (employees) generally are more aware of what is needed, and those paying for software (managers, bosses, owners) are generally more aware of what they want.

Does that mean managers/bosses/owners don't know their companies? At a high level of course they do - but building software highlights the kinds of tiny details that the day-to-day users develop habits to cope with.

I find the best project and product managers help to define software requirements based on needs as seen through existing habit, not wants as seen through RFQs. Users tend to fill holes in process through their own habits. Define how users are already working around a process, and you'll define truly helpful software.

Yet there is such an emotional pull to the idea of just adding features. Giving the number of features priority makes you feel like you're adding value, but really may show that you don't understand the needs. If you truly understand a business or process, you can express its simplest form via the software supporting it.

Deeply understanding the process you intend to digitize is far more valuable than inventing new features. If you understand you can prune away the excess feature wants and get to the heart of habitual feature needs - improving process and filling holes no one but a few on the ground knew was there.

![Pool table](/assets/blogimages/billiards2.jpeg)

**The Best Project Managers:**
Define a feature set that expresses the patterns of a business or process in simplest form.

**The Rest:**
Add features without stopping to understand if they are really needed or how they will be used. The result is a labyrinth that users will have to navigate, and ultimately will celebrate overcoming through new workaround habits they form.

## Coding: Frameworks and Futurists

Why does a coder code? The answer is the same as why an artist paints, or a musician plays. Because they enjoy the act of creation in that medium.

They enjoy solving a problem, and expressing that solution in code that didn't exist before they put their fingers to the keyboard.

Yet that love of the act of creation can cause a coder to be the ruin of a project, or even an entire business. Why? Because 'time is money', and time creating (and then maintaining) comes with a cost.

There are two primary ways in which coders become a weight that drags down the very processes they are trying to support, and they both involve unnecessary complexity: When coders become framework builders and futurists.

## The Framework Builder

This is the coder that seems to believe that every problem, no matter how simple, should be solved via a complex code structure (i.e. a framework). They build a layers upon layers of interconnecting code, all to support perhaps the simplest of software.

The problems become apparent quickly. Bugs galore. Difficulty in adding new features or making changes on the fly. Missed deadlines. Budget overruns. But the coder insists they are building it 'the right way' and scoffs at any suggestion otherwise.

Why does the coder insist on unnecessary complexity and then use that complexity to excuse problems?

<small>Note: Sometimes problems really do require complex solutions, but those are the rare cases. Even then, modularity and reusability are not synonymous with layer upon layer of framework code.</small>

Because - the average coder doesn't care all that much about the code he's already written. The code in production is humming away doing its job. Maintenance is a chore, not a joy.

<small>Note: Writing lots of complex code increases the need for maintenance. So, ironically, the love of writing new code leads the coder to spend less time writing it in the long run.</small>

Coders care about the code they're creating right now, at this very moment. That's where they're happy; and creating a full, complex framework keeps them in that emotional space, feeling like they're building something of greater worth than it may actually be.

Framework builders build because they love it. But they create complexity where there is none, possibly hurting others along the way - and his or her emotions keep them from seeing it. In the end the coder who minimizes complexity may be more emotionally mature.

Frameworks should only be as built out as necessary. No more, no less.

## The Futurist

Closely connected to the framework builder is the futurist. They too love the act of creation. But their reasoning is not to 'do it the right way' but to do it 'just in case it's needed'.

Code is added to support every possible use case the coder can think of, regardless of being specified by the current software requirements or not. If questioned on it they present it as obviously useful because 'if you need it it will already be there.'

The complexity that handling all those possibilities adds, though, gives either no help or hurts the real needs of the software. It's the coding equivalent of putting wings on a car in case some day the owner wants to fly.

In this case the simplest solution is implementing what is needed, and the complexity comes from trying to predict the future. There is a difference between building a flexible system, and a presumptuous one.

A flexible system makes it easy to add features, and adjust existing ones. It's modular and agile, with clear separation of concerns. However, a presumptuous system is built when the coder assumes that they can think of and handle every possible future situation - even if the business itself isn't planning on it.

We cannot say 'I'm a coder, don't bother me about the business' when asked to consider the business' financial situation while coding…and then the next moment write extra code to handle things 'in case the business needs it.' That's disingenuous.

We're coders. Not futurists. Don't try to handle future scenarios that only you have thought of, even though it's fun. Keep your code real, and enjoy building what's really needed.

![Pool table](/assets/blogimages/billiards3.jpeg)

**The Best Coders:**
Build flexible, modular systems that provide only the functionality that is needed. Code exists to serve a purpose, not just an emotional need.

**The Rest:**
Build for the love of it, but to the exclusion of reasonableness, creating complexity where none exists.

## User Experience: Tasks Expressed as Software

Software is the digital expression of a series of tasks. Even the most complex software can be broken down into distinct, individual tasks because although humans may think about more than one task at a time, that's all they can execute.

That underscores the need for the designer to reduce cognitive load. Humans can only keep so much information in their head. The software should help them focus on one task at a time, and not expect them to remember or learn too much.

Managers and clients, however, will not be thinking along those lines. The pressure and expectations of software development force designers into user experiences that are unnecessarily cluttered and complex.

## It Isn't Really That Complicated

The first reaction heard when talking about keeping software simple is: "that works unless the requirements are complex". That reaction is emotional. Either pressure, expectation, or ego is saying to you that the problem is so complex that the software must be as well. But no problem is so complex that it cannot be broken down into simpler problems.

Designers need to push back against the idea that a process is 'complicated' and therefore the software needs twenty buttons and five sortable, filterable grids on every screen. It doesn't. A user won't look at a screen and read all the interface elements - they will hunt for the one element that matches the task that are currently attempting to accomplish.

Don't let deadlines, changing requirements, and feature creep force you into a UX corner. Understand the process you are designing the software to enable; to the degree that you can express it in its simplest forms. If the problem feels too large, break it down into smaller problems and build software that solves those - then link them together.

There is another source of complexity though…and it's one that designers create for ourselves.

## It's User Experience Design, Not Just Design

Designers are artists. Much like coders they are designing to create and can get just as caught up in design as coders get caught up in code.

A designer may choose an interface style because it's new and popular, not necessarily because it's the best fit for the job. They may choose a pallet that's fun to work with but a nightmare for a user to stare at for hours a day. They may choose a design that works well in photoshop but is terrible to implement in reality.

Graphics design is not user experience design. It's a subset, but must be tempered by other elements of the discipline: psychology, empathy, and user testing (i.e. humility).

By focusing more on the emotional satisfaction of graphic design, and not on the emotional satisfaction of happy users, we build unnecessary paths of complexity into our designs that may ultimately lead to failure. Then it won't matter…because no one will see our designs anyway.

User experience design can be wonderfully rewarding. But falling for the myth of 'it's complicated', or getting overly caught up in our own creations, can ultimately rob of us of that joy. Keep your designs simple and reasonable. Your users will thank you.

![Pool table](/assets/blogimages/billiards4.jpeg)

**The Best Designers:**
Understand then reduce a process down to a series of tasks, as granular as reasonable, and express them as software interfaces.

**The Rest:**
Design software interfaces to match the perceived complexity of its creators or their own imagination, but to the users' detriment.

## What Is Simple?

In the context of software, simple and complex are not opposites. The lesson of the hard-shot-taking pool player is this:

**The opposite of simple is 'poorly controlled'**

Poor control of features, poor control of needless architecture, poor control of interface clutter.

Simple is not the opposite of complex. Simple is the distillation of the complex. It's making a seemingly hard problem appear simple through comprehension and skill.

Complexity is easy to create, yet in software discussion, development, and design we celebrate it. Then that complexity is used to excuse the problems the complexity itself creates.

On the other hand, it's hard to be simple. To express something simply you must truly understand it.

Whether it's features that show a firm grasp of process, code that demonstrates restraint, or user experience design that expresses a task naturally; we should all strive for simple.

The simpler, the better.