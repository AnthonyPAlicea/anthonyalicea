---
layout: recipe.njk
title: "Form (Validation Summary)"
desc: "<code>ul</code>, <code>li</code>, and <code>a</code> for listing and linking validation errors."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

Since the validation summary is a thematic grouping of content, but not standalone without the context of the rest of the document, a ```section``` element is appropriate to wrap the summary. We add ```role="alert"``` to ensure screen readers announce the summary.

The list of errors are marked up with ```ul``` and ```li``` elements, and they link to the associated form field. Finally we use ```aria-describedby``` to indicate to assistive devices that the error adds descriptive information to the form field.

```html
<h2>2 Errors - Order Your Pizza</h2>
<section role="alert">
  <h3>Please correct the following 2 errors</h3>
  <ul>
    <li><a href="#firstname" id="firstname_error">First name is required.</a></li>
    <li><a href="#lastname" id="lastname_error">Last name is required.</a></li>
  </ul>
</section>
<form>
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" aria-describedby="firstname_error" />
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" aria-describedby="lastname_error" />
  </p>
</form>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-section-element">The section element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element">The ul element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element">The ul element</a>
    &nbsp;|&nbsp;
    <a href="https://www.w3.org/WAI/tutorials/forms/notifications/">WAI Form Notifications</a>
</small>