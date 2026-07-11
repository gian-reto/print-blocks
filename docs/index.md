---
layout: home

hero:
  name: PrintBlocks
  text: Let your agents print things
  tagline: Let agents compose beautiful thermal prints from reusable blocks via MCP, or let apps and services print via a conventional API.
  image:
    src: /header.png
    alt: Three example print templates showing goal progress, a budget, and a habit review
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Browse blocks
      link: /blocks/
    - theme: alt
      text: View on GitHub
      link: https://github.com/gian-reto/print-blocks

features:
  - title: Compose with blocks
    details: Combine text, rows, images, codes, charts, timelines, and other blocks in one print job. Strictly validated to prevent mistakes before printing.
  - title: Use HTTP or MCP
    details: Print directly from an application or connect an MCP-capable coding agent to compose layouts and print autonomously.
  - title: Built for ESC/POS
    details: Render documents to printer-ready bytes and submit them to an existing CUPS queue. Works with most thermal printers that support ESC/POS.
---

## Print with a simple request

Build a document by placing blocks in the order they should appear on paper:

```sh
curl -X POST "http://localhost:3000/print" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  --data '{
    "blocks": [
      {
        "type": "text",
        "content": "Daily progress",
        "align": "center",
        "bold": true
      },
      { "type": "line", "character": "-" },
      {
        "type": "row",
        "left": { "content": "Tasks completed" },
        "right": { "content": "4 / 5", "bold": true }
      },
      {
        "type": "progress",
        "variant": "bar",
        "value": 4,
        "max": 5
      }
    ]
  }'
```

[Explore all available blocks →](/blocks/)
