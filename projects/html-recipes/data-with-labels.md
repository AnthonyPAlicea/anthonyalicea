---
layout: recipe.njk
title: "Data With Labels"
desc: "<code>dl</code>, <code>dd</code> and <code>dt</code> for labeled read-only data."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

Labeled data are name/value pairs, thus ```dl```, ```dd``` and ```dt``` are appropriate markup elements.

```html
<h2>Pizza Choices</h2>
<dl>
  <dt>Size</dt>
  <dd>Large</dd>
</dl>
<dl>
  <dt>Topping 1</dt>
  <dd>Pepperoni</dd>
</dl>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element">The dl element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-dt-element">The dt element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-dd-element">The dd element</a>
</small>