import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Toggle for mobile menu
  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/products/${params.slug}`
      );
      console.log("data of single product is ", data);
      setName(data.product.name);
      setDescription(data.product.description);
      setPrice(data.product.price);
      console.log(data.product.category);
      setCategory(data.product.category._id); // Store only the ID
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping ?? false);
      setId(data.product._id);
      console.log("Product ID:", data.product._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    try {
        const { data } = await axios.get("/api/v1/category/allcategory");
        if (data?.success) {
            setCategories(data?.category);
          }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong in getting categories");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation: Ensure all required fields are filled
    if (!name || !price || !quantity || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
     photo && productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      // Debug: Log form data
      console.log("Form Data before submission:", {
        name,
        description,
        price,
        quantity,
        photo,
        category,
        shipping,
      });

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      // Use a modern confirmation dialog
      const answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;
      console.log("Deleting product with ID:", id);
      const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
      
      if (data.success) {
        const { name } = data; // Assuming the deleted product's name is returned
        toast.success(`${name} deleted successfully`);
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.log(error.response || error);
      toast.error("Something went wrong");
    }
  };
  




  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid dashboard" style={dashboardStyle}>
        <div className="row">
          {/* Admin Menu */}
          <div className="col-md-3 d-none d-md-block">
            <AdminMenu />
          </div>
          <div className="col-md-3 d-block d-md-none mb-3">
            <button
              className="btn btn-secondary w-100"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? "Hide Menu" : "Show Admin Menu"}
            </button>
            {isMobileMenuOpen && <AdminMenu />}
          </div>
          <div className="col-md-9">
            <div className="m-3 p-4" style={formContainerStyle}>
              <h2 className="text-center text-light mb-4">
                Update the Product
              </h2>
              <div className="mb-3">
                <select
                  className="form-select form-control-lg mb-3"
                  onChange={(e) => setCategory(e.target.value)} // Update category ID
                  value={category} // Use the stored category ID
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="btn btn-outline-light col-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                ):(<div className="text-center">
                    <img
                      src={`/api/v1/product/get-photos/${id}`}
                      alt="product_photo"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>)}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="form-control form-control-lg"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Product Description"
                  className="form-control form-control-lg"
                  rows="4"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="form-control form-control-lg"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Quantity"
                  className="form-control form-control-lg"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Shipping:</label>
                <select
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value === "true")}
                  className="form-control"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="text-center d-flex mx-4">
                <button
                  className="btn btn-light btn-lg px-5 mx-4"
                  onClick={handleUpdate}
                >
                  UPDATE PRODUCT
                </button>
                <button
                  className="btn btn-light btn-lg px-5 mx-3px"
                  onClick={handleDelete}
                >
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
const dashboardStyle = {
  backgroundImage: `url(https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp)`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  color: "white",
  display: "flex",
  flexDirection: "column",
};

const formContainerStyle = {
  maxWidth: "700px",
  margin: "0 auto",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  color: "white",
};
