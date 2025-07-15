---
title: "Workshop: {{ replace .Name "-" " " | title }}"
date: {{ .Date.Format "2006-01-02" }}
start_datetime: "{{ .Date.Format "2006-01-02" }}T18:00:00+01:00"
end_datetime: "{{ .Date.Format "2006-01-02" }}T19:30:00+01:00"
time_zone: "CET"
description: "Join us for an insightful workshop on [Topic] by [Speaker Name]. Discover [Key Takeaway 1] and explore [Key Takeaway 2] in neuromorphic computing."
author:
  - "Speaker Name or Slug"
upcoming: true
video: ""
image: "workshop-banner.png"
type: "workshops"
show_author_bios: true
software_tags: []
# speaker_slides: "slides.pdf"
# speaker_code: "https://github.com/example/repo"
# speaker_notebook: "my-notebook.ipynb"
---

Detailed workshop abstract or information goes here.
Explain what attendees will learn, the agenda, and any prerequisites.