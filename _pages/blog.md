---
layout: page
title: "Blog"
permalink: /blog/
---

Mostly books but also some other things.

<div class="post-list">
  {% for post in site.posts %}
    <article>
      <small>{{ post.date | date_to_string }}</small>
      <h2><a href="{{ post.url }}">{{ post.title | markdownify | remove: '<p>' | remove: '</p>' }}</a></h2>
      <p>{{ post.excerpt }}</p>
    </article>
  {% endfor %}
</div>