---
layout: portfolio.njk
title: "Creating AI-Powered Learning Experiences"
subtitle: "Using LLMs to enhance web development, user experience, and accessibility education."
category: "AI-Powered Learning Experiences"
role: "Course Creator, Curriculum Designer, Instructor"
timeline: "2025 – Present"
team: "Solo project. Over 370,000 students over 10 years."
excerpt: "Enabling interactive self-paced study using context management and LLMs."
---

## The Challenge

An advantage of self-paced online courses is that they scale. One instructor can reach hundreds of thousands of students. But scaling creates a problem as well: to practice *reasoning* you need someone who pushes back, asks *why*, and won't accept the first answer.

A video lecture can't do that. Multiple-choice questions can't do that either. Even well-designed coding exercises can only test whether code runs, not whether the developer understands what they wrote.

For my <a href="https://dontimitate.dev/courses/html-css/">HTML and CSS course</a>, I wanted students to develop genuine semantic thinking: the ability to look at a piece of content, make a deliberate choice about how to mark it up, and defend that choice on the basis of *meaning* rather than appearance, convention, or what they've seen before. This kind of reasoning is what separates developers who understand the web from developers who imitate patterns they found online, and it's also the basis of accessible, maintainable HTML and good user experience.

The challenge was getting hundreds of thousands of students access to the kind of Socratic challenge that normally only happens in one-on-one mentorship, and doing it asynchronously.

NOTE: For a discussion on what I think the future of self-paced online education looks like, <a href="/blog/the-future-of-self-paced-online-education/">see my blog post</a> on the subject.

## The Insight

Large Language Models are capable of embodying an instructional role with some nuance, but only if the instructions they're given are designed with the same rigor as any other piece of curriculum. That was the core concept that drove this work: **a prompt is an instructional design artifact**. The quality of the learning experience it produces depends entirely on how well the instructional design behind it is conceived and expressed.

Most uses of LLMs in education take the easy path: ask the AI to quiz the student, check answers, give hints. That amounts to automation of low-level testing, and it doesn't change what the student is learning or how deeply they're learning it.

What I built instead was a set of structured Socratic exercises: carefully authored prompts that give an LLM a specific instructional role, a set of rules for how to inhabit that role, and content blocks to work through with the student one at a time. The LLM isn't grading answers. It's making the student defend their reasoning, which is a different activity entirely.

## Designing for Reasoning, Not Recall

Each exercise covers a different semantic HTML decision: when to use `<article>` versus `<section>` versus `<aside>`, when to choose an ordered list over an unordered one, when a `<div>` is the right call and when it hides meaning. These aren't questions with single right answers. They're semantic choices, defensible in multiple ways depending on context and reasoning, and the exercises were designed that way on purpose. The point is never to produce a correct answer. It's to produce a *reasoned* one.

The prompt instructs the LLM to never say "correct" or "incorrect." Instead, after any answer, it asks *why*. After any explanation, it pushes back with a counterargument, even when the student's reasoning is solid. The student must defend their position, not just state it. They can only move to the next content block once they've grounded their reasoning in meaning: who the information is *for*, what role it plays in the document, what it communicates to browsers, assistive technologies, and search engines.

The LLM is also instructed to redirect surface-level reasoning. If a student says a list should be ordered because they want numbers to appear, they're redirected: *CSS handles that. What about the meaning of this list makes sequence matter?* If they say something belongs in the `<head>` because that's where they've seen it before, they're redirected: *That's convention. What purpose does this information serve?*

That redirection is important to instruction. It trains students to ask a different question: not "what does this look like?" but "what does this mean?" That question generalizes to every semantic decision they'll make for the rest of their career, and prepares them for real-world interactions with team members who may want a `<div>` for everything.

## The Architecture of a Socratic Exercise

Each exercise follows a structure I designed and tested to produce as consistent a dialogue quality as possible regardless of which LLM the student uses.

The prompt establishes the LLM's role, its rules, and a key concept. The rules are precise: present content blocks one at a time, challenge reasoning at least once before accepting it, and never end a message with a challenge and then move on in the same response. That last constraint is critical because it enforces a clean separation between the debate phase and the transition phase, so students aren't moved past the hardest part of the thinking before they've done it.

The content blocks are sequenced to surface genuine ambiguity. Some blocks have defensible cases for multiple answers. Others look like one thing but argue better as another. The sequencing makes students encounter their own assumptions and find the edges of their reasoning.

The wrap-up phase asks the student to articulate the principle they've developed in their own words, not a definition I gave them, but their own synthesis. If it's vague, the LLM pushes for specificity. If they invoke appearance, they're redirected to meaning. The final assignment summary they submit to the course uses their own words rather than a template answer, so the submission itself reflects actual understanding.

Eight exercises cover the core semantic decisions in HTML:

- Metadata versus visible content
- `<article>` versus `<section>` versus `<aside>`
- `<header>`, `<footer>`, and `<address>`
- Ordered versus unordered lists
- Description lists versus other structures
- When to use `<div>`
- `<em>` versus `<strong>` versus `<small>`
- When to use `<span>`

The underlying question in all of them is the same: can you defend this as a semantic choice, and can you ground that defense in meaning?

## Context Management as Instructional Design

What makes this work is not AI capability in isolation. It's the quality of context provided to the model. An LLM given a vague instruction to "help students learn HTML" will produce generic, unhelpful, and at times incorrect responses. An LLM given a precisely authored instructional context is capable of holding a genuinely challenging, technically sound conversation.

This is what I mean by context management: authoring instructions that shape an LLM's behavior in specific, intentional ways. Every constraint in these prompts exists for a reason grounded in learning science. The ban on "correct" and "incorrect" removes evaluative pressure that causes students to guess rather than think. The required counterargument prevents premature closure. The exit condition tied to meaning rather than surface answers ensures the dialogue produces real understanding rather than the appearance of it.

Designing these constraints required running experiments, reading the outputs, identifying where the LLM drifted from the intended role, and tightening the prompt until the behavior was consistent. It's iterative research applied to a new kind of educational artifact.

## The Response

Each exercise ends with the LLM generating a short assignment summary for the student to copy and paste into the course. The format is specific: one sentence articulating the key insight they developed, and a brief description of a decision they defended and how they defended it. The student fills in those blanks themselves, in their own words. The LLM generates the frame; the content has to come from what they actually worked through.

This gave me something I didn't have before: a readable record of what students were actually thinking. Reviewing those submissions, I could see whether students had arrived at reasoning grounded in meaning or were still reaching for visual and conventional explanations. In most cases, they had gotten there. Students described defending choices under pushback, changing their initial answers when the counterargument was stronger, and arriving at principles they had worked out themselves rather than been given.

What I observed across the submissions was that students weren't just identifying correct HTML elements. They were articulating *why* one choice communicated something that another didn't, and holding that position even when the exercise challenged it. That's the reasoning I wanted the exercises to build, and seeing it show up consistently in the written responses confirmed that the instructional design was doing its job.

The course review ratings went up after these exercises were introduced.

## What This Changes

These exercises gave students something that previously only existed in one-on-one mentorship or live classroom discussion: a conversational partner that challenges their reasoning and won't let them coast on surface-level answers. Any student with access to a capable LLM can now have that experience, on their own schedule, with the content I designed.

The broader implication is worth mentioning. Instructional design skills are the leverage point for AI-powered learning. LLMs are capable of far more than most AI learning tools ask of them. The bottleneck isn't model capability; it's the quality of the instructional design behind the prompt. Getting that right requires understanding how people learn, what kinds of challenges build reasoning, and how to express educational intentions precisely enough that a language model can embody them consistently.

Figuring out how to write that kind of curriculum is work I find genuinely interesting, and there's a lot more of it to do.
