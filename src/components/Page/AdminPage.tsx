import React, { useState, Suspense, useEffect } from "react";
import SideMenu from "../Layout/SideMenu";
import AddInventoryForm from "../Layout/AddInventory";
import Transaction from "../Layout/Transaction";
import Testing from "../UI/TransactionTable";
import ProductListnStock from "../Layout/ProductListnStock";
import CustomerList from "../Layout/CustomerList";
import RevenueReport from "../Layout/RevenueReport";
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
      case "addInventory":
        return <AddInventoryForm />;
      case "inventoryList":
        return <ProductListnStock />;
      case "RevenueReport":
        return <RevenueReport />;
      case "cashier":
        return <Transaction />;
      case "customerList":
        return <CustomerList />;
      case "testing":
        return <ProductListnStock />;
      default:
        return <Testing onFetchProduct={()=>console.log("test")} />;
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