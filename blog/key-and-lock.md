---
layout: post.njk
title: Key and Lock
excerpt: Learn from interfaces that have endured.
date: 2014-03-14
tags: ['post','front-page']
---
![Key and lock](/assets/blogimages/keylock.jpeg)
# {{ title }}

In his seminal work [The Design of Everyday Things](https://www.amazon.com/gp/product/B00E257T6C/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00E257T6C&linkCode=as2&tag=preneer-20%22%3EThe%20Design%20of%20Everyday%20Things:%20Revised%20and%20Expanded%20Edition%3C/a%3E%3Cimg%20src=%22http://ir-na.amazon-adsystem.com/e/ir) (revised in 2013), Don Norman notes that with every new technology designers repeat the same mistakes of the past.

User experience designers should not fall into this trap, because a fundamental key to good UX design is humility. It takes humility to change a design based on user testing; and it takes humility to look back at technologies of the past that have endured, and show them their due respect.

One of the oldest and best interfaces has endured for thousands of years. The two part interface: key and lock. Let's pull some software lessons from before there was software.

## Guessability
The key and lock is guessable. Most doors have only one keyhole. The key looks like it fits in the hole. If you handed someone a key, and pointed them at its corresponding door, they would likely guess what to do even if they'd never done it before.

Both the key and lock follow [DOTW (Do One Thing Well)](/blog/dotw-do-one-thing-well/) and it is hard for a user to get it wrong.

>Make your interfaces guessable by minimizing ways to get it wrong. Reduce the number of elements in each interface, drawing a clear path to completing any given task.

## Security
The key and lock's primary purpose is security. Yet no one complains about it, because it works well and is not hard to use.

You must have the right key, and only the right key for the door to open. It takes special skill to open a door without the key, but no skill to open it otherwise.

>Security is important. It should keep things safe. It should just work. It should be trustworthy. Yet when you are authorized, security shouldn't be an impediment to use.
>
>Don't think 'difficult to do' is a valid security paradigm. The people who break security won't be impeded, just your users. Implement good security practices, but simple UI.

## Notifications
One reason for the endurance of key and lock is not commonly considered. The key/lock paradigm provides user notifications. Attempts to tamper with a lock invariably leave evidence, like scratches for example.

>Users value clear notifications, in security and all other actions. A good notification system can make the emotional difference between feeling cared for, and feeling uncertain and alone.

## Consistency
Although generally one key fits in one door, using one key and lock teaches you how to use all of them. No matter the material, appearance, size, country, or epoch, key and lock pretty much works the same way.

>Consistency isn't necessarily the most important element of UX. Clarity is arguably more important (consistently confusing isn't good). However, there is value making certain elements of your UI consistent. Navigation, save/cancel, and error messages for example. A consistent interface makes the user feel like they have a chance of learning it.

## Feedback
Key and lock provides instantaneous feedback. Usually the wrong key won't even fit into the lock. If it does fit, the lock won't turn. Although its annoying to run through a ring of keys looking for the right one, consider how quickly you are actually able to do it. That's because of good feedback.

>Feedback is vitally important to any interface design. Any and every action must have a clear, unambiguous, unmissable reaction. Change your button's text and disable it once it's clicked, notify that the form saved properly, explain that an error happened and what to do to fix it. Provide good feedback.

## Useful Abstractions
Few people truly know how the tumblers in a lock work, and fewer still could design them. Yet the key abstracts the user away from the inner workings of the lock, allowing them to focus on the task (opening or locking the door) rather than how the tool helps them accomplish it.

>Software interface design is the act of building abstractions. We abstract the user from the inner workings, on the web for example, of HTTP, HTML, CSS, Javascript, and whatever server-side code involved.
>
>No matter how hard you worked on your code, don't let your ego or frustration leak those complexities into the interface; the user won't understand them anyway.
>
>Want recognition? Do a really, really good job of hiding all that thought and work; make a simple interface to all that complexity, and your users will thank you.
---
Interfaces that have endured for centuries have done so for a reason, because they rely on UX truths that work no matter what the technology.

Guessability, security, notification, consistency, feedback, and good abstractions are something that every interface (physical, software, or otherwise) should share.

Stay humble in your designs. Seek knowledge from interfaces that have endured the test of time. Build something that people will be happy to use, and you'll be happy building it.