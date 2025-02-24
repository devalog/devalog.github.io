---
layout: page
title: "Blog"
permalink: /blog/
---

<div class="post-list">
  {% for post in site.posts %}
    <article>
      <small>{{ post.date | date_to_string }}</small>
      <h2><a href="{{ post.url }}">{{ post.title | markdownify | remove: '<p>' | remove: '</p>' }}</a></h2>
      <p>{{ post.excerpt }}</p>
      {% if post.tags.size > 0 %}
        <div class="post-tags">
          {% for tag in post.tags %}
            <a href="{{site.baseurl}}/archive.html#{{tag | slugize}}" class="post-tag">#{{ tag }}</a>
          {% endfor %}
        </div>
      {% endif %}
    </article>
  {% endfor %}
</div>