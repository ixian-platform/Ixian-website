export type Inline = string | { b: string } | { a: string; href: string };
export type Block = { p: Inline[] } | { ul: Inline[][] } | { ol: Inline[][] };
export type LegalDoc = {
  title: string;
  updated: string;
  sections: { n?: number; heading: string | null; blocks: Block[] }[];
};
