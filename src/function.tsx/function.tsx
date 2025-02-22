export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 0,
    }).format(price);
};