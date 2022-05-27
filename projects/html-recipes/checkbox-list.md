---
layout: recipe.njk
title: "Checkbox List"
desc: "<code>fieldset</code> and <code>legend</code> to label a related collection of checkboxes."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## Checkbox List

A checkbox list is a collection of fields (checkbox inputs), thus ```fieldset``` is an appropriate container, with ```legend``` serving as the label for the collection.

```html
<fieldset>
  <legend>Pizza Toppings</legend>
  <p>
    <input type="checkbox" id="pepperoni" />
    <label for="pepperoni">Pepperoni</label>
  </p>
  <p>
    <input type="checkbox" id="sausage" />
    <label for="sausage">Sausage</label>
  </p>
</fieldset>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element">The fieldset element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/form-elements.html#the-legend-element">The legend element</a>
</small>