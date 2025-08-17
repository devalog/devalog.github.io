---
layout: post
title: "How I used Claude Code to restructure and redirect files"
date: 2025-08-17
tags: ai tech
---

Any technical writer working on a large documentation site with legacy docs knows the pain of site reorganization projects.

When you have a documentation site that needs structural changes, making these changes involves a lot of small steps. There are old docs that need to be revamped or even deleted. Sometimes the file name needs to be changed even if some of the page content can be salvaged. You might end up breaking up big files into smaller ones or merging smaller files into big ones. When you make these types of file changes, you need to redirect users from old URLs to new ones so your changes don’t introduce a bunch of broken links. You probably also need to update your navigation or sitemap file so it's clear how to navigate everything. In my previous position at Google, I had to do this kind of work as part of basically every project I worked on – it was always a long, arduous task that didn’t seem worth my time.

I recently did this kind of file restructuring as part of my current freelance gig at [Fern](https://buildwithfern.com/learn/home). This time around, though, I have Claude Code, and it made everything easier.

## The challenge

[Fern](https://buildwithfern.com/learn/api-definitions/overview/what-is-an-api-definition) has five API definition options, and each option has roughly parallel docs. I’d already restructured this content into a single API Definitions section – I mainly used existing content, but significantly revamped the section-level overview pages.

![API Definitions section](/assets/redirects/api-def-section.png)

However, there was an issue in the Extensions section of each API definition. For all of the API Definitions (the fifth, Fern Definition, has native support so extensions aren't necessary by design), you can use a bunch of extensions to further configure your spec and output a higher quality SDK. Things like adding examples, error handling, configuring custom names, etc. These are small things that can make a big difference for SDK readability.

Four API definitions (OpenAPI, AsyncAPI, OpenRPC, and gRPC) each had an Extensions section containing three pages – Audience, SDK Method Names, SDK Parameter Names, and… Other. The "Other" page was a catchall of all the (you guessed it) other parameter names you could use:

![Original Others page](/assets/redirects/old-others-page.png)

Also, it wasn't clear at a glance what content these pages contained:

![How the old left nav looked](/assets/redirects/old-left-nav.png){: .smaller-image}

## The solution

Looking at the problem, there were basically two ways to solve this. We could either put everything on one long ctrl-f-able page, or break everything up into small pages (per extension). A deep dive into the pros and cons of these two options is very much out of scope for this article, as the point here is the how, not the why – we chose to break everything up into smaller pages.

## Using Claude Code to make this easier

Claude did this task pretty well right from the first prompt – I did a little refining with the descriptions and overview content, but the actual core task of breaking up files, creating new files, adding the correct old content into the new files, updating the section-level `yml` file, and adding redirects worked great and saved me a lot of time.

I (and Claude Code) broke the task down into a few subtasks:

### Break up pages

First, Claude broke up the `others.mdx` page into one small page per extension, using the same style I used for the first few OpenAPI extensions. That style included adding a `title` and `description` in the page's frontmatter. Each `others.mdx` had roughly 4-15 extensions, but it varies a lot. 

![Claude makes a new page](/assets/redirects/new-page-output.png)

### Add an overview page

Claude added a new overview page for each definition's extension section. This overview included a reference table that listed all of the extensions for that definition, with a brief description and links to the relevant documentation. The overview pages also explained the two methods for configuring extensions (overlaying in an overrides file or embedding directly in the main definition file).

![How the new overview page looks](/assets/redirects/new-overview.png)

### Update the navigation file

For each definition, Claude added all of the new extension pages, plus the overview, to the `api-def.yml` file. This file configures the left nav for the entire API Definitions section. 

![Claude's navigation suggested edit](/assets/redirects/navigation-suggested-edit.png)

### Set up redirects

Claude updated the site-level redirects file to account for the deleted `others.mdx` pages. Any links to the old `others.mdx` pages now get redirected to the extensions overview page for the respective API definition. 

![Claude's navigation suggested edit](/assets/redirects/redirect-suggested-edit.png)

## Conclusion

Sites change, content shifts, and restructuring changes are almost always going to be necessary for any decently sized documentation site. It's hard to completely future-proof such navigation changes and probably not even worth the effort (or much effort) to try. Claude Code makes it easy to cope with these kinds of changes when they come up. 

I estimate this end-to-end task, with Claude Code, took me about an hour. But the bulk of that work was initially figuring out what I wanted to do, and then finetuning the overview page text at the end. The middle part of the project, i.e. all of the file restructuring, took me very little time. I think this entire task would have taken me at least 2-3 hours to do manually, and I'm sure I would have introduced more errors.

And finally, credit where credit is due: thanks to [my husband](https://www.echevarria.io/) who raved about Claude Code a few weeks ago for engineering tasks and inspired me to give it a shot for my own work. Turns out it's pretty great for technical writing workflows too.

<script data-goatcounter="https://dlog.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
