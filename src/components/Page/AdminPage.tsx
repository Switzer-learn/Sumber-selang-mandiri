import React, { useState, Suspense, useEffect } from "react";
import SideMenu from "../Layout/SideMenu";
import AddInventoryForm from "../Layout/AddInventory";
import Transaction from "../Layout/Transaction";
import ProductListnStock from "../Layout/ProductListnStock";
import CustomerList from "../Layout/CustomerList";
import RevenueReport from "../Layout/RevenueReport";
import EmployeeRegister from "../Layout/AddEmployee";
import ProductPurchase from "../Layout/ProductPurchase";
import { useNavigate } from 'react-router-dom'
import { api } from "../../service/api"
import PurchaseHistory from "../Layout/PurchaseHistory";

const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [userRole,setUserRole] = useState("")
  const navigate = useNavigate();

  useEffect(()=>{
    const checkUser = async() =>{
      const currentUser = await api.getCurrentUser();
      //console.log(currentUser)
      if(currentUser){
        const checkRole = await api.checkRole(currentUser.id);
        if(checkRole.role){
          setUserRole(checkRole.role[0].role!)
          if (checkRole.role[0].role!=="admin" && checkRole.role[0].role!=="cashier"){
              alert("Unauthorized");
              navigate("/");
          }
        }
      }else{
        alert("You need to Log in")
        navigate("/")
      }
    }
    checkUser();
  },[navigate])
  
  const handleSideMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const displayContent = () => {
    switch (selectedMenu) {
      case "addInventory":
        return <AddInventoryForm />;
      case "addInventoryPurchase":
        return <ProductPurchase />;
      case "purchaseList":
        return <PurchaseHistory />;
      case "inventoryList":
        return <ProductListnStock />;
      case "RevenueReport":
        return <RevenueReport />;
      case "cashier":
        return <Transaction />;
      case "customerList":
        return <CustomerList />;
      case "addEmployee":
        return <EmployeeRegister />;
      default:
        return <Transaction />;
    }
  };

  return (
    <div className="flex justify-around">
      <div className="items-start">
        <SideMenu onMenuClick={handleSideMenuClick} userRole={userRole}/>
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