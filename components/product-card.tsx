export interface ProductCardProps {
  name: string;
  weight: string;
  price: string;
  grade: string;
  gradeType: "nik" | "motevaset";
  image: string;
  type: string;
}

export function ProductCard({
  name,
  weight,
  price,
  grade,
  gradeType,
  image,
  type,
}: ProductCardProps) {
  const gradeBadgeClass =
    gradeType === "nik" ? "badge-grade-nik" : "badge-grade-motevaset";

  return (
    <article className="group shrink-0 w-[210px] rounded-2xl border border-latte bg-foam p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-beige-dark hover:shadow-md">
      {/* Product image / emoji badge */}
      <div className="w-16 h-16 rounded-full bg-beige flex items-center justify-center text-3xl mx-auto mb-3 transition-transform duration-200 group-hover:scale-110">
        {image}
      </div>

      {/* Type label */}
      <div className="text-[0.6rem] font-semibold uppercase tracking-widest text-mocha text-center">
        {type}
      </div>

      {/* Name — fixed height keeps card rows aligned */}
      <h3 className="mt-1 text-sm font-bold text-ink leading-snug min-h-10 flex items-center justify-center">
        {name}
      </h3>

      {/* Weight */}
      {weight && weight !== "—" && (
        <div className="mt-1 text-xs font-medium text-clay">{weight}</div>
      )}

      {/* Price */}
      <div className="mt-3">
        {price && price !== "—" ? (
          <span className="text-lg font-extrabold text-ink tracking-tight">
            {price}
            <span className="ms-1 text-[0.65rem] font-medium text-mocha">تومان</span>
          </span>
        ) : (
          <span className="text-sm text-mocha">به‌زودی</span>
        )}
      </div>

      {/* Grade badge */}
      <div className="mt-3 flex justify-center">
        <span
          className={`text-[0.65rem] font-semibold px-2.5 py-1 rounded-full tracking-wide ${gradeBadgeClass}`}
        >
          درجه بسته: {grade}
        </span>
      </div>
    </article>
  );
}
