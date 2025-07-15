import { getStrapiMedia } from "@/lib/client-utils/media";
import { Category } from "@/types"; // Adjust the import path based on your project structure

// Define the props for this component
interface MenuRendererProps {
    Categories: Category[];
}

export default function MenuRenderer({ Categories }: MenuRendererProps) {
    if (!Categories || Categories.length === 0) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Nothing to see here yet, but check back soon for updates!</p>
            </div>
        );
    }

    // Define the desired order of categories
    const categoryOrder = [
        "coffee",
        "iced coffee",
        "tea",
        "iced tea",
        "extras",
        "smoothie",
        "probiotic",
        "porridge",
        "sweet breakfast",
        "savory breakfast",
        "snack",
        "beer",
        "softdrink",
        "cocktail",
        "liquor",
    ];

    // Create a map for quick lookup of category order
    const categoryOrderMap = new Map(
        categoryOrder.map((category, index) => [category, index])
    );

    // Sort the Categories array
    const sortedCategories = [...Categories].sort((a, b) => {
        const orderA = categoryOrderMap.get(a.name.toLowerCase()) ?? Infinity;
        const orderB = categoryOrderMap.get(b.name.toLowerCase()) ?? Infinity;
        return orderA - orderB;
    });

    return (
        <div id="menu" className="w-full bg-amara-dark-blue py-10 padding-x">
            <div className="w-full pb-10">
                <div className="md:p-5 overflow-hidden">
                    {sortedCategories.map((cat) => {
                        // --- START OF MODIFICATION ---
                        const sortedProducts = cat.products ? [...cat.products].sort((a, b) => {
                            // If 'a' is available and 'b' is not, 'a' comes first (return -1)
                            if (a.available && !b.available) {
                                return -1;
                            }
                            // If 'b' is available and 'a' is not, 'b' comes first (return 1)
                            if (!a.available && b.available) {
                                return 1;
                            }
                            // Otherwise, maintain original order (or sort alphabetically if desired)
                            return 0;
                        }) : [];
                        // --- END OF MODIFICATION ---

                        return (
                            <div key={cat.id}>
                                <div className="w-full p-16 xm:p-0 sm:p-0 flex justify-between rounded-[30px] gap-20 xm:gap-10 sm:gap-10 xm:flex-col sm:flex-col">
                                    <div className="w-full md:p-4">
                                        <h3 className="text-amara-gold text-6xl bolder font-hff text-center">{cat.name}</h3>
                                        {sortedProducts && sortedProducts.length > 0 ? ( // Use sortedProducts here
                                            <ul className="max-w-lg w-lg mt-4 mb-16 md:mb-0 mx-auto border border-amara-dark-blue rounded-lg pt-4 space-y-2 ">
                                                {sortedProducts.map((product) => ( // Use sortedProducts here
                                                    <li key={product.sku} className="px-4 py-2 mb-4 md:mb-0">
                                                        <div className="flex items-start justify-between border-b border-white pb-4 mb-4">
                                                            <div className="">
                                                                <div className="flex gap-2 items-center">
                                                                    <p className={product.available ? "text-white text-lg" : "text-gray-500 text-lg line-through"}>
                                                                        {product.name}
                                                                    </p>
                                                                    {!product.available && (
                                                                        <span className="text-sm no-underline px-2 border-2 rounded-md border-green-500 text-green-500 -rotate-12 -translate-y-4">Soon</span>
                                                                    )}
                                                                </div>
                                                                <p className={product.available ? "text-white text-sm opacity-50" : "text-gray-500 text-sm line-through"}>
                                                                    {product.description}
                                                                </p>
                                                            </div>
                                                            <span className={product.available ? "text-amara-gold font-bold" : "text-gray-500 font-bold line-through"}>
                                                                ${product.price}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-white text-lg">No products available in this category.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}