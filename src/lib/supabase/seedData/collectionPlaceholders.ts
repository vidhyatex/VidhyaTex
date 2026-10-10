/** Neutral placeholders for empty/new Vidhya Tex catalogs (no third-party assets). */
export const PLACEHOLDER_MEDIA_BASE = "https://placehold.co/600x800/png?text=Vidhya+Tex+";

export const SAREE_SHOP_MODEL_IMAGES = [
  `${PLACEHOLDER_MEDIA_BASE}1`,
  `${PLACEHOLDER_MEDIA_BASE}2`,
  `${PLACEHOLDER_MEDIA_BASE}3`,
  `${PLACEHOLDER_MEDIA_BASE}4`,
  `${PLACEHOLDER_MEDIA_BASE}5`,
  `${PLACEHOLDER_MEDIA_BASE}6`,
  `${PLACEHOLDER_MEDIA_BASE}7`,
  `${PLACEHOLDER_MEDIA_BASE}8`,
] as const;

const COLLECTION_IMAGE_BY_LABEL: Record<string, string> = {};

export const DEFAULT_SAREE_PLACEHOLDER = SAREE_SHOP_MODEL_IMAGES[0];

export function collectionPlaceholderImage(label: string): string {
  return COLLECTION_IMAGE_BY_LABEL[label] ?? DEFAULT_SAREE_PLACEHOLDER;
}

/** Used by legacy seed scripts — returns a neutral Vidhya Tex placeholder. */
export function collectionImageForLabel(label: string, index = 0): string {
  return (
    COLLECTION_IMAGE_BY_LABEL[label] ??
    SAREE_SHOP_MODEL_IMAGES[index % SAREE_SHOP_MODEL_IMAGES.length]
  );
}
