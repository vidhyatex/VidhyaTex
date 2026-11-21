"use client";
import { DocumentType, gql } from "@/gql";
import { formatPrice, keytoUrl } from "@/lib/utils";
import { toGstInclusiveAmount } from "@/lib/courier/calculate";
import { useCourierChargesConfig } from "@/providers/CourierChargesProvider";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

type BuyAgainCardProps = {
  products: DocumentType<typeof BuyAgainCardFragment>[];
};

export const BuyAgainCardFragment = gql(/* GraphQL */ `
  fragment BuyAgainCardFragment on productsEdge {
    node {
      id
      featured
      price
      name
      slug
      description
      featuredImage: medias {
        id
        key
        alt
      }
    }
  }
`);

function BuyAgainCard({ products }: BuyAgainCardProps) {
  const courierConfig = useCourierChargesConfig();
  if (products.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-zinc-100 px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold">Buy again</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 py-4 sm:gap-y-5 sm:py-5">
        {products.map(({ node }) => {
          const imageSrc = keytoUrl(node.featuredImage?.key);
          return (
            <div key={node.id} className="grid grid-cols-5 gap-2">
              <div className="relative col-span-2">
                <StorefrontImage
                  src={imageSrc}
                  alt={node.featuredImage?.alt || node.name}
                  className="h-20 w-20 object-cover"
                  width={80}
                  height={80}
                />
              </div>

              <div className="col-span-3 min-w-0">
                <Link
                  href={"/shop/" + node.slug}
                  className="line-clamp-3 text-blue-500"
                >
                  {node.name}
                </Link>
                <Link href={`/shop/${node.slug}`} className="text-red-700">
                  <p>
                    {formatPrice(
                      toGstInclusiveAmount(Number(node.price), courierConfig),
                    )}
                  </p>
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default BuyAgainCard;
