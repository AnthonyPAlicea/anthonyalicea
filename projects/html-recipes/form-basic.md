---
layout: recipe.njk
title: "Form (Basic)"
desc: "Using <code>p</code> and <code>label</code> for wrapping and labeling form inputs."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

Form fields are properly labeled using the ```label``` element. As the ```p``` element creates a thematic grouping of <a href="https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2">phrasing content</a> it is appropriate to wrap the label and field pairs.

```html
<h2>Order Your Pizza</h2>
<form>
  <p>
    <label for="firstname">First Name</label>
    <input type="text" id="firstname" name="firstname" />
  </p>
  <p>
    <label for="lastname">Last Name</label>
    <input type="text" id="lastname" name="lastname" />
  </p>
</form>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/forms.html#the-form-element">The form element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/forms.html#the-label-elementt">The label element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-p-element">The p element</a>
</small>