import { useEffect, useState } from "react";
import { api } from "../../service/api";
import { formatPrice } from "../../function.tsx/function";

interface PurchaseHistory {
    purchase_id: string;
    purchase_quantity: number;
    buying_price: number;
    product_name: string;
    product_type: string;
    purchase_date: string;
}

const PurchaseHistory = () => {
    const [purchaseHistoryData, setPurchaseHistoryData] = useState<PurchaseHistory[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<PurchaseHistory[]>([]);
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            setLoading(true);
            try {
                const purchaseHistoryResponse = await api.fetchPurchaseHistory();
                if (purchaseHistoryResponse?.status === 200) {
                    setPurchaseHistoryData(purchaseHistoryResponse.data);
                    setSelectedHistory(purchaseHistoryResponse.data);
                } else {
                    alert(purchaseHistoryResponse?.message || "Failed to fetch data");
                }
            } catch (error) {
                alert("Something went wrong");
                alert(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchaseHistory();
    }, []);

    const handleDateChange = (date: string) => {
        setDate(date);
        setSelectedHistory(purchaseHistoryData.filter(transaction => transaction.purchase_date.startsWith(date)));
    };

    const handleMonthChange = (month: string) => {
        setMonth(month);
        setSelectedHistory(purchaseHistoryData.filter(transaction => transaction.purchase_date.split("-")[1] === month.padStart(2, "0")));
    };

    const handleYearChange = (year: string) => {
        setYear(year);
        setSelectedHistory(purchaseHistoryData.filter(transaction => transaction.purchase_date.startsWith(year)));
    };

    const handleReset = () => {
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Updates the selected year and filters the purchase history data
 * to display transactions that occurred in the specified year.
 *
 * @param year - The year used to filter the purchase transactions.
 */

/******  e1ad6fb7-63b0-4350-9f74-8192097adab5  *******/        setSelectedHistory(purchaseHistoryData);
        setDate("");
        setMonth("");
        setYear("");
    };

    return (
        <div className="container mx-auto p-4 max-h-screen overflow-auto">
            <h1 className="text-2xl font-semibold text-center mb-4 animate-fadeIn">History Pembelian</h1>
            <div className="mb-4 animate-fadeIn">
                <div className="flex justify-between">
                    <div className="flex space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input 
                                type="date" 
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={date}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Month</label>
                            <select 
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                onChange={(e) => handleMonthChange(e.target.value)}
                                value={month}
                            >
                                <option value="">Select Month</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={(i + 1).toString()}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <select 
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                onChange={(e) => handleYearChange(e.target.value)}
                                value={year}
                            >
                                <option value="">Select Year</option>
                                {[2024, 2025, 2026].map((y) => (
                                    <option key={y} value={y.toString()}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center">
                            <button 
                                className="mt-1 rounded bg-blue-500 hover:bg-blue-600 font-semibold text-white py-2 px-4"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <p className="text-lg font-semibold">
                            Grand Total: Rp.{formatPrice(selectedHistory.reduce((total, transaction) => total + (transaction.buying_price*transaction.purchase_quantity), 0))}
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32 animate-fadeIn">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : selectedHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-4 animate-fadeIn">No purchase history available</div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg animate-fadeIn">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Tanggal Transaksi</th>
                                <th className="py-3 px-6 text-left">Nama Produk</th>
                                <th className="py-3 px-6 text-left">Jumlah Pembelian</th>
                                <th className="py-3 px-6 text-left">Harga Pembelian</th>
                                <th className="py-3 px-6 text-left">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {selectedHistory.map((transaction) => (
                                <tr key={transaction.purchase_id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left">{transaction.purchase_date.slice(0,10)}</td>
                                    <td className="py-3 px-6 text-left">{transaction.product_name}</td>
                                    <td className="py-3 px-6 text-left">{formatPrice(transaction.purchase_quantity)}</td>
                                    <td className="py-3 px-6 text-left">Rp.{formatPrice(transaction.buying_price)},-</td>
                                    <td className="py-3 px-6 text-left">Rp.{formatPrice(transaction.buying_price * transaction.purchase_quantity)},-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
