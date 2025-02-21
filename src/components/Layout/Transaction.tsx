import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";



const Transaction = () =>{
    const [customerName,setCustomerName] = useState<string>("");
    const [customerData,setCustomerData] = useState<any[]>([]);
    const [customerId,setCustomerId] = useState<string>("");
    const [cashierName,setCashierName] = useState<string>("");
    const [customerPhoneNumber,setCustomerPhoneNumber] = useState<number>(0);
    const [customerAddress,setCustomerAddress] = useState<string>("");
    const [hutangCustomer,setHutangCustomer] = useState<number>(0);


    const handleSubmit =()=>{
        console.log("submit Pressed")
    }

    const resetForm = () =>{
        setCustomerName("");
        setCustomerAddress("");
        setCustomerPhoneNumber(0);
        setHutangCustomer(0);
        setCustomerId("");
    }

    return(
        <div id="addInventory" className="flex flex-col items-center p-4">
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
                            Hutang Pelanggan:
                        </label>
                        <TextField
                            id="hutangCustomer"
                            value={hutangCustomer}
                            onChange={(e) => setHutangCustomer(e.target.value ? parseInt(e.target.value) : 0)}
                            label="Hutang Pelanggan"
                        />
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