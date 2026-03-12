---
layout: post.njk
title: "Trace: Declarative Modeling for the AI Age"
excerpt: A spec-writing approach for AI code generation and teaching new devs how to think about software.
date: 2026-03-03
og_image: 'assets/trace_card.png'
tags: ['post','front-page']
---
# {{ title }}

Spec first, then plan, then code. In the age of AI, most developers already understand the value of this when working with an AI agent.

What changes when an LLM is generating the code is the weight placed on how the spec is written. It's no longer just communication between people who can ask each other questions, it's the primary input to a system that will produce significant amounts of code. Vague specs produce vague implementations, and the gap between what you wrote and what you meant shows up quickly in the generated output.

[**Trace**](https://github.com/anthonypalicea/trace) is a standard for writing that spec: specifically, writing it in a declarative, structured way that an LLM can act on and that a developer can learn from.

That second part matters as much as the first. The challenge for developers learning to code today is that the most accessible entry point to the craft, writing syntax, can now be largely delegated to a language model. That shifts attention toward the harder and less visible work: understanding what a system actually is before anyone writes a line of it. What are the boundaries between parts of the system? Who owns what data? What rules govern how things change? How do separate areas of the software communicate without becoming one tangled dependency?

These are questions of systems thinking, and they're not easy to develop in the abstract. Trace is designed to help with this. Defining a domain forces you to answer what it owns and what it doesn't. Writing a glossary forces precision about words that teams often treat as interchangeable until they discover mid-build that they meant different things. Writing access rules for a persona forces you to think about a real person's relationship to data, not just which buttons they can see on a screen. 

The structure won't let you skip past these questions, and working through them carefully is itself an education in how systems are built and practice to build architectural skill.

In this post we'll walk through each part of a Trace a running example, a small clinic system with patients, providers, and a front desk staff who keeps everything moving.

---

## The 'L' in LLMs

The first L in LLM stands for "Large." But the more interesting letter, for our purposes, is the second one: *Language*.

Traditional specifications were designed for parsers. They used formal grammars, rigid syntax, and machine-readable structures that are highly proscriptive.

Because LLMs process natural language, that proscriptive need largely disappears. A specification written in clear, structured prose can be understood by AI and human alike.

This doesn't mean writing a vague paragraph and calling it a spec. Trace is designed around *organizational consistency*, not syntactic rigidity. The LLM doesn't need formal grammar; it needs *structure*. A consistent structure tells it what the access rules are, what the events are, what the business rules are. Natural language inside that structure conveys intent and meaning. The spec is readable by design, and actionable because of its organization.

---

![A technical machine blueprint](/assets/blogimages/trace1.jpeg)

## A Trace Is A Folder
A Trace is a standardized folder structure. Our example, while in progress, might look like this:

```
fish-family-medicine/
├── overview.md
├── stack.md
├── personas/
│   ├── patient.persona.md
│   ├── front-desk.persona.md
│   └── provider.persona.md
├── domains/
│   ├── scheduling.domain.md
│   ├── clinical.domain.md
│   └── billing.domain.md
└── flows/
    ├── book-appointment.flow.md
    ├── front-desk-dashboard.flow.md
    └── patient-check-in.flow.md
```

## Overview
The `overview.md` file gives an overview of the system being built, and provides a place for a global glossary of terms used by the underlying business the software is supporting.

```
GLOSSARY:
- Patient: A person receiving care at the practice.
- Provider: A doctor, NP, or PA who sees patients.
- Appointment: A scheduled time slot. Not the same as a visit.
- Visit: A clinical encounter that happens when a patient checks in. Not the same as an appointment.
- Claim: A billing request submitted to insurance after a visit is completed.
- Front Desk: Administrative staff who manage the schedule and patient flow.
- Check-In: The moment a patient arrives and is marked present. Bridges Scheduling and Clinical.
```

## Stack

Before describing behavior, Trace captures the technical decisions that affect everything else. These live at the root in a `stack.md` file.

```
BACKEND:
- Runtime: Node.js (LTS)
- Framework: Fastify
- Language: TypeScript

DATA:
- Database: Supabase (Postgres)
- ORM: Drizzle

FRONTEND:
- Framework: React + Vite
- State: Zustand
- Styling: Tailwind CSS
```

These decisions live in one place so an LLM generating code never has to guess the runtime, the ORM, or the state management library. Stack also includes a `SYSTEM DEFAULTS` section for cross-cutting decisions like ID strategy, audit fields, and how money is stored: things that affect every entity and every domain in the system.

### Design System Forward

Stack also includes the design system reference: where component libraries, design tokens, style guides, or design files live. This connects every flow in the spec to the visual language of the product, so the LLM knows what UI building blocks are available and which to use. 

The design system isn't a separate concern from the architecture; it's part of the same document.

---

## Domains

Domains (`./domains/*.domain.md`) are the heart of a Trace. Each domain is a self-contained area of the system with its own vocabulary, rules, and data. They communicate with each other through events, not by reaching directly into each other's data.

The first question to ask when defining a domain is: *Is this one thing, or secretly two things?*

Fish Family Medicine is a good example. You might be tempted to create an "Appointment" domain and move on. But look more carefully. An *Appointment* is a scheduled time slot. A *Visit* is what actually happens when the patient walks through the door. They're related, but they're not truly the same conceptual entity. 

You could simply state that a Visit is scheduled and occurs or does not. That may work fine. But as business rules grow, and user research shows the reality of appointments versus visits, thinking through these domains may save untangling later.

### Glossary

There is a global glossary for terms that always have the same meaning. However you will find in many organizations that the same word means different things to different groups.

Domains document the terms that matter in their context. Whether terms unique to a domain or that differ from the general global meaning.

```
GLOSSARY:
- No-Show: A patient who had a confirmed appointment but never checked in.
```

Whether from the global glossary or domain-specific, when the LLM reads a rule about an "Appointment," it knows exactly what that word means in this context, not some general notion in its training data of what an appointment could be.

### Constraints

Constraints define what a domain can and cannot do, and how it relates to the rest of the system.

```
CONSTRAINTS:
- Scheduling owns appointment lifecycle only. It does not know about clinical notes,
  diagnoses, or billing.
- "Appointment" in this context is a time slot. It is NOT a visit.
- When a patient checks in, Scheduling emits an event. What happens clinically after
  that is not Scheduling's concern.
- Never include reason_for_visit in SMS messages (PHI constraint).
```

This is the domain's boundary. Constraints protect the architecture from drift. When an LLM implements Scheduling, it knows not to reach across into Clinical. The boundary is explicit in the spec, not just implied by convention.

### Entities

Entities are the data the domain owns. They're defined at the least with the fields that actually matter, though they can be exhaustive.

```
# ENTITY: Appointment
MUST HAVE:
- id: UUID
- status: Enum (Requested, Confirmed, CheckedIn, Cancelled, NoShow)
- appointment_time: DateTime
- duration_minutes: Integer
- reason_for_visit: Text
- patient_id: UUID
- provider_id: UUID
```

The `MUST HAVE` pattern keeps the spec honest. These aren't optional fields; they're the fields without which the entity doesn't make sense. The LLM generates the full schema from this, applying the Stack defaults along the way.

### Events

Domains communicate outward by publishing events. Other domains listen and react.

```
# EVENT: PatientCheckedIn
TRIGGER:
- When Appointment.status changes to CheckedIn.

PAYLOAD:
- appointment_id
- patient_id
- provider_id
- reason_for_visit

# EVENT: AppointmentConfirmed
TRIGGER:
- When Appointment.status changes to Confirmed.
- Send a confirmation text via Twilio SMS with the appointment date, time, and provider name.

PAYLOAD:
- appointment_id
- patient_id
- appointment_time
- provider_name
```

The Clinical domain, for example, declares exactly how it reacts to `PatientCheckedIn`:

```
# LISTENS TO: PatientCheckedIn (from Scheduling domain)
- Creates a new Visit in InProgress status.
- Sets Visit.patient_id, provider_id, and appointment_id from the event payload.
- Sets Visit.chief_complaint from the event's reason_for_visit.
```

Neither domain needs to know how the other works internally; they only need to know the events being published and what to do when they arrive. The system stays decoupled at the architecture level, not just in the implementation.

The `LISTENS TO` keyword is a simple way to describe what events domains depend on.

How events actually work in code is an implementation question. Domains communicate via events *architecturally* and *conceptually*. Developers can work with the intended stack and the generated plan to determine what a concrete implementation looks like.

### Rules

Rules are the business logic that must be enforced, written in plain language and labeled for reference.

```
RULES:
- R1: Status moves forward only: Requested -> Confirmed -> CheckedIn. Cancelled and
  NoShow can happen from Requested or Confirmed.
- R2: A provider cannot have overlapping appointments.
- R3: A new patient appointment must be at least 30 minutes. Returning patient
  appointments can be 15 minutes.
- R4: Appointments cannot be scheduled more than 6 months in advance.
```

The labels are useful. "This test covers R3" is useful in a code review. "This test covers the appointment length rule" is ambiguous. When a stakeholder changes their mind about R2, you can find every place it's referenced in code (I find the LLM tends to put them in comments where they are implemented), in tests, and in tickets.

### Stubs

Some rules are real but require their own implementation planning. They're complex enough that dropping them into a domain spec would derail the conversation.

```
RULES:
- R5 STUB: Cancellations less than 24 hours before appointment time incur a
  cancellation fee.
```

The `STUB` modifier signals that this rule exists and that the signature should be enforced, but the implementation will be planned separately. This allows developers to choose when to drop deeper into the implementation and work a problem more carefully.

### Externals

In modern applications it's common for a domain to integrate with something outside the system. With scheduling, for example, that might be something like Twilio SMS for appointment confirmations.

```
EXTERNAL: Twilio SMS

# LISTENS TO: Twilio SMS
- When a patient replies CANCEL, find the matching appointment by patient phone number
  and cancel it. Appointment.R1 and Appointment.R5 still apply.
```

The list of externals is declared simply in the domain file. The `LISTENS TO` section describes how the domain reacts to inbound messages from it.

---

## Personas

A persona (`./personas/*.persona.md`) in Trace represents real people with constraints, goals, and frustrations, and with explicit data access rules.

```
# PERSONA: Patient

DESCRIPTION:
- A person receiving care at the practice.
- Wide age range. Many are not tech-savvy.
- Cares about getting an appointment quickly and not being surprised by bills.
- Often anxious when visiting the doctor. Clarity reduces anxiety.
```

That last line isn't decoration. It shapes how flows are designed for this persona: confirm steps clearly, reduce ambiguity, never leave patients wondering what happens next. That's a design principle, and it lives in the spec where it can actually influence the work.

### Access

Access rules define what data each persona can see and modify. These rules are enforced at the data layer, not just in the UI.

```
ACCESS:
- Can only see their own appointments and visit history.
- Can see their provider's name and specialty. Cannot see other patients' data.
- Can cancel or reschedule their own appointments.
- Cannot see clinical notes until the provider releases them.
```

It's not enough to hide a button in the interface. The spec says what data each persona is *allowed to touch* at the system boundary. That drives API permissions, middleware, and database row-level security.

### User Research

Trace treats user research as a first-class citizen of the specification. If you've done interviews or gathered insights about how real people use your system, they belong here, not in a separate document that gets lost six months into the project.

```
## Research Findings

### From user interviews
- 4 of 6 patients said they've accidentally booked the wrong appointment type because
  the options were confusing.
- Patients over 60 strongly preferred calling over using an app but were open to
  "something simple."
- Multiple patients mentioned frustration with not knowing if their insurance was
  verified before arriving.

### Jobs to Be Done
- When I need to see my doctor, I want to book the right type of appointment without
  having to know medical terminology.
- After my visit, I want to understand what I owe before I get a surprise bill.
```

When an LLM generates flows for the Patient persona, this context shapes the output. Plain language over medical categories. Insurance status visible at check-in. The research doesn't stay in a slide deck; it travels with the spec into the implementation.

---

## Flows

Flows describe how each persona moves through the system. They're the bridge between the domain model and the actual user experience.

<!-- IMAGE: Person at a desk with a tablet or monitor showing a calm, uncluttered digital interface. Focused, intentional. Adobe Stock search: "person tablet digital workspace calm organized professional" -->

Flows in Trace have two strategies.

**normalize** spreads the workflow across multiple screens, each with its own URL. This works well for processes that benefit from one-thing-at-a-time focus, like a patient booking an appointment for the first time.

**denormalize** keeps the workflow on a single screen with changing frame states, where the URL doesn't change. This works well for practiced users who need everything in front of them, like a front desk coordinator managing a full day's schedule.

If you want to read more about the thinking behind normalization and denormalization as a UX principle, I wrote a full book on it which is [free to read online](https://dontimitate.dev/normalui).

### Domains

Each flow declares its strategy, persona, and the domains it touches in YAML frontmatter. This makes dependencies explicit and helps determine implementation order.

```
---
flow: BookAppointment
strategy: normalize
persona: Patient
domains:
  - Scheduling
---
```

### Screens, Frames, and Normal UI

Flows in Trace are built around the Normal UI usability concept, but it's really just user flows with some specific additional ideas.

You pick `normalize` or `denormalize` for each flow, and the structure follows from that choice. In a normalized flow, **Screens** are the primary unit, each a distinct URL route. In a denormalized flow, there's one Screen containing multiple **Frames**, which are the states the user transitions between without navigating away.

This explicity documented choice, beyond a prototype or design system component, serves as a reminder of *why* a flow is designed a certain way, based on what we know about how users will work.

Book Appointment is normalized because booking is a first-time or infrequent task for a patient. One decision per screen, clear progress, no risk of accidentally skipping something important:

```
---
flow: BookAppointment
strategy: normalize
persona: Patient
domains:
  - Scheduling
---

## SCREEN: Choose Reason
- REF: design-system/templates/card-selection-grid.jsx
- DATA: A simplified list of reasons (e.g., "Routine Checkup", "I'm Feeling Sick",
  "Follow-up Visit", "Something Else").
- These map to internal reason_for_visit values but are displayed in plain language.
- ACTION: Select any standard reason -> Goes to SCREEN: Choose Provider
- ACTION: Select "Something Else" -> Goes to SCREEN: Describe Concern

## SCREEN: Choose Provider
- REF: design-system/templates/list-selection.jsx
- REF: design-system/mockups/provider-card-layout.png
- DATA: Provider.name, Provider.specialty, Provider.accepting_new_patients
- Only show providers relevant to the selected reason.
- ACTION: Select a provider -> Goes to SCREEN: Choose Time
```

The Front Desk Dashboard is denormalized because front desk staff are practiced users managing a high-volume day. They need to act quickly without losing context of the full schedule:

```
---
flow: FrontDeskDashboard
strategy: denormalize
persona: FrontDesk
domains:
  - Scheduling
---

# SCREEN: Today's Schedule
> GOAL: See everything at a glance. Manage the day's flow without navigating away.

## FRAME: Schedule View
- REF: design-system/templates/data-table-with-status.jsx
- SOURCE: Appointment entity (filtered by date == today, ordered by appointment_time)
- ACTION: Click appointment -> Transitions to FRAME: AppointmentDetail

## FRAME: AppointmentDetail
- ENTERS_FROM: FRAME: Schedule View
- DATA:
  - Appointment.status
  - Appointment.appointment_time
  - Patient.name
  - Patient.insurance_status
- ACTION: "Check In" -> Changes Appointment.status to CheckedIn, Transitions to
  FRAME: Schedule View. Only available if status is Confirmed.
- ACTION: "Back" -> Transitions to FRAME: Schedule View
```

The LLM knows the route, the state within it, what data to display, and what happens when the user acts. The strategy, normalize or denormalize, determines the structure, and the spec makes that decision explicit rather than leaving it to whoever builds the screen.

### Design System References

Flows reference design system assets directly: component names, or image mockups from a design file.

```
## SCREEN: Choose Provider
- REF: design-system/templates/list-selection.jsx
- REF: design-system/mockups/provider-card-layout.png
```

This connects the architecture directly to the UX design. The LLM uses these references. Human readers know where to look. The design files are part of the same conversation as the spec.

---

## Generating Plans

Once a Trace is written, you can generate an implementation plan from it.

For larger software, an effective approach is **vertical slices**, implementing one complete feature at a time from database to UI, so that each slice is actually usable when it's done. Alternatively, plans can be organized by **flow**, where each flow references its needed domains and the plan builds them out in the order the flows require.

A plan generated from Fish Family Medicine might look like this:

```
Phase 1: Scheduling Core
  - Appointment entity and migrations
  - Confirm, cancel, no-show endpoints
  - PatientCheckedIn and AppointmentConfirmed events

Phase 2: Patient Booking Flow
  - Book Appointment screens
  - Patient access rules

Phase 3: Front Desk Dashboard
  - Today's Schedule screen and frame states
  - Check-in action

Phase 4: Clinical Integration
  - Visit entity created on PatientCheckedIn
  - Provider view of today's visits

Phase 5: Billing Integration
  - Claim created when VisitCompleted fires
```

Each phase can be implemented by an agent or agent swarm with a human-in-the-loop working within clear boundaries. The Trace defines what each phase needs to know. The plan says what order to build it in. 

Agent swarms can implement multiple phases in parallel when domain dependencies allow it. Phases 2 and 3 can proceed simultaneously because they touch the same Scheduling domain from different directions. The spec makes those relationships visible, so the plan reflects them accurately.

---

## The Full Spec

The complete Trace specification, including all file formats, keywords, and examples, is on GitHub:

[https://github.com/anthonypalicea/trace](https://github.com/anthonypalicea/trace)

---

## The Agent Skill

The spec includes an agent skill you can use directly. The skill has two modes.

**Author Mode** is for designing a new system from scratch. The skill guides you through the process: What does the system do? Who uses it? What are the core domains? It asks questions, helps you make decisions, and produces a complete Trace at the end. At the close of every session, it calls out open questions, the gaps in the architecture that need answers before implementation can begin.

If a newer developer is using the skill, it includes educational notes as-you-go.

**Implement Mode** is for building from an existing Trace. The skill reads the spec, builds an implementation plan, gets your approval, and then builds phase by phase with review gates between each phase.

At the end of planning the LLM is asked to present you with open questions, to help find gaps in the architecture. Fill in those gaps and proceed with code generation.

The skill is at the same GitHub link:

[https://github.com/anthonypalicea/trace](https://github.com/anthonypalicea/trace)

Clone the repo, read the spec, try out the Agent Skill. Try building a Trace (or use the example), generating a plan, and letting an LLM do some implementation.

I've found it works quite well!

---

## Keeping Specs In Sync
Inevitably some change will occur after coding has begun. Have the LLM help you keep the Trace up-to-date when necessary.

I like to think of the spec as the source of truth that everyone can reference.

---

## The Next Generation of Developers

For you developers who are earlier in your careers: the rise of AI code generation is sometimes framed as a threat. The argument goes, if a machine can write the code, there's less for developers to do, syntax knowledge matters less, and the path into software is narrowing. I think that's wrong.

What AI changes is *where the intellectual work focuses*. Understanding a problem well enough to describe it clearly. Designing a system that respects the people who use it. That work becomes more valuable as a result of AI, because it's the work that AI can't do for you.

Trace is, in part, a tool for that work. It gives developers a framework for thinking clearly about systems before writing a line of code. The domains, the rules, the personas, the access controls are all visible, reviewable, and improvable before anything gets built. That's good engineering with or without AI in the picture, and it's something worth learning deliberately.

If you're learning software development right now, *learn to think in systems*. Learn to ask why a rule exists. Learn to think about when pieces of a system need to communicate and what needs to be communicated. Learn to understand the people who will use what you build. Learn to think clearly about what a system *is* before you worry about how it works. Those skills travel with you regardless of what the tools look like five years from now.

That's what Trace is for.

---

The spec is [open source](https://github.com/anthonypalicea/trace). Please use it, adapt it, and share it. I hope it helps you build something better and helps new developers begin to find their footing.
