import { useEffect, useState } from "react";
import { formatPrice } from "../../function.tsx/function";
import { api } from "../../service/api";

interface Transaction {
    transaction_id: string;
    date: string;
    customer: {
      name: string;
      id: number;
      hutang: number;
    };
    payment_type: string;
    grandtotal: number;
    products: {
      product_id: string;
      name: string;
      quantity: number;
      unit_price: number;
    }[];
}

const RevenueReport = () => {
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [originalTransaction,setOriginalTransaction] = useState<Transaction[]>([]);
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function groupTransactions(data: any[]): Transaction[] {
        const transactionsMap = new Map<string, Transaction>();
      
        data.forEach((item) => {
          if (!transactionsMap.has(item.transaction_id)) {
            transactionsMap.set(item.transaction_id, {
              transaction_id: item.transaction_id,
              date: item.created_at,
              customer: {
                name: item.customer_name,
                id: 0, // Replace with actual customer ID if available
                hutang: item.customer_hutang,
              },
              payment_type: item.transaction_payment_type,
              grandtotal: item.transaction_grand_total,
              products: [],
            });
          }
      
          const transaction = transactionsMap.get(item.transaction_id)!;
          transaction.products.push({
            product_id: item.product_id || "", // Replace if product_id is available
            name: item.product_name,
            quantity: item.product_quantity,
            unit_price: item.product_price,
          });
        });
      
        return Array.from(transactionsMap.values());
      }

    useEffect(() => {
        const fetchTransactions = async () => {
            const fetchTransactionsResponse = await api.fetchTransaction();
            if(fetchTransactionsResponse){
                //console.log(groupTransactions(fetchTransactionsResponse.data))
                if(fetchTransactionsResponse.status===200){
                    setTransactionData(groupTransactions(fetchTransactionsResponse.data));
                    setOriginalTransaction(groupTransactions(fetchTransactionsResponse.data));
                }
                else{
                    alert(fetchTransactionsResponse.message);
                    console.log(fetchTransactionsResponse.message)
                }
            }
        }
        fetchTransactions();
    }, []);

    const handleDateChange = (date: string) => {
        setDate(date);
        // Filter transactions based on the selected date
        const filteredTransactions = originalTransaction.filter((transaction) => transaction.date.slice(0,10) === date);
        setTransactionData(filteredTransactions);
    };

    const handleMonthChange = (month: string) => {
        setMonth(month);
        // Filter transactions based on the selected month
        const filteredTransactions = originalTransaction.filter((transaction) => transaction.date.startsWith(month));
        setTransactionData(filteredTransactions);
    };

    const handleYearChange = (year: string) => {
        setYear(year);
        // Filter transactions based on the selected year
        const filteredTransactions = originalTransaction.filter((transaction) => transaction.date.startsWith(year));
        setTransactionData(filteredTransactions);
    };

    const handleReset = () => {
        // Reset the transaction data to the original data
        setTransactionData(originalTransaction);
        setDate("");
        setMonth("");
        setYear("");
    };

    return (
        <div className="container mx-auto p-4 max-h-screen overflow-auto">
            <h1 className="text-2xl font-semibold text-center mb-4">Revenue Report</h1>
            <div className="mb-4">
                <div className="flex justify-between">
                    <div className="flex space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input 
                                type="date" 
                                onChange={(e) => handleDateChange(e.target.value) }
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={date}
                             />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Month</label>
                            <select 
                              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                              onChange={(e) => handleMonthChange(e.target.value)}
                              value={month}>
                                <option value="">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <select 
                               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                               onChange={(e) => handleYearChange(e.target.value)}
                               value={year}>
                                <option value="">Select Year</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                        <div className="mt-4 flex items-center">
                            <button className="mt-1 rounded bg-blue-500 hover:bg-blue-600 font-semibold text-white py-2 px-4" onClick={handleReset}>Reset</button>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <p className="text-lg font-semibold">Grand Total: Rp.{formatPrice(transactionData.reduce((total, transaction) => total + transaction.grandtotal, 0))}</p>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Transaction ID</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Customer Name</th>
                            <th className="py-3 px-6 text-left">Payment Type</th>
                            <th className="py-3 px-6 text-left">Grand Total</th>
                            <th className="py-3 px-6 text-left">Details</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {transactionData.map((transaction) => (
                            <tr key={transaction.transaction_id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left">{transaction.transaction_id}</td>
                                <td className="py-3 px-6 text-left">{transaction.date.slice(0, 10)}</td>
                                <td className="py-3 px-6 text-left">{transaction.customer.name}</td>
                                <td className="py-3 px-6 text-left">{transaction.payment_type}</td>
                                <td className="py-3 px-6 text-left">Rp.{formatPrice(transaction.grandtotal)},-</td>
                                <td className="py-3 px-6 text-left">
                                    <button 
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTransaction && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="fixed inset-0 w-full h-full bg-gray-300 bg-opacity-10"></div>
                    <div className="flex items-center min-h-screen px-4 py-8">
                        <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-lg shadow-lg">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                                    Transaction Details
                                </h3>
                                <div className="mt-2">
                                    <p><strong>Transaction ID:</strong> {selectedTransaction.transaction_id}</p>
                                    <p><strong>Customer Name:</strong> {selectedTransaction.customer.name}</p>
                                    <p><strong>Payment Type:</strong> {selectedTransaction.payment_type}</p>
                                    <p><strong>Grand Total:</strong> Rp.{formatPrice(selectedTransaction.grandtotal)},-</p>
                                    <h3 className="mt-4 text-lg font-semibold">Products</h3>
                                    <ul className="list-disc ml-6">
                                        {selectedTransaction.products.map(product => (
                                            <li key={product.product_id}>
                                                {product.name} - {product.quantity} x Rp.{formatPrice(product.unit_price)},-
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                                        onClick={() => setSelectedTransaction(null)}
                                    >
                                        Close
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueReport;
