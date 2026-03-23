---
layout: post.njk
title: "Why AI-Assisted Development Is More Exhausting Than It Should Be"
excerpt: "Developers used to move between three cognitive modes. AI has collapsed that cycle."
date: 2026-03-23
og_image: 'assets/singlemode_twitter_card.png'
tags: ['post','front-page']
---
# {{ title }}

The promise of AI-assisted development is that it should make developers' lives easier. In some ways it does. Yet I see many developers suffering from post-LLM burnout and exhaustion.

In part, it is because of the unrealistic expectations of the organizations they work for, caught up in AI hype and FOMO.

However, I am seeing another issue. And it's one rooted in the psychology of human-computer interaction (HCI).

## Cognitive Modes

When you consider user behavior from an HCI perspective, you might think about "modes". A "mode" is a distinct state in which the same interface produces different behavior. But modes aren't just states of the interface. They're states of the *user*.

Imagine someone using a project management app. When they're scanning the board, they're in a reading mode, absorbing the state of things. When they're creating a task, they're in input mode, making decisions about what to write and how to categorize it. When they're reviewing a teammate's task before marking it done, they're in an evaluation mode.

Same app, perhaps the same screen, but three different cognitive states. Each uses different mental resources, and rotating between them is part of what makes the work feel varied rather than grinding.

Software development has always had these kinds of modes. And until recently, the natural rhythm of work kept developers moving between them.

## Planning, Implementation, and Integration

There are at least three modes of work in software development: **Planning**, **Implementation**, and **Integration**.

### Planning

Planning is about understanding the problem and designing an approach to solve it. What are the problems we need to solve? What are the constraints? What is the best architecture for the circumstances? How do the pieces fit together?

I would argue that this is the most cognitively demanding mode. It requires holding multiple concerns in your head at once, reasoning about tradeoffs, and making decisions that will impact every step that follows.

### Implementation

Implementation is about making the solution a reality. Writing the code and solving the unexpected challenges along the way. Debugging, testing, fixing, and getting it all working.

But implementation also served a deeper cognitive function. It was a **cognitive reset**. After the taxing, uncertain work of planning, you could drop into the *flow of building*. The plan is defined, at least enough to start. And writing code, which is really *the act of solving a series of small problems* within a larger context, provides a rhythm of frequent, tangible success.

You write a function and it works. You connect the backend, frontend, and the database and see data appear and update. You style a component and it looks right. These are small wins, but they accumulate, creating momentum. They produce the feeling of progress that sustains motivation through the harder parts of the work.

Even debugging, which can be frustrating, is a different kind of frustration than planning uncertainty. Debugging is *traceable*. There's a bug, eventually you find it. The satisfaction when you do is immediate and concrete.

Implementation was the mode where the abstract became real. It was the mode that, for many devs, *recharged* you for the other modes.

### Integration

Integration is about quality control. Code review, both your own and others'. Making pull requests and merging code. Careful inspection of the choices made. Catching regressions, enforcing standards, verifying behavior.

But integration, like implementation, provided other benefits. It was a period of **cognitive feedback**. When you reviewed your own code before a merge, you were meditating on your own work with fresh eyes. You'd catch things you missed, notice patterns you'd repeated, see implementation that could have been clearer. Self-reflection was built into the workflow.

When others reviewed your code, you got the benefit of a different perspective, which is a key part of learning and growth. Integration was also a space for debate, process refinement, and team alignment.

While you may have felt the pressure of getting code reviewed, the act itself seldom had back pressure. It happened, on a broad scale, at the speed of code or faster, and thus was rarely a bottleneck. You could reflect, review, consider, and rethink. The cognitive equivalent of stretching after a long morning run.

## Mode Collapse

AI-assisted development has not only changed the ratio of time developers spend in each of these modes, but the very nature of each mode and the back pressure involved.

<div class="svg-holder">
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1737.48 2524.36" style="max-width: 300px; max-height: 300px;">
  <defs>
    <style>
      .cls-1 {
        fill: currentColor;
      }
    </style>
  </defs>
  <g id="_Ñëîé_1" data-name="Ñëîé 1">
    <g>
      <path class="cls-1" d="M1657.12,598.19c-51.82-51.82-120.71-80.35-193.99-80.35s-142.17,28.54-193.99,80.35c-38.73,38.73-64.45,87-74.97,139.52-39.93-47.93-95.54-78.68-157.75-86.96-65.52-8.72-130.5,8.52-183.07,48.54l-531.01,375.2c-50.62,35.73-86.25,93.39-97.76,158.18-6.18,34.82-5.35,70.53,2.49,106.14,8.4,38.16,22.41,76.39,48.53,110.81.04.05.06.1.1.15.02.03.04.06.06.09.06.08.12.16.18.25.2.29.4.58.61.86l335.03,451.36,34.91,469.63c2.26,42.78,20.99,82.14,52.78,110.88,29.82,26.96,67.79,41.54,107.72,41.54,2.76,0,5.53-.07,8.3-.21,1.21-.06,2.41-.14,3.6-.22,42.11-3.06,80.74-22.18,108.75-53.84,28.06-31.7,42.34-72.45,40.21-114.74-.01-.22-.02-.44-.04-.65l-37.77-522.09c-1.81-34.47-14.96-68.02-37.05-94.54l-250.35-311.89,323.45-231.09-.28,421.54c0,78.95,64.23,143.18,143.18,143.18s143.18-64.23,143.18-143.19l-.26-649.35c5.42,6.52,11.16,12.83,17.23,18.9,51.82,51.82,120.71,80.35,193.99,80.35s142.17-28.54,193.99-80.35c51.82-51.82,80.35-120.71,80.35-193.99s-28.54-142.17-80.35-193.99ZM1108.99,1699.81c-45.86,0-83.18-37.31-83.18-83.16l.38-561.02c.01-16.57-13.41-30.01-29.98-30.02h-.02c-16.56,0-29.99,13.42-30,29.98l-.04,65.72-405.29,289.55c-13.48,9.63-16.6,28.37-6.97,41.85,5.86,8.2,15.08,12.56,24.44,12.56,5.27,0,10.58-1.39,15.36-4.25l252.7,314.81c.13.16.25.31.38.47,13.98,16.71,22.28,37.9,23.38,59.65.01.22.02.44.04.65l37.77,522.06c2.57,54.21-39.27,101.46-93.43,105.41-.77.06-1.53.1-2.28.14-26.92,1.36-52.75-7.85-72.75-25.92-19.99-18.07-31.75-42.85-33.11-69.77-.01-.24-.03-.47-.04-.71l-35.58-478.64c-.42-5.66-2.44-11.09-5.83-15.66l-339.73-457.69c-79.88-118.95-43.32-239.37,31.75-292.36l531.47-375.52c.31-.22.62-.44.92-.67,39.92-30.54,89.34-43.71,139.16-37.07,49.82,6.63,94.08,32.27,124.62,72.19,32.05,41.89,34.26,61.03,38.76,106.06l.29,728.17c0,45.86-37.31,83.18-83.18,83.18ZM1463.13,1006.52c-118.19,0-214.35-96.16-214.35-214.35s96.16-214.35,214.35-214.35,214.35,96.16,214.35,214.35-96.16,214.35-214.35,214.35Z"/>
      <path class="cls-1" d="M548.28,1906.27c-.24,0-.48,0-.72,0-16.24,0-29.6,12.97-29.98,29.3-.54,22.85-8.93,45.07-23.64,62.56-.63.75-1.22,1.52-1.77,2.33l-255.01,371.51c-19.71,22.83-48.25,35.55-78.51,34.91-23.23-.48-44.93-8.66-62.76-23.65-42.59-35.8-48.1-99.58-12.3-142.16.7-.83,1.35-1.7,1.96-2.6l226.3-337.6c3.08-4.6,4.83-9.96,5.06-15.5l10.7-266.03c.67-16.55-12.22-30.52-28.77-31.18-16.54-.65-30.52,12.22-31.18,28.77l-10.36,257.57-220.72,329.28c-55.88,67.9-46.76,168.66,20.71,225.38,28.03,23.56,63.59,36.95,100.13,37.71,1.14.02,2.26.04,3.4.04,47.69,0,92.42-20.79,123.17-57.36.63-.75,1.22-1.52,1.77-2.33l255.1-371.65c22.84-27.71,35.87-62.66,36.71-98.59.39-16.56-12.72-30.31-29.29-30.7Z"/>
      <path class="cls-1" d="M154.35,522.51h737.39c61.68,0,111.87-50.18,111.87-111.87,0-14.1,11.47-25.57,25.57-25.57,47.19,0,85.57-38.39,85.57-85.57v-76.49c0-47.19-38.39-85.57-85.57-85.57-14.1,0-25.57-11.47-25.57-25.57,0-3.95-.21-7.85-.61-11.69-.01-.11-.03-.22-.04-.33-6.02-56.05-53.6-99.84-111.22-99.84H154.35C92.67,0,42.49,50.18,42.49,111.87v298.78c0,61.68,50.18,111.87,111.87,111.87ZM102.49,111.87c0-28.6,23.27-51.87,51.87-51.87h737.39c26.32,0,48.1,19.7,51.41,45.13l.32,145.83c.04,16.55,13.46,29.93,30,29.93h.07c16.57-.04,29.97-13.5,29.93-30.07l-.13-57.39c8.15,2.59,16.83,3.99,25.83,3.99,14.1,0,25.57,11.47,25.57,25.57v76.49c0,14.1-11.47,25.57-25.57,25.57-10.83,0-21.18,2.04-30.73,5.73-5.41-7.86-14.47-13.02-24.73-13.02h-.05c-16.57.03-29.98,13.48-29.95,30.05l.09,57.2c-.12,1.86-.2,3.73-.2,5.62,0,28.6-23.27,51.87-51.87,51.87H154.35c-28.6,0-51.87-23.27-51.87-51.87V111.87Z"/>
      <path class="cls-1" d="M229.73,402.44h43.95c36.76,0,66.66-29.9,66.66-66.66v-149.05c0-36.76-29.9-66.66-66.66-66.66h-43.95c-36.76,0-66.66,29.9-66.66,66.66v149.05c0,36.76,29.9,66.66,66.66,66.66ZM223.07,186.73c0-3.67,2.99-6.66,6.66-6.66h43.95c3.67,0,6.66,2.99,6.66,6.66v149.05c0,3.67-2.99,6.66-6.66,6.66h-43.95c-3.67,0-6.66-2.99-6.66-6.66v-149.05Z"/>
    </g>
  </g>
</svg>
</div>

### Planning

Now that AI can theoretically implement features in minutes instead of days, organizations expect more output. That means more planning. More specs, more architectural decisions, more prompts. The pace of planning used to be gated by how long it took to build. That gate is gone, blown open by the runaway inference truck.

Developers are being asked to do the most cognitively demanding part of their job at a volume that was never required before. Planning at this velocity, without proportional rest via mode change, is exhausting in a way that's hard to articulate or even recognize.

### Implementation

Implementation has undergone the biggest change. The flow state of building, the rhythm of small wins, the tactile satisfaction of writing code that works, these have been compressed into "prompt, wait, review."

The prompting itself is a form of planning, not building. The waiting is dead time, unless you subject yourself to myriad context switching. Reviewing, in reality, is integration. The actual *building*, the part that let you live in a flow for awhile, is being done by something else.

What remains of implementation is supervisory. You're directing the work, not doing it. That's a fundamentally different cognitive experience than the one developers have been accustomed to, and I don't believe it provides the same restorative benefits.

### Integration

Integration has also changed dramatically. When AI generates the code, integration becomes purely a review of output you didn't write. You lose the reflective quality of reviewing your own work...because it isn't your work.

Feedback from others reviewing your code not longer has the same moments of learning and growth, because it's more similar to learning from examples in a book than from reviewing your own work, which implies your thought process and understanding.

Reviewing AI-generated code is also cognitively different from reviewing a teammate's code. With a teammate, you can often infer intent. You can ask questions. You learn their patterns. 

With AI output, you're inspecting code that has no intent behind it. It's syntactically coherent and often well-structured. But there's no one on the other end who meant anything by it.

Integration becomes an audit rather than a dialogue. Audits are a necessary piece of a process. They're not enriching. They don't provide the same space for learning or improved team dynamics.

Worse still, developers spend far more time in integration than before. Integration by a human is slower than implementation by an AI, placing immediate back pressure on the process, and thus making any personal improvements for the developer an even less likely outcome.

## One-and-a-Half Modes

What developers are left with is roughly one-and-a-half modes.

Planning has expanded and intensified. Integration has been stripped of its relational and reflective qualities and reduced to pure verification. Implementation, the mode that provided cognitive reset and tangible momentum, has been automated and compressed.

The initial rush of getting something working quickly is real. Watching an AI generate a feature in minutes that would have taken you a day is exciting. But that excitement is being tempered by the reality of what comes after. You still have to plan the next thing, and the thing after that. You have to review all of it. And the actual *building* is a shadow of what it was. A prompt cycle or agent orchestration isn't flow. It's management.

In some ways, AI didn't remove the hard parts of development, it removed the cognitive modes that made the hard parts sustainable.

To give this a name, let's call it **single-mode burnout**. The exhaustion of spending most of your time in the most demanding modes of work, with bottleneck pressure and little of the recovery and reflection that the other modes used to provide.

## Cognitive Impact

I don't believe we fully understand yet the long-term impacts of this mode collapse, especially in three areas:

### Skill

Implementation was where developers deepened their craft. You learn the most when you're building. You develop intuition for how systems behave by constructing them yourself. That intuition and understanding is what allows a junior developer to become a senior, an architect, a manager.

Compressing implementation shrinks the primary mechanism by which developers improve. Over a span of years, what does that do to the skill of a developer workforce? What happens when the next generation of developers has spent most of their career planning and reviewing, but relatively little time building?

### Motivation

The three-mode cycle provided natural variation in a workday. Hard thinking, then flow-state building, then reflective review. This variation sustains motivation and balances cognitive load.

Collapsing that into sustained planning and auditing has become a recipe for a new kind of burnout that looks different from what we're used to identifying. It doesn't look like overwork. It looks like fatigue, apathy, laziness, and atrophy in the presence of output. You're getting more done, and feeling worse about it. That's confusing, because social media tells us we should feel better about ourselves the more we produce.

To a degree, producing more *does* feel good. But if it comes at a cognitive cost, the feeling is not long-lasting.

### Quality

Verification without the context of having built the thing yourself is harder and less reliable. Developers reviewing AI-generated code may miss issues that they would have caught if they'd written it themselves, because writing code builds a mental model of the system that reviewing code alone does not.

A good mental model helps you spot when something is subtly wrong. Without it, code review becomes a surface-level exercise, no matter how careful you are. 

If you offload code review to another AI model, then you lose yet another opportunity to learn and grow. Short-term success at the cost of long-term skill.

## Redesigning Cognitive Infrastructure

The three modes of development weren't just phases in a process, they were a cognitive infrastructure around which the software industry built experts. They provided rhythm and recovery. Opportunities for challenge, reflection, and growth.

We've disrupted that infrastructure, and we need to be intentional about what we put in its place.

It might mean reserving certain kinds of implementation for yourself, not because AI can't do them, but because you need the cognitive benefits of doing them.

It might mean teams rethinking what a healthy developer workflow looks like when the ratio of planning to building has inverted. Perhaps "implementation time" becomes something that's protected, and a backlog of AI-generated code to review is not considered a drop in velocity, but evidence of care.

At minimum, it means naming the problem. If you're an experienced developer and the work feels more draining than it used to, even though you're supposedly more productive, you aren't imagining it. The cognitive structure of your craft has changed.

AI-assisted development can be more exhausting than we are led to believe. I believe we can educate, innovate, and mentor ourselves and our teams into a new, better infrastructure. But first, as an industry, we need to acknowledge and consider the problem.

It's up to us to take care of ourselves, our cognitive load, and our future skill.