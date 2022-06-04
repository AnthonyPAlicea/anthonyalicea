---
layout: recipe.njk
title: "Cards and Card Lists"
desc: "<code>article</code>, <code>header</code>, <code>footer</code>, and <code>ul/ol</code> for creating a cards and card lists"
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

Since a card is usually a self-contained, complete composition, and could be reused in various document contexts, ```article``` is an appropriate element to wrap it.

We use ```header``` and ```footer``` for header and footer areas of the card.

```html
<article>
  <header>
    <h2>Order #123</h2>
  </header>
  <p>Large pepperoni pizza.</p>
  <footer>
    <a href="...">Order This Again</a>
  </footer>
</article>
```

Lists of cards, such as in search results, are marked up as either ```ol``` or ```ul``` depending on if the order of the list matters. For example, if the list is sortable then use ```ol```.

```html
  <ol>
    <li>
      <article>
        ...
      </article>
    </li>
    <li>
      <article>
        ...
      </article>
    </li>
  </ol>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-article-element">The article element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-header-element">The header element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-footer-element">The footer element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element">The ol element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element">The li element</a>
</small>