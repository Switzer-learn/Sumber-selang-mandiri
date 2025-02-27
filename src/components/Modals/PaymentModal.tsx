import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { api } from "../../service/api";
import { currentDate } from "../../function.tsx/function";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  cashBon: number;
  grandTotal: number;
  cashierId: string;
  customerId: string;
  customerAddress:string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productData: any[];
}

const PaymentModal = ({
  open,
  onClose,
  customerName,
  customerPhone,
  customerAddress,
  cashBon,
  grandTotal,
  cashierId,
  productData,
}: PaymentModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [remainingCashBon, setRemainingCashBon] = useState<number>(cashBon);
  const [change, setChange] = useState<number>(0);
  const [newLoan, setNewLoan] = useState<number>(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setAmount(newAmount);
  
    const difference = newAmount - grandTotal; // Amount paid minus total
  
    if (difference >= 0) {
      // Overpayment or exact payment
      if (cashBon > 0) {
        const remainingDebt = Math.max(cashBon - difference, 0); // Deduct cashBon first
        const newChange = difference - (cashBon - remainingDebt); // Calculate change after clearing debt
        setRemainingCashBon(remainingDebt);
        setChange(newChange);
      } else {
        setRemainingCashBon(0);
        setChange(difference);
      }
      setNewLoan(0);
    } else {
      // Underpayment (loan case)
      setChange(0);
      setNewLoan(Math.abs(difference)); // Remaining amount becomes new loan
      setRemainingCashBon(cashBon + Math.abs(difference)); // Increase cashBon
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!confirm("Apakah data sudah benar?")) return;
  
    const finalCashBon = remainingCashBon; // Use the updated cash bon
  
    // 1. Upsert Customer (Get or Create Customer ID)
    const customerResponse = await api.addCustomer({
      name: customerName,
      phone_number: customerPhone,
      address: customerAddress,
      cash_bon: finalCashBon, // Update with new cash bon value
    });
  
    if (!customerResponse || customerResponse.status !== 200 || !customerResponse.data[0]) {
      alert("Gagal memperbarui data pelanggan.");
      return;
    }
  
    const updatedCustomerId = customerResponse.data[0].id; // Get the correct customer ID
  
    // 2. Create Transaction
    const transactionPayload = {
      customer_id: updatedCustomerId,
      cashier_id: cashierId,
      grand_total: grandTotal,
      metode_pembayaran: "cash",
      date: currentDate(),
    };
  
    const addTransactionResponse = await api.addTransactions(transactionPayload);
  
    if (!addTransactionResponse || addTransactionResponse.status !== 200) {
      alert("Gagal menambahkan transaksi.");
      return;
    }
  
    const transactionId = addTransactionResponse.data[0].id;
  
    // 3. Add Transaction Items and Update Stock
    await Promise.all(
      productData.map(async (item) => {
        // Reduce stock and keep avg_buy_price unchanged
        await api.addTransactionItems({
          transaction_id: transactionId,
          product_id: item.product_id,
          amount: item.amount,
          price: item.price,
        });
  
        // Fetch current stock
        const newStock = Math.max(item.stock - item.amount, 0); // Ensure stock doesn't go negative
  
        await api.updateProductPricenStock({
          id: item.product_id,
          avg_buy_price: item.avg_buy_price, // Keep the same
          stock: newStock,
        });
      })
    );
  
    alert("Transaksi berhasil! Stok diperbarui.");
    setRemainingCashBon(finalCashBon);
    onClose();
    window.location.reload();
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="p-5 bg-white rounded-lg shadow-lg w-96 mx-auto mt-20">
        <h2 className="text-xl font-bold mb-4">Pembayaran</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Nama Pelanggan" value={customerName} disabled fullWidth />
          <TextField label="Nomor Telepon" value={customerPhone} disabled fullWidth />
          <TextField label="Total Bayar" value={grandTotal} disabled fullWidth />
          <TextField label="Cash Bon Sebelumnya" value={cashBon} disabled fullWidth />
          <TextField
            label="Jumlah Bayar"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
            required
          />

          {change > 0 && <TextField label="Kembalian" value={change} disabled fullWidth />}
          {newLoan > 0 && (
            <TextField label="Sisa Hutang (Cash Bon Baru)" value={newLoan} disabled fullWidth />
          )}

          <TextField
            label="Total Cash Bon Sekarang"
            value={remainingCashBon}
            disabled
            fullWidth
          />

          <div className="flex justify-between">
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Bayar
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
