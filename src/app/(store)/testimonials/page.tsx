import Header from "@/components/layouts/Header";
import { Shell } from "@/components/layouts/Shell";
import { HomeTestimonialsCarousel } from "@/features/storefront/components/HomeTestimonialsCarousel";
import { CustomerTestimonialForm } from "@/features/testimonials/components/CustomerTestimonialForm";
import { getPublishedTestimonialsCached } from "@/lib/storefront/testimonials-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Testimonials | Vidhya Tex",
  description:
    "Read Vidhya Tex customer reviews and share your silk saree experience as a written or video testimonial.",
};

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonialsCached();

  return (
    <Shell>
      <Header
        heading="Customer Testimonials"
        description="Real reviews from Vidhya Tex customers. Share your own experience — we publish after a quick check."
      />

      <div className="mx-auto w-full max-w-6xl space-y-10 px-2 pb-16">
        <HomeTestimonialsCarousel
          testimonials={testimonials}
          showHeader={false}
        />

        <section className="mx-auto max-w-3xl space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            Share your experience
          </h2>
          <p className="text-sm text-muted-foreground">
            Send a written or video review. New submissions stay private until
            we approve them.
          </p>
          <CustomerTestimonialForm />
        </section>
      </div>
    </Shell>
  );
}
