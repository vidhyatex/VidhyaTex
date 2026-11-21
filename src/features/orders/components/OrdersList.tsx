"use client";

import Link from "next/link";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { UserOrderListView } from "@/lib/orders/getUserOrdersList";
import { formatOrderDateTimeIst } from "@/lib/datetime/india";
import { displayInternalOrderRef } from "@/lib/orders/internal-order-ref";
import { cn, formatPrice, keytoUrl } from "@/lib/utils";

type OrdersListProps = {
  orders: UserOrderListView[];
};

function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        You have no orders yet. When you place an order while signed in, it will
        appear here.
      </div>
    );
  }

  return (
    <div className="grid gap-y-5">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-col gap-3 bg-zinc-100 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-medium">Order placed</p>
              <p className="text-sm">
                {formatOrderDateTimeIst(order.createdAt)}
              </p>
            </div>

            <div className="min-w-0 sm:text-right">
              <p className="text-xs font-medium">Total</p>
              <p className="text-sm tabular-nums">
                {formatPrice(order.amount)}
              </p>
            </div>

            <div className="min-w-0 sm:max-w-[40%] sm:text-right">
              <p className="text-xs font-medium">Order</p>
              {order.internalRef ? (
                <>
                  <p className="text-sm font-semibold tabular-nums">
                    {displayInternalOrderRef(order.internalRef)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    #{order.id}
                  </p>
                </>
              ) : (
                <p className="truncate text-sm">#{order.id}</p>
              )}
            </div>
          </CardHeader>

          <CardContent className="py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {order.paymentStatus.replaceAll("_", " ")}
              </Badge>
              {order.orderStatus ? (
                <Badge variant="secondary" className="capitalize">
                  {order.orderStatus.replaceAll("_", " ")}
                </Badge>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 py-3 md:grid-cols-12 md:gap-8">
              <div className="min-w-0 flex flex-col gap-5 md:col-span-8">
                {order.lines.map((line) => {
                  const imageSrc = keytoUrl(line.imageKey ?? undefined);
                  return (
                    <div
                      className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5"
                      key={line.id}
                    >
                      <div className="relative h-20 w-20 shrink-0 sm:h-[120px] sm:w-[120px]">
                        <StorefrontImage
                          width={120}
                          height={120}
                          src={imageSrc}
                          alt={line.imageAlt || line.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-col gap-2">
                        {line.productSlug ? (
                          <Link
                            href={`/shop/${line.productSlug}`}
                            className="text-blue-600"
                          >
                            {line.productName}
                          </Link>
                        ) : (
                          <p className="font-medium">{line.productName}</p>
                        )}
                        {line.productDescription ? (
                          <p className="line-clamp-2 leading-tight tracking-tighter text-muted-foreground">
                            {line.productDescription}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <section className="flex w-full min-w-0 flex-col gap-3 md:col-span-4">
                <Link
                  href={`/orders/${order.id}`}
                  className={cn(buttonVariants(), "mb-0 w-full sm:mb-3")}
                >
                  View order details
                </Link>
                <Button variant="outline" disabled className="w-full">
                  Leave seller feedback
                </Button>
                <Button variant="outline" disabled className="w-full">
                  Write a product review
                </Button>
              </section>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default OrdersList;
