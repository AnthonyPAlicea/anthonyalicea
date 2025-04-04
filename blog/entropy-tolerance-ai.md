---
layout: post.njk
title: "Entropy Tolerance: The Essential Software Question for The AI Age"
excerpt: 
date: 2025-04-04
og_image: 'assets/entropy_twitter.png'
tags: ['post','front-page']
---
# {{ title }}

"**Entropy Tolerance**" is the concept we should be using to talk about AI-assisted development, software requirements, and team processes in the age of LLMs and "vibe coding."

I've been thinking a lot about how AI is changing the way we build software—not just writing code, but shaping whole workflows.

So I've coined a phrase: Entropy Tolerance.

**"Entropy Tolerance" is how much uncertainty (or AI-generated 'guesswork') a software-supported process can handle.**

Every process—whether you're prototyping a new idea or managing a supply chain—has a limit to how much uncertainty it can tolerate before things break.

In information theory, entropy (as coined by Claude Shannon, whose mathematical ideas have shaped LLMs) measures uncertainty in a probability distribution. LLMs are built on this foundation. Every output they generate is a probabilistic, statistical guess.

The more AI you integrate into your process—from brainstorming to coding to QA—the more entropy you introduce. As entropy increases, confabulations (that is, hallucinations) and unexpected outputs compound. When probabilities multiply, uncertainty grows.

## A Useful Vocabulary

Good decisions come from clear thinking—and clear thinking needs clear terms. "Entropy tolerance" gives devs, managers, and orgs a way to talk about how much *unchecked* AI involvement a process can handle.

For devs, realize that we aren't talking about the entropy tolerance of the act of coding itself. Rather the entropy tolerance of *the processes that the code is supporting*. This touches both how we code, and any AI integration we include in the software.

<p style="text-align: center">
<img src="/assets/blogimages/robot_question.png" alt="Robot with question" />
</p>

## Requirements, "Vibe Coding", and Entropy Tolerance

When you begin any software project, ask yourself this question: ***What is the entropy tolerance of the process this software is supporting?***

The higher the tolerance, the more it can tolerate AI being occasionally wrong. **This is the new key software requirements question that should be asked going forward.**

This also guides coding and design decisions. If a process has a low entropy tolerance, then you should ensure the software's design enables and encourages humans to check the AI's work.

If a process has a high entropy tolerance, then you can allow AI to do more work with less oversight, such as "vibe coding" a feature.

### Here are some concrete examples:

**You're building a prototype for user testing, but the code won't be deployed to production.**
- *Entropy tolerance*: ⬆️ High
- Since the generated software isn't going into production, it doesn't matter what the underlying process is, the entropy tolerance is quite high. If the AI gets something wrong, it won't have much of an impact.
___
**You're adding a feature to your software that extracts data from a PDF.**
- *Entropy tolerance*: Could be ⬆️ High or ⬇️ Low
- Remember to focus on the underlying process. If you are extracting financial data from a PDF that will go into a payroll system, for example, the tolerance is low.

If the tolerance is low, you'll need to make it clear to the user that the data extracted needs to be reviewed, and should provide a UI that helps with that review.

If the tolerance is high (say, extracting keywords to build a word cloud), you may be able to simply have the AI do the work and move on with minimal human checks.
___
**You're adding a feature to medical software that logs symptoms a patient reports to their doctor.**
- *Entropy tolerance*: ⬇️ Low
- You have to get this process right. The cost of LLM mistakes could be terrible. This is not the place to vibe code. You might use AI to assist in coding, but it would be done slowly, carefully, and with constant oversight.

Any AI integration in the software itself would be made extremely clear (perhaps with warnings) to the user, and never allowed to be completed without explicit human sign off.

## AI Won't Replace Developers

Entropy tolerance also shows why probabilistic AI won't replace developers. So many of the processes we support in software have low entropy tolerance.

Sure, a non-coder can vibe code a minesweeper clone for their blog. The entropy tolerance of that is sky high. But what about enterprise software? What about a SaaS app? 

No matter what the hype says, at their mathematical core, LLMs are unreliable. They make a best guess based on what's been done before. That can be incredibly useful and powerful. But it's also a risk factor for any business.

For processes with low entropy tolerance, software needs human coders. Human coders to check AI work. Human designers to design AI integrations that encourage human input.

## Conclusion

The next time you're starting a software project, ask yourself: "**What's the entropy tolerance of this?**" Understanding the limits around uncertainty and AI involvement can be the difference between costly mistakes and remarkable success.