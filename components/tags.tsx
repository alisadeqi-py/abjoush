"use client";

const tags = [
    "خرید قهوه",
    "قهوه عربیکا",
    "قهوه روبستا",
    "اسپرسو ساز خانگی",
    "قهوه ترک",
    "قهوه دمی",
    "فرنچ پرس",
    "کلد برو",
    "قهوه سبوس‌خورده",
    "V60",
    "ایروپرس",
    "موکاپات",
    "قهوه تک خاستگاه",
    "کافئین کم",
];

export function Tags() {
    return (
        <section aria-label="برچسب‌ها" className="w-full mt-16 bg-foam rounded-3xl border border-latte shadow-sm overflow-hidden">
            <div className="bg-espresso">
                <h2 className="text-lg font-bold text-foam tracking-tight px-6 py-4">
                    برچسب‌های پرجست‌وجو
                </h2>
            </div>

            <div className="flex flex-wrap gap-2.5 p-5 md:p-6">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        className="px-4 py-2 bg-beige text-clay text-sm font-medium rounded-full border border-transparent hover:border-beige-dark hover:bg-beige-dark hover:text-ink transition-all duration-200"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </section>
    );
}
