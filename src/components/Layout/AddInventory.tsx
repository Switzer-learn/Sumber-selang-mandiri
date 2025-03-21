import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { dbProducts } from "../interface/dbInterfaces";
import { api } from "../../service/api";

const AddInventoryForm: React.FC = () => {
  const [jumlah, setJumlah] = useState<number | null>(0);
  const [satuan, setSatuan] = useState<string>("pcs");
  const [keterangan, setKeterangan] = useState<string>("");
  const [hargaJual, setHargaJual] = useState<number>(0);
  const [inventoryName, setInventoryName] = useState<string>("");
  const [inventoryData, setInventoryData] = useState<dbProducts[]>([]);
  const [jenis, setJenis] = useState<string>("goods");
  const [categories, setCategories] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");


  useEffect(() => {
    const fetchProducts = async () => {
      const fetchProductsResponse = await api.fetchProducts();
      if (fetchProductsResponse) {
        if (fetchProductsResponse.status === 200) {
          setInventoryData(fetchProductsResponse.data);
        } else {
          alert(fetchProductsResponse.message);
          console.log(fetchProductsResponse);
        }
      } else {
        return;
      }
    };
    fetchProducts();
  }, []);

  const uniqueSatuan = Array.from(
    new Set(inventoryData.map((item) => item.unit))).sort((a, b) => a.localeCompare(b));
  
  const uniqueCategories = Array.from(
    new Set(inventoryData.map((item) => item.categories).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // Reset form fields
  const resetForm = () => {
    setInventoryName("");
    setJumlah(0);
    setSatuan("pcs");
    setKeterangan("");
    setHargaJual(0);
    setCategories("");
    setNewCategory("");
  };

  const handleSubmit = async (_event: React.FormEvent) => {
    _event.preventDefault();
    
    const finalCategory = categories === "newCategory" ? newCategory.trim() : categories;

    const finalSatuan = satuan === "newSatuan" ? newCategory.trim() : satuan;

    const formData = {
      name: inventoryName,
      type: jenis,
      unit: finalSatuan,
      description: keterangan,
      sell_price: hargaJual,
      stock: 0,
      avg_buy_price: 0,
      categories: finalCategory,
    };

    confirm("Apakah data sudah benar?");
    const addProductResponse = await api.addProduct(formData);
    if (addProductResponse?.status === 200) {
      alert(addProductResponse.message);
    } else {
      alert(addProductResponse.message);
      console.log(addProductResponse);
    }
  };

  return (
    <div id="addInventory" className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold underline mb-4">Tambah Inventory</h1>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-5 shadow-md grid grid-cols-2 gap-4 w-full max-w-4xl bg-white"
      >
        {/* Nama Barang */}
        <div className="flex flex-col gap-2">
          <label htmlFor="inventoryName" className="font-medium">
            Nama Barang:
          </label>
          <Autocomplete
            id="inventoryName"
            freeSolo
            value={inventoryName}
            options={inventoryData.map((option) => option.name)}
            onInputChange={(_event, newValue) => setInventoryName(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Nama Barang" required />
            )}
          />
        </div>

        {/* Jumlah */}
        <div className="flex flex-col gap-2">
          <label htmlFor="jumlah" className="font-medium">
            Jumlah:
          </label>
          <TextField
            id="jumlah"
            type="number"
            value={jumlah ?? ""}
            onChange={(e) => setJumlah(e.target.value ? parseInt(e.target.value) : null)}
            label="Jumlah"
            disabled
          />
        </div>

        {/* Satuan */}
        <div className="flex flex-col gap-2">
          <label htmlFor="satuan" className="font-medium">
            Satuan:
          </label>
          <select
            id="satuan"
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            className="border rounded p-2"
          >
            <option value="" disabled>Pilih Satuan</option>
            {uniqueSatuan.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="newSatuan">Tambah satuan</option>
          </select>
        </div>

        {satuan === "newSatuan" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="newSatuan" className="font-medium">
              Nama Satuan:
            </label>
            <TextField
              id="newSatuan"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              label="Satuan"
              required
            />
          </div>
        )}

        {/* Harga */}
        <div className="flex flex-col gap-2">
          <label htmlFor="harga" className="font-medium">
            Harga Jual:
          </label>
          <TextField
            id="sell_price"
            type="number"
            value={hargaJual ?? ""}
            onChange={(e) => setHargaJual(parseInt(e.target.value))}
            label="Harga"
            required
          />
        </div>

        {/* Jenis */}
        <div className="flex flex-col gap-2">
          <label htmlFor="jenis" className="font-medium">
            Tipe:
          </label>
          <select
            id="jenis"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="border rounded p-2"
          >
            <option value="goods">Barang</option>
            <option value="service">Jasa</option>
          </select>
        </div>

        {/* Kategori */}
        {jenis === "goods" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="kategori" className="font-medium">
              Kategori:
            </label>
            <select
              id="kategori"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="border rounded p-2"
            >
              <option value="" disabled>Pilih Kategori</option>
              <option value="newCategory">Input kategori baru</option>
              {uniqueCategories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input kategori baru */}
        {categories === "newCategory" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="newCategory" className="font-medium">
              Nama Kategori Baru:
            </label>
            <TextField
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              label="Kategori Baru"
              required
            />
          </div>
        )}

        {/* Keterangan */}
        <div className="col-span-2 flex flex-col gap-2">
          <label htmlFor="keterangan" className="font-medium">
            Keterangan:
          </label>
          <TextField
            id="keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            label="Keterangan"
            multiline
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-between">
          <button type="button" onClick={resetForm} className="rounded-lg bg-gray-500 hover:bg-gray-600 text-white px-6 py-2">
            Reset
          </button>
          <button type="submit" className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryForm;
