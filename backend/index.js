const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const app = express();
const Product = require("./db/Product"); 
//To get the react and postman data to the node js application
app.use(express.json()); //middleware=>which helps us to get the data from the file body inside register.
app.use(cors());

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
    } else {
      resp.send({ result: "No User Found" });
    }
  } else {
    resp.send({ result: "No00 user Found" });
  }
});

app.post("/add-product",async(req,resp)=>{
  let product = new Product(req.body);
    let result=await product.save();
    resp.send(result);

})

app.get("/products",async(req,resp)=>{
  const products= await Product.find();
  if(products.length >0){
    resp.send(products)
  }else{
    resp.send({result:"No Product Found"})
  }
})


app.delete("/product/:id",async(req,resp)=>{
  let result= await Product.deleteOne({_id:req.params.id});
  resp.send(result)
})

app.get("/product/:id",async(req,resp)=>{
  let result=await Product.findOne({_id:req.params.id})
  if(result)
    {
  resp.send(result)
  }
  else
  {
    resp.send({"result":"NO Record Found"})
  }
});

app.put("/product/:id", async (req, resp) => {
  try {
    let result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    // Check if update operation was successful
    if (result.matchedCount > 0) {
      resp.send({ message: "Product updated successfully", result });
    } else {
      resp.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
});

app.get("/search/:key",async(req,resp)=>{
  let result =await Product.find({
    "$or": [
      {
        name:{$regex:req.params.key}

      },
      {
        company:{$regex:req.params.key}

      },
      {
        category:{$regex:req.params.key}

      }
    ]
  });

resp.send(result);
})

app.listen(5000);
