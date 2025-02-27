import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import TransactionTable from "../UI/TransactionTable";
import { currentDate } from "../../function.tsx/function";
import { api } from "../../service/api";

interface onFetchProductInterface{
    name:string,
    amount:number,
    price:number,
    product_id:string
}

interface CustomerData{
    id: string;
    name: string;
    phone_number: string;
    address: string;
    cash_bon: number;
}

const Transaction = () =>{
    const [customerName,setCustomerName] = useState<string>("");
    const [customerData,setCustomerData] = useState<CustomerData[]>([]);
    const [customerId,setCustomerId] = useState<string>("");
    const [cashierId,setCashierId] = useState<string>("");
    const [customerPhoneNumber,setCustomerPhoneNumber] = useState<string>("");
    const [customerAddress,setCustomerAddress] = useState<string>("");
    const [hutangCustomer,setHutangCustomer] = useState<number>(0);
    const [productData,setProductData] = useState<onFetchProductInterface[]>([]);
    const [grandTotal,setGrandTotal] = useState<number>(0);
    const [metodePembayaran,setMetodePembayaran] = useState<string>("Cash");

    useEffect(()=>{
        const fetchCurrentUser = async()=>{
            const fetchUserResponse = await api.getCurrentUser();
            if(fetchUserResponse){
                setCashierId(fetchUserResponse.id)
            }
        }
        const fetchCustomer = async()=>{
            const fetchCustomerResponse = await api.fetchCustomer();
            if(fetchCustomerResponse){
                if(fetchCustomerResponse.status===200){
                    if (fetchCustomerResponse.data) {
                      setCustomerData(fetchCustomerResponse.data as CustomerData[]);
                    }
                }
            }
        }
        fetchCurrentUser();
        fetchCustomer();
    },[])

    const fetchProduct = (data:onFetchProductInterface[],grandTotal:number) =>{
        setGrandTotal(grandTotal);
        setProductData(data);
    }

    const resetForm = () =>{
        setCustomerName("");
        setCustomerAddress("");
        setCustomerPhoneNumber("");
        setHutangCustomer(0);
        setCustomerId("");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!confirm("Apakah data sudah benar?")) {
            return; // Stop execution if user cancels
        }
    
        console.log("Submit Pressed");
    
        let finalCustomerId = customerId; 
        if (metodePembayaran === "Bon") {
            setHutangCustomer(prevHutang => prevHutang + grandTotal);
        }
    
        if (!customerId) {
            const addCustomerResponse = await api.addCustomer({
                name: customerName,
                phone_number: customerPhoneNumber,
                address: customerAddress,
                cash_bon:hutangCustomer
            });
    
            if (addCustomerResponse?.status === 200 && addCustomerResponse.data.length > 0) {
                finalCustomerId = addCustomerResponse.data[0].id;
                setCustomerId(finalCustomerId); 
            } else {
                alert("Gagal menambahkan pelanggan.");
                return;
            }
        }
    
        const transactionPayload = {
            customer_id: finalCustomerId,
            cashier_id: cashierId,
            grand_total: grandTotal,
            metode_pembayaran: metodePembayaran.toLowerCase(),
            date: currentDate(),
        };
    
        const addTransactionResponse = await api.addTransactions(transactionPayload);
    
        if (!addTransactionResponse || addTransactionResponse.status !== 200 || !addTransactionResponse.data.length) {
            alert("Gagal menambahkan transaksi.");
            console.error("Transaction error:", addTransactionResponse);
            return;
        }
    
        const transactionId = addTransactionResponse.data[0].id;
        console.log("Transaction ID:", transactionId);
    
        const addTransactionItemsPromise = productData.map(async (item) => {
            return api.addTransactionItems({
                transaction_id: transactionId,
                product_id: item.product_id,
                amount: item.amount,
                price: item.price
            });
        });
    
        const addTransactionItemsResponse = await Promise.all(addTransactionItemsPromise);
        const hasErrors = addTransactionItemsResponse.some(res => !res || res.status !== 200);
    
        if (hasErrors) {
            alert("Insert data pembelian produk gagal");
            console.log("Transaction items error:", addTransactionItemsResponse);
            return;
        }
    
        const updateStockPromises = productData.map(async (item) => {
            const productResponse = await api.fetchSingleProduct(item.product_id);
    
            if (productResponse?.status === 200 && productResponse.data) {
                const currentStock = productResponse.data.stock || 0;
                const newStock = currentStock - item.amount;
    
                return api.updateProductPricenStock({
                    id: item.product_id,
                    avg_buy_price: productResponse.data.avg_buy_price,
                    stock: newStock
                });
            }
            return null;
        });
    
        const updateStockResponses = await Promise.all(updateStockPromises);
        const hasStockErrors = updateStockResponses.some(res => !res || res.status !== 200);
    
        if (hasStockErrors) {
            alert("Gagal memperbarui stok produk");
            console.log("Stock update error:", updateStockResponses);
            return;
        }
    
        alert("Transaksi berhasil!");
    
        // Refresh page only on success
        window.location.reload();
    };
    
    

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
                        options={customerData.map((option) => option.name)}
                        onInputChange={(_event, newValue) => {
                            setCustomerName(newValue);

                            // Find the selected customer
                            const selectedCustomer = customerData.find((customer) => customer.name === newValue);
                            if (selectedCustomer) {
                                setCustomerId(selectedCustomer.id);
                                setCustomerPhoneNumber(selectedCustomer.phone_number);
                                setCustomerAddress(selectedCustomer.address);
                                setHutangCustomer(selectedCustomer.cash_bon);
                            } else {
                                // Clear values if the name doesn't match any customer
                                setCustomerId("");
                                setCustomerPhoneNumber("");
                                setCustomerAddress("");
                                setHutangCustomer(0);
                            }
                        }}
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
                            onChange={(e) => setCustomerPhoneNumber(e.target.value ? e.target.value : "")}
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