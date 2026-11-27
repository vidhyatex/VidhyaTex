"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Mail, Phone, ShoppingBag } from "lucide-react";
import { shopMailtoHref } from "@/lib/contact/links";
import { useCartCount } from "@/features/carts/hooks/useCartCount";
import { DEFAULT_FLOATING_ACTIONS } from "@/lib/admin/floating-actions";
import { useFloatingActions } from "@/providers/FloatingActionsProvider";
import { useStorefrontContact } from "@/providers/ShopContactProvider";
import { FloatingContactPicker } from "./FloatingContactPicker";
import { FloatingMailPicker } from "./FloatingMailPicker";
import { Icons } from "./icons";
import { useMobileMenu } from "./MobileMenuContext";
import { useCheckoutChrome } from "@/providers/CheckoutChromeProvider";

const floatingActionButtonClass =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 touch-manipulation";

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
      {count > 9 ? "9+" : count}
    </span>
  );
}

type OpenPicker = "mail" | "call" | "whatsapp" | null;

/**
 * Floating quick actions — only enabled buttons render, stacked with no gaps.
 */
export function StoreFloatingActions() {
  const { isOpen: menuOpen } = useMobileMenu();
  const { hideStoreChrome } = useCheckoutChrome();
  const flags = useFloatingActions() ?? DEFAULT_FLOATING_ACTIONS;
  const contact = useStorefrontContact();
  const cartCount = useCartCount();
  const contacts = contact?.contacts ?? [];
  const mailHref = shopMailtoHref(contact?.email);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);

  const hasPhoneContacts = contacts.some(
    (person) => person.phone && person.phoneHref && person.phoneHref !== "tel:",
  );

  const showMail = flags.mail && Boolean(mailHref && contact?.email);
  const showPhone = flags.phone && hasPhoneContacts;
  const showWhatsapp = flags.whatsapp && hasPhoneContacts;
  const showCart = flags.cart;

  const handlePickerChange = useCallback(
    (picker: Exclude<OpenPicker, null>) => (open: boolean) => {
      setOpenPicker(open ? picker : null);
    },
    [],
  );

  const items = useMemo(() => {
    const nodes: ReactNode[] = [];

    if (showMail && contact?.email && mailHref) {
      nodes.push(
        <FloatingMailPicker
          key="mail"
          email={contact.email}
          mailHref={mailHref}
          isOpen={openPicker === "mail"}
          onOpenChange={handlePickerChange("mail")}
          triggerLabel="Email Vidhya Tex"
          triggerClassName={`${floatingActionButtonClass} bg-primary text-white ring-2 ring-primary/40`}
          triggerIcon={<Mail className="h-5 w-5" strokeWidth={2} />}
        />,
      );
    }

    if (showPhone) {
      nodes.push(
        <FloatingContactPicker
          key="phone"
          mode="call"
          isOpen={openPicker === "call"}
          onOpenChange={handlePickerChange("call")}
          triggerLabel="Call Vidhya Tex"
          triggerClassName={`${floatingActionButtonClass} floating-glow floating-glow--phone border border-border bg-card text-foreground`}
          triggerIcon={<Phone className="h-5 w-5" strokeWidth={2} />}
        />,
      );
    }

    if (showWhatsapp) {
      nodes.push(
        <FloatingContactPicker
          key="whatsapp"
          mode="whatsapp"
          isOpen={openPicker === "whatsapp"}
          onOpenChange={handlePickerChange("whatsapp")}
          triggerLabel="WhatsApp Vidhya Tex"
          triggerClassName={`${floatingActionButtonClass} floating-glow floating-glow--whatsapp bg-[#25D366] text-white`}
          triggerIcon={<Icons.whatsapp className="h-5 w-5" />}
        />,
      );
    }

    if (showCart) {
      nodes.push(
        <Link
          key="cart"
          href="/cart"
          className={`relative ${floatingActionButtonClass} border border-border bg-card text-foreground shadow-[0_4px_16px_rgba(28,24,20,0.12)]`}
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={2} />
          <CartBadge count={cartCount} />
        </Link>,
      );
    }

    return nodes;
  }, [
    showMail,
    showPhone,
    showWhatsapp,
    showCart,
    contact?.email,
    mailHref,
    openPicker,
    handlePickerChange,
    cartCount,
  ]);

  if (menuOpen || hideStoreChrome) return null;
  if (items.length === 0) return null;

  const pickerOpen = openPicker !== null;

  return (
    <>
      {pickerOpen ? (
        <div
          className="fixed inset-0 z-[225] bg-black/10 backdrop-blur-[1px] md:pointer-events-none md:bg-transparent md:backdrop-blur-none"
          aria-hidden
          onClick={() => setOpenPicker(null)}
        />
      ) : null}

      <div
        className="fixed right-4 z-[230] flex flex-col items-end gap-3 bottom-[calc(var(--mobile-nav-height)+4.75rem)] md:bottom-6"
        aria-label="Quick actions"
      >
        {items}
      </div>
    </>
  );
}
