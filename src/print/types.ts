export type PrintTransport = {
  print: (data: Uint8Array) => Promise<void>;
};
