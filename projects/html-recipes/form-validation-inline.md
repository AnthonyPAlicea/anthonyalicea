---
layout: recipe.njk
title: "Form (Validation Inline)"
desc: "Using <code>span</code> for inline errors."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

Since label/field groups are wrapped with ```p```, we cannot add a ```p``` as a child element, since the content model for ```p``` is <a href="https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2">phrasing content</a>.

Since ```p``` cannot be used to markup an inline error message, this is an appropriate usage of ```span```. Though it has no meaning in itself, it represents its children, which in this case is the text of the error message itself.

If the error messages appear while the user is typing or after the form field loses focus, we use ```aria-live="assertive"``` to ensure screen readers announce the error message.

```html
<h2>2 Errors - Order Your Pizza</h2>
<form>
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" aria-describedby="firstname_error" />
    <span id="firstname_error" aria-live="assertive">First name is required.</span>
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" aria-describedby="lastname_error" />
    <span id="lastname_error" aria-live="assertive">Last name is required.</span>
  </p>
</form>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-span-element">The span element</a>
    &nbsp;|&nbsp;
    <a href="https://www.w3.org/WAI/tutorials/forms/notifications/">WAI Form Notifications</a>
</small>