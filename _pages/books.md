---
layout: page
title: "Books"
permalink: /books/
---

<div class="post-list">
  <!-- Pinned book posts first -->
  {% assign pinned_book_posts = site.posts | where: "pinned", true | where_exp: "post", "post.tags contains 'books'" %}
  {% for post in pinned_book_posts %}
    <article class="pinned-post">
      <span class="pinned-label">📌</span>
      <small>
        Published: {{ post.date | date_to_string }}
        {% if post.updated %}
        <br><span class="updated-date">Updated: {{ post.updated | date_to_string }}</span>
        {% endif %}
      </small>
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

  <!-- Regular book posts (excluding pinned ones) -->
{% for post in site.posts %}
  {% if post.tags contains 'books' and post.pinned != true %}
    <article>
      <small>
        Published: {{ post.date | date_to_string }}
        {% if post.updated %}
        <br><span class="updated-date">Updated: {{ post.updated | date_to_string }}</span>
        {% endif %}
      </small>
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
  {% endif %}
{% endfor %}
</div>