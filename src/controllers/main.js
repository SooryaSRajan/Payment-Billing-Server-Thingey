const Vendor = require("../models/vendor.js");
const Item = require("../models/items.js");
const Biller = require("../models/biller.js");
const Admin = require("../models/admin.js");
const Order = require("../models/order.js");

const addVendor = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Invalid username or password"});
    }

    const existingUser = await Vendor.findOne({username});
    console.log(existingUser, "user")
    if (existingUser) {
        return res.status(400).json({error: "User already exists"});
    }

    const user = new Vendor({username, password});
    await user.save();
    return res.json(
        {
            token: user.getJWT(),
        }
    );
};

const addNewVendor = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Invalid usename or password"});
    }
    const vendor = new Vendor({username, password});
    await vendor.save();
    return res.json(vendor);
};

const addNewItems = async (req, res) => {
    const {vendorId} = req.params;
    const {name, price} = req.body;
    if (!name || !price) {
        return res.status(400).json({error: "Invalid item"});
    }
    const item = new Item({vendorId, name, price});
    await item.save();
    return res.json(item);
};

const addItems = async (req, res) => {
    const {name, price} = req.body;
    if (!name || !price) {
        return res.status(400).json({error: "Invalid name or price"});
    }
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) {
        return res.status(404).json({error: "Vendor not found"});
    } else {
        const item = new Item({vendorId: vendor._id, name, price});
        await item.save();
        return res.json(item);
    }
};

const allVendors = async (req, res) => {
    const vendors = await Vendor.find({});
    return res.json(vendors);
};

const addBiller = async (req, res) => {
    const {name, phone} = req.body;
    if (!name || !phone) {
        return res.status(400).json({error: "Invalid name or phone number"});
    }
    //generate random 4 digit code that doesn't already exist
    let code = Number(Date.now().toString().slice(-4));

    const biller = new Biller({name, phone, code});
    await biller.save();
    return res.json(biller);
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
        return res.status(200).send(updatedBiller);
    } catch (error) {
        return res.status(500).send(error);
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
        return res.status(200).send(updatedVendor);
    } catch (error) {
        return res.status(500).send(error);
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
        return res.status(200).send(updatedItem);
    } catch (error) {
        return res.status(500).send(error);
    }
};


const deleteBiller = async (req, res) => {
    try {
        // Find the Biller using id from the url parameter
        const biller = await Biller.findById(req.params.id);

        // Delete the Biller from database
        if (!biller) {
            return res.status(404).send('No biller found');
            return;
        }
        await biller.remove();

        // Send response
        return res.status(200).send(`Biller deleted successfully`);
    } catch (err) {
        return res.status(500).send('Error deleting biller: ' + err);
    }
};

const deleteVendor = async (req, res) => {
    try {
        // Find the Biller using id from the url parameter
        const vendor = await Vendor.findById(req.params.id);

        // Delete the Biller from database
        if (!vendor) {
            return res.status(404).send('No vendor found');
            return;
        }
        await vendor.remove();

        // Send response
        return res.status(200).send(`Biller deleted successfully`);
    } catch (err) {
        return res.status(500).send('Error deleting biller: ' + err);
    }
};

const deleteItem = async (req, res) => {
    try {
        // Find the item using id from the url parameter
        const item = await Item.findOne({vendorId: req.params.vendorId, _id: req.params.itemId});
        // Delete the item from database
        if (!item) {
            return res.status(404).send('No item found');
            return;
        }
        await item.remove();
        // Send response
        return res.status(200).send(`Item deleted successfully`);
    } catch (err) {
        return res.status(500).send('Error deleting item: ' + err);
    }
};


const adminLogin = async (req, res) => {
    const {username, password} = req.body;
    console.log(username, password)
    if (!username || !password) {
        return res.status(401).json({error: "Invalid username or password"});
    }
    const user = await Admin.findOne({username});

    if (user) {
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: "Incorrect password"});
            } else {
                console.log(isMatch);
                if (isMatch) {
                    return res.json(
                        {
                            token: user.getJWT(),
                        }
                    );
                } else {
                    return res.status(401).json({error: "Incorrect password"});
                }
            }
        });

    } else {
        return res.status(401).json({error: "Invalid username or password"});
    }
};

const adminAdd = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Invalid username or password"});
    }

    const existingUser = await Admin.findOne({username});
    console.log(existingUser, "user")
    if (existingUser) {
        return res.status(400).json({error: "User already exists"});
    }

    const user = new Admin({username, password});
    await user.save();
    return res.json(
        {
            token: user.getJWT(),
        }
    );
};

const vendorLogin = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(401).json({error: "Invalid username or password"});
    }
    const user = await Vendor.findOne({username});

    if (user) {
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: "Incorrect password"});
            } else {
                console.log(isMatch);
                if (isMatch) {
                    return res.json(
                        {
                            token: user.getJWT(),
                        }
                    );
                } else {
                    return res.status(401).json({error: "Incorrect password"});
                }
            }
        });

    } else {
        return res.status(401).json({error: "Invalid username or password"});
    }
};

const newOrder = async (req, res) => {
    console.log(req.body)
    const {items, totalPrice, billerCode, usableId, name, rollNo} = req.body;
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
        return res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
};


const getLiveOrders = async (req, res) => {
    const vendorId = req.params.vendorId;

    const orders = await Order.find({
        vendorIds: {$in: vendorId},
        live: true,
    });
    return res.json(orders);
};


const getCompleteOrders = async (req, res) => {
    const vendorId = req.params.vendorId;
    const orders = await Order.find({
        vendorIds: {$in: vendorId},
        live: false,
    });
    return res.json(orders);
};


const getItem = async (req, res) => {
    const item = await Item.findOne({_id: req.params.itemId});
    return res.json(item);
};

const completeOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.orderId, {
        live: false,
    });
    const updated = await Order.findById(req.params.orderId);
    return res.json(updated);
};

const revertOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.orderId, {
        live: true,
    });
    const updated = await Order.findById(req.params.orderId);
    return res.json(updated);
};

const getUsername = async (req, res) => {
    const username = req.params.username;
    Admin.findOne({username}, (err, userData) => {
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
        if (err) return res.status(500).send(err);
        else return res.status(200).send(billers);
    });
};

const vendorsDisplay = async (req, res) => {
    Vendor.find({}, (err, vendors) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(vendors);
    });
};

const itemDisplay = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;

        // Find all items related to the vendor
        let items = await Item.find({vendorId})

        if (!items) {
            return res.status(404).send('No Items found');
            return;
        }

        return res.status(200).send(items);
    } catch (error) {
        console.log("Error fetching data", error);
    }
};

const orderDisplay = async (req, res) => {
    Order.find({}, (err, billers) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(billers);
    });
};

const allItems = async (req, res) => {
    const items = await Item.find({});
    return res.json(items);
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
