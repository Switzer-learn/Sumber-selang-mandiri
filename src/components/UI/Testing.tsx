import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";

const Testing = () =>{
    const [productData, setProductData] = useState(data)

    const handleOnChange = (field: string, newValue: string, index: number) => {
        console.log(field, newValue, index);
        setProductData(
            productData.map((item, i) => 
                i === index ? 
                field === "name" ? 
                {...item, name: newValue} :
                field === "amount" ? 
                {...item, amount: parseInt(newValue), total: item.price * parseInt(newValue)} :
                item
                : item
            )
        );
    }
    return(
    <div className="bg-slate-50">
        <h2>Produk</h2>
        <div className="grid grid-cols-6 font-semibold">
            <span className="border text-center">Nama Produk</span>
            <span className="border text-center">Harga</span>
            <span className="border text-center">Jumlah</span>
            <span className="border text-center">Total Harga</span>
            <span className="border text-center">Sisa Stok</span>
            <span className="border text-center">Hapus</span>
        </div>
        {productData.map((item,index) =>(
            <div className="grid grid-cols-6" key={index}>
                <Autocomplete
                    id="productName"
                    freeSolo
                    value={item.name}
                    options={productData.map((option) => option.name)}
                    onInputChange={(_event,newValue) => handleOnChange("name",newValue,index)}
                    renderInput={(params) => (
                        <TextField {...params} required />
                )}
                />
                <input type="number" className="border text-center" disabled value={item.price}/>
                <input type="number" className="border text-center" placeholder="Masukkan jumlah" onChange={(e) => handleOnChange("amount",e.target.value,index)}/>
                <input type="number" className="border text-center" disabled value={item.total}/>
                <input type="number" className="border text-center" disabled value={item.stock}/>
                <button className="border">
                    <FaTrash className="mx-auto size-6 text-red-600 hover:text-red-700" />
                </button>
            </div>
        ))}
    </div>
    );
}

export default Testing;


    const data = [{
        name: "Indomie Goreng",
        price: 15000,
        amount: 0,
        total: 0,
        stock: 100,

    },{
        name: "Indomie Kuah",
        price: 12000,
        amount: 0,
        total: 0,
        stock: 100,
    },{
        name: "Indomie Rendang",
        price: 18000,
        amount: 0,
        total: 0,
        stock: 100,
    }];
