import { useEffect, useState } from "react";
import { api } from "../../service/api";
import { formatPrice } from "../../function/function";

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
    const [search, setSearch] = useState("");
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
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        fetchPurchaseHistory();
    }, []);

    useEffect(() => {
        let filteredData = purchaseHistoryData;
        
        if (search) {
            filteredData = filteredData.filter(transaction => 
                transaction.product_name.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (date) {
            filteredData = filteredData.filter(transaction => transaction.purchase_date.startsWith(date));
        }
        if (month) {
            filteredData = filteredData.filter(transaction => transaction.purchase_date.split("-")[1] === month.padStart(2, "0"));
        }
        if (year) {
            filteredData = filteredData.filter(transaction => transaction.purchase_date.startsWith(year));
        }
        
        setSelectedHistory(filteredData);
    }, [search, date, month, year, purchaseHistoryData]);

    return (
        <div className="container mx-auto p-4 max-h-screen overflow-auto">
            <h1 className="text-2xl font-semibold text-center mb-4">History Pembelian</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 px-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                {/* Date, Month, Year Filters */}
                <div className="flex space-x-4">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border px-3 py-2 rounded-md" />
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="border px-3 py-2 rounded-md">
                        <option value="">Select Month</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={(i + 1).toString()}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="border px-3 py-2 rounded-md">
                        <option value="">Select Year</option>
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y.toString()}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : selectedHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">No purchase history available</div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Tanggal Transaksi</th>
                                <th className="py-3 px-6 text-left">Nama Produk</th>
                                <th className="py-3 px-6 text-left">Jumlah Pembelian</th>
                                <th className="py-3 px-6 text-left">Harga Pembelian</th>
                                <th className="py-3 px-6 text-left">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {selectedHistory.map(transaction => (
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
