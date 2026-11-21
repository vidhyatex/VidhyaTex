"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  AdminLoadingState,
  LoadingButtonLabel,
} from "@/components/admin/AdminLoadingState";
import { fetchWithTimeout } from "@/lib/network/fetchWithTimeout";
import {
  DEFAULT_COURIER_WEIGHT_EXTRA_PER_KG,
  DEFAULT_COURIER_WEIGHT_SLABS,
  DEFAULT_INTERNATIONAL_WEIGHT_SLABS,
  normalizeInternationalWeightSlabs,
  normalizeInternationalZones,
  normalizeWeightSlabs,
  parseCourierWeightSettings,
  parseInternationalCourierSettings,
  type CourierCalculationMode,
  type CourierWeightSlab,
  type InternationalCourierZone,
  type InternationalWeightSlab,
} from "@/lib/courier/calculate";

type ApiSettingRecord = {
  key: string;
  isEnabled: boolean;
  value: Record<string, unknown>;
} | null;

type IntegrationsPayload = {
  courierCharges: ApiSettingRecord;
};

type CourierFormState = {
  enabled: boolean;
  tamilNaduBase: number;
  southStatesBase: number;
  restOfIndiaBase: number;
  qty2To4AddOn: number;
  qty5PlusFlat: number;
  freeShippingEnabled: boolean;
  freeShippingMin: number;
  gstEnabled: boolean;
  gstPercentage: number;
  calculationMode: CourierCalculationMode;
  weightSlabs: CourierWeightSlab[];
  weightExtraPerKg: number;
  internationalEnabled: boolean;
  internationalZones: InternationalCourierZone[];
};

const SLAB_PRICE_FIELDS = [
  { key: "tamilNadu", label: "Tamil Nadu ₹" },
  { key: "southStates", label: "KA/AP/TS/KL ₹" },
  { key: "restOfIndia", label: "Rest of India ₹" },
] as const;

const DEFAULT_VALUES: CourierFormState = {
  enabled: true,
  tamilNaduBase: 40,
  southStatesBase: 60,
  restOfIndiaBase: 75,
  qty2To4AddOn: 40,
  qty5PlusFlat: 200,
  freeShippingEnabled: false,
  freeShippingMin: 999,
  gstEnabled: true,
  gstPercentage: 5,
  calculationMode: "quantity",
  weightSlabs: DEFAULT_COURIER_WEIGHT_SLABS,
  weightExtraPerKg: DEFAULT_COURIER_WEIGHT_EXTRA_PER_KG,
  ...parseInternationalCourierSettings({}),
};

function toAmount(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, Math.round(parsed))
    : Math.max(0, Math.round(fallback));
}

function toPercentage(value: unknown, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(50, Math.max(0, Math.round(parsed * 100) / 100));
}

export function CourierChargesForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CourierFormState>(DEFAULT_VALUES);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithTimeout("/api/admin/integrations", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Could not load courier charges.");
        const payload = (await response.json()) as IntegrationsPayload;
        if (cancelled) return;

        const value = payload.courierCharges?.value ?? {};
        setForm({
          enabled: payload.courierCharges?.isEnabled ?? true,
          tamilNaduBase: toAmount(
            value.tamilNaduBase,
            DEFAULT_VALUES.tamilNaduBase,
          ),
          southStatesBase: toAmount(
            value.southStatesBase,
            DEFAULT_VALUES.southStatesBase,
          ),
          restOfIndiaBase: toAmount(
            value.restOfIndiaBase,
            DEFAULT_VALUES.restOfIndiaBase,
          ),
          qty2To4AddOn: toAmount(
            value.qty2To4AddOn,
            DEFAULT_VALUES.qty2To4AddOn,
          ),
          qty5PlusFlat: toAmount(
            value.qty5PlusFlat,
            DEFAULT_VALUES.qty5PlusFlat,
          ),
          freeShippingEnabled: Boolean(
            value.freeShippingEnabled ?? DEFAULT_VALUES.freeShippingEnabled,
          ),
          freeShippingMin: toAmount(
            value.freeShippingMin,
            DEFAULT_VALUES.freeShippingMin,
          ),
          gstEnabled: Boolean(value.gstEnabled ?? DEFAULT_VALUES.gstEnabled),
          gstPercentage: toPercentage(
            value.gstPercentage,
            DEFAULT_VALUES.gstPercentage,
          ),
          ...parseCourierWeightSettings(value),
          ...parseInternationalCourierSettings(value),
        });
      } catch (error) {
        toast({
          title: "Could not load courier settings",
          description: error instanceof Error ? error.message : "Please retry.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const disabled = useMemo(() => isLoading || isSaving, [isLoading, isSaving]);

  const setAmount = (key: keyof CourierFormState, raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    setForm((prev) => ({ ...prev, [key]: Math.max(0, Math.round(value)) }));
  };

  const updateSlab = (
    index: number,
    key: keyof CourierWeightSlab,
    raw: string,
  ) => {
    const value = Number(raw);
    if (raw !== "" && !Number.isFinite(value)) return;
    setForm((prev) => ({
      ...prev,
      weightSlabs: prev.weightSlabs.map((slab, i) =>
        i === index
          ? {
              ...slab,
              [key]:
                key === "upToKg"
                  ? Math.max(0, value)
                  : Math.max(0, Math.round(value)),
            }
          : slab,
      ),
    }));
  };

  const addSlab = () => {
    setForm((prev) => {
      const last = prev.weightSlabs[prev.weightSlabs.length - 1];
      return {
        ...prev,
        weightSlabs: [
          ...prev.weightSlabs,
          last
            ? { ...last, upToKg: Math.floor(last.upToKg) + 1 }
            : DEFAULT_COURIER_WEIGHT_SLABS[0],
        ],
      };
    });
  };

  const removeSlab = (index: number) => {
    setForm((prev) => ({
      ...prev,
      weightSlabs: prev.weightSlabs.filter((_, i) => i !== index),
    }));
  };

  const updateIntlZone = (
    zoneIndex: number,
    patch: Partial<InternationalCourierZone>,
  ) => {
    setForm((prev) => ({
      ...prev,
      internationalZones: prev.internationalZones.map((zone, i) =>
        i === zoneIndex ? { ...zone, ...patch } : zone,
      ),
    }));
  };

  const updateIntlSlab = (
    zoneIndex: number,
    slabIndex: number,
    key: keyof InternationalWeightSlab,
    raw: string,
  ) => {
    const value = Number(raw);
    if (raw !== "" && !Number.isFinite(value)) return;
    setForm((prev) => ({
      ...prev,
      internationalZones: prev.internationalZones.map((zone, i) => {
        if (i !== zoneIndex) return zone;
        return {
          ...zone,
          slabs: zone.slabs.map((slab, j) =>
            j === slabIndex
              ? {
                  ...slab,
                  [key]:
                    key === "upToKg"
                      ? Math.max(0, value)
                      : Math.max(0, Math.round(value)),
                }
              : slab,
          ),
        };
      }),
    }));
  };

  const addIntlSlab = (zoneIndex: number) => {
    setForm((prev) => ({
      ...prev,
      internationalZones: prev.internationalZones.map((zone, i) => {
        if (i !== zoneIndex) return zone;
        const last = zone.slabs[zone.slabs.length - 1];
        return {
          ...zone,
          slabs: [
            ...zone.slabs,
            last
              ? { ...last, upToKg: Math.floor(last.upToKg) + 1 }
              : DEFAULT_INTERNATIONAL_WEIGHT_SLABS[0],
          ],
        };
      }),
    }));
  };

  const removeIntlSlab = (zoneIndex: number, slabIndex: number) => {
    setForm((prev) => ({
      ...prev,
      internationalZones: prev.internationalZones.map((zone, i) => {
        if (i !== zoneIndex) return zone;
        if (zone.slabs.length <= 1) return zone;
        return {
          ...zone,
          slabs: zone.slabs.filter((_, j) => j !== slabIndex),
        };
      }),
    }));
  };

  const addIntlCountryCode = (zoneIndex: number, raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || code === "IN") return;
    setForm((prev) => ({
      ...prev,
      internationalZones: prev.internationalZones.map((zone, i) => {
        if (i !== zoneIndex || zone.id === "rest_of_world") return zone;
        if (zone.countryCodes.includes(code)) return zone;
        return { ...zone, countryCodes: [...zone.countryCodes, code] };
      }),
    }));
  };

  const removeIntlCountryCode = (zoneIndex: number, code: string) => {
    setForm((prev) => ({
      ...prev,
      internationalZones: prev.internationalZones.map((zone, i) => {
        if (i !== zoneIndex) return zone;
        return {
          ...zone,
          countryCodes: zone.countryCodes.filter((item) => item !== code),
        };
      }),
    }));
  };

  const onSave = async () => {
    const weightMode = form.calculationMode === "weight";
    if (weightMode) {
      const upTos = form.weightSlabs.map((slab) => slab.upToKg);
      if (
        upTos.length === 0 ||
        upTos.some((kg) => !(kg > 0)) ||
        new Set(upTos).size !== upTos.length
      ) {
        toast({
          title: "Check weight conditions",
          description:
            "Add at least one condition. Each 'up to kg' must be above 0 and unique.",
          variant: "destructive",
        });
        return;
      }
    }
    for (const zone of form.internationalZones) {
      const upTos = zone.slabs.map((slab) => slab.upToKg);
      if (
        upTos.length === 0 ||
        upTos.some((kg) => !(kg > 0)) ||
        new Set(upTos).size !== upTos.length
      ) {
        toast({
          title: `Check ${zone.label} weight slabs`,
          description:
            "Each international zone needs at least one slab with unique kg values above 0.",
          variant: "destructive",
        });
        return;
      }
    }
    const weightSlabs = normalizeWeightSlabs(form.weightSlabs);
    const internationalZones = normalizeInternationalZones(
      form.internationalZones.map((zone) => ({
        ...zone,
        slabs: normalizeInternationalWeightSlabs(zone.slabs),
      })),
    );
    setForm((prev) => ({ ...prev, weightSlabs, internationalZones }));
    setIsSaving(true);
    try {
      const response = await fetchWithTimeout("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "courier_charges",
          isEnabled: form.enabled,
          value: {
            tamilNaduBase: form.tamilNaduBase,
            southStatesBase: form.southStatesBase,
            restOfIndiaBase: form.restOfIndiaBase,
            qty2To4AddOn: form.qty2To4AddOn,
            qty5PlusFlat: form.qty5PlusFlat,
            freeShippingEnabled: form.freeShippingEnabled,
            freeShippingMin: form.freeShippingMin,
            gstEnabled: form.gstEnabled,
            gstPercentage: toPercentage(form.gstPercentage, 5),
            calculationMode: form.calculationMode,
            weightSlabs,
            weightExtraPerKg: form.weightExtraPerKg,
            internationalEnabled: form.internationalEnabled,
            internationalZones,
          },
        }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "Save failed");
        throw new Error(text || "Save failed");
      }

      toast({
        title: "Courier & GST settings saved",
        description:
          "Checkout now uses updated courier, free shipping, and GST settings.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please retry.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Courier & GST</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <AdminLoadingState message="Loading courier settings..." />
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, enabled: event.target.checked }))
            }
          />
          Enable state-wise courier calculation
        </label>

        <div className="flex flex-wrap gap-4 text-sm">
          {(
            [
              { mode: "quantity", label: "Quantity-wise (by number of items)" },
              { mode: "weight", label: "Weight-wise (by total kg)" },
            ] as const
          ).map((option) => (
            <label key={option.mode} className="flex items-center gap-2">
              <input
                type="radio"
                name="courier-calculation-mode"
                checked={form.calculationMode === option.mode}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    calculationMode: option.mode,
                  }))
                }
              />
              {option.label}
            </label>
          ))}
        </div>

        {form.calculationMode === "weight" ? (
          <div className="space-y-3 rounded-md border border-border p-3">
            <p className="text-sm font-medium">Weight conditions</p>
            <div className="space-y-2">
              {form.weightSlabs.map((slab, index) => {
                const from =
                  index === 0 ? 0 : form.weightSlabs[index - 1].upToKg;
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-end gap-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
                  >
                    <div className="space-y-1">
                      <Label htmlFor={`slab-kg-${index}`}>
                        {index === 0
                          ? "Up to (kg)"
                          : `Above ${from} kg, up to (kg)`}
                      </Label>
                      <div className="flex items-center gap-1">
                        <Input
                          id={`slab-kg-${index}`}
                          type="number"
                          min={0}
                          step={0.1}
                          value={slab.upToKg}
                          onChange={(event) =>
                            updateSlab(index, "upToKg", event.target.value)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          kg
                        </span>
                      </div>
                    </div>
                    {SLAB_PRICE_FIELDS.map((field) => (
                      <div key={field.key} className="space-y-1">
                        <Label htmlFor={`slab-${field.key}-${index}`}>
                          {field.label}
                        </Label>
                        <Input
                          id={`slab-${field.key}-${index}`}
                          type="number"
                          min={0}
                          value={slab[field.key]}
                          onChange={(event) =>
                            updateSlab(index, field.key, event.target.value)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={form.weightSlabs.length <= 1}
                      onClick={() => removeSlab(index)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSlab}>
              Add condition
            </Button>
            <div className="space-y-2">
              <Label htmlFor="weight-extra-per-kg">
                Above last condition: extra ₹ per additional kg
              </Label>
              <Input
                id="weight-extra-per-kg"
                type="number"
                min={0}
                value={form.weightExtraPerKg}
                onChange={(event) =>
                  setAmount("weightExtraPerKg", event.target.value)
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Order weight = each product&apos;s weight × quantity (digital
              items excluded). Products without a weight count as 0.5 kg.
              Conditions are sorted by kg when saved.
            </p>
          </div>
        ) : null}

        <div
          className={
            form.calculationMode === "weight"
              ? "hidden"
              : "grid gap-4 md:grid-cols-2"
          }
        >
          <div className="space-y-2">
            <Label htmlFor="tn-base">Tamil Nadu (qty 1)</Label>
            <Input
              id="tn-base"
              type="number"
              min={0}
              value={form.tamilNaduBase}
              onChange={(event) =>
                setAmount("tamilNaduBase", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="south-base">
              Karnataka/Andhra/Telangana/Kerala (qty 1)
            </Label>
            <Input
              id="south-base"
              type="number"
              min={0}
              value={form.southStatesBase}
              onChange={(event) =>
                setAmount("southStatesBase", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rest-base">Rest of India (qty 1)</Label>
            <Input
              id="rest-base"
              type="number"
              min={0}
              value={form.restOfIndiaBase}
              onChange={(event) =>
                setAmount("restOfIndiaBase", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qty-2-4">Qty 2-4 add-on</Label>
            <Input
              id="qty-2-4"
              type="number"
              min={0}
              value={form.qty2To4AddOn}
              onChange={(event) =>
                setAmount("qty2To4AddOn", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qty-5-plus">Qty 5+ flat courier</Label>
            <Input
              id="qty-5-plus"
              type="number"
              min={0}
              value={form.qty5PlusFlat}
              onChange={(event) =>
                setAmount("qty5PlusFlat", event.target.value)
              }
            />
          </div>
        </div>

        {form.calculationMode === "quantity" ? (
          <p className="text-xs text-muted-foreground">
            Qty 2-4 uses base + add-on. Qty 5+ uses flat courier value.
          </p>
        ) : null}

        <div className="rounded-md border border-border p-3 space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.freeShippingEnabled}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  freeShippingEnabled: event.target.checked,
                }))
              }
            />
            Enable free shipping
          </label>
          <div className="space-y-2">
            <Label htmlFor="free-shipping-min">Free shipping above (₹)</Label>
            <Input
              id="free-shipping-min"
              type="number"
              min={0}
              disabled={!form.freeShippingEnabled}
              value={form.freeShippingMin}
              onChange={(event) =>
                setAmount("freeShippingMin", event.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">
              When order value after discount reaches this amount, courier is
              ₹0. Below it, state and quantity/weight rates still apply.
            </p>
          </div>
        </div>

        <div className="rounded-md border border-border p-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.gstEnabled}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  gstEnabled: event.target.checked,
                }))
              }
            />
            Enable GST
          </label>
          <p className="text-xs text-muted-foreground">
            Applied once on discounted merchandise plus courier. Storefront
            product prices show GST-inclusive amounts; admin orders and packing
            keep exclusive price plus a separate GST line.
          </p>
          <div className="mt-3 space-y-2">
            <Label htmlFor="gst-percentage">GST percentage</Label>
            <Input
              id="gst-percentage"
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={form.gstPercentage}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  gstPercentage: toPercentage(
                    event.target.value,
                    prev.gstPercentage,
                  ),
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-border p-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.internationalEnabled}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  internationalEnabled: event.target.checked,
                }))
              }
            />
            Enable international shipping
          </label>
          <p className="text-xs text-muted-foreground">
            India rates stay unchanged. International orders use zone × kg
            slabs (INR). Free shipping applies to India only. Set accurate
            product weights — missing weight defaults to 0.5 kg. Duties/customs
            are paid by the customer.
          </p>
          {form.internationalZones.map((zone, zoneIndex) => (
            <div
              key={zone.id}
              className="space-y-3 rounded-md border border-border/70 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{zone.label}</p>
                <span className="text-xs text-muted-foreground">{zone.id}</span>
              </div>
              {zone.id === "rest_of_world" ? (
                <p className="text-xs text-muted-foreground">
                  Catch-all for any enabled destination not listed in another
                  zone.
                </p>
              ) : (
                <div className="space-y-2">
                  <Label>Country codes (ISO)</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.countryCodes.map((code) => (
                      <button
                        key={code}
                        type="button"
                        className="rounded border border-border px-2 py-0.5 text-xs"
                        onClick={() => removeIntlCountryCode(zoneIndex, code)}
                        title={`Remove ${code}`}
                      >
                        {code} ×
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Add code e.g. AE"
                    maxLength={2}
                    className="max-w-[10rem]"
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addIntlCountryCode(zoneIndex, event.currentTarget.value);
                      event.currentTarget.value = "";
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                {zone.slabs.map((slab, slabIndex) => {
                  const from =
                    slabIndex === 0 ? 0 : zone.slabs[slabIndex - 1].upToKg;
                  return (
                    <div
                      key={`${zone.id}-slab-${slabIndex}`}
                      className="grid grid-cols-2 items-end gap-2 md:grid-cols-[1.2fr_1fr_auto]"
                    >
                      <div className="space-y-1">
                        <Label>
                          {slabIndex === 0
                            ? "Up to (kg)"
                            : `Above ${from} kg, up to`}
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          value={slab.upToKg}
                          onChange={(event) =>
                            updateIntlSlab(
                              zoneIndex,
                              slabIndex,
                              "upToKg",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Rate ₹</Label>
                        <Input
                          type="number"
                          min={0}
                          value={slab.rate}
                          onChange={(event) =>
                            updateIntlSlab(
                              zoneIndex,
                              slabIndex,
                              "rate",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={zone.slabs.length <= 1}
                        onClick={() => removeIntlSlab(zoneIndex, slabIndex)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addIntlSlab(zoneIndex)}
                >
                  Add slab
                </Button>
                <div className="space-y-1">
                  <Label>Extra ₹ per kg above last slab</Label>
                  <Input
                    type="number"
                    min={0}
                    value={zone.extraPerKg}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (!Number.isFinite(value)) return;
                      updateIntlZone(zoneIndex, {
                        extraPerKg: Math.max(0, Math.round(value)),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onSave} disabled={disabled}>
          <LoadingButtonLabel
            isLoading={isSaving}
            loadingText="Saving..."
            idleText="Save courier & GST settings"
          />
        </Button>
      </CardContent>
    </Card>
  );
}

export default CourierChargesForm;
