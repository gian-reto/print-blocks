# print-blocks

`print-blocks` is a small TypeScript service that prints structured documents to ESC/POS thermal printers.

It has an API endpoint `/print` that accepts a JSON payload describing a document as an array of blocks, renders them to ESC/POS bytes with [`react-thermal-printer`](https://github.com/seokju-na/react-thermal-printer), and submits the resulting bytes to a CUPS printer with `lp`.

The service has no UI. It exposes:

- `POST /print` for authenticated print jobs.
- `GET /healthz` for unauthenticated liveness checks.
- `GET /openapi.json` for generated OpenAPI JSON.
- `GET /docs` for an interactive Scalar API reference.
- `GET /llms.txt` for LLM-friendly Markdown API documentation.

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

## Development

Install dependencies:

```sh
pnpm install
```

Run the dev server:

```sh
pnpm dev
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

Returns an interactive API reference backed by Scalar and `/openapi.json`.

### `GET /llms.txt`

Returns Markdown API documentation generated from the OpenAPI specification.

## Manual smoke test

After the app is running:

```sh
curl -X POST "http://localhost:3000/print" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  --data '{"blocks":[{"type":"text","content":"Hello from print-blocks","align":"center"}]}'
```
