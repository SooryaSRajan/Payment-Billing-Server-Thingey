const express = require("express");

const router = express.Router();
const auth = require("../middleware/authorisation.js");
//middlewares

//controllers
//TODO: Change authorisation accordingly
//TODO: Add authentication and authorisation for biller

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
router.get("/api/vendor/:vendorId/orders/live", auth("vendor"), getLiveOrders);
router.get("/api/vendor/:vendorId/orders/complete", auth("vendor"), getCompleteOrders);
router.get("/api/item/:itemId", auth("vendor"), getItem);
router.get("/api/vendor/display", auth("vendor"), vendorsDisplay);
router.get("/api/biller/display", billerDisplay);
router.post("/api/admin/login", adminLogin);
router.post("/api/admin/new", auth("admin"), adminAdd);
router.post("/api/biller/new", auth("admin"), addBiller);
router.post("/api/vendor/login", vendorLogin);
router.post("/api/vendor/new", auth("admin"), addVendor);
router.post("/api/order", newOrder);
router.post("/api/vendor/:vendorId/food-items", auth("vendor"), addItems);
router.put("/api/order/:orderId/complete", completeOrder);
router.put("/api/order/:orderId/revert", revertOrder);
router.get("/api/admin/:username", auth("admin"), getUsername);
router.put("/api/biller/:id", editBiller);
router.delete("/api/biller/delete/:id", deleteBiller);
router.post("/api/vendor/newadd", auth("vendor"), addNewVendor);
router.put("/api/vendor/:id", auth("vendor"), editVendor);
router.delete("/api/vendor/delete/:id", auth("admin"), deleteVendor);
router.get("/api/item/display/:vendorId", auth("admin"), itemDisplay);
router.get("/api/items/all", allItems);
router.post("/api/item/:vendorId/new", auth("admin"), addNewItems);
router.put("/api/item/:vendorId/:itemId", auth("admin"), editItem);
router.delete("/api/item/delete/:vendorId/:itemId", auth("admin"), deleteItem);
router.get("/api/order/display", orderDisplay);
module.exports = router;
