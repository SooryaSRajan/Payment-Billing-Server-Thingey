const express = require("express");

const router = express.Router();
const auth = require("../middleware/authorisation.js");
//middlewares

//controllers
const {
  addVendor,
  addItems,
  allVendors,
  addBiller,
  adminLogin,
  adminAdd,
  vendorLogin,
  newOrder,
  getLiveOrders,
  getCompleteOrders,
  getItem,
  completeOrder,
  revertOrder,
  getUsername,
  vendorsDisplay,
  billerDisplay,
  editBiller,
  deleteBiller,
  addNewVendor,
  editVendor,
  deleteVendor,
  itemDisplay,
  addNewItems,
  editItem,
  deleteItem,
  orderDisplay,
  allItems
} = require("../controllers/main.js");

//routes
router.get("/api/vendor/all", auth("admin"), allVendors);
router.get("/api/vendor/:vendorId/orders/live", getLiveOrders);
router.get("/api/vendor/:vendorId/orders/complete", getCompleteOrders);
router.get("/api/item/:itemId", getItem);
router.get("/api/vendor/display", vendorsDisplay);
router.get("/api/biller/display", billerDisplay);
router.post("/api/admin/login", adminLogin);
router.post("/api/admin/new", adminAdd);
router.post("/api/biller/new", addBiller);
router.post("/api/vendor/login", vendorLogin);
router.post("/api/vendor/new", addVendor);
router.post("/api/order", newOrder);
router.post("/api/vendor/:vendorId/food-items", addItems);
router.put("/api/order/:orderId/complete", completeOrder);
router.put("/api/order/:orderId/revert", revertOrder);
router.get("/api/admin/:username", getUsername);
router.put("/api/biller/:id", editBiller);
router.delete("/api/biller/delete/:id", deleteBiller);
router.post("/api/vendor/newadd", addNewVendor);
router.put("/api/vendor/:id", editVendor);
router.delete("/api/vendor/delete/:id", deleteVendor);
router.get("/api/item/display/:vendorId", itemDisplay);
router.get("/api/items/all", allItems);
router.post("/api/item/:vendorId/new", addNewItems);
router.put("/api/item/:vendorId/:itemId", editItem);
router.delete("/api/item/delete/:vendorId/:itemId", deleteItem);
router.get("/api/order/display", orderDisplay);
module.exports = router;
