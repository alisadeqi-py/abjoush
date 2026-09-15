"use client";

import Image from "next/image";
import React, { useId, useMemo, useState } from "react";

import type { BrewMethod, Origin } from "@/lib/content";

/* ------------------------------------------------------------------ *
 * Dummy assets
 * ------------------------------------------------------------------ */

function dummyBag(color = "#1f1410", label = "#c99a4a"): string {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160">
      <path d="M30 30h60v110a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8z" fill="${color}" />
      <path d="M30 30l6-14h48l6 14z" fill="${color}" opacity="0.8" />
      <rect x="42" y="52" width="36" height="56" rx="4" fill="${label}" opacity="0.9" />
      <circle cx="60" cy="76" r="12" fill="#f5efe6" />
      <text x="60" y="82" font-size="13" text-anchor="middle"
            font-family="system-ui, sans-serif" fill="${color}">☕</text>
    </svg>
  `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function dummyFlag(h = "#fcd116", m = "#003893", b = "#ce1126"): string {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="11" fill="${h}" />
      <rect y="11" width="32" height="10" fill="${m}" />
      <rect y="21" width="32" height="11" fill="${b}" />
    </svg>
  `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DUMMY_BAG = dummyBag();
const DUMMY_FLAG = dummyFlag();

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

interface CheckoutProps {
    selectedMethod: BrewMethod | null;
    selectedOrigin: Origin | null;
    robusta: number;
    arabica: number;
    selectedTasteLabel?: string;
    selectedConsumptionRange?: string;
    /** Price in toman, e.g. 345000. */
    totalPrice?: number;
    onClose?: () => void;
    onSubmit?: (data: CheckoutForm) => void;
}

interface CheckoutForm {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    paymentMethod: "online" | "cod";
    notes: string;
}

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function formatPrice(value: number): string {
    return value.toLocaleString("fa-IR");
}

function toFa(n: number | string): string {
    return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageCheckout({
    selectedMethod,
    selectedOrigin,
    robusta,
    arabica,
    selectedTasteLabel,
    selectedConsumptionRange,
    totalPrice = 345000,
    onClose,
    onSubmit,
}: CheckoutProps) {
    const formId = useId();
    const [form, setForm] = useState<CheckoutForm>({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        paymentMethod: "online",
        notes: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const update = <K extends keyof CheckoutForm>(
        key: K,
        value: CheckoutForm[K]
    ) => {
        setForm((f) => ({ ...f, [key]: value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const subtotal = totalPrice;
    const shipping = 0;
    const discount = 0;
    const grandTotal = subtotal + shipping - discount;

    const isValid = useMemo(
        () => form.fullName.trim() && form.phone.trim() && form.address.trim(),
        [form]
    );

    function validate(): FormErrors {
        const e: FormErrors = {};
        if (!form.fullName.trim()) e.fullName = "نام را وارد کنید";
        if (!/^09\d{9}$/.test(form.phone.replace(/\D/g, "")))
            e.phone = "شماره موبایل معتبر نیست";
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
            e.email = "ایمیل معتبر نیست";
        if (!form.address.trim()) e.address = "آدرس را وارد کنید";
        return e;
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;
        setSubmitting(true);
        try {
            onSubmit?.(form);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section
            aria-label="تکمیل سفارش"
            className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-3 pb-4 sm:px-6 sm:pb-6"
        >
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-black/5 bg-[#fbf7ef] shadow-2xl ring-1 ring-black/5">
                {/* ═══ Top bar ═══════════════════════════════════════ */}
                <header className="relative flex items-center justify-between gap-3 border-b border-black/5 bg-gradient-to-l from-[#1a1512] to-[#2b201a] px-4 py-3 text-white sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-caramel/15 ring-1 ring-caramel/30">
                            <Image
                                src={DUMMY_BAG}
                                alt=""
                                width={22}
                                height={30}
                                className="h-5 w-auto object-contain"
                                unoptimized
                            />
                        </span>
                        <div className="text-right">
                            <h2 className="text-sm font-extrabold sm:text-base">
                                تکمیل سفارش
                            </h2>
                            <p className="text-[0.65rem] text-white/60 sm:text-xs">
                                اطلاعات ارسال و پرداخت را وارد کنید
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="بستن"
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                        >
                            <CloseIcon className="h-4 w-4" />
                        </button>
                    )}
                </header>

                {/* ═══ Body ══════════════════════════════════════════ */}
                <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6 lg:p-6">
                    {/* ── Form (left in DOM, right visually in RTL) ─── */}
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="order-2 flex flex-col gap-5 lg:order-1"
                    >
                        {/* Delivery */}
                        <fieldset className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm sm:p-5">
                            <legend className="flex items-center gap-2 px-1 text-xs font-bold text-ink/70">
                                <TruckIcon className="h-4 w-4 text-caramel" />
                                <span>اطلاعات ارسال</span>
                            </legend>

                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Field
                                    id={`${formId}-name`}
                                    label="نام و نام خانوادگی"
                                    value={form.fullName}
                                    onChange={(v) => update("fullName", v)}
                                    icon={<UserIcon className="h-4 w-4" />}
                                    error={errors.fullName}
                                    autoComplete="name"
                                    required
                                    className="sm:col-span-2"
                                />
                                <Field
                                    id={`${formId}-phone`}
                                    label="شماره موبایل"
                                    value={form.phone}
                                    onChange={(v) => update("phone", v.replace(/[^\d]/g, ""))}
                                    icon={<PhoneIcon className="h-4 w-4" />}
                                    error={errors.phone}
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                    required
                                />
                                <Field
                                    id={`${formId}-email`}
                                    label="ایمیل (اختیاری)"
                                    value={form.email}
                                    onChange={(v) => update("email", v)}
                                    icon={<MailIcon className="h-4 w-4" />}
                                    error={errors.email}
                                    type="email"
                                    autoComplete="email"
                                />
                                <Field
                                    id={`${formId}-address`}
                                    label="آدرس / واحد / پلاک"
                                    value={form.address}
                                    onChange={(v) => update("address", v)}
                                    icon={<PinIcon className="h-4 w-4" />}
                                    error={errors.address}
                                    autoComplete="street-address"
                                    required
                                    className="sm:col-span-2"
                                />
                            </div>
                        </fieldset>

                        {/* Payment */}
                        <fieldset className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm sm:p-5">
                            <legend className="flex items-center gap-2 px-1 text-xs font-bold text-ink/70">
                                <CardIcon className="h-4 w-4 text-caramel" />
                                <span>روش پرداخت</span>
                            </legend>

                            <div
                                role="radiogroup"
                                aria-label="روش پرداخت"
                                className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
                            >
                                <PaymentOption
                                    name={`${formId}-pay`}
                                    value="online"
                                    checked={form.paymentMethod === "online"}
                                    onChange={() => update("paymentMethod", "online")}
                                    title="پرداخت آنلاین"
                                    subtitle="با کارت بانکی، امن و سریع"
                                    icon={<CardIcon className="h-4 w-4" />}
                                    badge="پیشنهادی"
                                />
                                <PaymentOption
                                    name={`${formId}-pay`}
                                    value="cod"
                                    checked={form.paymentMethod === "cod"}
                                    onChange={() => update("paymentMethod", "cod")}
                                    title="پرداخت در محل"
                                    subtitle="هنگام تحویل پرداخت کنید"
                                    icon={<CashIcon className="h-4 w-4" />}
                                />
                            </div>
                        </fieldset>

                        {/* Notes */}
                        <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm sm:p-5">
                            <label
                                htmlFor={`${formId}-notes`}
                                className="mb-2 flex items-center gap-2 text-xs font-bold text-ink/70"
                            >
                                <PencilIcon className="h-3.5 w-3.5 text-caramel" />
                                <span>یادداشت سفارش (اختیاری)</span>
                            </label>
                            <textarea
                                id={`${formId}-notes`}
                                value={form.notes}
                                onChange={(e) => update("notes", e.target.value)}
                                placeholder="اگر نکته‌ای برای سفارش دارید بنویسید..."
                                rows={3}
                                className="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs text-ink placeholder:text-ink/40 transition focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30"
                            />
                        </div>
                    </form>

                    {/* ── Order summary (right in DOM, left visually in RTL) ── */}
                    <aside className="order-1 lg:order-2">
                        <div className="lg:sticky lg:top-4">
                            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-black/5 bg-gradient-to-l from-[#fbf7ef] to-white px-4 py-3">
                                    <h3 className="text-xs font-bold text-ink/80">
                                        خلاصه سفارش
                                    </h3>
                                    <span className="rounded-full bg-caramel/15 px-2 py-0.5 text-[0.6rem] font-bold text-caramel">
                                        ۱ محصول
                                    </span>
                                </div>

                                {/* Product */}
                                <div className="flex items-center gap-3 border-b border-black/5 p-4">
                                    <Image
                                        src={DUMMY_BAG}
                                        alt="قهوه کلمبیا"
                                        width={60}
                                        height={80}
                                        className="h-16 w-auto shrink-0 object-contain"
                                        unoptimized
                                    />
                                    <div className="min-w-0 flex-1 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[0.55rem] font-bold text-ink/60">
                                                تازه‌رست
                                            </span>
                                            <h4 className="text-sm font-extrabold text-ink">
                                                قهوه کلمبیا
                                            </h4>
                                        </div>
                                        <p className="mt-0.5 text-[0.65rem] font-semibold text-ink/60">
                                            {toFa(arabica)}٪ عربیکا · {toFa(robusta)}٪ روبستا
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap justify-end gap-1">
                                            {["شکلاتی", "آجیلی"].map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-caramel/25 bg-caramel/10 px-1.5 py-0.5 text-[0.55rem] font-semibold text-ink/70"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <dl className="divide-y divide-black/5 px-4">
                                    <DetailRow
                                        icon={<MachineIcon className="h-3.5 w-3.5" />}
                                        label="دستگاه"
                                        value={selectedMethod?.name ?? "اسپرسوساز خانگی"}
                                    />
                                    <DetailRow
                                        icon={
                                            <span className="grid h-3.5 w-3.5 place-items-center overflow-hidden rounded-full ring-1 ring-ink/15">
                                                <Image
                                                    src={DUMMY_FLAG}
                                                    alt=""
                                                    width={14}
                                                    height={14}
                                                    className="h-full w-full object-cover"
                                                    unoptimized
                                                />
                                            </span>
                                        }
                                        label="خاستگاه"
                                        value={selectedOrigin?.name ?? "کلمبیا"}
                                    />
                                    <DetailRow
                                        icon={<LeafIcon className="h-3.5 w-3.5" />}
                                        label="سلیقه و طعم"
                                        value={selectedTasteLabel ?? "شکلاتی، آجیلی"}
                                    />
                                    <DetailRow
                                        icon={<BagIcon className="h-3.5 w-3.5" />}
                                        label="میزان مصرف"
                                        value={selectedConsumptionRange ?? "۱۵۰ - ۲۰۰ گرم"}
                                    />
                                </dl>

                                {/* Pricing */}
                                <dl className="space-y-2 border-t border-black/5 bg-[#fbf7ef]/60 px-4 py-3 text-[0.7rem]">
                                    <PriceRow label="جمع کالا" value={subtotal} />
                                    <PriceRow
                                        label="هزینه ارسال"
                                        value={shipping}
                                        free={shipping === 0}
                                    />
                                    {discount > 0 && (
                                        <PriceRow label="تخفیف" value={-discount} accent />
                                    )}
                                </dl>

                                <div className="flex items-center justify-between border-t border-black/5 bg-white px-4 py-3">
                                    <span className="text-xs font-semibold text-ink/60">
                                        قابل پرداخت
                                    </span>
                                    <span className="text-base font-extrabold text-ink">
                                        {formatPrice(grandTotal)}{" "}
                                        <span className="text-[0.65rem] font-semibold text-ink/50">
                                            تومان
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Submit (desktop) */}
                            <div className="mt-4 hidden lg:block">
                                <SubmitButton
                                    disabled={!isValid || submitting}
                                    submitting={submitting}
                                    onClick={handleSubmit}
                                />
                                <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.6rem] text-ink/50">
                                    <ShieldIcon className="h-3 w-3" />
                                    <span>اطلاعات شما رمزنگاری و محفوظ است</span>
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ═══ Sticky mobile submit ═════════════════════════ */}
                <div className="sticky bottom-0 border-t border-black/5 bg-[#fbf7ef]/95 px-4 py-3 backdrop-blur lg:hidden">
                    <SubmitButton
                        disabled={!isValid || submitting}
                        submitting={submitting}
                        onClick={handleSubmit}
                    />
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.6rem] text-ink/50">
                        <ShieldIcon className="h-3 w-3" />
                        <span>اطلاعات شما رمزنگاری و محفوظ است</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ *
 * Subcomponents
 * ------------------------------------------------------------------ */

function DetailRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-1.5 text-[0.7rem] text-ink/55">
                <span className="text-caramel">{icon}</span>
                <span>{label}</span>
            </dt>
            <dd className="truncate text-left text-[0.72rem] font-semibold text-ink">
                {value}
            </dd>
        </div>
    );
}

function PriceRow({
    label,
    value,
    free,
    accent,
}: {
    label: string;
    value: number;
    free?: boolean;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <dt className="text-ink/55">{label}</dt>
            <dd
                className={`font-semibold ${accent ? "text-emerald-600" : "text-ink"
                    }`}
            >
                {free ? (
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[0.6rem] font-bold text-emerald-600">
                        رایگان
                    </span>
                ) : (
                    <>
                        {formatPrice(Math.abs(value))}{" "}
                        <span className="text-[0.6rem] font-normal text-ink/50">تومان</span>
                    </>
                )}
            </dd>
        </div>
    );
}

function Field({
    id,
    label,
    value,
    onChange,
    icon,
    error,
    type = "text",
    required,
    className,
    ...rest
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    icon: React.ReactNode;
    error?: string;
    type?: string;
    required?: boolean;
    className?: string;
} & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "id" | "value" | "onChange" | "type"
>) {
    const invalid = Boolean(error);
    return (
        <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
            <label
                htmlFor={id}
                className="text-[0.7rem] font-semibold text-ink/70"
            >
                {label}
                {required && <span className="mr-0.5 text-caramel">*</span>}
            </label>
            <div className="relative">
                <span
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${invalid ? "text-rose-400" : "text-caramel/70"
                        }`}
                >
                    {icon}
                </span>
                <input
                    {...rest}
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? `${id}-err` : undefined}
                    className={`w-full rounded-xl border bg-white py-2.5 pr-10 pl-3 text-xs text-ink placeholder:text-ink/35 transition focus:outline-none focus:ring-2 ${invalid
                            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                            : "border-black/10 focus:border-caramel focus:ring-caramel/30"
                        }`}
                />
            </div>
            {invalid && (
                <span
                    id={`${id}-err`}
                    role="alert"
                    className="text-[0.65rem] font-medium text-rose-500"
                >
                    {error}
                </span>
            )}
        </div>
    );
}

function PaymentOption({
    name,
    value,
    checked,
    onChange,
    title,
    subtitle,
    icon,
    badge,
}: {
    name: string;
    value: string;
    checked: boolean;
    onChange: () => void;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
}) {
    const id = `${name}-${value}`;
    return (
        <label
            htmlFor={id}
            className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-right transition ${checked
                    ? "border-caramel bg-caramel/10 shadow-sm"
                    : "border-black/10 bg-white hover:border-ink/20"
                }`}
        >
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />
            <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${checked
                        ? "bg-caramel text-white shadow"
                        : "bg-ink/5 text-ink/60"
                    }`}
            >
                {icon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-1.5">
                    <span
                        className={`text-[0.72rem] font-bold ${checked ? "text-caramel" : "text-ink"
                            }`}
                    >
                        {title}
                    </span>
                    {badge && (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[0.55rem] font-bold text-emerald-600">
                            {badge}
                        </span>
                    )}
                </span>
                <span className="text-[0.62rem] text-ink/50">{subtitle}</span>
            </span>
            {/* Custom radio indicator */}
            <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition ${checked ? "border-caramel" : "border-ink/20"
                    }`}
            >
                {checked && <span className="h-2 w-2 rounded-full bg-caramel" />}
            </span>
        </label>
    );
}

function SubmitButton({
    disabled,
    submitting,
    onClick,
}: {
    disabled: boolean;
    submitting: boolean;
    onClick: (e: React.FormEvent) => void;
}) {
    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={disabled}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#1a1512] to-[#2b201a] px-6 py-3.5 text-sm font-extrabold text-cream shadow-xl ring-1 ring-white/10 transition-all hover:scale-[1.01] hover:shadow-caramel/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40 active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
            {submitting ? (
                <>
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                    <span>در حال ثبت...</span>
                </>
            ) : (
                <>
                    <span>ثبت سفارش و پرداخت</span>
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </>
            )}
        </button>
    );
}

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </svg>
    );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 16V6h11v10" />
            <path d="M14 9h4l3 3v4h-7z" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
        </svg>
    );
}

function CardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function CashIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="7" width="18" height="10" rx="2" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}

function MachineIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M4 8h12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
            <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
            <path d="M9 4v3M13 4v3M2 22h18" />
        </svg>
    );
}

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 12-9 0 8-4 12-9 12z" />
            <path d="M4 20c2-4 6-8 12-10" />
        </svg>
    );
}

function BagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M6 6h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
            <path d="M6 6l2-3h8l2 3" />
        </svg>
    );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
    );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3l8 3v6a9 9 0 0 1-8 9 9 9 0 0 1-8-9V6z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
    );
}

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 12a9 9 0 1 1-6.22-8.56" />
        </svg>
    );
}