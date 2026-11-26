import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  titleAccent?: string;
  /** Destination for the section title and optional “view more” CTA. */
  href?: string;
  viewMoreLabel?: string;
  showViewMore?: boolean;
};

/**
 * Home section header — industry pattern:
 * heading contains the primary navigation link; optional secondary CTA
 * uses the same href with a distinct accessible name (e.g. “Share yours”).
 */
export function HomeSectionHeader({
  title,
  titleAccent,
  href = "/shop",
  viewMoreLabel = "View More",
  showViewMore = true,
}: Props) {
  const fullTitle = titleAccent ? `${title} ${titleAccent}` : title;

  const titleContent = (
    <>
      {title}
      {titleAccent ? (
        <span className="text-brand-magenta">
          {" "}
          {titleAccent}
        </span>
      ) : null}
    </>
  );

  return (
    <header className="mb-4 flex min-w-0 flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:mb-6">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <span className="craft-washi" aria-hidden />
        <h2 className="craft-section-title font-hero min-w-0 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
          <Link
            href={href}
            aria-label={fullTitle}
            className={cn(
              "rounded-sm text-inherit no-underline outline-offset-4",
              "transition-opacity hover:opacity-80",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold",
            )}
          >
            {titleContent}
          </Link>
        </h2>
      </div>
      {showViewMore ? (
        <Link
          href={href}
          className={cn(
            "craft-stitch group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-card/90 px-4 py-2 text-xs font-semibold text-brand-rose sm:text-sm",
            "transition-colors hover:border-brand-gold hover:bg-brand-rose hover:text-white",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
          )}
        >
          {viewMoreLabel}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </header>
  );
}
