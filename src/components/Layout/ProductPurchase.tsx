import React, { useEffect, useState } from "react";
import { formatPrice } from "../../function.tsx/function";
import { Autocomplete, TextField } from "@mui/material";
import { api } from "../../service/api"
import { dbProducts } from "../interface/dbInterfaces";
import supabase  from "../../util/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface ProductPurchase{
  name: string;
  quantity_purchased: number;
  buying_price: number;
  product_id: string;
  subtotal: number;
  current_stock:number;
  avg_price:number
}

const ProductPurchase: React.FC = () => {
  const [originalProducts, setOriginalProducts] = useState<dbProducts[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductPurchase[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const productPurchasesSubscription = supabase
      .channel("product_purchases_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "product_purchases" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("insert product_purchases", payload);
          setSelectedProducts((prev) => [...prev, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "product_purchases" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("update product_purchases", payload);
          setSelectedProducts((prev) =>
            prev.map((item) =>
              item.product_id === payload.new.product_id ? payload.new : item
            )
          );
        }
      )
      .subscribe();
  
    const productsSubscription = supabase
      .channel("products_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "products" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("insert products", payload);
          setOriginalProducts((prev) => [...prev, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("update products", payload);
          setOriginalProducts((prev) =>
            prev.map((item) => (item.id === payload.new.id ? payload.new : item))
          );
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(productPurchasesSubscription);
      supabase.removeChannel(productsSubscription);
    };
  }, []);

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
  }, [ selectedProducts]);

  const handleProductChange = (index: number, value: string) => {
    const trimmedValue = value.trim(); // Ensure no extra spaces
    const product = originalProducts.find((p) => p.name === trimmedValue);
    console.log(product)
    if(product === undefined) return;
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              name: product?.name || "",
              buying_price: 0,
              product_id: product?.id || "",
              subtotal: item.quantity_purchased * (item.buying_price || 0),
              current_stock: product?.stock,
              avg_price: product?.avg_buy_price
            }
          : item
      )
    );
  };
  
  

  const handleSubmit = async () => {
    confirm("Apakah data sudah benar?");
    const purchaseProductsPromise = selectedProducts.map(async (item) => {
      return await api.addProductPurchases(item);
    });
  
    const updateProductPromise = selectedProducts.map(async (item) => {
      console.log("Old avg_price:", item.avg_price);
      console.log("Old stock:", item.current_stock);
      console.log("New buying_price:", item.buying_price);
      console.log("New quantity_purchased:", item.quantity_purchased);
  
      const newStock = item.current_stock + item.quantity_purchased;
      const totalOldCost = item.current_stock * item.avg_price;
      const totalNewCost = item.quantity_purchased * item.buying_price;
      console.log(totalNewCost);
      const newAvgPrice = Math.floor((totalOldCost + totalNewCost) / newStock);
      console.log(newAvgPrice);
  
      return await api.updateProductPricenStock({
        id: item.product_id,
        avg_buy_price: newAvgPrice,
        stock: newStock,
      });
    });
  
    console.log(selectedProducts);
    const purchaseProductsResponse = await Promise.all(purchaseProductsPromise);
    const hasErrors = purchaseProductsResponse.some(
      (res) => !res || res.status !== 200
    );
  
    if (hasErrors) {
      alert("Insert data pembelian produk gagal");
      console.log("service error ", purchaseProductsResponse);
      return;
    }
  
    const updateProductResponse = await Promise.all(updateProductPromise);
    const hasErrors2 = updateProductResponse.some(
      (res) => !res || res.status !== 200
    );
  
    if (hasErrors2) {
      alert("Update product stock failed");
      console.log("service error ", updateProductResponse);
      return;
    }
    
    alert("Insert data pembelian produk berhasil");
  };
 

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { name: "", quantity_purchased: 0, buying_price: 0, product_id: '', subtotal: 0 , current_stock:0, avg_price:0}]);
  };

  const handleAmountChange = (index: number, value: number) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity_purchased: value, subtotal: value * (item.buying_price || 0)} : item
      )
    );
  };

  const handlePriceChange = (index:number, value:number) => {
    setSelectedProducts((prev) =>
    prev.map((item,i)=>
    i===index? {...item, buying_price:value, subtotal:value * (item.quantity_purchased||0)} : item))
  }

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-h-screen overflow-y-auto shadow-lg rounded-lg">
      <h1 className="text-lg font-semibold my-4 text-gray-700">Pembelian Produk</h1>
      <div className="w-full">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-5 text-lg font-semibold text-center border-b pb-2">
          <span>Nama</span>
          <span>Jumlah Pembelian</span>
          <span>Harga</span>
          <span>Subtotal</span>
        </div>

        {/* Products Selection */}
        {selectedProducts.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 my-4 items-center text-gray-800">
            {/* Product Select */}
            <Autocomplete
              id="productName"
              freeSolo
              value={item.name}
              options={originalProducts.map((option) => option.name)}
              onInputChange={(_event, newValue) => handleProductChange(index, newValue || "")} // ✅ Handle manual typing
              renderInput={(params) => <TextField {...params} label="Nama Produk" required />}
            />

            {/* Jumlah pembelian */}
            <span className="md:hidden text-center font-semibold text-sm">Jumlah Pembelian :</span>
            <TextField
              type="number"
              className="text-center font-semibold text-sm md:text-base border rounded"
              value={item.quantity_purchased}
              onChange={(e) => handleAmountChange(index, parseInt(e.target.value))}
              label="Quantity Pembelian"
            />

            {/* Price */}
            <span className="md:hidden text-center font-semibold text-sm">Harga Beli :</span>
            <TextField
              type="number"
              className="text-center font-semibold text-sm md:text-base border rounded"
              value={item.buying_price}
              onChange={(e) => handlePriceChange(index, parseInt(e.target.value))}
              label="Harga Beli"
            />

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
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg font-bold p-2 mt-4 w-full md:w-auto"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg font-bold p-2 mt-4 w-full md:w-auto"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex justify-end font-bold text-gray-800 mt-4 text-lg">
        <span>Total: Rp.{formatPrice(totalAmount)},-</span>
      </div>
    </div>
  );
};

export default ProductPurchase;

