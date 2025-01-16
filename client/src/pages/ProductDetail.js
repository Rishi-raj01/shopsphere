import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";
import Layout from "../components/Layout/Layout";

const ProductDetails = () => {
  const params = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showWithPhotos, setShowWithPhotos] = useState(false);

  const filteredReviews = showWithPhotos
    ? reviews.filter((review) => review.photo)
    : reviews;

  // Fetch product details
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/products/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added to your cart`);
  };

  //reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/products/${params.slug}/reviews`,
          {
            params: { page, limit: 5 },
          }
        );
        console.log("Reviews from backend:", data);

        // Append new reviews to the previous ones
        setReviews((prev) => [...prev, ...data.reviews]);

        // Set if there are more reviews to load
        setHasMore(data.reviews.length > 5);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    // Only call fetchReviews when page changes
    if (page > 0) {
      fetchReviews();
    }
  }, [page, params.slug]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handlePayment = async (product) => {
    try {
      setLoading(true);
     console.log("user is ",auth.user);
     console.log("product is ",product)
      // Create order on your server
      const { data: order } = await axios.post("/api/v1/product/orders", {
        amount: product.price * 100,  // Multiply by 100 for paise
        product, // Include the product ID for reference
        auth // Pass user details
      });

      console.log("Order Data:", order);
      const options = {
        key: "rzp_test_xkZhbPPhzFGU8G",
        amount: order.amount,
        currency: "INR",
        name: "Ritwin Handmade Company",
        description: `Payment for ${product.name}`,
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on the server
            const verification = await axios.post(
              "/api/v1/product/payment-callback",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                productId: product.id,
                user: auth.user,
                
              }
            );

            if (verification.data.success) {
              console.log("Verification successful", verification.data.success);
              toast.success("Payment Completed Successfully");
              navigate("/success");
            } else {
              navigate("/failure");
              toast.error(
                verification.data.message || "Payment verification failed."
              );
            }
          } catch (error) {
            console.error("Verification error:", error);
            navigate("/failure");
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: auth?.user?.name || "Guest",
          email: auth?.user?.email || "guest@example.com",
          contact: auth?.user?.phone || "No Number",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setLoading(false);
      navigate("/failure");
      toast.error("Payment initialization failed.");
    }
  };

  return (
    <Layout>
      <div className="container">
        {/* Product Details */}
        <div className="row my-5">
          <div className="col-md-6">
            <img
              src={`/api/v1/product/get-photos/${product._id}`}
              className="img-fluid rounded"
              alt={product.name}
              style={{ maxHeight: "350px" }}
            />
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">{product.name}</h2>
            <p>{product.description}</p>
            <h5>
              Price:{" "}
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </h5>
            <p>Category: {product?.category?.name}</p>
            <p>Shipping: {product?.shipping ? "Yes" : "No"}</p>
            <p>Available: {product?.quantity}</p>
           <div className="d-flex justify-content-center">
           <button
              className="btn btn-primary mx-2" style={{width:"10rem", }}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button
        className="btn btn-primary mx-2" style={{width:"10rem"}}
        onClick={() => handlePayment(product)}
      >
        Buy Now
      </button>
           </div>

          </div>
        </div>

        <hr />

        {/* reviews */}

        <h3 className="my-4 text-center">Reviews</h3>
        <div className="container">
          <h3 className="my-4">Customer Reviews</h3>
          <div className="d-flex justify-content-center mb-3">
            <button
              className={`btn btn-sm ${
                showWithPhotos ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setShowWithPhotos(!showWithPhotos)}
              style={{ width: "200px" }} // Ensure consistent button size
            >
              {showWithPhotos ? "Show All Reviews" : "Show Reviews with Photos"}
            </button>
          </div>
          <div className="row">
            {filteredReviews.length ? (
              filteredReviews.map((review, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card shadow-sm p-3 h-100">
                    {review.photo ? (
                      <img
                        src={`/api/v1/product/review/photo/${review._id}`}
                        alt="Review"
                        className="card-img-top img-fluid"
                        style={{
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{
                          height: "200px",
                          borderRadius: "8px",
                          color: "#aaa",
                          fontSize: "14px",
                          fontWeight: "bold",
                          border: "1px dashed #ddd",
                        }}
                      >
                        No Photo Available
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        Rating: {review.rating}{" "}
                        <span className="text-warning">★</span>
                      </h5>
                      <p className="card-text flex-grow-1">
                        <strong>Comment:</strong> {review.comment}
                      </p>
                      <p className="card-text">
                        <strong>Commented by:</strong> {review.userId.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No reviews found.</p>
            )}
          </div>
            
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center my-4">
              <button onClick={loadMore} className="btn btn-primary">
                Load More
              </button>
            </div>
          )}

          {/* Write a Review Button */}
          <div className="text-center mt-4">
            <Link to={`/dashboard/user/create-review/${params.slug}`}>
              <button className="btn btn-primary" style={{maxWidth:"9rem"}}>Write a Review</button>
            </Link>
          </div>
        </div>

        {/* Similar Products */}
        <h3 className="my-4">Similar Products</h3>
        {relatedProducts.length === 0 ? (
          <p>No similar products found.</p>
        ) : (
          <div className="row">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="col-6 col-md-3 mb-4 d-flex align-items-stretch"
              >
                <div
                  className="card w-100"
                  style={{
                    maxHeight: "350px", // Limit the card height
                    height: "auto", // Allow height to adjust based on content
                    overflow: "hidden", // Prevent overflow
                  }}
                >
                  <Link
                    to={`/product/${relatedProduct.slug}`}
                    className="product-link"
                  >
                    <img
                      src={`/api/v1/product/get-photos/${relatedProduct._id}`}
                      style={{
                        height: "200px", // Adjust height of the image
                        objectFit: "cover", // Maintain aspect ratio and crop overflow
                      }}
                      className="card-img-top"
                      alt={relatedProduct.name}
                    />
                  </Link>
                  <div className="card-body h-100 d-flex flex-column">
                    <Link
                      to={`/product/${relatedProduct.slug}`}
                      className="product-link"
                    >
                      <h5 className="card-title">{relatedProduct.name}</h5>
                    </Link>
                    <div className=" mt-auto d-flex justify-content-between align-items-center mt-2">
                      <h5 className="text-success mb-0">
                        {relatedProduct.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(relatedProduct)}
                      >
                        Add to Cart
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
              
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) {
  .card {
    max-height: 300px; /* Reduce height on smaller screens */
  }
  .card-img-top {
    height: 150px; /* Adjust image height */
  }
}

@media (max-width: 576px) {
  .card {
    max-height: 250px; /* Further reduce height on mobile devices */
  }
  .card-img-top {
    height: 120px; /* Adjust image height */
  }
}
`}</style>
    </Layout>
  );
};

export default ProductDetails;
