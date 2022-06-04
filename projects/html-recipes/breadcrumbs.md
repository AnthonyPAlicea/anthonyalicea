---
layout: recipe.njk
title: "Breadcrumbs"
desc: "<code>nav</code>, <code>p</code>, and <code>a</code> for breadcrumbs."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

While it may be tempting to use a list of some type, technically breadcrumbs aren't truly a list, but a hierarchy (of which there may be multiple hierarchies, that is multiple ways to reach a page).

Thus the simple approach of a series of links, grouped within a ```p``` is appropriate. If there are multiple breadcrumb trails to show, then each would be wrapped within its own ```p```. As it is page navigation, the entire set of links should be wrapped in a ```nav```.

It is expected that a visual delimiter is placed between each link via CSS.

```html
<nav>
  <p>
    <a href="/">Home</a>
    <a href="/menu">Menu</a>
    <a href="/pizza">Pizza</a>
  </p>
</nav>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-nav-element">The nav element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-p-element">The p element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element">The a element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/semantics-other.html#rel-up">HTML Spec: Breadcrumbs</a>
</small>