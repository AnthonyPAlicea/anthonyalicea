---
layout: post.njk
title: "The Future of Self-Paced Online Education"
excerpt: Rethinking learning for the age of AI.
date: 2026-02-24
og_image: 'assets/self-paced.png'
tags: ['post','front-page']
---
# {{ title }}

A lot of words have been dedicated to how LLMs are changing the landscape of software development. But there's another arena that has been massively impacted by the rise of AI and deserves more discussion: the self-paced online education industry.

Thousands upon thousands of developers are self-taught, and that education, for many, included self-paced video courses. The student appetite for inexpensive (compared to universities) video course education powered the success of marketplaces and platforms like Udemy, Coursera, Teachable and more.

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

The reality, of course, is more nuanced. LLMs are enormously sophisticated probabilistic word-guessing machines. Their underlying architecture is oriented, not around being correct (they have no real sense of 'truth'), but of outputting something that looks like the languages they were trained on.

In other words, if an LLM is inaccurate it's accomplished the core purpose of its design as long as the output reads like a human-written lie. That's not a small accomplishment. It's massively impacted the digital industry. But it isn't reliable learning.

Some will argue that human teachers make mistakes as well. That's certainly true. But there are two major differences between a human and an LLM in the area of mistakes:
- A human teacher can learn from their mistakes.
- It's far easier for the *way* you ask a question to nudge an LLM towards an erroneous response than it is when asking a human teacher.

LLMs also output confident-sounding text. In 2024, I began getting responses from students that challenged something I said in a lecture, and these responses would start with "ChatGPT said...".

Unsurprisingly, their LLM-based pushback was *always* incorrect, and often had to do with how they asked the question. They didn't have the knowledge yet to ask a question designed to get a good LLM response. But they trusted LLM output.

Thus we're faced with a kind of cognitive dissonance. LLMs can make fantastic educational partners. LLMs are also unreliable educational partners, encumbered by the knowledge (or lack thereof) of the one asking the question, and a poor education is a poor foundation for a career.

## The Pivot
Instructors teaching "watch me code and parrot what I do" courses were especially vulnerable to the AI disruption.

But all instructors were vulnerable to the student assumption that AI could either teach them or do the work for them.

Many instructors have pivoted. Some to Developer Relations. Others to live teaching. 

Live teaching is fantastic, and I've done it for years. However it is also more expensive for the student, and not scalable.

For myself, while I continued to enjoy creating courses for my own platform, Udemy, and Pluralsight, I wondered how to pivot affordable self-paced education in the age of AI. Learning companies and platforms were asking the same thing.

## AI and Learning Innovation
![Robot with a graduation cap](/assets/blogimages/ai_graduate.png)
Like most businesses, learning companies responded with attempts to include "AI innovation" in their service offerings. The aforementioned tools to build quizzes and content automated away some tasks for instructors, and you could feed transcripts of videos to an LLM so students could ask questions of it.

Udemy piloted one of the more interesting approaches, called "Role Play", where students could converse with an LLM avatar. Of course, this was still a chatbot and a prompt, wrapped in an engaging user experience. I found students *loved* Role Play, even as they commented that the AI was limited in the realism of its interactivity.

But that love of interactivity, coupled with the careful prompts that I wrote for Role Plays, began to spark some theories on what self-paced education innovation could really look like in the age of AI.

My next experiment was adding prompt-based AI exercises. In my course on semantic HTML and modern CSS, I teach students HTML first before opening a browser window. This way they learn to think semantically, and not get distracted or derailed by visual intent.

If you work in a front-end development team that cares about and is skilled in accessibility, then you might have a conversation about your semantic HTML choices. What's interesting about that is there are cases where there is no strictly correct answer. Multiple HTML elements may be arguably viable to markup a particular bit of the web document. I've had my share of fun conversations in that arena.

So, I gave my students a series of "AI-powered exercises" that were BYOLLM (Bring Your Own LLM). They pasted a prompt into their LLM, and had a conversation where they had to defend their semantic choice for a particular markup challenge. The LLM was instructed to not just accept their first answer, push back even if it was reasonable, and move on when they made a defense grounded in semantics.

It took testing and iteration, but I got a set of prompts that worked well across models. I also instructed the LLM to summarize the experience of the student at the end, and the student pasted that summary as homework into their learning app. In reviewing those responses I discovered what an interesting experience it was for students, and the results reflected in the reviews I got as well.

To discuss this further, let's coin some acronyms. If video courses are a form of human-led instruction (HLI), then these exercises were a form of AI-led instruction (ALI). But they were ALI with carefully curated and tested context. This is necessary because AI-led instruction, due to an LLM's tendency to drift in the direction the human gives it, is fundamentally flawed without knowledgeable instructor support.

For me this began to form some ground rules for a good AI-led instruction:
- Context and prompts must be well-tested across models.
- Curriculum needs to provide structured guidance but that is designed to survive non-determinism and student input.
- An LLM must be given a personality and teaching approach that matches the intent of the instruction.
- LLMs must be provided examples of inputs and outputs of the intended educational experience.

These concepts have provided a foundation for my experimentation with ALI, and still do. However, options to provide an even better student experience were on the horizon.

## Skills, MCP, and the LLM Infrastructure
The eternal challenge of LLMs is their inherent probabilistic nature. *Encouraging* them to produce structured, accurate results is as much art and authoring as engineering.

The industry has provided standards to help. These same standards form the building blocks of AI-led curricula.

### Agent Skills
The <a href="https://agentskills.io">Agent Skills</a> standard provides a way to give an LLM context and tools that it loads on-demand, saving context window space and reducing context rot.

### The Model Context Protocol (MCP)
The <a href="https://modelcontextprotocol.io">Model Context Protocol</a> provides a standardized way to expose data, tools, and workflows to an LLM from an external system.

### MCP Apps
The <a href="https://modelcontextprotocol.io/extensions/apps/overview">MCP Apps</a> standard is the real game changer for AI-led instruction. 

MCP Apps allows an MCP server to return interactive UI applications as part of the LLM conversation.

This means you can return deterministic slices of interactivity interlaced with the LLM's non-deterministic inference.

### WebMCP
The <a href="https://github.com/webmachinelearning/webmcp">WebMCP standard</a> allows web application functionality to be exposed as "tools" to an AI agent. 

Essentially, the web page becomes an MCP server. This enables user and agent collaboration on the same web page.


### The Infrastructure
These four standards form an infrastructure for enabling an AI agent to enhance the context of an LLM.

I think organizations and instructors that want to train in the age of AI need to be familiar with these standards, and how to build and use them. Because they also form the infrastructure for a high-quality student experience.

## Learning Surfaces: An LLM-Based Future
![Digital ocean surface](/assets/blogimages/surface.jpeg)

We need a name for the combination of Agent Skills and MCP servers with resources curated by an instructor, with videos, interactive widgets, slides delivered via the MCP Apps standard. We need a name for the experience and the structure of these various elements presented via an LLM for educational purposes. 

I call this combination a **Learning Surface**. Learning Surfaces are a form of AI-led instruction.

Self-paced AI-led instruction is unique because the learning experience will not be entirely reproducible like a video course is. Students may dive deeper on one topic than another. They may ask more of the LLM than the instructor intended. They may jump ahead, though the structure of the experience should discourage it.

Thus, while you might still call what you experience a "course", I think the curriculum that you build is more like the surface of a digital ocean. The student moves across the surface, likely in a pre-determined path. However the depth of exploration, the eddies of knowledge, are unique to that student's experience. 

The flow of a Learning Surface for a coding course might look like this:

```
Student
   ↑↓
AI Agent
   ↑↓
Learning Surface
   ├── Skill context
   ├── MCP tools
   ├── UI Apps
   ├── Videos
   └── Code workspace
   ```

An enjoyable Learning Surface provides both required and optional material, making a course not only personalized, but an experience that supports repetition.

### Skill and MCP Learning
Agent Skills and MCP provide context. Context nudges the LLM in the right direction.

A learning experience should start with a Skill. The student can install it into the AI agent of their choice. It provides things like voice, style, workflow, core context, and more.

You might have a Skill for a single course module, an entire course, or an entire school.

The Skill can help guide the usage of the MCP server. The server provides in-depth context (especially if paywalled, otherwise it may be in the Skill), deterministic tools needed during instruction, video snippets, interactive slides, and more.

MCP Apps can also provide context to the LLM. For example, the results of a student's interaction with a piece of UI. Thus the deterministic elements can feed forward into the non-deterministic LLM keeping it on track and in the flow of the student's moment-to-moment experience.

### IDE Integration
For coding education, MCP Apps combined with IDEs make for a fantastic experience. Students clone a course repo. The student can watch a video and interact with a widget in an agent integrated into the IDE, and the agent can read the code the student types, allowing the LLM to provide feedback.

This is a broad space to provide in-depth training in a real-world work environment.

### WebMCP Learning Experiences
WebMCP really opens the doors to innovate on AI-led experiences. 

Designing a web application with two intended users: the student and their agent with whom they are collaborating, coupled with the other foundational pieces of infrastructure we've discussed, really means the limits are open to instructor imagination.

I believe enabling an agent-aware web experience via WebMCP is a vital goal for any learning platform going forward.

### A Sample Flow
The idea of a Learning Surface is both an educational and a user experience design solution. For a coder, I've experimented with something that looks like this:
- Clone a repo
- Install the Agent Skill for the course into your AI agent
- Connect the MCP server
- Start the course and watch the introductory video
- Interact with a slide
- If you are in an IDE (or web IDE), read some code and ask questions about it
- Ask a question mid-flow for clarification
- Get asked a question about some code
- Be asked to write some code
- Get LLM feedback on the code
- Have a mock debate with a fake coworker
- Answer a quiz question
- Time for lunch

### Video and Screenshare
Thanks to MCP Apps and WebMCP video can and should still be a major building block of self-paced education. The human touch of an instructor's explanation, the power of animated visuals, and the practicality of observing an instructor's screen can't be overstated.

However, as part of a Learning Surface, video becomes a carefully weaved thread in the tapestry of the student experience. Video serves well to establish core mental models, share thoughtful advice, and provide a real human connection as a needed break from fake LLM interaction.

### Designing a Learning Surface
Designing a Learning Surface, in my experimentation, is in some ways much like designing a self-paced video course, and far different in other ways.

It's similar in that you need a progressive curriculum. You need to create artifacts intended for consumption via MCP Apps or WebMCP. You need a voice, an intent, a goal, and technique.

It's vastly different in that it is a "surface" and not a straight line. If you want a learning experience to be more than "videos plus a chat bot", then you need to provide depth, delight, and aha-moments that can appear organically as the student moves through the experience.

This is especially challenging because good education, I believe, provides a progression that builds accurate mental models and foundations before moving on to fully using them.

You need to encourage a "golden path" through the material, while understanding that LLM interaction naturally means the student can do whatever they want.

Designing a Learning Surface is, at its core, a UX design challenge. You're designing for two simultaneous users (the student and the agent) across potentially non-linear paths, while maintaining progressive disclosure of concepts. The same principles that make a great product experience (clear mental models, meaningful feedback, guided autonomy) make a great learning experience.

The problem of skipping ahead is also not truly new. You could skip around a textbook in school. But I think the best Learning Surfaces will be those that provide meaningful education depth at all points on the Surface, whether the student chooses to dive into all of them or not.

After all, the best part about a human instructor is that you can ask them a question, and dive into their experience and opinions. Making your experience and opinions available to the student via LLM is a feat of context engineering that the best courses will muster.

### Building a Learning Surface
Building a Learning Surface goes beyond screen recordings.

It's building tools, content designed for agent consumption, and interactive UI designed for "in the moment" student engagement.

Instructors should get good at context engineering, and teams supporting learning platforms and apps should provide an infrastructure and design and development support that delivers performant and well-tested Skill, MCP, MCP Apps and WebMCP-based experiences.

That said, one person can absolutely design and build a quality Learning Surface.

### Observability
Good analytics are important for course content iteration. But because the LLM is along for the student experience ride, analytics on student experiences become more like interviewing a mentor than reading quiz results.

You can have the agent update student metrics and observations via the MCP server as the student takes the course. Have the LLM build a structured document as-you-go, and analyze the results. I found it enlightening and heartening. 

For self-paced instruction you don't always get the enjoyment of watching the student learn and succeed. The AI can give you a play-by-play.

## A Look Ahead at Self-Paced Learning
Maybe you were expecting me to sell you a Learning Surface at the end of this post. Well, I'm not. I'm sharing my ideas that I'm currently experimenting with.

By the way, nothing in my experimentation leads me to believe that AI will replace human-led instruction. It won't. It *can't*.

However, I do believe it *is* possible to deliver an impactful learning experience delivered via an AI agent. In fact, I think it's the future.

Events like the merger of Udemy and Coursera have people wondering about the future of self-paced education. But I think that **self-paced online education isn't going anywhere**. 
It's going to change, and we need to change how we think about learning experiences. But not about learning itself.

AI also doesn't remove the need for direct human instructor access. In fact, the possibility of AI inaccuracy increases it. Forums, office hours, and the like still are a vital aspect of self-paced education, no matter the format. But an LLM-powered format, properly designed, controlled, and presented, can be an impactful experience. 

A great Learning Surface that serves as the foundation for people's careers won't come about because a new AI model is released. It will be carefully designed and thoughtfully curated by a human instructor who cares.

If you'd like to discuss or would like consultation on the future of technical education, feel free to reach out to me at <a href="mailto:hey@tonyalicea.dev">hey@tonyalicea.dev</a>, or <a href="https://www.linkedin.com/in/tonyalicea">connect with me on LinkedIn</a>.