import React, { useState, Suspense, useEffect } from "react";
import SideMenu from "../Layout/SideMenu";
import AddInventoryForm from "../Layout/AddInventory";
import Transaction from "../Layout/Transaction";
import Testing from "../UI/Testing";
//import { useNavigate } from 'react-router-dom'

// Lazy load components


const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("");
  //const navigate = useNavigate();

  useEffect(()=>{
    
  },[])
  
  const handleSideMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const displayContent = () => {
    switch (selectedMenu) {
      case "AddEmployee":
        return <div>Tambah Pegawai</div>;
      case "EmployeeList":
        return <div>List Pegawai</div>;
      case "addInventory":
        return <AddInventoryForm />;
      case "inventoryList":
        return <div>List Produk</div>;
      case "revenueReport":
        return <div>Laporan Omzet</div>;
      case "transactionList":
        return <div>List Transaksi</div>;
      case "cashier":
        return <Transaction />;
      case "customerList":
        return <div>List Pelanggan</div>;
      case "testing":
        return <Testing />;
      default:
        return <Testing />;
    }
  };

  return (
    <div className="flex justify-around">
      <div className="items-start">
        <SideMenu onMenuClick={handleSideMenuClick} />
      </div>
      <div className="w-screen">
        <div className="mx-auto">
          <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
            {displayContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;