import { useState, useEffect } from "react";
import { formatPrice } from "../../function/function";
import { api } from "../../service/api";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface CustomerData {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  cash_bon: number;
}

const CustomerList = () => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const response = await api.fetchCustomer();
      if (response?.status === 200) {
        setCustomerData(response.data as CustomerData[]);
      }
    };
    fetchCustomer();
  }, []);

  const handleEditClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCustomer) return;
    const response = await api.updateCustomer(selectedCustomer);
    if (response.status === 200) {
      alert("Customer updated successfully!");
      setCustomerData((prevData) =>
        prevData.map((item) => (item.id === selectedCustomer.id ? selectedCustomer : item))
      );
      setEditModalOpen(false);
    } else {
      alert(response.message || "Failed to update customer");
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-4">Customer List</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Nama</th>
              <th className="py-3 px-6 text-left">No Hp</th>
              <th className="py-3 px-6 text-left">Alamat</th>
              <th className="py-3 px-6 text-left">Hutang</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {customerData.map((customer, index) => (
              <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{customer.name}</td>
                <td className="py-3 px-6 text-left">{customer.phone_number}</td>
                <td className="py-3 px-6 text-left">{customer.address}</td>
                <td className="py-3 px-6 text-left">Rp.{formatPrice(customer.cash_bon)},-</td>
                <td className="py-3 px-6 text-left space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleEditClick(customer)}
                  >
                    Edit
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box className="p-5 bg-white rounded-lg shadow-lg w-96 mx-auto mt-20">
          <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
          {selectedCustomer && (
            <div className="flex flex-col gap-4">
              <TextField
                label="Nama"
                value={selectedCustomer.name}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="No Hp"
                value={selectedCustomer.phone_number}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone_number: e.target.value })}
                fullWidth
              />
              <TextField
                label="Alamat"
                value={selectedCustomer.address}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                fullWidth
              />
              <TextField
                label="Hutang"
                type="number"
                value={selectedCustomer.cash_bon}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, cash_bon: Number(e.target.value) })}
                fullWidth
              />
              <div className="flex justify-between">
                <Button variant="outlined" color="secondary" onClick={() => setEditModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CustomerList;
