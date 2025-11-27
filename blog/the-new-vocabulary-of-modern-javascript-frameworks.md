---
layout: post.njk
title: "The New Vocabulary of Modern JavaScript Frameworks"
excerpt: ...
date: 2025-11-27
og_image: 'assets/rsc_twittercard.png'
---

{% block head %}
<style>
.dictionary-entry {
    background: #2a2a2a;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
    font-family: 'Noto Sans', sans-serif;
}

.dictionary-term {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-highlight);
    margin-bottom: 0.25rem;
}

.dictionary-pronunciation {
    font-family: monospace;
    color: #999;
    font-size: 0.9rem;
    margin: 0 0 0.25rem 0;
}

.dictionary-part-speech {
    color: #999;
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
}

.dictionary-definition {
    margin: 0 0 0.75rem 1.5rem;
    position: relative;
    line-height: 1.4;
}

.dictionary-definition:last-child {
    margin-bottom: 0;
}

.definition-number {
    position: absolute;
    left: -1.5rem;
    color: var(--color-highlight);
}

.dictionary-definition em {
    color: #999;
    font-style: normal;
}
</style>
{% endblock %}

# {{ title }}