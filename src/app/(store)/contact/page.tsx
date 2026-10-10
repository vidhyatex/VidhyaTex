import InfoPage from "@/components/layouts/InfoPage";
import { resolveStorefrontContact } from "@/lib/integrations/settings";
import { shopMailtoHref, whatsAppHrefFromPhone } from "@/lib/contact/links";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Vidhya Tex",
  description:
    "Contact Vidhya Tex by phone, WhatsApp or email for saree orders and enquiries — Elampillai, Salem, Tamil Nadu",
};

export const revalidate = 60;

export default async function ContactPage() {
  const contact = await resolveStorefrontContact();
  const mailHref = shopMailtoHref(contact.email);

  return (
    <InfoPage
      heading="Contact Us"
      description="Reach Vidhya Tex by phone, WhatsApp or email for orders and enquiries."
    >
      <section id="store" className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Business address
        </h2>
        <address className="not-italic space-y-0.5">
          {contact.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {contact.gstin ? (
            <p className="pt-2 text-muted-foreground">
              <span className="font-medium text-foreground">GSTIN: </span>
              {contact.gstin}
            </p>
          ) : null}
        </address>
      </section>

      {contact.phone ? (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            Phone &amp; WhatsApp
          </h2>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href={contact.phoneHref} className="text-primary hover:underline">
              Call {contact.phone}
            </Link>
            <Link
              href={whatsAppHrefFromPhone(contact.phoneHref || contact.phone)}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {contact.phone}
            </Link>
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Email</h2>
        {mailHref ? (
          <p>
            <Link href={mailHref} className="text-primary hover:underline">
              {contact.email}
            </Link>
          </p>
        ) : (
          <p className="text-muted-foreground">
            Email coming soon. Use the contact form on this site when it is
            available.
          </p>
        )}
      </section>
    </InfoPage>
  );
}
