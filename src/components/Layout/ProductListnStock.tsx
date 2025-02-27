import { useEffect, useState } from "react";
import { dbProducts } from "../interface/dbInterfaces";
import { formatPrice } from "../../function.tsx/function";
import { api } from "../../service/api";

const ProductListnStock = () => {
    const [productData, setProductData] = useState<dbProducts[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const fetchProductsResponse = await api.fetchProducts();
                if (fetchProductsResponse?.status === 200) {
                    setProductData(fetchProductsResponse.data);
                } else {
                    alert(fetchProductsResponse?.message || "Failed to fetch products");
                }
            } catch (error) {
                alert(error);
                alert("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const editProduct = (index: number) => {
        console.log(index);
    };

    const deleteProduct = (index: number) => {
        setProductData(productData.filter((_, i) => i !== index));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold text-center mb-4">Product List</h1>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">#</th>
                                <th className="py-3 px-6 text-left">Nama</th>
                                <th className="py-3 px-6 text-left">Stock</th>
                                <th className="py-3 px-6 text-left">Harga</th>
                                <th className="py-3 px-6 text-left">Update terakhir</th>
                                <th className="py-3 px-6 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {productData.map((product, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left">{index + 1}</td>
                                    <td className="py-3 px-6 text-left">{product.name}</td>
                                    <td className="py-3 px-6 text-left">{product.stock}</td>
                                    <td className="py-3 px-6 text-left">Rp.{formatPrice(product.sell_price)},-</td>
                                    <td className="py-3 px-6 text-left">{product.last_updated?.slice(0, 10)}</td>
                                    <td className="py-3 px-6 text-left space-y-2 md:space-x-2 md:space-y-0">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            onClick={() => editProduct(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => deleteProduct(index)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductListnStock;
