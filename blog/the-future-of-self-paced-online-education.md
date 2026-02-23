---
layout: post.njk
title: "The Future of Self-Paced Online Education"
excerpt: Rethinking learning for the age of AI.
date: 2026-02-23
og_image: 'assets/self-paced.png'
---
# {{ title }}

A lot of words have been dedicated to how LLMs are changing the landscape of software development. But there's another arena that has been massively impacted by the rise of AI and deserves more discussion: the self-paced online education industry.

Thousands upon thousands of developers are self-taught, and that self-taught education, for many, included self-paced video courses. The student appetite for inexpensive (compared to universities) video course education powered the success of marketplaces and platforms like Udemy, Coursera, Teachable and more.

However, the past few years have seen a massive disruption of that success. This AI disruption is leaving the industry and learners with some open vital questions: What is the value of a video course when you seemingly can ask an interactive LLM to teach you anything? Are LLMs the right answer to a good education for developers? What will the next generation of self-paced learning look like?

## Bona Fides
I've been a developer educator building self-paced video courses for over a decade. I released my first web development course on <a href="https://www.udemy.com/user/anthonypalicea" target="_blank">Udemy</a> in late 2014.

Leading up to that, I found nearly all video courses, even popular ones, to be nothing but "follow along with me while I code"-style videos, which did not provide the mental models and understanding necessary to debug well and support a long career. I wanted to provide web development education for self-taught devs that was rooted in first-principles and computer science (I got a comp sci degree 25 years ago).

The results shocked me. To date I have over 370,000 enrolled students and I've heard from many students that my most well-known course, <a href="https://dontimitate.dev/courses/javascript-weird-parts/" target="_blank">JavaScript: Understanding the Weird Parts</a>, was the foundation of their career.

Over the years interacting with so many students, I've seen the challenges they face, the curricula that work, and what doesn't. Like many other instructors, I rode the wave of interest in inexpensive education, enjoyed watching students from all backgrounds and economic circumstances succeed, and was able to support myself and my family doing it.

Then, in 2024, something changed.

## AI and Probabilistic Learning
The one true bottleneck of self-paced education was always the speed of getting student questions answered. There were lots of solutions like hiring teaching assistants, building online communities for student interaction, and more.

Enter AI. When ChatGPT output quality caused it to cement into the culture around 2023, AI chat bots began to provide something no self-paced instructor could hope to match: instant education gratification.

An LLM is a tireless instructor. It answers any question, expounds on any point, and never becomes frustrated with a student. By all appearances you can learn *anything* with an LLM.

The reality, of course, is more nuanced. LLMs are enormously sophisticated probabilistic word-guessing machines. They're underlying architecture is oriented, not around being correct (they have no real sense of 'truth'), but of outputting something that looks like the languages they were trained on.

In other words, if an LLM is inaccurate it's accomplished the core purpose of its design as long as the output reads like a human-written lie. That's not a small accomplishment. It's massively impacted the digital industry. But it isn't reliable learning.

Some will argue that human teachers make mistakes as well. That's certainly true. But there are two major differences between a human and an LLM in the area of mistakes:
- A human teacher can learn from their mistakes.
- It's far easier for the *way* you ask a question to nudge an LLM towards an erroneous response than it is when asking a human teacher.

LLMs also output confident-sounding text. In 2024, I began getting responses from students that challenged something I said in a lecture, and these responses would start with "ChatGPT said...".

Unsurprisingly, their LLM-based pushback was *always* incorrect, and often had to do with how they asked the question. They didn't have the knowledge yet to ask a question designed to get a good LLM response. But they trusted LLM output.

Thus we're faced with a kind of cognitive dissonance. LLMs can make fantastic educational partners. LLMs are also unreliable educational partners, encumbered by the knowledge (or lack thereof) of the one asking the question, and a poor education is a poor foundation for a career.

## AI and Learning Innovation
![Robot with a graduation cap](/assets/blogimages/ai_graduate.png)
Like most businesses, learning companies responded with attempts to include "AI innovation" in their service offerings. The aforementioned tools to build quizzes and content automated away some tasks for instructors, and you could feed transcripts of videos to an LLM so students could ask questions of it.

Udemy piloted one of the more interesting approaches, called "Role Play", where students could converse with an LLM avatar. Of course, this was still a chatbot and a prompt, wrapped in an engaging user experience. I found students *loved* Role Play, even as they commmented that the AI was limited in the realism of its interactivity.

But that love of interactivity, coupled with the careful prompts that I wrote for Role Plays, began to spark some theories on what self-paced education innovation could really look like in the age of AI.

My next experiment was adding prompt-based AI exercises. In my course on semantic HTML and modern CSS, I teach students HTML first before opening a browser window. This way they learn to think semantically, and not get distracted or derailed by visual intent.

If you work in a front-end development team that cares about and is skilled in accessibility, then you might have a conversation about your semantic HTML choices. What's interesting about that is there are cases where there is no strictly correct answer. Multiple HTML elements may be arguably viable to markup a particular bit of the web document. I've had my share of fun conversations in that arena.

So, I gave my students a series of "AI-powered exercises" that were BYOLLM (Bring Your Own LLM). They pasted a prompt into their LLM, and had a conversation where they had to defend their semantic choice for a particular markup challenge. The LLM was instructed to not just accept their first answer, push back even if it was reasonable, and move on when they made a defense grounded in semantics.

It took testing and iteration, but I got a set of prompts that worked well across models. I also instructed the LLM to summarize the experience of the student at the end, and the student pasted that summary as homework into their learning app. In reviewing those responses I discovered what an interesting experience it was for students, and the results reflected in the reviews I got as well.

To discuss this further, let's coin some acronyms. If video courses are a form of human-led instruction (HLI), then these exercises were a form of AI-led instruction (ALI). But they were ALI with carefully curated and tested context. This is necessary because AI-led instruction, due to LLM tendency to drift in the direction the human gives it, is fundamentally flawed without knowledgable instructor support.

For me this began to form some ground rules for a good AI-led instruction:
- Context and prompts must be well-tested across models.
- Curriculum needs to provide structured guidance but that is designed to survive non-determinism and student input.
- An LLM must be given a personality and teaching approach that matches the intent of the instruction.
- LLMs must be provided examples of inputs and outputs of the intended educational experience.

These concepts have provided a foundation for my experimentation with ALI, and still do. However, options to provide an even better student experience were on the horizon.

## Skills, MCP, and the LLM Infrastructure
The eternal challenge of LLMs is their inherent probabilistic nature. *Encouraging* them to produce structured, accurate results is as much art and authoring as engineering.

## Learning Surfaces: An LLM-Based Future
![Digital ocean surface](/assets/blogimages/surface.jpeg)

We need a name for the combination of Agent Skills and MCP servers with resources curated by an instructor, with videos, interactive widgets, slides delivered via the MCP Apps standard. We need a name for the experience and the structure of these various elements presented via an LLM for educational purposes. 

I call this combination a **Learning Surface**. Learning Surfaces are a form of AI-led instruction.

Self-paced AI-led instruction is unique because the learning experience will not be entirely reproducible like a video course is. Students may dive deeper on one topic than another. They may ask more of the LLM than the instructor intended. They may jump ahead, though the structure of the experience should discourage it.

Thus, while you might still call what you experience a "course", I think the curriculum that you build is more like the surface of a digital ocean. The student moves across the surface, likely in a pre-determined path. However the depth of exploration, the eddies of knowledge, are unique to that student's experience. 

An enjoyable Learning Surface provides both required and optional material, making a course not only personalized, but an experience that supports repetition.

### MCP Learning

### IDE Integration

### WebMCP Learning Experiences

### Designing a Learning Surface

### Building a Learning Surface

## A Look Ahead at Learning
AI won't replace human-led instruction.