# print-blocks

`print-blocks` is a small TypeScript service that prints structured documents to ESC/POS thermal printers.

It has an API endpoint `/print` that accepts a JSON payload describing a document as an array of blocks, renders them to ESC/POS bytes with [`react-thermal-printer`](https://github.com/seokju-na/react-thermal-printer), and submits the resulting bytes to a CUPS printer with `lp`.

The service has no UI. It exposes:

- `POST /print` for authenticated print jobs.
- `GET /healthz` for unauthenticated liveness checks.
- `GET /openapi.json` for generated OpenAPI JSON.
- `GET /docs` for an interactive Scalar API reference when `EXPOSE_DOCS=true`.
- `GET /llms.txt` for LLM-friendly Markdown API documentation when `EXPOSE_LLMS_TXT=true`.
- `ALL /mcp` for authenticated MCP clients when `EXPOSE_MCP=true`.

## Requirements

- Node.js 24 and pnpm 10 for local development.
- CUPS configured on the host.
- A CUPS printer queue that accepts raw/native ESC/POS data.
- The CUPS client command `lp` available wherever the app runs.

The production container installs `cups-client`, so `lp` is available inside the image.

## Configuration

Copy the example environment file and edit it:

```sh
cp .env.example .env
```

Note:

- Documentation endpoints are disabled by default. Set `EXPOSE_DOCS=true` to enable `/docs` and `EXPOSE_LLMS_TXT=true` to enable `/llms.txt`.
- The MCP endpoint is disabled by default. Set `EXPOSE_MCP=true` and provide a separate `MCP_TOKEN` with at least 32 characters to enable `/mcp`.
- `PRINTER_WIDTH` configures the printer text width in characters and defaults to `48`. `PRINTER_DOT_WIDTH` configures the raster width used for image-like blocks and defaults to `576` dots. Set it explicitly when your printer mode uses a different raster width, such as `384` dots.
- Image blocks accept base64-encoded data through the `data` property. Supported image formats are JPEG, PNG, WebP, and SVG. Remote image URLs are disabled by default. Set `ALLOW_REMOTE_IMAGE_URLS=true` to allow image blocks to use an HTTPS `url` instead. Remote image fetching is intentionally strict: only HTTPS URLs with public domain hostnames are accepted, direct IP addresses and credentials are rejected, redirects are not followed, downloaded bytes are limited by `MAX_REMOTE_IMAGE_BYTES`, fetches time out after `REMOTE_IMAGE_TIMEOUT_MS`, and decoded image input is limited by `MAX_IMAGE_INPUT_PIXELS`. These restrictions are in place to prevent abuse and security issues, but enabling remote image URLs is only recommended in trusted environments.

## Development

Install dependencies:

```sh
pnpm install
```

Run the dev server:

```sh
pnpm dev
```

SVG-backed block previews are available in development at:

```txt
http://localhost:3000/preview
```

Run checks:

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

## API

### `POST /print`

Headers:

```http
Content-Type: application/json
Authorization: Bearer <API_TOKEN>
```

Body:

```json
{
  "blocks": [
    {
      "type": "text",
      "content": "Hello from print-blocks",
      "align": "center",
      "bold": true
    }
  ]
}
```

Success response:

```json
{
  "ok": true
}
```

### `GET /healthz`

Returns:

```json
{
  "ok": true
}
```

### `GET /openapi.json`

Returns the OpenAPI specification for the API.

### `GET /docs`

Returns an interactive API reference backed by Scalar and `/openapi.json`. This endpoint is only registered when `EXPOSE_DOCS=true`.

### `GET /llms.txt`

Returns Markdown API documentation generated from the OpenAPI specification. This endpoint is only registered when `EXPOSE_LLMS_TXT=true`.

### `ALL /mcp`

Serves a stateless MCP server over streamable HTTP. This endpoint is only registered when `EXPOSE_MCP=true` and requires `Authorization: Bearer <MCP_TOKEN>`.

Available tools:

- `get_info` returns printer settings, service limits, supported blocks, and templates.
- `print` renders print instructions and submits them to the configured printer.
- `list_templates` lists examplary print templates that can be used as starting points or inspiration for print requests.
- `get_template` returns Markdown instructions and the template's JSON structure for a given template id.

## Manual smoke test

After the app is running:

```sh
curl -X POST "http://localhost:3000/print" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  --data '{"blocks":[{"type":"text","content":"Hello from print-blocks","align":"center"}]}'
```
