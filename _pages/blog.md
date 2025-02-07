---
layout: default
title: Blog
permalink: /blog/
---

Mostly books but also some other things.

{% for post in site.posts %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <p>{{ post.excerpt }}</p>
    <small>{{ post.date | date_to_string }}</small>
  </article>
{% endfor %}