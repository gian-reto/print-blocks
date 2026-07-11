# MCP

`print-blocks` can expose a stateless remote MCP server for coding agents and other MCP clients.

## Enable MCP

Set a separate token containing at least 32 characters:

```dotenv
EXPOSE_MCP=true
MCP_TOKEN=replace-this-with-a-different-long-random-token
```

The endpoint is available at:

```text
http://localhost:3000/mcp
```

MCP clients must send `Authorization: Bearer <MCP_TOKEN>`.

## Tools

| Tool             | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| `get_info`       | Returns the live printer settings, limits, supported blocks, and image capabilities. |
| `list_templates` | Lists the bundled templates available to agents.                                     |
| `get_template`   | Returns the instructions and print request for a selected template.                  |
| `print`          | Validates, renders, and submits a print request.                                     |

A useful agent workflow is:

```text
get_info → optionally list_templates/get_template → print
```

## Claude Code

Export the token in the environment that starts Claude Code:

```sh
export MCP_TOKEN="replace-this-with-your-mcp-token"
```

Add a project-level `.mcp.json`:

```json
{
  "mcpServers": {
    "print-blocks": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

Claude Code asks for approval before using a project-provided MCP server.

## OpenCode

Export the token in the environment that starts OpenCode:

```sh
export MCP_TOKEN="replace-this-with-your-mcp-token"
```

Add the remote server to a project `opencode.json` or to the global configuration at `~/.config/opencode/opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "print-blocks": {
      "type": "remote",
      "url": "http://localhost:3000/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MCP_TOKEN}",
      },
    },
  },
}
```

Restart OpenCode after changing its configuration.

## Other clients

Any client that supports remote streamable-HTTP MCP servers and custom request headers can connect to `/mcp`. Configure the endpoint URL and send the MCP bearer token in the `Authorization` header.
