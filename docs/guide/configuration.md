# Configuration

Configuration is read from environment variables when the service starts. Empty values are treated as unset where a default is available.

## Server and authentication

| Variable    | Default   | Description                                                          |
| ----------- | --------- | -------------------------------------------------------------------- |
| `API_TOKEN` | Required  | Bearer token for `POST /print`. Must contain at least 32 characters. |
| `HOST`      | `0.0.0.0` | Hostname or address on which the server listens.                     |
| `PORT`      | `3000`    | Server port from 1 through 65535.                                    |

## Printer

| Variable                | Default                          | Description                                    |
| ----------------------- | -------------------------------- | ---------------------------------------------- |
| `PRINTER_NAME`          | CUPS default                     | CUPS queue to use.                             |
| `PRINTER_TYPE`          | `epson`                          | Printer command set: `epson` or `star`.        |
| `PRINTER_WIDTH`         | `48`                             | Printable text width in characters.            |
| `PRINTER_DOT_WIDTH`     | `576`                            | Printable raster width in dots.                |
| `PRINTER_CHARACTER_SET` | `pc437_usa`                      | Character set used to encode printer text.     |
| `PRINT_TIMEOUT_MS`      | `15000`                          | Maximum time allowed for submission to CUPS.   |
| `CUPS_SERVER`           | `/run/cups/cups.sock` in Compose | CUPS server or socket used by the CUPS client. |

## Optional interfaces

| Variable          | Default | Description                                                                             |
| ----------------- | ------- | --------------------------------------------------------------------------------------- |
| `EXPOSE_DOCS`     | `false` | Exposes the Scalar API reference at `/docs`.                                            |
| `EXPOSE_LLMS_TXT` | `false` | Exposes generated Markdown API documentation at `/llms.txt`.                            |
| `EXPOSE_MCP`      | `false` | Exposes the MCP endpoint at `/mcp`.                                                     |
| `MCP_TOKEN`       | Unset   | Separate bearer token for MCP. Required and at least 32 characters when MCP is enabled. |

## Request and image limits

| Variable                   | Default    | Description                                               |
| -------------------------- | ---------- | --------------------------------------------------------- |
| `MAX_REQUEST_BODY_BYTES`   | `10485760` | Maximum HTTP request size in bytes.                       |
| `MAX_BLOCKS_PER_PRINT_JOB` | `50`       | Maximum number of blocks in one print request.            |
| `MAX_TEXT_CHARS_PER_BLOCK` | `5000`     | Configurable text limit used by text-bearing blocks.      |
| `MAX_IMAGE_INPUT_PIXELS`   | `25000000` | Maximum decoded image pixel count.                        |
| `ALLOW_REMOTE_IMAGE_URLS`  | `false`    | Allows image blocks to fetch supported images over HTTPS. |
| `MAX_REMOTE_IMAGE_BYTES`   | `5242880`  | Maximum remote image download size in bytes.              |
| `REMOTE_IMAGE_TIMEOUT_MS`  | `5000`     | Remote image request timeout.                             |

The generated `/openapi.json` reflects configuration-dependent request limits for the running server.
