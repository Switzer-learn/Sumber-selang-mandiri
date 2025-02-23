import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import TransactionTable from "../UI/TransactionTable";
import { currentDate } from "../../function.tsx/function";

interface SelectedProduct{
    name: string;
    amount: number;
    price: number;
    product_id: number;
}

interface CustomerData{
    customer_id: string;
    customer_name: string;
    customer_phone_number: number;
    customer_address: string;
    hutang_customer: number;
}

const Transaction = () =>{
    const [customerName,setCustomerName] = useState<string>("");
    const [customerData,setCustomerData] = useState<CustomerData[]>([]);
    const [customerId,setCustomerId] = useState<string>("");
    const [cashierName,setCashierName] = useState<string>("");
    const [customerPhoneNumber,setCustomerPhoneNumber] = useState<number>(0);
    const [customerAddress,setCustomerAddress] = useState<string>("");
    const [hutangCustomer,setHutangCustomer] = useState<number>(0);
    const [productData,setProductData] = useState<SelectedProduct[]>([]);
    const [grandTotal,setGrandTotal] = useState<number>(0);
    const [metodePembayaran,setMetodePembayaran] = useState<string>("Cash");

    useEffect(()=>{
        setCashierName("");
    },[])

    useEffect(()=>{
        setCustomerData([]);
    },[customerName])

    const handleSubmit =(e:React.FormEvent)=>{
        e.preventDefault();
        const formData = {
            customer_id:customerId,
            cashier_name:cashierName,
            customer_name:customerName,
            customer_phone_number:customerPhoneNumber,
            customer_address:customerAddress,
            hutang_customer:hutangCustomer,
            product_data:productData,
            grand_total:grandTotal,
            metode_pembayaran:metodePembayaran,
            date:currentDate()
        }
        console.log("submit Pressed")
        console.log(formData);
    }

    

    const fetchProduct = (data:SelectedProduct[],grandTotal:number) =>{
        console.log(data,grandTotal);
        setGrandTotal(grandTotal);
        setProductData(data);
    }

    const resetForm = () =>{
        setCustomerName("");
        setCustomerAddress("");
        setCustomerPhoneNumber(0);
        setHutangCustomer(0);
        setCustomerId("");
    }

    return(
        <div id="addInventory" className="flex flex-col items-center p-4 max-h-screen overflow-y-auto">
            <h1 className="text-2xl font-bold underline mb-4">Transaksi</h1>
              <form
                onSubmit={handleSubmit}
                className="border rounded-lg p-5 shadow-md grid grid-cols-2 gap-4 w-full max-w-4xl bg-white"
              >
                <div>
                    {/* Nama Customer */}
                    <div className="flex flex-col gap-2">
                    <label htmlFor="customerName" className="font-medium">
                        Nama Pelanggan:
                    </label>
                    <Autocomplete
                        id="customerName"
                        freeSolo
                        value={customerName}
                        options={customerData.map((option) => option.customer_name)}
                        onInputChange={(_event, newValue) => setCustomerName(newValue)}
                        renderInput={(params) => (
                        <TextField {...params} label="Nama Pelanggan" required />
                        )}
                    />
                    </div>
        
                {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="customerPhoneNumber" className="font-medium">
                            Nomor Telepon :
                        </label>
                        <TextField
                            id="customerPhoneNumber"
                            type="number"
                            value={customerPhoneNumber ?? ""}
                            onChange={(e) => setCustomerPhoneNumber(e.target.value ? parseInt(e.target.value) : 0)}
                            label="Nomor Telepon"
                            required
                        />
                    </div>

                    {/* Hutang */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="hutangCustomer" className="font-medium">
                            Hutang Pelanggan: <span className="text-sm text-gray-500">(sisa hutang customer)</span>
                        </label>
                        <span
                            id="hutangCustomer"
                            className="border rounded-lg px-3 py-4"
                        >{hutangCustomer}</span>
                    </div>
                </div>
                <div>
                        {/* ID Customer */}
                    <div className="flex flex-col gap-2">
                    <label htmlFor="inventoryID" className="font-medium">
                        ID Pelanggan: <span className="text-sm text-gray-500">(jika ingin memasukan data baru pastikan ID Pelanggan kosong)</span>
                    </label>
                    <input
                        id="inventoryID"
                        type="text"
                        value={customerId}
                        disabled
                        className="px-3 py-4 border rounded"
                    />
                    </div>
                    
                    {/* Alamat */}
                    <div className="flex flex-col gap-2">
                    <label htmlFor="customerAddress" className="font-medium">
                        Alamat:
                    </label>
                    <TextField
                        id="customerAddress"
                        type="text"
                        value={customerAddress ?? ""}
                        onChange={(e) => setCustomerAddress(e.target.value ? e.target.value : "")}
                        label="Alamat"
                        multiline
                        rows={3}
                        required
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-medium">Metode Pembayaran</span>
                        <select className="border rounded-lg px-3 py-4" value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)}>
                            <option value="Cash">Cash</option>
                            <option value="Bon">Bon</option>
                        </select>
                    </div>
                </div>
                <div className="col-span-2">
                  <TransactionTable onFetchProduct={fetchProduct} />
                </div>
                {/* Buttons */}
                <div className="col-span-2 flex justify-between">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
    )
}

export default Transaction;