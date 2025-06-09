import { Descripcion } from "@/interfaces/products/products.interface";

export function extractTextFromBlocks(blocks: Descripcion[]): string {
  return blocks
    .map(block => {
      if (Array.isArray(block.children)) {
        return block.children.map((child: { text: string; }) => child.text).join("");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}
