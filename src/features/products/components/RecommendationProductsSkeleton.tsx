import React from "react";
import Header from "@/components/layouts/Header";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import {
  HomeScrollSnapStrip,
  ScrollSnapItem,
  scrollSnapRecommendationItemClass,
} from "@/features/storefront/components/HomeScrollSnapStrip";

function RecommendationProductsSkeleton() {
  return (
    <Header heading={`We Think You'll Love`}>
      <div className="container">
        <HomeScrollSnapStrip
          ariaLabel="Loading recommendations"
          className="-mx-8 px-8 sm:mx-0 sm:px-0"
        >
          {[...Array(4)].map((_, index) => (
            <ScrollSnapItem
              key={index}
              className={scrollSnapRecommendationItemClass}
            >
              <ProductCardSkeleton />
            </ScrollSnapItem>
          ))}
        </HomeScrollSnapStrip>
      </div>
    </Header>
  );
}

export default RecommendationProductsSkeleton;
