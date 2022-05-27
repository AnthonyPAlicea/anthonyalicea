---
layout: recipe.njk
title: "Login"
desc: "<code>article</code>, <code>header</code>, <code>form</code>, and <code>footer</code> for creating a user login form."
recipe: 1
tags: ['recipe', 'html-recipe']
isRecipe: true
---
# HTML Recipes

## {{ title }}

Since a login form is a self-contained, complete composition, and could be reused in various document contexts, ```article``` is an appropriate element to wrap it.

We use ```header``` and ```footer``` for common login form aspects like a form title and registration link. See other recipes for details on <a href="{{ site.baseUrl }}projects/html-recipes/form-basic">forms</a> and <a href="{{ site.baseUrl }}projects/html-recipes/form-validation-summary">form validation</a>.

```html
<article>
  <header>
    <h2>Login</h2>
  </header>
  <form>
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" name="username" />
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" />
    </p>
  </form>
  <footer>
    <a href="...">Register</a>
  </footer>
</article>
```

<small>
    <h2>References</h2>
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-article-element">The article element</a>&nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-header-element">The header element</a>
    &nbsp;|&nbsp;
    <a href="https://html.spec.whatwg.org/multipage/sections.html#the-footer-element">The footer element</a>
</small>