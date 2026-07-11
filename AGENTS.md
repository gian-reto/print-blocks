# AGENTS.md

## Project overview

`print-blocks` is a small TypeScript service for printing structured documents to ESC/POS-compatible thermal printers.

The service accepts JSON print instructions, validates them, renders them into raw printer bytes with `react-thermal-printer`, and submits those bytes to a CUPS printer through the system print command. It has no browser UI. Its public surfaces are an HTTP API, generated API documentation, and an optional MCP endpoint for agent/LLM clients.

At a high level, the project is organized as a pipeline:

```txt
Request input
  -> validation and normalization
  -> block rendering
  -> ESC/POS byte generation
  -> print transport
```

Keep this separation intact. HTTP/MCP code should not know printer byte details. Block renderers should not know about HTTP routes. Printer transport code should not know about request schemas.

## Project organization

### Application entrypoints

- `src/index.ts` starts the production server, loads runtime configuration, and handles shutdown.
- `src/dev.ts` exports the app for the Vite development server.
- `src/app.ts` assembles the Hono app, shared validation behavior, route registration, logging, and top-level error handling.

### Configuration

- `src/config.ts` is the central place for environment parsing, defaults, validation, and conversion to app configuration.
- Keep environment parsing declarative and close to the configuration schema.
- Prefer adding new runtime settings here first, then passing the resulting config object down to the layer that needs it.

### HTTP layer

- `src/routes/` contains route registration modules.
- Each route module should own its HTTP method/path, request/response documentation, middleware attachment, and handler.
- Shared HTTP helpers live in `src/http/`, including normalized error responses and middleware.
- API responses should stay small, predictable, and avoid leaking internal details.
- Validation errors should be reported in full to help the caller figure out what's wrong with their request.

### Rendering layer

- `src/render/render-print-job.tsx` converts validated blocks into a thermal-printer React tree and renders it to bytes.
- `src/render/blocks/` contains all supported block types.
- Each block directory should own its schema, renderer component, index barrel, and tests.
- The central block schema is a discriminated union, and the central block renderer dispatches by block type.
- The service appends printer finishing behavior itself; callers should not need to provide low-level printer-control blocks.

### Printing layer

- `src/print/` contains the print transport abstraction, CUPS implementation, print errors, and render-to-print glue.
- Keep printer submission behind the transport interface so tests and future transports can inject alternatives.
- A successful print request means the job was rendered and accepted by the configured transport, not necessarily physically completed by the printer.

### MCP layer

- `src/mcp/` contains the optional MCP server, MCP tool helpers, tools, and templates.
- MCP tools should return useful structured content as well as readable text.
- Print templates are examples and starting points; they should conform to the same print request schema as normal requests.
- Errors returned by tool calls should be descriptive and readable, so agents can diagnose the issue quickly and adjust their requests efficiantly.

### Utilities and tests

- `src/util/` contains small generic helpers and type utilities.
- Keep utility modules narrowly scoped and well-tested when they encode non-obvious type or runtime behavior.
- Tests live next to the code they validate and use Vitest.

## Code style and conventions

### General TypeScript style

- Prefer `type` aliases over `interface` unless an interface is specifically more suitable for declaration merging or external extension.
- Prefer `const` and arrow functions for local helpers and exported functions. Try to avoid the `function` keyword, unless required for a given task due to its unique properties.
- Use explicit exported types for important module boundaries, especially options objects and inferred schema types.
- Keep functions small enough that each one has one clear responsibility.
- Break out helpers when a function starts mixing parsing, validation, transformation, and side effects.
- Use early returns to keep control flow flat.
- Prefer object parameters for exported functions that take several related values.
- Preserve strict typing; avoid `any` and broad casts unless there is a clear boundary reason.

### Naming conventions

- Use names that describe the role in the pipeline: `create...`, `register...`, `render...`, `load...`, `get...`.
- Use `create...Schema` for schema factories, especially when config-dependent limits are involved.
- Use `register...Route` for route-registration functions and `register...Tool` for MCP tools.
- Use `...Options` for option object types and keep them close to the function they configure.
- Use domain names like `block`, `request`, `transport`, `template`, and `config` consistently.

### Module organization

- Keep each layer independent and pass dependencies downward.
- Prefer dependency injection for side effects, especially printing, so tests can use fake transports.
- Put schema logic beside the feature it validates, not in one large global schema file.
- Put renderer logic beside the block schema it renders.
- Use index barrels for small public exports from a folder.
- Avoid circular dependencies between layers.

### Object and type property order

- Keep object properties and type fields stable and easy to scan.
- Alphabetical order is common for simple data objects, summaries, and response payloads.
- For configuration-like objects, grouping by conceptual area is preferred over strict alphabetical order.
- For schemas, put discriminator/config fields first, then component/rendering options.
- For route definitions, keep method/path/request/responses/security in a predictable order.

### Validation and schemas

- Runtime inputs should be validated with Zod before reaching rendering or transport code.
- Prefer schema factories when limits or feature flags affect validation.
- Request schemas should be OpenAPI-aware when they are part of the HTTP API.
- Unknown fields are usually stripped for normal request and block objects unless strictness is important for safety.
- Keep user-facing validation errors actionable and sanitized.

### Error handling

- Use typed errors for domain-specific failures.
- Convert internal errors into stable API/MCP responses at the boundary.
- Do not expose stack traces, secrets, raw tokens, or unnecessary internal details to clients.
- Log useful server-side diagnostics for unexpected or transport-level failures.

### Comments

- Add comments only for non-obvious decisions, constraints, or workarounds.
- Do not comment straightforward code just to restate what it does.
- Comments should be complete sentences and end with a period.

### Tests

- Add or update tests near the code being changed.
- Schema tests should cover valid examples, boundary values, rejected invalid values, and unknown-field behavior.
- Route tests should use injected transports instead of real printing.
- Rendering tests should assert successful byte output and actionable error behavior, not exact byte sequences unless necessary.

## File-specific rules

- When adding dependencies, prefer `pnpm add` instead of adding dependencies to `package.json` manually.
- Do not read `pnpm-lock.yaml` unless absolutely necessary. It is huge and burns context quickly.
- Expect access to `.env` files to be restricted, and ask the user to edit them manually instead.
- If an environment-example file is needed, prefer reading project documentation and configuration code first, because some setups block `.env` reads automatically.
- When asked to write a plan, place it under `.temp/plans`.

## When adding new functionality

1. Identify which layer the change belongs to: route, schema/block, rendering, transport, MCP, template, or config.
2. Look at similar existing code, and keep the new code consistent with it in style, structure, and organization.
3. Add validation at the boundary before adding rendering or side effects.
4. Keep side effects behind injectable abstractions where practical.
5. Add tests next to the changed module.
6. Run the narrowest useful checks first, then broader checks when the change is complete.
