import React, { useEffect, useState } from "react";
import { formatPrice } from "../../function.tsx/function";
import { Autocomplete, TextField } from "@mui/material";
import { SelectedProduct } from "../interface/SelectedProductInterface";
import { api } from "../../service/api"
import { dbProducts } from "../interface/dbInterfaces";
interface TransactionTableProps {
  onFetchProduct: (
    products: { name: string; amount: number; price: number; product_id: string }[],
    grandTotal: number
  ) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ onFetchProduct }) => {
  const [originalProducts, setOriginalProducts] = useState<dbProducts[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
        const fetchProducts = async()=>{
           const fetchProductsResponse = await api.fetchProducts();
           console.log(fetchProductsResponse?.data);
           if(fetchProductsResponse){
               if(fetchProductsResponse.status===200){
                   setOriginalProducts(fetchProductsResponse.data);
               }else{
                   alert("check console");
                   console.log(fetchProductsResponse.message);
               }
           }else{
               alert("failed to fetch product");
           }
       }
      fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = selectedProducts.reduce((acc, curr) => acc + curr.subtotal, 0);
    setTotalAmount(newTotal);
    onFetchProduct(selectedProducts, newTotal);
  }, [onFetchProduct, selectedProducts]);

  const handleProductChange = (index: number, value: string) => {
    const product = originalProducts.find((p) => p.name === value);
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              name: product?.name || "",
              price: product?.sell_price || 0,
              stock: product?.stock || 0,
              product_id: product?.id || "",
              subtotal: item.amount * (product?.sell_price || 0),
            }
          : item
      )
    );
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { name: "", amount: 0, price: 0, product_id: '', subtotal: 0, stock: 0 }]);
  };

  const handleAmountChange = (index: number, value: number) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, amount: value, subtotal: value * item.price } : item
      )
    );
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-h-96 overflow-y-auto shadow-lg rounded-lg">
      <h1 className="text-lg font-semibold my-4 text-gray-700">Product Selection</h1>
      <div className="w-full">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 text-lg font-semibold text-center border-b pb-2">
          <span>Nama</span>
          <span>Stok</span>
          <span>Jumlah</span>
          <span>Harga</span>
          <span>Subtotal</span>
        </div>

        {/* Products Selection */}
        {selectedProducts.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 my-4 items-center text-gray-800">
            {/* Product Select */}
            <Autocomplete
              id="productName"
              freeSolo
              value={item.name}
              options={originalProducts.map((option) => option.name)}
              onInputChange={(_event, newValue) => handleProductChange(index, newValue)}
              renderInput={(params) => <TextField {...params} label="Pilih Produk" required />}
            />

            {/* Stock */}
            <span className="md:hidden text-center font-semibold text-sm">Sisa Stock :</span>
            <span className="text-center font-semibold text-sm md:text-base">{item.stock}</span>

            {/* Amount Change */}
            <span className="md:hidden text-center font-semibold text-sm">Jumlah :</span>
            <input
              type="number"
              value={item.amount}
              onChange={(e) => handleAmountChange(index, parseInt(e.target.value) || 0)}
              className="border p-2 rounded-lg shadow-md w-full"
            />

            {/* Price */}
            <span className="md:hidden text-center font-semibold text-sm">Harga Satuan :</span>
            <span className="text-center font-semibold text-sm md:text-base">Rp.{formatPrice(item.price)},-</span>

            {/* Subtotal */}
            <span className="md:hidden text-center font-semibold text-sm">Subtotal :</span>
            <span className="text-center font-semibold text-sm md:text-base">Rp.{formatPrice(item.subtotal)},-</span>

            {/* Remove Button */}
            <button
              type="button"
              className="bg-red-500 text-white p-2 w-full md:w-28 text-center rounded-lg border-b-2 mb-4 md:mb-0 md:border-b-0"
              onClick={() => handleRemoveProduct(index)}
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add Product Button */}
        <button
          type="button"
          className="bg-green-500 text-white rounded-lg shadow-lg font-bold p-2 mt-4 w-full md:w-auto"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>
      </div>

      {/* Total Amount */}
      <div className="flex justify-end font-bold text-gray-800 mt-4 text-lg">
        <span>Total: Rp.{formatPrice(totalAmount)},-</span>
      </div>
    </div>
  );
};

export default TransactionTable;

