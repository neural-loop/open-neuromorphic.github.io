---
title: "Hacking Hours: {{ replace .Name "-" " " | title }}"
# The 'date' field should match the date part of start_datetime for correct sorting.
# It should be in YYYY-MM-DD format.
date: {{ .Date.Format "2006-01-02" }}
# Use ISO 8601 format for start and end times (YYYY-MM-DDTHH:MM:SS-07:00).
# This is machine-readable and includes the timezone offset.
start_datetime: "{{ .Date.Format "2006-01-02" }}T18:00:00+01:00" # Example: CET
end_datetime: "{{ .Date.Format "2006-01-02" }}T19:30:00+01:00" # Example: CET
# The original time_zone field is kept for display fallback if needed.
time_zone: "CET"
description: "Join us for a hands-on hacking hours on [Topic] with [Speaker Name]. You will learn how to [Key Takeaway 1] and explore [Key Takeaway 2]."
author:
  - "Speaker Name or Slug"
upcoming: true
video: ""
image: "hacking-hours-banner.png"
type: "hacking-hours"
show_author_bios: true
software_tags: []
# speaker_slides: "slides.pdf"
# speaker_code: "https://github.com/example/repo"
# speaker_notebook: "my-notebook.ipynb"
---

Detailed hacking hours abstract or information goes here.
Explain what attendees will learn, the agenda, and any prerequisites.