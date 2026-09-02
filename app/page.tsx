
import { BREW_METHODS, ORIGINS } from "@/lib/content";
import CoffeeWizard from "@/components/CoffeeWizard";
import { CoffeeShowcase } from "@/components/coffee-showcase";
import { Testimonials } from "@/components/testimonials";
import { AboutCoffee } from "@/components/about-coffee";
import { ReadMore } from "@/components/read-more";
import { CategoryFilter } from "@/components/category-filter";
import { FAQ } from "@/components/faq";
import { Tags } from "@/components/tags";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <CoffeeWizard brewMethods={BREW_METHODS} origins={ORIGINS} />
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <CategoryFilter />
        <CoffeeShowcase
          sectionId="products"
          title="پرفروش ترین ها"
          subtitle="قهوه‌ای برای هر سلیقه"
        />
        <CoffeeShowcase title="جدیدترین ها" subtitle="قهوه‌ای برای کشف کردن" />
        <CoffeeShowcase title="پیشنهاد ویژه" subtitle="قهوه‌ای برای علاقه‌مندان" />
        <CoffeeShowcase title="محبوب ترین ها" subtitle="قهوه‌ای برای هر سلیقه" />
        <Testimonials />
        <AboutCoffee />
        <ReadMore />
        <FAQ />
        <Tags />
      </div>
    </main>
  );
}