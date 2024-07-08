import { Router } from "express";
import lodash from "lodash";
import { collection, ProductModel } from "../src/mongodb.js";
import addMiddleware from "../varmiddleware/add.js";
import usermiddleware from "../varmiddleware/user.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.status(200).render("index", {
    title: "Booom Shop",
    products: products.reverse(),
    UserID: req.UserId ? req.UserId : null,
  });
});

router.get("/Products", async (req, res) => {
  const user1 = req.UserId ? req.UserId : null;
  const myproducts = await ProductModel.find({ user: user1 })
    .populate("user")
    .lean();
  res.status(200).render("Products", {
    title: "Products",
    isPruductss: true,
    Myproducts: myproducts.reverse(),
  });
});

router.get("/Add", addMiddleware, async (req, res) => {
  res.status(200).render("Add", {
    title: "Add Products",
    isAdd: true,
    ProductError: req.flash("ProductError"),
  });
});
//Details
router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id).populate("user").lean();
  res.render("product", { product: product });
});

//Edit
router.get("/edit-product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id).populate("user").lean();
  res.render("Editproduct", {
    product: product,
    ProductEditError: req.flash("ProductEditError"),
  });
});

router.post("/Edit-product/:id", async (req, res) => {
  const { title, description, image, price } = req.body;
  const id = req.params.id;
  // Check if all fields are filled
  if (!title || !description || !image || !price) {
    req.flash("ProductEditError", "All field required");
    return res.redirect(`/edit-product/${id}`);
  }
  await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.redirect("/Products");
});

//Delete

router.post("/delete-product/:id", async (req, res) => {
  const id = req.params.id; 
  await ProductModel.findByIdAndDelete(id);
  res.redirect("/");
});

router.post("/add-products", usermiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;

  // Check if all fields are filled
  if (!title || !description || !image || !price) {
    if (!title) {
      req.flash("ProductError", "Title is required");
    }
    if (!description) {
      req.flash("ProductError", "Description is required");
    }
    if (!image) {
      req.flash("ProductError", "Image is required");
    }
    if (!price) {
      req.flash("ProductError", "Price is required");
    }
    return res.redirect("/Add");
  }
  try {
    // const maxsulotlar = new ProductModel(
    //   lodash.pick(req.body, ["title", "description", "image", "price"])
    // );
    //await maxsulotlar.save();

    // Create new product
    await ProductModel.create({
      title,
      description,
      image,
      price,
      user: req.UserId,
    });
    return res.redirect("/");
  } catch (error) {
    console.error("Error adding product: ", error);
    req.flash("ProductError", "An error occurred while adding the product");
    return res.redirect("/add-products");
  }
});

export default router;
