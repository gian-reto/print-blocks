export type PreviewPageExample = {
  src: string;
};

export type PreviewPageEntry = {
  examples: PreviewPageExample[];
  title: string;
};

export type PreviewMainProps = {
  entries: PreviewPageEntry[];
};

export const PreviewMain = ({ entries }: PreviewMainProps) => (
  <>
    {entries.map((preview) => (
      <section key={preview.title}>
        <h2>{preview.title}</h2>
        {preview.examples.map((example, index) => (
          <img
            alt={`${preview.title} preview ${index + 1}`}
            key={index}
            src={example.src}
          />
        ))}
      </section>
    ))}
  </>
);
