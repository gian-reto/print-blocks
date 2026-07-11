# HTTP API

The service exposes a small HTTP API. All print requests must use `Content-Type: application/json` and bearer authentication with `API_TOKEN`.

## Routes

| Method | Path            | Description                                                               |
| ------ | --------------- | ------------------------------------------------------------------------- |
| `POST` | `/print`        | Validates, renders, and submits a print job.                              |
| `GET`  | `/healthz`      | Returns the service's liveness status.                                    |
| `GET`  | `/openapi.json` | Returns the generated OpenAPI document.                                   |
| `GET`  | `/docs`         | Shows the Scalar API reference when `EXPOSE_DOCS=true`.                   |
| `GET`  | `/llms.txt`     | Returns generated Markdown API documentation when `EXPOSE_LLMS_TXT=true`. |

## Print a document

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
      },
      {
        "type": "qrcode",
        "content": "https://example.com",
        "align": "center"
      }
    ]
  }'
```

Success returns:

```json
{
  "ok": true
}
```

This means the job was rendered and accepted by CUPS, not that physical printing has completed.

## Errors

Errors use a stable JSON envelope:

```json
{
  "ok": false,
  "error": {
    "message": "Request body did not match the print request schema.",
    "issues": {}
  }
}
```

Validation failures include an `issues` tree identifying invalid fields. The generated `/openapi.json` and optional `/docs` page contain the complete request contract for the running server.
