import {customers} from "../../data/dummyCustomer.json";
import {useState,useEffect} from "react";
import { formatPrice } from "../../function.tsx/function";

interface CustomerData{
    id: number;
    name: string;
    phonenum: string;
    address: string;
    hutang: number;
}

const CustomerList = () =>{
    const [customerData,setCustomerData] = useState<CustomerData[]>([]);

    useEffect(()=>{
        setCustomerData(customers);
    },[])

    const deleteProduct = (index:number) =>{
        console.log(index);
    }

    return (
        <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-semibold text-center mb-4">Product List</h1>
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">#</th>
                                    <th className="py-3 px-6 text-left">Nama</th>
                                    <th className="py-3 px-6 text-left">No Hp</th>
                                    <th className="py-3 px-6 text-left">Alamat</th>
                                    <th className="py-3 px-6 text-left">Hutang</th>
                                    <th className="py-3 px-6 text-left">Hapus</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {customerData.map((customer, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left">{index + 1}</td>
                                        <td className="py-3 px-6 text-left">{customer.name}</td>
                                        <td className="py-3 px-6 text-left">{customer.phonenum}</td>
                                        <td className="py-3 px-6 text-left">{customer.address}</td>
                                        <td className="py-3 px-6 text-left">Rp.{formatPrice(customer.hutang)},-</td>
                                        <td className="py-3 px-6 text-left">
                                            <button 
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => deleteProduct(index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
    )
}


export default CustomerList;