import db from "../db";
import * as schema from "../schema";
import { slugify } from "@/lib/utils";
import { SAREE_COLLECTION_LABELS } from "./sareeCollections";
import { collectionPlaceholderImage } from "./collectionPlaceholders";

const seedCollections = async () => {
  try {
    await db.delete(schema.collections);

    for (let i = 0; i < SAREE_COLLECTION_LABELS.length; i++) {
      const label = SAREE_COLLECTION_LABELS[i];
      const slug = slugify(label);
      const imageKey = collectionPlaceholderImage(label);

      const [media] = await db
        .insert(schema.medias)
        .values({
          key: imageKey,
          alt: `${label} — Vidhya Tex`,
        })
        .returning();

      if (!media) continue;

      await db.insert(schema.collections).values({
        label,
        slug,
        title: label,
        description: `Explore our ${label} at Vidhya Tex.`,
        order: i + 1,
        featuredImageId: media.id,
      });
    }

    console.log(`Collections are added to the DB.`);
  } catch (err) {
    console.log("Error happen while inserting collections", err);
  }
};

export default seedCollections;
