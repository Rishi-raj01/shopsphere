const productmodel=require("../model/productmodel")
const categorymodel=require("../model/CategoryModel")
const reviewmodel =require("../model/reviewmodel")
const mongoose=require("mongoose")
const formidable=require("express-formidable")
const Razorpay=require("razorpay");
const crypto = require("crypto");
const fs=require("fs");

var braintree = require("braintree");

const slugify=require("slugify");
const ordermodel=require("../model/ordermodel")



module.exports.getallproducts=async function getallproducts(req,res){
    try {
        console.log("get all product called")
        let products=await productmodel.find().populate("category").select("-photo").limit(30).sort({createdAt:-1}); 
       // console.log("all product called found",products)
        if(products){
            return res.send({
                success:true,
                total:products.length,
                message:"all product retreived",
                data:products,
                 //not necessary to write "data" we can write anything here
              products
            })
        }
        else{
            console.log("nothing found here")
            return res.status(400).send({
                success:false,
                message:"no product found"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        
    }
}


module.exports.createProduct = async function createProduct(req, res) {
    try {
        console.log("create product working");
        const { name, description, price, category, quantity, shipping } = req.fields;
        console.log(req.fields);
        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).send({
                success: false,
                message: "All fields are required",
            });
        }
          
  
        const { photo } = req.files;
         // Validate photo size
         if (photo && photo.size > 6 * 1024 * 1024) { // 6 MB in bytes
            return res.status(400).send({
                success: false,
                message: "Photo size should not exceed 6 MB",
            });
        }
        const product = new productmodel({ ...req.fields, slug: slugify(name) }); // Create a new product instance
  
        if (photo) {
            // Read the photo file and set it in the product model
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
  
        await product.save(); // Save the product to the database
        res.status(200).send({
            success: true,
            message: "Product Created Successfully",
            product, // Send the saved product in the response
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
  };

module.exports.getproduct=async function getproduct(req,res){
    try {
        console.log("get product called")
        let slug=req.params.slug;
        console.log("slug from backend is ",slug)
        let product=await productmodel.findOne({slug:req.params.slug}).select('-photo').populate("category")
        if(product){
            return res.status(200).send({
                success:true,
                message:"product retreived",
                product
            });
        }
        else{
            return res.status(400).send({
                success:false,
                message:"no product found with given slug "
            })
        }
    } catch (error) {
        res.status(500).send({
            success:false,
            message: error.message
          });
        
    }
}

module.exports.updateproduct = async function updateproduct(req, res) {
    try {
      const fields = req.fields || {}; // Fixed typo
      const { name, description, price, category, quantity, shipping } = fields;
      const { photo } = req.files;
      const productId = req.params.id;
  
      console.log("Received fields:", fields);
      console.log("Received photo:", photo);
  
      // Update product details
      const products = await productmodel.findByIdAndUpdate(
        productId,
        { ...fields, slug: slugify(name || "") }, // Default to empty slug if name is undefined
        { new: true } // Return the updated document
      );
  
      if (photo) {
        // Save photo data if provided
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
        await products.save(); // Save updated product with photo
      }
  
      res.status(201).send({
        success: true,
        message: "Product updated successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in updating product",
      });
    }
  };

module.exports.deleteproduct=async function deleteproduct(req,res){
    try {
        let product=await productmodel.findByIdAndDelete(req.params.id);
        if(product){
            return res.status(200).send({
            success:true,
              message:"product deleted successfully",
              product
            })
          }
    }catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
        });
     }
};

module.exports.getphoto=async function getphoto(req,res) {
  const { pid } = req.params;

    // Check if the pid is a valid ObjectId
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).send({
            success: false,
            message: "Invalid product ID",
        });
    }
    try {
        const product=await productmodel.findById(req.params.pid).select("photo")
        if(product?.photo.data){
            res.set("Content-type",product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });  
    }
    
}

module.exports.productFilter=async function productFilter(req,res){
    try {
        const {checked,radio}=req.body;
        let args={}
        if(checked.length>0) args.category=checked
        if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
        const products=await productmodel.find(args)
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"error while filtering product",
            error
        })
    }
}

module.exports.productCount=async function productCount(req,res ){
try {
//const total=await productmodel.find({}.estimatedDocumentCount())
const total = await productmodel.countDocuments();
   res.status(200).send({
    success:true,
    total
   })
} catch (error) {
    console.log(error)
    res.status(400).send({
        message:"error in product count",
        error,
        success:false
    })
}
}

module.exports.productList=async function productList(req,res){
    try {
        const perPage=12;
        const page=req.params.page?req.params.page:1
        const products=await productmodel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success:false,
            message:"error in per page ctrl "
        })
    }
}
module.exports.searchProduct=async function searchProduct(req,res){
    try {
     const {keyword}=req.params;
     const results = await productmodel.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }).select("-photo");
      console.log(results)
     res.json(results)
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            error,
            success:false,
            message:"error in searching product"
        })
        
    }
}
module.exports.getSimilarProduct=async function getSimilarProduct(req,res){
    try {
        const {pid,cid}=req.params;
        const products=await productmodel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(8).populate('category')
        res.status(200).send({
          success:true,
          products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error in finding related product",
            error
        })
    }
}

module.exports.productCategory=async function productCategory(req,res){
    try {
        const  category=await categorymodel.findOne({slug:req.params.slug})
        const products=await productmodel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            products,
            category
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"something went wrong in fetching product category",
            error
        })
    }
}





var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // merchantId: "sbx93brp2ncgpfkn",
    // publicKey: "3rd4ycjy4gygkjht",
    // privateKey: "d13311816cc247f964785b7a66da030b",
    merchantId: "zm7jxgzhj4y6vvqn",
    publicKey: "5pb55p94mp6tnbpm",
    privateKey: "31c7ee57ecc098f6b17e733636bb10b9",
  });

  //payment gateway api
module.exports.braintreeToken=async function braintreeToken(req,res){
    try {
        console.log("create token called")
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    
    }
    }

    
module.exports.braintreepayment = async function braintreepayment(req, res) {
  try {
    console.log("braintreepayment is working");

    const { nonce, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    let total = 0;
    cart.map((item) => {
      total += item.price;
    });

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      async function (error, result) {
        if (error) {
          console.error("Braintree Transaction Error:", error);
          return res.status(500).json({ error: "Transaction failed" });
        }

        if (result) {
          try {
            const order = new ordermodel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            });
            await order.save();
            res.json({ ok: true });
          } catch (saveError) {
            console.error("Order Saving Error:", saveError);
            res.status(500).json({ error: "Failed to save order" });
          }
        } else {
          res.status(500).json({ error: "Unknown transaction error" });
        }
      }
    );
  } catch (error) {
    console.error("Braintree Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
      }


  module.exports.updatequantity=async function updatequantity(req,res) {
    const { cart } = req.body;

  try {
    for (const item of cart) {
      await productmodel.findByIdAndUpdate(
        item._id,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }
    res.status(200).json({ success: true, message: "Product quantities updated" });
  } catch (error) {
    console.error("Error updating product quantities:", error);
    res.status(500).json({ success: false, message: "Failed to update quantities" });
  }
    
  }


  module.exports.reviews=async function reviews(req,res) {
    try {
      const {slug}=req.params;
      console.log("Slug from request of review:", slug);
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required', success: false });
      }
      const {page=1,limit=6}=req.query;
      const product = await productmodel.findOne({ slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found',success:false });
    }
     // Fetch reviews based on the product ID
     const reviews = await reviewmodel.find({ productId: product._id })
     .sort({ createdAt: -1 }) 
     .skip((page - 1) * limit)
     .limit(parseInt(limit)).populate({path:"userId",select:"name photo"});



  //    const reviews = await reviewmodel.find({ productId: product._id })
  // .sort({ createdAt: -1 }) // Latest reviews first
  // .skip((page - 1) * limit)
  // .limit(parseInt(limit))
  // .populate('userId', 'name email') // Populate userId with specific fields (e.g., name, email)


   // Count total reviews
   const totalReviews = await reviewmodel.countDocuments({ productId: product._id });

   res.status(200).json({ reviews, totalReviews,success:true });
  
    } catch (error) {
      res.status(500).send({ error: 'Server error',
        success:false,
       });
    }
    
  }

  module.exports.createReview = async function createReview(req, res) {
    try {
      const { slug } = req.params;
      console.log("Review slug is ", slug);
  
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }
  
      const userId = req.user._id;
      console.log("user id is ",userId)
      const { rating, comment } = req.fields; // Use req.fields for regular fields
  
      // Validate required fields
      if (!rating || !comment) {
        return res.status(400).send({
          success: false,
          message: "Rating and comment are required.",
        });
      }
  
      // Check if product exists
      const product = await productmodel.findOne({ slug });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
  
      // Validate photo size if it exists (6MB limit)
      const { photo } = req.files; // Use req.files for file fields
      if (photo && photo.size > 6 * 1024 * 1024) {
        return res.status(400).send({
          success: false,
          message: "Photo size should not exceed 6 MB.",
        });
      }
  
      // Create review object
      const review = new reviewmodel({
        productId: product._id,
        userId,
        rating,
        comment,
      });
  
      // If photo exists, save it
      if (photo) {
        review.photo.data = fs.readFileSync(photo.path);
        review.photo.contentType = photo.type;
      }
  
      await review.save();
  
      // Respond with success
      res.status(201).send({
        success: true,
        message: "Review created successfully",
        review,
      });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).send({
        success: false,
        message: "Server error",
      });
    }
  };


  module.exports.reviewPhoto=async function reviewPhoto(req,res) {
    try {
      const review = await reviewmodel.findById(req.params.id);
      if (!review || !review.photo) {
        return res.status(404).send({ error: "Photo not found" });
      }
  
      res.set("Content-Type", review.photo.contentType);
      res.status(200).send(review.photo.data);
    } catch (error) {
      console.error("Error fetching photo:", error);
      res.status(500).send({ error: "Server error" });
    }
  }


  //Razorpay

  
    // key_id:"rzp_test_xkZhbPPhzFGU8G"
    // key_secret:"qIqX0OQJj3rbtTJjHEoneYym"

    module.exports.getOrderId= async function getOrderId(req,res) {
      try {
       // console.log("getorder is called")
        console.log("product in backend is  is ",req.body.product)
        const product = req.body.product;
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret:process.env.RAZORPAY_KEY_SECRET })
        var options = {
            amount: req.body.amount,
            currency: "INR",
            receipt: "TXN" + Date.now(),
            notes: {
              key1: req.body.auth.user.name || "N/A",
              key2: req.body.auth.user.email || "N/A",
              key3: req.body.auth.user.phone || "N/A",
              key4: req.body.auth.user.location || "N/A", // Use "N/A" or a default placeholder
              key5: (req.body.cart && req.body.cart.length > 0) 
        ? req.body.cart.map(item => `${item.name} (${item.quantity})`).join(", ")
        : `${product.name} (1)`,
            
              key6: req.body.auth.user.name || "Guest",
            }
        };

        instance.orders.create(options, function(err, order) {
          if (order) {
            //console.log("Order instance created:", order);
            // Send the entire order object to the frontend
            return res.status(200).json(order);
          } else {
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error.message);
    }

    }

module.exports.paymentCallBack=async function paymentCallBack(req,res) {
  const {razorpay_signature, razorpay_payment_id, razorpay_order_id,cart,user} = req.body
  console.log("cart in paymentcallback ",cart ,"user is ",user)
  try {
      const string = `${razorpay_order_id}|${razorpay_payment_id}`;

      const generated_signature = crypto
      .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
      .update(string)
      .digest('hex');
      
      if (generated_signature == razorpay_signature) {
        const order = new ordermodel({
          products: Array.isArray(cart) && cart.length > 0 ? cart : [{ name: product.name, quantity: 1 }], // If it's Buy Now, treat it as an array with one item
          payment: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            success:true,
          },
          buyer: user._id,
        });
        await order.save();
        console.log(order);
        console.log('Order saved:');
          console.log('payment successfull')
          return res.status(200).json({ success: true, message: "Payment successful and order saved" });
        }
        else{
          return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }

}

module.exports.paymentCancel =async function paymentCancel (req,res) {
  try {
    return res.status(200).json({ success: false, message: "Payment was cancelled" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
}
