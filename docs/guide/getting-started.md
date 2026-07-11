# Getting started

`print-blocks` accepts structured JSON documents, renders them as ESC/POS bytes, and submits them to a CUPS printer.

## Requirements

- An ESC/POS-compatible thermal printer.
- CUPS configured on the host.
- A CUPS queue that accepts raw ESC/POS data.
- For local development (optional): Node.js 24 or newer and pnpm 10.

`print-blocks` does not configure CUPS or install a printer queue. Make sure a raw-capable queue is working on the host before starting the service.

## Start with Docker Compose

Create a `compose.yaml` that uses the pre-built image and mounts the host CUPS socket:

```yaml
services:
  print-blocks:
    image: ghcr.io/gian-reto/print-blocks:latest
    environment:
      API_TOKEN: change-me-to-at-least-32-characters
      EXPOSE_MCP: true
      MCP_TOKEN: change-me-to-at-least-32-characters
    volumes:
      - /run/cups/cups.sock:/run/cups/cups.sock
    ports:
      - "3000:3000"
```

Then start the service:

```sh
docker compose up -d
```

If your host exposes CUPS elsewhere, make sure it's mounted to `/run/cups/cups.sock` inside the container, or update the `CUPS_SERVER` environment variable. To use a specific queue instead of the CUPS default printer, add `PRINTER_NAME` to the service's `environment` section.

For a complete example containing all available environment variables, see the repository's [`compose.yaml`](https://github.com/gian-reto/print-blocks/blob/main/compose.yaml).

## Start locally

For local development, clone the repository and create an environment file from the provided example:

```sh
cp .env.example .env
```

Edit `.env` and provide at least `API_TOKEN`. Set `PRINTER_NAME` when you do not want to use the CUPS default printer. See [Configuration](./configuration) for all available settings.

Install dependencies and run the development server:

```sh
pnpm install
pnpm dev
```

The local process needs access to the `lp` command and the configured CUPS server.

## Send your first print job

```sh
curl -X POST "http://localhost:3000/print" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  --data '{
    "blocks": [
      {
        "type": "text",
        "content": "Hello from print-blocks",
        "align": "center",
        "bold": true
      }
    ]
  }'
```

A successfully accepted job returns:

```json
{
  "ok": true
}
```

This confirms that the document was rendered and submitted to CUPS. It does not confirm that the printer physically completed the job.

## Next steps

- Read [Core concepts](./core-concepts) to understand blocks and printer widths.
- Browse the [block reference](/blocks/) to compose a document.
- Use the [HTTP API](/api) from an application.
- Connect an agent through [MCP](/mcp).
