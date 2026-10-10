/**
 * Add Vidhya Tex saree categories to Supabase (safe upsert — does not delete products).
 *
 * Usage:
 *   npm run db:seed-collections
 *   npm run db:seed-collections -- --remove-demo
 */
import seedSareeCollections from "../src/lib/supabase/seedData/sareeCollections";

const removeDemo = process.argv.includes("--remove-demo");

seedSareeCollections({ removeDemo })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
