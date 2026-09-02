export function AboutCoffee() {
    return (
        <section id="about" className="w-full mt-16 bg-cream rounded-3xl border border-latte p-6 md:p-8 shadow-sm scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mb-6">
                درباره‌ی قهوه
            </h2>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
                {/* Three quick criteria */}
                <div className="md:col-span-2 space-y-4 text-clay leading-relaxed text-sm md:text-base">
                    <p>
                        خرید قهوه، مثل هر خرید دیگری، به آگاهی نیاز دارد. ابتدا بدانید قهوه را با
                        چه هدفی می‌نوشید: برای لذت بردن از عطر و طعم، یا برای انرژی و کافئین بیشتر.
                    </p>
                    <p>
                        سپس به روش عصاره‌گیری مورد علاقه‌تان و ابزاری که در اختیار دارید توجه کنید؛
                        یک قهوه‌ی عالی در اسپرسوساز، ممکن است در فرنچ‌پرس آن‌طور که انتظار دارید
                        از آب درنیاید.
                    </p>
                    <p>
                        ویزارد «قهوه بساز» در بالای همین صفحه بر اساس همین معیارها، دانه، نسبت و
                        خاستگاه مناسب شما را پیشنهاد می‌دهد.
                    </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 md:grid-cols-1 gap-3 content-start">
                    {[
                        { value: "+۱۰", label: "روش دم‌آوری" },
                        { value: "۳", label: "خاستگاه عربیکا" },
                        { value: "۱۰۰٪", label: "رست تازه" },
                    ].map(({ value, label }) => (
                        <div
                            key={label}
                            className="rounded-2xl bg-foam border border-latte px-4 py-3 text-center md:text-start"
                        >
                            <div className="text-xl font-extrabold text-roast">{value}</div>
                            <div className="text-xs font-medium text-clay mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
