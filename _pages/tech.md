---
layout: page
title: "Tech"
permalink: /tech/
---

<div class="post-list">
  <!-- Pinned tech posts first -->
  {% assign pinned_tech_posts = site.posts | where: "pinned", true | where_exp: "post", "post.tags contains 'tech'" %}
  {% for post in pinned_tech_posts %}
    <article class="pinned-post">
      <span class="pinned-label">📌</span>
      <h2><a href="{{ post.url }}">{{ post.title | markdownify | remove: '<p>' | remove: '</p>' }}</a></h2>
      <p>{{ post.excerpt }}</p>
    </article>
  {% endfor %}

<!-- Regular tech posts (excluding pinned ones) -->
{% for post in site.posts %}
  {% if post.tags contains 'tech' and post.pinned != true %}
    <article>
      <small>
        Published: {{ post.date | date_to_string }}
        {% if post.updated %}
        <br><span class="updated-date">Updated: {{ post.updated | date_to_string }}</span>
        {% endif %}
      </small>
      <h2><a href="{{ post.url }}">{{ post.title | markdownify | remove: '<p>' | remove: '</p>' }}</a></h2>
      <p>{{ post.excerpt }}</p>
    </article>
  {% endif %}
{% endfor %}
</div>