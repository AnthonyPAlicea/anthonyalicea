---
layout: portfolio.njk
title: "Designing a Formative JavaScript Course"
subtitle: "How first-principles teaching and deliberate curriculum design produced one of the most impactful JavaScript courses ever made."
category: "Curriculum Design"
role: "Course Creator, Curriculum Designer, Instructor"
timeline: "2015 – Present"
team: "Solo project. Nearly 200,000 students over 10 years."
excerpt: "A course built on first principles and mental models that students say changed their careers and their lives."
---

<div class="theme-img theme-img--sm">
  <img style="max-width: 200px" src="/assets/portfolio/formative-javascript/jslogo.png" alt="Stage 1: User Research -- Observe users, conduct interviews, build instincts, watch people use software.">
</div>

## The Challenge

In 2015, most JavaScript education followed the same pattern: learn the syntax, follow along with a project, and hope that understanding comes with imitation. Developers who learned this way could build things, but they couldn't explain why they worked. When something broke, they searched for answers instead of reasoning through them. Debugging was an exercise in brute force frustration.

Self-taught developers were hit hardest. Without a computer science background, they had no mental models for what was actually happening when their code ran. They memorized patterns without understanding mechanics. This left them productive but fragile. One unfamiliar error and they were lost.

I wanted to build a course that fixed this at the root. Not another syntax walkthrough. A course that taught developers how JavaScript actually works, so they could reason about any problem they encountered.

## First Principles and Computer Science

Most self-taught developers never get a formal introduction to the concepts that make languages tick: compilers, interpreters, syntax parsing, code execution, etc. These aren't truly advanced topics. They're foundational ones that computer science programs teach early. But if you skipped that path, no one goes back and fills in the gaps.

I decided to start there. In 2015, no JavaScript instructor was teaching from the engine and specification level. Execution contexts, lexical environments, scope chains, prototypal inheritance: none of this was part of online JavaScript education. The course opens not with "how to write JavaScript" but with how a JavaScript engine processes your code. What happens when a function is invoked. How memory is allocated. Where variables actually live. These are the building blocks that make everything else make sense. In fact the first code lecture of the course is a blank JS file, and the results of that is deeply instructive.

This was deliberate. When you understand execution contexts, closures stop being mysterious. When you understand the prototype chain, inheritance patterns become logical rather than arbitrary. First principles don't just teach one concept. They make every future concept easier to learn.

## Mental Models and Going Under the Hood

I made an early decision that shaped the entire course: take the JavaScript specification and explain what the engine is actually doing. Not metaphorically. Concretely. Show the learner what happens in memory, what the engine sees, and how decisions are made at runtime.

This "under-the-hood" approach gave students something more valuable than knowledge of any single feature. It gave them a mental model of the machine. When they encountered unfamiliar behavior, they didn't need to search for an answer. They could reason about it: "What would the engine do here? What's in scope? What does the prototype chain look like?"

Reasoning from a mental model instead of recalling from memory: that's the difference between a developer who follows tutorials and one who solves novel problems. That distinction drove every design decision in the course.

<div class="theme-img theme-img--sm">
  <img style="max-width: 200px; border: none;" src="/assets/portfolio/formative-javascript/megaphone.png" alt="Stage 1: User Research -- Observe users, conduct interviews, build instincts, watch people use software.">
</div>

## Big Words and Technical Vocabulary

Technical vocabulary intimidates learners. Terms like "hoisting," "coercion," "first-class functions," and "immediately invoked function expressions" sound like they belong to experts. Many courses use terms them without explanation, which leaves learners either underequipped or confused.

I took a different approach. Whenever the course introduced a technical term, it got what I called a "Big Word Alert": a deliberate pause to break the term apart, explain its origins, and demystify it. The message was consistent: these words aren't a barrier to entry. They're just vocabulary, and vocabulary can be learned.

This did two things. It removed the intimidation that keeps self-taught developers from going deeper. And it gave students the language to communicate precisely with other developers, read documentation confidently, and participate in technical conversations they'd previously felt excluded from.

## Progressive Curriculum and Avoiding the Curse of Knowledge

The biggest risk in teaching complex material is assuming the learner knows what you know. The curse of knowledge makes experts skip steps they've internalized, leaving gaps the learner can't fill. Avoiding this requires more than good intentions. It requires deliberate structure.

I built the course around what I called "Conceptual Asides": short detours that teach a supporting concept right before the learner needs it. Before explaining closures, a Conceptual Aside covers execution contexts. Before syntax we cover syntax parsers. Each aside builds the understanding needed for the next topic, so the learner is never asked to make a leap they're not ready for.

This progressive structure meant the course could cover genuinely advanced material without overwhelming anyone. By the time students reached topics like building their own framework or understanding transpiler output, they had every mental model they needed. The difficulty was real, but the cognitive load was managed.

## A Surprising Reception

I hoped the course to would be useful. I did not expect the response it received.

Students began calling it the best JavaScript course on the internet. Ten years later, they still do. Developers told me it was the first resource that made JavaScript make sense. That it gave them the confidence to pursue senior roles. That it changed their careers.

Some messages went further than career impact. Developers reached out to tell me the course got them out of poverty. That it was directly responsible for their livelihood. That it changed the trajectory of their lives. These were not the outcomes I designed for. But they were the outcomes that a first-principles approach made possible: when you teach someone to reason rather than memorize, you give them something that compounds over every problem they solve for the rest of their career.

The course has maintained a top rating across 50,000 reviews and 200,000 students over a decade. Students still return to it as a reference years into their careers.

## The Legacy

My early courses like "JavaScript: Understanding the Weird Parts" established a teaching philosophy I've applied to everything since: Don't Imitate, Understand. Every course, curriculum, and training program I've built since starts from the same premise: lasting competence comes from mental models, not memorized patterns.

The approach proved that rigorous, first-principles education isn't just for computer science classrooms. It works for self-taught developers, career changers, and anyone willing to invest in understanding over shortcuts. The thousands of developers now building careers on what this course taught them are the strongest evidence that the philosophy works.

The course is still selling, still reviewed, and still shaping how people learn JavaScript. Ten years on, that's the outcome I'm most proud of.