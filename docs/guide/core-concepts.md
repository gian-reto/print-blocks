# Core concepts

## Print requests

Every print request contains a non-empty `blocks` array:

```json
{
  "blocks": [
    { "type": "text", "content": "Order #1042", "bold": true },
    { "type": "line", "character": "-" },
    {
      "type": "row",
      "left": { "content": "Total" },
      "right": { "content": "7.70", "bold": true }
    }
  ]
}
```

Each block has a `type` discriminator and is printed in array order. The service adds the final paper-cut command, so requests do not need a cut block.

## Text width and raster width

Thermal printers use two relevant measurements:

- `PRINTER_WIDTH` is the printable width in text characters. It affects text wrapping and row layout and defaults to `48`.
- `PRINTER_DOT_WIDTH` is the printable width in raster dots. It affects images, charts, heatmaps, progress indicators, timelines, and tokens and defaults to `576`.

Set both values to match the printer mode in use. A printer configured for 384-dot output, for example, should use `PRINTER_DOT_WIDTH=384`.

## Character encoding

Text, barcodes, and QR codes are encoded with the configured printer character set. The default is `pc437_usa`. Choose a character set supported by both the service and the printer when printing other scripts or regional characters.

## Images

Image blocks accept base64-encoded JPEG, PNG, WebP, or SVG data. Remote HTTPS image URLs can be enabled explicitly, but are disabled by default.

Image input and raster output are limited by the server configuration. See [Configuration](./configuration) for the available controls.

## Successful submission

An HTTP or MCP success means the request was valid, rendered successfully, and accepted by the configured print transport. It does not guarantee that paper was printed; queue, connectivity, or hardware failures can still happen after submission.
