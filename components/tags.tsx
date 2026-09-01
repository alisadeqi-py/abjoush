"use client";

const tags = [
    "جایهای جدید و گردشگری در ایران",
    "دیدن فرهنگ و هنر در ایران",
    "مکان های تفریحی رایگان ایران",
    "تجربیات روزانه در ایران",
    "مجابه‌بندی در ایران",
    "فروشگاه‌ها در ایران",
    "خرید کردن در ایران",
    "خودکاران در ایران",
    "پارک های ایران",
    "سواحل بکر در ایران",
    "تاریخ گردی در ایران",
    "تاریخ وقوع بحران",
    "روستاگردی در ایران",
];

export function Tags() {
    return (
        <section className="w-full mt-16 bg-white rounded-3xl border border-[#eae5de] shadow-sm">
            <div className="bg-[#f0f0f0]">
                <h2 className="text-2xl font-bold text-[#1f1b17] tracking-tight mb-6 p-3 md:p-2">
                    برچسب ها
                </h2>
            </div>

            <div className="flex flex-wrap gap-3 p-3 md:p-2">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        className="px-4 py-2 bg-[#f2efe9] text-[#4b3f34] text-sm rounded-full border border-transparent hover:border-[#d4cbc0] hover:bg-[#e6dfd6] transition-all duration-200 hover:shadow-sm"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </section>
    );
}