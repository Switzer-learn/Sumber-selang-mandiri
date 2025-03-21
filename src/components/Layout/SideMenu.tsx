import React, { useState } from "react";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";

interface SideMenuProps {
  onMenuClick: (menu: string) => void;
  userRole: string; // Added userRole prop
}

const SideMenu: React.FC<SideMenuProps> = ({ onMenuClick, userRole }) => {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const response = await api.logout();
    if (response.status === 200) {
      alert("Successful logout");
      navigate("/");
    }
  };

  return (
    <div>
      {/* Mobile menu toggle */}
      <button
        className="md:hidden p-3 text-white bg-slate-800 fixed top-4 left-4 z-50 rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close Menu" : "Open Menu"}
      </button>

      <div
        id="sideMenu"
        className={`${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform transform fixed md:static flex flex-col w-64 h-auto min-h-screen bg-slate-800 z-40`}
      >
        {/* Logo Section */}
        <div className="flex flex-col justify-center align-middle my-5">
          <span className="text-center text-2xl font-bold text-white">
            Sumber Selang Mandiri
          </span>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col justify-center gap-3 my-10 mx-auto font-bold text-white">
          <span className="text-center text-xl">Menu</span>
          <div>
            {userRole === "cashier" ? (
              <>
                <button
                  className="w-full text-left py-2 px-4 hover:bg-green-700"
                  onClick={() => onMenuClick("cashier")}
                >
                  Penjualan
                </button>
              </>
            ) : (
              <>
                <div>
                  <button
                    className="w-full text-left py-2 px-4 hover:bg-green-700"
                    onClick={() => setInventoryOpen(!inventoryOpen)}
                  >
                    Produk
                  </button>
                  {inventoryOpen && (
                    <ul className="px-4 text-md font-normal flex flex-col">
                      <button
                        className="hover:text-lg text-start py-1 px-2"
                        onClick={() => onMenuClick("addInventory")}
                      >
                        Tambah Produk
                      </button>
                      <button
                        className="hover:text-lg text-start py-1 px-2"
                        onClick={() => onMenuClick("addInventoryPurchase")}
                      >
                        Pembelian Produk
                      </button>
                      <button
                        className="hover:text-lg text-start py-1 px-2"
                        onClick={() => onMenuClick("inventoryList")}
                      >
                        List Produk & Stock
                      </button>
                      <button
                        className="hover:text-lg text-start py-1 px-2"
                        onClick={() => onMenuClick("purchaseList")}
                      >
                        History Pembelian
                      </button>
                    </ul>
                  )}
                </div>
                <div>
                  <button
                    className="w-full text-left py-2 px-4 hover:bg-green-700"
                    onClick={() => onMenuClick("RevenueReport")}
                  >
                    Laporan Penjualan
                  </button>
                </div>
                <div>
                  <button
                    className="w-full text-left py-2 px-4 hover:bg-green-700"
                    onClick={() => onMenuClick("cashier")}
                  >
                    Penjualan
                  </button>
                </div>
                
                <div>
                  <button
                    className="w-full text-left py-2 px-4 hover:bg-green-700"
                    onClick={() => onMenuClick("customerList")}
                  >
                    List Pelanggan
                  </button>
                </div>
                <div>
                  <button
                    className="w-full text-left py-2 px-4 hover:bg-green-700"
                    onClick={() => onMenuClick("addEmployee")}
                  >
                    Tambah Pegawai
                  </button>
                </div>
              </>
            )}
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SideMenu;
