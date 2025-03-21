import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import TransactionTable from "../UI/TransactionTable";
import PaymentModal from "../Modals/PaymentModal";
import { api } from "../../service/api";
import { formatPrice } from "../../function/function";

interface onFetchProductInterface {
  name: string;
  amount: number;
  price: number;
  product_id: string;
}

interface CustomerData {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  cash_bon: number;
}

const Transaction = () => {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [cashierId, setCashierId] = useState<string>("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [cashBon, setCashBon] = useState<number>(0);
  const [productData, setProductData] = useState<onFetchProductInterface[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const fetchUserResponse = await api.getCurrentUser();
      if (fetchUserResponse) {
        setCashierId(fetchUserResponse.id);
      }
    };

    const fetchCustomer = async () => {
      const fetchCustomerResponse = await api.fetchCustomer();
      if (fetchCustomerResponse?.status === 200) {
        setCustomerData(fetchCustomerResponse.data as CustomerData[]);
      }
    };

    fetchCurrentUser();
    fetchCustomer();
  }, []);

  const fetchProduct = (data: onFetchProductInterface[], total: number) => {
    setGrandTotal(total);
    setProductData(data);
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhoneNumber("");
    setCashBon(0);
    setCustomerId("");
  };

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Silakan pilih atau masukkan pelanggan terlebih dahulu.");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  return (
    <div id="addInventory" className="w-full flex flex-col items-center p-4 max-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold underline mb-4">Transaksi</h1>
      <form onSubmit={handleOpenPaymentModal} className="border rounded-lg p-5 shadow-md grid grid-cols-2 gap-4 w-full max-w-4xl bg-white">
        <div>
          <div className="flex flex-col gap-2">
            <label htmlFor="customerName" className="font-medium">Nama Pelanggan:</label>
            <Autocomplete
              id="customerName"
              freeSolo
              value={customerName}
              options={customerData.map((option) => option.name)}
              onInputChange={(_event, newValue) => {
                setCustomerName(newValue);
                const selectedCustomer = customerData.find((customer) => customer.name === newValue);
                if (selectedCustomer) {
                  setCustomerId(selectedCustomer.id);
                  setCustomerPhoneNumber(selectedCustomer.phone_number);
                  setCustomerAddress(selectedCustomer.address);
                  setCashBon(selectedCustomer.cash_bon);
                } else {
                  setCustomerId("");
                  setCustomerPhoneNumber("");
                  setCustomerAddress("");
                  setCashBon(0);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Nama Pelanggan" required />}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="customerPhoneNumber" className="font-medium">Nomor Telepon:</label>
            <TextField
              id="customerPhoneNumber"
              type="number"
              value={customerPhoneNumber ?? ""}
              onChange={(e) => setCustomerPhoneNumber(e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="cashBon" className="font-medium">Cash Bon (Hutang Pelanggan):</label>
            <span id="cashBon" className="border rounded-lg px-3 py-4">{formatPrice(cashBon)}</span>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <label htmlFor="customerAddress" className="font-medium">Alamat:</label>
            <TextField
              id="customerAddress"
              type="text"
              value={customerAddress ?? ""}
              onChange={(e) => setCustomerAddress(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        <div className="col-span-2">
          <TransactionTable onFetchProduct={fetchProduct} />
        </div>

        <div className="col-span-2 flex justify-between">
          <button type="button" onClick={resetForm} className="rounded-lg bg-gray-500 hover:bg-gray-600 text-white px-6 py-2">
            Reset
          </button>
          <button type="submit" className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
            Submit
          </button>
        </div>
      </form>

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customerName={customerName}
        customerPhone={customerPhoneNumber}
        customerAddress={customerAddress}
        cashBon={cashBon}
        grandTotal={grandTotal}
        cashierId={cashierId}
        customerId={customerId}
        productData={productData}
      />
    </div>
  );
};

export default Transaction;
