const Vendor = require("../models/vendor.js");
const Item = require("../models/items.js");
const Biller = require("../models/biller.js");
const Admin = require("../models/admin.js");
const Order = require("../models/order.js");

const addVendor = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Invalid username or password" });
  }
  const vendor = new Vendor({ username, password });
  await vendor.save();
  res.json(vendor);
};

const addNewVendor = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Invalid usename or password" });
  }
  const vendor = new Vendor({ username, password});
  await vendor.save();
  res.json(vendor);
};

const addNewItems = async (req, res) => {
  const {vendorId} = req.params;
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).json({ error: "Invalid item" });
  }
  const item = new Item({vendorId, name, price});
  await item.save();
  res.json(item);
};

const addItems = async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).json({ error: "Invalid name or price" });
  }
  const vendor = await Vendor.findById(req.params.vendorId);
  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
  } else {
    const item = new Item({ vendorId: vendor._id, name, price });
    await item.save();
    res.json(item);
  }
};

const allVendors = async (req, res) => {
  const vendors = await Vendor.find({});
  res.json(vendors);
};

const addBiller = async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: "Invalid name or phone number" });
  }
  //generate random 4 digit code that doesn't already exist
  let code = Number(Date.now().toString().slice(-4));

  const biller = new Biller({ name, phone, code });
  await biller.save();
  res.json(biller);
};

const editBiller = async (req, res) => {
    console.log("dogggg")
    const id = req.params.id;
    try {
        // Find the Biller in the database where it's matching the id
      let biller = await Biller.findById(id);
      console.log("dog", biller);
      // Update the biller information
      biller.name = req.body.name;
      biller.phone = req.body.phone;
      // Save the new biller details
      const updatedBiller = await biller.save();
      res.status(200).send(updatedBiller);
  } catch (error) {
    res.status(500).send(error);
  }
};

const editVendor = async (req, res) => {
  console.log("dogggg")
  const id = req.params.id;
  try {
      // Find the Biller in the database where it's matching the id
    let vendor = await Vendor.findById(id);
    // Update the biller information
    vendor.username = req.body.username;
    vendor.password = req.body.password;
    // Save the new biller details
    const updatedVendor = await vendor.save();
    res.status(200).send(updatedVendor);
} catch (error) {
  res.status(500).send(error);
}
};

const editItem = async (req, res) => {

  const vendorId = req.params.vendorId;
  const itemId = req.params.itemId;
  try {
    // Find the item in the database using id
    const item = await Item.findOne({_id: itemId, vendorId: vendorId});
    // Update the item information
    item.name = req.body.name;
    item.price = req.body.price;
    console.log("dog", item)
    // Save the new item details
    const updatedItem = await item.save();
    res.status(200).send(updatedItem);
  } catch (error) {
    res.status(500).send(error);
  }
};  


const deleteBiller = async (req,res) => {
  try {
    // Find the Biller using id from the url parameter
    const biller = await Biller.findById(req.params.id);
    
    // Delete the Biller from database 
    if (!biller) { res.status(404).send('No biller found'); return; }
    await biller.remove();
    
    // Send response
    res.status(200).send(`Biller deleted successfully`);
  } catch (err) {
    res.status(500).send('Error deleting biller: ' + err);
  }
}; 

const deleteVendor = async (req,res) => {
  try {
    // Find the Biller using id from the url parameter
    const vendor = await Vendor.findById(req.params.id);
    
    // Delete the Biller from database 
    if (!vendor) { res.status(404).send('No vendor found'); return; }
    await vendor.remove();
    
    // Send response
    res.status(200).send(`Biller deleted successfully`);
  } catch (err) {
    res.status(500).send('Error deleting biller: ' + err);
  }
}; 

const deleteItem = async (req, res) => {
  try {
    // Find the item using id from the url parameter
    const item = await Item.findOne({ vendorId: req.params.vendorId, _id: req.params.itemId });
    // Delete the item from database 
    if (!item) { res.status(404).send('No item found'); return; }
    await item.remove();
    // Send response
    res.status(200).send(`Item deleted successfully`);
  } catch (err) {
    res.status(500).send('Error deleting item: ' + err);
  }
};



const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({ error: "Invalid username or password" });
  }
  const user = await Admin.findOne({ username, password });

  if(user){
    console.log(user);
    res.json({ username: user.username });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
};

const adminAdd = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Invalid username or password" });
  }
  const user = new Admin({ username, password });
  await user.save();
  res.json(user);
};

const vendorLogin = async (req, res) => {
  const { username, password } = req.body;
  const vendor = await Vendor.findOne({ username });
  const match = vendor.password == password;

  if (match) {
    console.log(vendor);
    res.json({ vendorId: vendor._id });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
};

const newOrder = async (req, res) => {
  console.log(req.body)
  const { items, totalPrice, billerCode, usableId, name, rollNo} = req.body;
  const vendorIds = [...new Set(items.map((item) => item.vendorId))];
  console.log(vendorIds)
  const order = new Order({
    vendorIds,
    billerCode,
    items,
    totalPrice,
    timeStamp: Date.now(),
    live: true,
    usableId,
    name,
    rollNo,
  });

  try {
    // Save the new order to the database
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getLiveOrders = async (req, res) => {
  const vendorId = req.params.vendorId;

  const orders = await Order.find({
    vendorIds: { $in: vendorId },
    live: true,
  });
  res.json(orders);
};


const getCompleteOrders = async (req, res) => {
  const vendorId = req.params.vendorId;
  const orders = await Order.find({
    vendorIds: { $in: vendorId },
    live: false,
  });
  res.json(orders);
};


const getItem = async (req, res) => {
  const item = await Item.findOne({ _id: req.params.itemId });
  res.json(item);
};

const completeOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId, {
    live: false,
  });
  const updated = await Order.findById(req.params.orderId);
  res.json(updated);
};

const revertOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId, {
    live: true,
  });
  const updated = await Order.findById(req.params.orderId);
  res.json(updated);
};

const getUsername = async(req, res) => {
  const username = req.params.username;
    Admin.findOne({ username }, (err, userData) => {
        if (err) {
            return res.status(400).json({
                message: 'An error occured',
                err
            });
        } else {
            return res.status(200).json(userData);
        }
    })
  };


const billerDisplay = async (req, res) => {
  Biller.find({}, (err, billers) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(billers);
  });
};

const vendorsDisplay = async (req, res) => {
  Vendor.find({}, (err, vendors) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(vendors);
  });
};

const itemDisplay = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // Find all items related to the vendor
    let items = await Item.find({ vendorId })
    
    if(!items) {
        res.status(404).send('No Items found');
        return;
    }

    res.status(200).send(items);
  } catch (error) {
    console.log("Error fetching data", error);
  }
};

const orderDisplay = async (req, res) => {
  Order.find({}, (err, billers) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(billers);
  });
};

const allItems = async (req, res) => {
  const items = await Item.find({});
  res.json(items);
};


module.exports = {
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
  allItems,
};
