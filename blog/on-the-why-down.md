---
layout: post.njk
title: On The Why Down
excerpt: How To Do Better Than MVP
date: 2023-03-27
tags: ['post','front-page']
---
# {{ title }}
**How To Do Better Than MVP**

How do we build software that solves real problems? How do both software development teams and the organizations that surround and utilize them come together to make good decisions? How do we acknowledge and work with the human factors built into all aspects of software development? How do we know what to build?

## The Myth of the MVP

The "Minimum Viable Product" is a great idea on paper. Over the years, however, I find that, no matter the software development process, **defining what needs to be built** is a problem that it doesn't solve well.

MVP has two major flaws:
- The fog of "viability": Who decides what is "viable"? This term is subjective, and highly susceptible to organizational politics and human bias.
- The undefined "minimum": Minimum is a moving target, and often incorrect. It's susceptible to siloed organizational structures and communication breakdowns.

MVP isn't the only issue. Companies have adopted Scrum and Agile. These too are meant to approach software in a minimal, iterative, and unifying way. But Agile only produces results as good as the "defining what needs to be built" stage is.

Scopes creep, expectations go unrealized, intended iterations never happen, and people we should have asked are never talked to. While differing in degrees, these are problems that every team, organization, and company I have ever worked for or with have struggled to control. These remained true no matter what software development practices and processes they were using.

Myths proliferate. Buzz words fly. The resulting software is so-so. People are frustrated.

## Software Is Human

A massive blind spot in most software development processes is recognizing that it is a fundamentally human endeavor. People are involved, and thus the needs of people must be filled in order to have the greatest success.

***People need dignity, agency, and respect.***

- **Dignity**: They don't want to feel that they are unneeded, unwanted, or ignored.
- **Agency**: They want to feel they have some control over what they are doing or experiencing.
- **Respect**: They want to feel that others recognize the value of their existing or potential contributions.

You hear the results of these needs not being filled in interpersonal communications, that usually degrade into reduced morale, motivation, cooperation, and productivity:

- "Who do you think you are..."
- "No one asked me..."
- "I can't believe they're making us do this..."

A unified organization produces the best results. Software is cold and calculating. The people that exist in all aspects of software development are not.

Since people are inputs to the software development process, human flaws are as well. People get attached to their ideas, misunderstand, miscommunicate, and filter information through the lenses of their own biases and insecurities. 

A successful software development process recognizes these negative aspects of human input, and ***iterates them away through good process***, without tearing people down along the way.

## A Better Way

Over my 25 years of software development, straddling and crossing the line between development, UX, and managerial roles, I've seen things go wrong and go right. The popular approaches often go wrong, in both technical, budgetary, and human ways.

What follows is the approach I have had success with in every way. It has worked in both small teams and large organizations implementing Scrum and Agile. It's the way I think software should be developed.

## A Seat At The Table

We begin by establishing that ***everyone has a seat at the table***. Everyone involved in the software, be it construction or use, gets input. I call these "seats" at the table.

These are usually representatives from organizational roles coupled with representatives from development roles. Stakeholders, managers, users, designers, developers, security professionals, DevOps, etc. Each role gets a "seat". 

This is not "design by committee". The organizational hierarchy still makes the final decisions, and each seat is given due respect and deference for their relative expertise and responsibility. Each seat carries out their own work, using whatever methods are working for them.

In expressing concerns, needs, and constraints, though, they are a team of equals.

Everyone is heard. Everyone is given dignity, agency, and respect. Every seat is a potential source of a good solution that comes from their area of knowledge, experience, and influence. UX doesn't suggest DevOps solutions, they suggest UX solutions to DevOps problems.

## Solutions vs. Problems

Next, we establish the fundamental unit of design that everyone works with: the "Problem".

People usually express their problems in the form of solutions. They say, "I need to go to the grocery store", not "I don't have food in my refrigerator for dinner."

This is both natural and highly problematic. Everyone (stakeholders, users, developers, designers, managers, etc.) can become attached to a particular solution, placing blinders on the entire project.

Every role (each "seat") must learn to think in terms of problems, rather than solutions. ***A "problem" is a statement of needs to be filled or constraints to be respected with no mention of a solution***. It does not have to be in the form of a negative.

- A designer's *"Add a 'Buy Now' button"* becomes *"Users leave the site before they finish their purchase."*
- A manager's *"Use this template I found"* becomes *"We want users to find it visually attractive while staying within budget."*
- A stakeholder's *"Output a Word doc"* becomes *"We need it to be easy to edit."*

This process is not just applied to the user experience. It is applied to every seat at the table. Stakeholders, managers, developers, designers, security professionals, DevOps, etc. *all* distill their solutions, within the context of a particular software project, to problems. These problem statements are shared with all the other seats. This allows solutions to come from anywhere.

For stakeholders and requirements gatherers, this eschews the "gather functional requirements" approach to software development. Don't ask the stakeholders and managers to design the solutions (which is often what gathering requirements degrades into). 

Stakeholders and managers are given dignity, agency, and respect by being an active part of the software development lifecycle. The "requirements" are problem statements they provide. They have a seat at the table, and so give what they know but also see what they don't know.

This usually requires cultural change, and can be the biggest hurdle. The "problem" approach needs to be established at the beginning of the project. Frame it positively. Everyone has "full access", a window into **all** the problems that need solving. 

Treat problem statement creation formally as "the process", and treat them as a vital part of it. You may be surprised at how quickly they become invested in doing it right.

## The Why Down

What is "the process"? Take the idea of "seats" and "problems", and process them through what I call the "why down".

Every "seat" writes down all of their ideas and concerns. Then, for each idea and concern, they ask "why" and write the answer. If the answer still contains some sort of a specific solution or action, ask "why" again and write the answer. Repeat.

A "why down", then, is **the act of reducing (or distilling) a suggested solution to the underlying problem that it is solving.** If the solutions are the leaves of a tree, the problems are the roots.

At the bottom of a correct "why down" you arrive at a statement that expresses the problem ***with no mention of any particular solution or action***.

A "why down" might look like this:

- "Provide a way to download the report as a Word doc." *(Why?)*
- ...so I can edit the report before I send it. *(Why?)*
- ...because managers need more information than is in the generated report. *(Why?)* 
- ...because managers make presentations in higher-level meetings and don't have the information to answer questions. *(Why?)* 

In this way the solution "Provide a way to download the report as a Word doc" becomes a problem statement: "Managers are unfamiliar with the data on the reports".

Note that you can stop asking "why?" as soon as the answer contains only **needs/constraints** and **no actions/solutions**. "Edit the report" was an action, and so another "why?" was needed. 

If stakeholders/managers have a seat at the table, for example, they may find other solutions to this problem that don't involve software. That's fine. That's the point. We are working to discover what problems exist ***that software needs to solve***. Scope creep is typical in other software development processes. If everyone has a seat at the table, the "why down" often *reduces* scope.

You may go too far. With each answer, check if you have no actions/solutions. As soon as you don't, **stop**.

You can give pre-prepared sheets to each "seat" representative(s). Just columns with lines and the word "Why?" on a big arrow on the side pointing down. People usually need training or help at first to do this properly. It's hard to stop thinking about solutions, and express the heart of the problem.

This leads us to a dramatic improvement on the MVP, an idea that emerges naturally from the "why down", and gets everyone at the table on the same page.

![Tree with roots](/assets/blogimages/treewithroots_1.png)

## Minimum Solved Problems (MSP)

The set of every final problem statement from every seat at the table becomes the "problem space". From that problem space, the **minimum required set of problems that must be solved** with the current iteration of the software are chosen. This set makes up the "Minimum Solved Problems" or MSP set.

Choose the MSP via whatever organizational hierarchy, responsibility, and determining factors make sense. Everyone has a seat at the table. Not everyone gets to choose which problems are the most important at the moment or which solutions are tried. That's better than an unawareness of other problems, and people not feeling respect nor agency.

This works out fine, because when people feel they were given dignity, agency, and respect, they will often feel ownership of solutions even if they aren't the solutions they suggested. It's easier for them to feel empathy for problems that aren't theirs, and appreciate them being solved, when they know their own problems are on the table as well. The MSP is a team effort.

Each release of the software is an "MSP" release. A release solves the minimum required set of problems in some way, and each problem needs only be solved in one way. Each "seat" implements solutions that fall within their responsibilities using their own best practices.

<small>There are no rules to what constitutes problems, just be sure to specify them. For example, your software will have bugs. Perhaps there are a lot of bugs. It may be decided that a problem is "we want users to be confident in the software". An MSP release may be just a bug fix release. That's great, just make sure you know <em>why</em> (i.e. the problem that was solved).</small>

I find MSP to be superior to MVP in every way. It avoids human biases, attachments, and insecurities. There is no "viability" fog and "minimum" is clearly defined. It results in useful software that solves real problems from day one.

## Feature Requests
One of the first things that starts to happen once software is released is feature requests. Most companies take in feature requests and sort them by effort, popularity, etc. That's wrong.

A feature request, by nature, is an expressed solution. So, simply take each feature request and why it down. ***A feature request is a window into users' problems, not a solution that must be implemented.***

Different feature requests often reduce to the same problem statement. Now you can accurately compare the popularity of underlying problems.

<small>"Please add a copy/paste feature" and "We need a 'send via e-mail' button" feature requests may both reduce to one problem statement: "Users can't easily share information."</small>

You can simply add these new problem statements to your User Seat. Feature requests feed into new MSP releases no differently than any other form of user analysis, and the solutions to those problems may be wildly different than the solution presented in the feature request itself.

Solve the underlying problem in only one way. Then release and see what happens. Different feature requests often disappear after one released solution.

## Iteration

Software should be developed iteratively, with the understanding that you may never get to the second iteration.

The reality of budgets, time, priorities, staffing, and more can mean good iteration intentions are never realized. That's ok, if the first iteration of the software solves real problems.

If you do get to iterate, the process does not change. Take any new inputs, such as feature requests, organizational priority changes, usability testing results, financial feedback, software bug reports, etc. and why them down into problem statements. Determine your new MSP set. Design one solution for each problem not yet solved. Release software. Repeat.

I find doing this enough begins to change organizational culture. Due to positive business and human results, it becomes a natural, open, and welcome way to solve problems. 

You won't just be iterating on the software, you'll be iterating away negative human inputs.

## Solving For The Why

Most organizations do not fully understand all aspects of their own processes until they attempt to implement it as software. Most organizations and many dev teams are collections of information silos blocked from intercommunication through poor process or human insecurity. The "why down" and MSP process provides a safe space to tear down walls and bring everyone to the table.

Solving for the "why" leads to the best, fastest, most efficient, and most enjoyable software development I have ever engaged in. I find solving for the why makes people want to come back to work in the morning.

## A Welcoming Table

Giving everyone a seat at the table only works if everyone is welcome. Organizational politics, personal agendas, and fear can derail the entire process. Use software development formalized processes as an excuse to get past these problems, but you don't have to say that's what you're doing. Let the process iterate the issues away.

To convince people to come to the table, I find the following arguments work best, depending on the listeners perspective:
- This process will save time, budget, and effort.
- This process will make sure your concerns, thoughts, and needs are heard and considered.
- This process will produce innovation and software that gets the job done.

A welcoming table is one that sees every seat as a potential source of solutions. Engage everyone in the process, and they will feel they had agency and feel ownership over the results, even if their solutions are never implemented.

You will find you have a more unified, happy group of people, who happen to build great software on the why down.

<small>Discuss this with me on <a href="https://twitter.com/AnthonyPAlicea/status/1640367729210163202?s=20">Twitter</a> and <a href="https://www.linkedin.com/posts/tonyalicea_softwaredevelopment-activity-7046170757718040576-pzWx?utm_source=share&utm_medium=member_desktop">LinkedIn</a>.</small>