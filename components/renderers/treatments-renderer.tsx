import { Treatment } from "@/types";

// --- HELPER: PRICE FORMATTER ---
const formatPrice = (amount: number, locale: string) => {
  if (locale === 'kh') {
    const riel = amount * 4000;
    return `${riel.toLocaleString()} ៛`;
  }
  return `${amount}$`;
};

// --- COMPONENT: STANDARD TABLE ---
const TreatmentCategorySection = ({ category, treatments, currentLocale }: { category: string, treatments: Treatment[], currentLocale: string }) => {
  const durations = [60, 90, 120];
  return (
    <div className="w-full max-w-6xl px-4 md:px-8 mb-16">
      <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white my-10 md:my-16 pb-8 md:pb-16 capitalize font-agr">{category}</h2>
      <div className="hidden md:grid lg:grid xl:grid 2xl:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 2xl:grid-cols-12 gap-4 mb-6 text-lotus-bronze font-medium text-sm uppercase tracking-wide border-b border-lotus-gold pb-2">
        <div className="md:col-span-9 lg:col-span-9 xl:col-span-9 2xl:col-span-9"></div>
        {durations.map((min) => (
          <div key={min} className="md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 text-center">{min}min</div>
        ))}
      </div>
      <div className="flex flex-col gap-10 md:gap-6">
        {treatments.map((item) => {
          const displayTitle = (currentLocale === 'kh' && item.khTitle) ? item.khTitle : item.title;
          const displayDescription = (currentLocale === 'kh' && item.khDescription) ? item.khDescription : item.description;
          return (
            <div key={item.id} className="group w-full border-b border-white pb-6 md:border-none md:pb-0">
              <div className="flex flex-col md:grid lg:grid xl:grid 2xl:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 2xl:grid-cols-12 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-4 md:items-baseline lg:items-baseline xl:items-baseline 2xl:items-baseline">
                <div className="w-full md:col-span-9 lg:col-span-9 xl:col-span-9 2xl:col-span-9 mb-4 md:mb-0">
                  <h3 className="text-2xl font-semibold text-white mb-2">{displayTitle}</h3>
                  <p className="text-white text-base md:text-lg leading-relaxed max-w-xl">{displayDescription}</p>
                </div>
                {durations.map((min) => {
                  const pkg = item.packages?.find((p) => p.minutes === min);
                  return (
                    <div key={min} className="hidden md:flex lg:flex xl:flex 2xl:flex md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 justify-center items-center text-gray-300">
                      {pkg ? (
                        <div className="flex flex-col items-center leading-tight">
                          {pkg.discountedPrice ? (
                            <>
                              <span className="text-lotus-bronze font-bold whitespace-nowrap text-lg">{formatPrice(pkg.discountedPrice, currentLocale)}</span>
                              <span className="text-xs text-gray-300 line-through whitespace-nowrap">{formatPrice(pkg.price, currentLocale)}</span>
                            </>
                          ) : (
                            <span className="whitespace-nowrap font-medium text-white text-lg">{formatPrice(pkg.price, currentLocale)}</span>
                          )}
                        </div>
                      ) : <span className="text-gray-600">-</span>}
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-3 mt-2 md:hidden lg:hidden xl:hidden 2xl:hidden">
                  {item.packages?.filter(p => p.minutes >= 60).sort((a, b) => a.minutes - b.minutes).map((pkg) => (
                    <div key={pkg.id} className="px-3 py-2 rounded border border-lotus-gold flex items-center gap-2">
                      <span className="text-lotus-bronze font-semibold text-sm">{pkg.minutes} min</span>
                      {pkg.discountedPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-white font-bold text-sm">{formatPrice(pkg.discountedPrice, currentLocale)}</span>
                          <span className="text-gray-300 text-xs line-through">{formatPrice(pkg.price, currentLocale)}</span>
                        </div>
                      ) : (
                        <span className="text-white font-bold text-sm">{formatPrice(pkg.price, currentLocale)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- COMPONENTE BODYCARE ---
const BodycareCategorySection = ({ category, treatments, currentLocale }: { category: string, treatments: Treatment[], currentLocale: string }) => {
  return (
    <div className="w-full max-w-6xl px-4 md:px-8 mb-16">
      <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white my-10 md:my-16 pb-8 md:pb-16 capitalize font-agr">{category}</h2>
      <div className="flex flex-col gap-12">
        {treatments.map((item) => {
          const displayTitle = (currentLocale === 'kh' && item.khTitle) ? item.khTitle : item.title;
          const displayDescription = (currentLocale === 'kh' && item.khDescription) ? item.khDescription : item.description;
          const pkg = item.packages && item.packages.length > 0 ? item.packages[0] : null;
          return (
            <div key={item.id} className="flex flex-col border-b border-white pb-8 last:border-none">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-3 gap-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-white">{displayTitle}</h3>
                {pkg && (
                  <div className="flex items-baseline gap-3">
                    {pkg && pkg.minutes > 0 && (
                      <div className="self-start text-lotus-bronze/80 text-sm font-medium border border-lotus-gold/30 px-3 py-1 rounded">Duration: {pkg.minutes} min</div>
                    )}
                    {pkg.discountedPrice ? (
                      <>
                        <span className="text-gray-300 text-sm line-through">{formatPrice(pkg.price, currentLocale)}</span>
                        <span className="text-lotus-bronze font-bold text-xl md:text-2xl">{formatPrice(pkg.discountedPrice, currentLocale)}</span>
                      </>
                    ) : (
                      <span className="text-white font-bold text-xl md:text-2xl">{formatPrice(pkg.price, currentLocale)}</span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-white text-base md:text-lg leading-relaxed max-w-3xl mb-4">{displayDescription}</p>

            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- CLIENT COMPONENT PRINCIPALE ---
// Riceve i dati come props, non fa fetch!
interface TreatmentsRendererProps {
  treatmentsData: Record<string, Treatment[]>;
  locale: string;
}

export default function TreatmentsRenderer({ treatmentsData, locale }: TreatmentsRendererProps) {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center mb-16 pt-10 min-h-[50vh] bg-lotus-blue">
        {Object.keys(treatmentsData).length > 0 ? (
          Object.entries(treatmentsData).map(([category, items]) => {
            if (category === 'Bodycare and Beauty') {
              return <BodycareCategorySection key={category} category={category} treatments={items} currentLocale={locale} />;
            }
            return <TreatmentCategorySection key={category} category={category} treatments={items} currentLocale={locale} />;
          })
        ) : (
          <p className="text-gray-400">No treatments found.</p>
        )}
      </div>
    </>
  );
}