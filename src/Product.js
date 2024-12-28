import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductCRUD.css';

const API_URL = "https://fakestoreapi.com/products";

const Product = () => {
  const [products, setProducts] = useState([]); // Holds the list of products
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: 0,
    description: "",
    image: "",
    category: "",
  }); // New product details
  const [loading, setLoading] = useState(false); // Loading state during API calls
  const [error, setError] = useState(""); // Holds error messages

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL); // Fetching product list
      setProducts(response.data);
      setError(""); // Clear any previous errors
    } catch (error) {
      setError("Error fetching products, please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.title || newProduct.price <= 0 || !newProduct.description) {
      alert("Please fill out all fields with valid data."); // Validation before adding
      return;
    }
    try {
      const response = await axios.post(API_URL, newProduct); // Adding a new product
      setProducts([...products, response.data]); // Update product list
      alert("Product added!");
      setNewProduct({ title: "", price: 0, description: "", image: "", category: "" }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product, please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`); // Deleting the product
      setProducts(products.filter((product) => product.id !== id)); // Remove from list
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError("Error deleting product, please try again.");
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts
  }, []);

  return (
    <div className="product-crud">
      <h1>Product CRUD Operations</h1>

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      <div className="product-form">
        {/* Form inputs for adding a product */}
        <input type="text" placeholder="Title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
        <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
        <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input type="text" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
        <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Loading state */}
      {loading && <p>Loading products...</p>}

      {/* Display product list */}
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products available</p> // Show message if no products
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.image || "https://via.placeholder.com/150"} alt={product.title || "No Image Available"} className="product-image" />
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>${product.price}</p>
                <p>{product.description}</p>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Product;

