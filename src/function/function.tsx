export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 0,
    }).format(price);
};

export const currentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};