# Block reference

A print request combines one or more blocks in the order they should appear on paper. Every block requires a `type` property.

## Text and layout

- [`text`](./text) prints styled text.
- [`row`](./row) places text cells across one line.
- [`line`](./line) prints a horizontal separator.
- [`br`](./br) inserts a line break.

## Codes and media

- [`barcode`](./barcode) prints a supported one-dimensional barcode.
- [`qrcode`](./qr-code) prints a QR code.
- [`image`](./image) prints base64 or optionally remote image data.

## Status and structure

- [`token`](./token) highlights a titled code or value.
- [`progress`](./progress) prints a bar or stepped progress indicator.
- [`timeline`](./timeline) prints ordered labelled events.

## Data visualization

- [`heatmap`](./heatmap) prints a labelled grayscale value matrix.
- [`lineChart`](./line-chart) compares one or more numeric series.
- [`areaChart`](./area-chart) prints one filled numeric series.
- [`barChart`](./bar-chart) compares labelled values.
- [`stackedAreaChart`](./stacked-area-chart) prints stacked non-negative series.

The schemas on these pages use the service's default request limits. A deployment can override limits such as the maximum text length.
