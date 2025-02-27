import { useEffect, useState } from "react";
import { dbProducts } from "../interface/dbInterfaces";
import { formatPrice } from "../../function.tsx/function";
import { api } from "../../service/api";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ProductListnStock = () => {
  const [productData, setProductData] = useState<dbProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<dbProducts | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchProductsResponse = await api.fetchProducts();
        if (fetchProductsResponse?.status === 200) {
          setProductData(fetchProductsResponse.data);
        } else {
          alert(fetchProductsResponse?.message || "Failed to fetch products");
        }
      } catch (error) {
        alert(error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEditClick = (product: dbProducts) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedProduct) return;

    const response = await api.updateProduct(selectedProduct);
    if (response.status === 200) {
      alert("Product updated successfully!");
      setProductData((prevData) =>
        prevData.map((item) => (item.id === selectedProduct.id ? selectedProduct : item))
      );
      setEditModalOpen(false);
    } else {
      alert(response.message || "Failed to update product");
    }
  };

  const handleDeleteClick = async (productId: string | undefined) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const response = await api.deleteProduct({ id: productId } as dbProducts);
    if (response.status === 200) {
      alert("Product deleted successfully!");
      setProductData(productData.filter((item) => item.id !== productId));
    } else {
      alert(response.message || "Failed to delete product");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-4">Product List</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Nama</th>
                <th className="py-3 px-6 text-left">Stock</th>
                <th className="py-3 px-6 text-left">Harga</th>
                <th className="py-3 px-6 text-left">Update terakhir</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {productData.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{index + 1}</td>
                  <td className="py-3 px-6 text-left">{product.name}</td>
                  <td className="py-3 px-6 text-left">{product.stock}</td>
                  <td className="py-3 px-6 text-left">Rp.{formatPrice(product.sell_price)},-</td>
                  <td className="py-3 px-6 text-left">{product.last_updated?.slice(0, 10)}</td>
                  <td className="py-3 px-6 text-left space-y-2 md:space-x-2 md:space-y-0">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box className="p-5 bg-white rounded-lg shadow-lg w-96 mx-auto mt-20">
          <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
          {selectedProduct && (
            <div className="flex flex-col gap-4">
              <TextField
                label="Nama"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Deskripsi"
                value={selectedProduct.description || ""}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                fullWidth
              />
              <TextField
                label="Unit"
                value={selectedProduct.unit}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, unit: e.target.value })}
                fullWidth
              />
              <TextField
                label="Harga Jual"
                type="number"
                value={selectedProduct.sell_price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, sell_price: Number(e.target.value) })}
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

export default ProductListnStock;
