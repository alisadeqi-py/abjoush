export function ReadMore() {
    return (
        <section className="w-full mt-16 bg-foam rounded-3xl border border-latte p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mb-6">
                بیشتر بخوانید
            </h2>

            <article className="space-y-4 leading-relaxed text-sm md:text-base text-clay">
                <h3 className="text-lg font-bold text-roast">
                    درجه‌ی عصاره‌گیری چیست؟
                </h3>
                <p>
                    «درجه» در آبجوش نشان می‌دهد عصاره‌ی قهوه چقدر کامل گرفته شده است. قهوه‌های
                    درجه‌ی <b className="text-ink">نیک</b> عطر و طعمی نرم‌تر و میوه‌ای‌تر دارند و برای
                    دم‌آوری‌های دستی مثل V60 یا کلد برو عالی‌اند؛ قهوه‌های درجه‌ی{" "}
                    <b className="text-ink">متوسط</b> بدنه‌ی غلیظ‌تر و تلخی متعادل‌تری دارند و برای
                    اسپرسو و موکاپات انتخاب مطمئن‌تری هستند.
                </p>

                <h4 className="font-bold text-ink mt-4">کدام را انتخاب کنم؟</h4>
                <p>
                    اگر شیرین‌کام هستید و قهوه را بدون شکر می‌نوشید، با نیک شروع کنید. اگر
                    شیر یا شکر به قهوه اضافه می‌کنید یا طعم قوی‌تر می‌خواهید، متوسط برایتان
                    مناسب‌تر است. در ویزارد بالای همین صفحه می‌توانید قهوه‌ی دلخواه خود را
                    قدم‌به‌قدم بسازید.
                </p>

                <a
                    href="#"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-caramel hover:text-roast transition-colors"
                >
                    ادامه‌ی مطلب
                    <ArrowIcon className="w-4 h-4 rtl:-scale-x-100" />
                </a>
            </article>
        </section>
    );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
