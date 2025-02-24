import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Product } from "../interface/ProductInterface";

const AddInventoryForm: React.FC = () => {
  const [jumlah, setJumlah] = React.useState<number | null>(0);
  const [satuan, setSatuan] = React.useState<string>("pcs");
  const [keterangan, setKeterangan] = React.useState<string>("");
  const [harga, setHarga] = React.useState<number | null>(0);
  const [inventoryName, setInventoryName] = React.useState<string>("");
  const [inventoryData, setInventoryData] = React.useState<Product[]>([]);
  const [jenis,setJenis] = React.useState<string>("Barang");

  // Reset form fields
  const resetForm = () => {
    setInventoryName("");
    setJumlah(0);
    setSatuan("pcs");
    setKeterangan("");
    setHarga(0);
  };

  const handleSubmit = async (_event: React.FormEvent) => {
    _event.preventDefault();
    const formData = {
      inventoryName,
      jumlah,
      satuan,
      keterangan,
      harga,
    };
    console.log(formData)
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
            required
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
            <option value="pcs">Pcs</option>
            <option value="kg">Meter</option>
            <option value="ml">Ml</option>
          </select>
        </div>

        {/* Harga */}
        <div className="flex flex-col gap-2">
          <label htmlFor="harga" className="font-medium">
            Harga:
          </label>
          <TextField
            id="harga"
            type="number"
            value={harga ?? ""}
            onChange={(e) => setHarga(e.target.value ? parseInt(e.target.value) : null)}
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
            <option value="pcs">Barang</option>
            <option value="kg">Jasa</option>
          </select>
        </div>

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
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryForm;