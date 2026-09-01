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
    <div className="product-card shrink-0 min-w-50 max-w-55 border border-[#e0dcd6] p-4 rounded-lg bg-transparent flex flex-col items-center justify-start">
      <div className="w-14 h-14 rounded-full bg-[#f2efe9] flex items-center justify-center text-2xl mx-auto mb-3">
        {image}
      </div>
      <div className="text-[0.55rem] uppercase tracking-wider text-[#8a7d6e] font-semibold text-center mb-0.5">
        {type}
      </div>
      <h3 className="text-sm font-bold text-[#1f1b17] text-center leading-tight min-h-10 flex items-center justify-center">
        {name}
      </h3>
      {weight && weight !== "—" && (
        <div className="text-[0.65rem] text-[#6b6154] text-center mt-0.5 font-medium">
          {weight}
        </div>
      )}
      <div className="mt-2 text-center">
        {price && price !== "—" ? (
          <span className="text-base font-bold text-[#1f1b17] tracking-tight">
            {price}
            <span className="text-[0.6rem] font-normal text-[#8a7d6e] mr-0.5">
              تومان
            </span>
          </span>
        ) : (
          <span className="text-xs text-[#8a7d6e]">—</span>
        )}
      </div>
      <div className="mt-2.5 flex justify-center">
        <span className={`text-[0.6rem] font-medium px-2.5 py-0.5 rounded-full tracking-wide ${gradeBadgeClass}`}>
          درجه بسته: {grade}
        </span>
      </div>
    </div>
  );
}