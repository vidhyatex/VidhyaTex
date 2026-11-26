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
    <Header
      heading={`We Think You'll Love`}
      className="min-w-0 pb-[30px] pt-[80px]"
    >
      <div className="container min-w-0">
        <HomeScrollSnapStrip
          ariaLabel="Loading recommendations"
          className="-mx-12 px-4 sm:mx-0 sm:px-0"
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
