const { default: mongoose } = require("mongoose");
const Cart = require("../model/CartModel");
const PhoneListing = require("../model/PhoneListModel");
const UserList = require("../model/userlist");

const getCartDataByUserId = async (req, res) => {
  try {
    const currUserIdStr = req.query.currentUserId;
    const cart = await Cart.findOne({ userId: currUserIdStr });

    if (!cart || cart.cartItems.length === 0) {
      return res.json("no data");
    }

    let total = 0;
    for (const cartItem of cart.cartItems) {
      total += cartItem.price * cartItem.num;
    }
    await Cart.updateOne({ userId: currUserIdStr }, { totalPrice: total });

    res.json({
      cartItems: cart.cartItems,
      totalPrice: total,
    });
    // console.log(cart.cartItems);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateAfterCheckout = async (req, res) => {
  try {
    const currUserIdStr = req.body.currentUserId;
    if (!currUserIdStr) {
      return res.json("No such user");
    }

    const cart = await Cart.findOne({ userId: currUserIdStr });
    if (!cart || cart.cartItems.length === 0) {
      return res.json("No items in cart");
    }

    //update database
    const cartItems = cart.cartItems;
    const updatePromises = [];

    //for loop to check whether all items in cart is in stock
    for(const cartItem of cartItems) {
      const phoneId = cartItem.phone_id;
      const num = cartItem.num;


      const phoneListing = await PhoneListing.findById(phoneId);
      if (!phoneListing) {
        return res.json("no such phone");
      }
      //If the phone has been disabled, then user cannot check out this item.
      if(!phoneListing.enable) {
        res.json({data: "phone disabled", msg: `${phoneListing.title} has been disabled, please remove this item.`});
        return;
      }
      //check stock
      if(phoneListing.stock < num) {
        return res.status(401).json(
            `${phoneListing.title} doesn't have enough stock. The available stock quantity is: ${phoneListing.stock}`
          );
      }
    }

    //separate update stock operation from check stock for loop to make sure wrong update won't happen
    for (const cartItem of cartItems) {
      const num = cartItem.num;
      updatePromises.push(
        await PhoneListing.updateOne(
          { _id: cartItem.phone_id },
          { $inc: { stock: -num } }
        )
      );
    }

    await Promise.all(updatePromises);
    await Cart.deleteOne({ userId: currUserIdStr });

    res.json("good");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

//post request
const updateNumWhenUserChangeItemNum = async (req, res) => {
  let { currentUserId, phone_id, num } = req.body;
 // console.log(req.body);
  num = parseInt(num);

  if (currentUserId === null) {
    return res.json("No user");
  }
  if (phone_id === null) {
    return res.json("No phone");
  }

  try {
    //check cart and cart item exist
    const cart = await Cart.findOne({ userId: currentUserId });
    if (!cart) {
      return res.json("No cart");
    }

    const cartItem = cart.cartItems.find((item) => item.phone_id.toString() === phone_id.toString());
   // console.log(cartItem);
    if (!cartItem) {
      return res.json("No item");
    }

    const phoneListing = await PhoneListing.findById(phone_id);
    if (!phoneListing) {
      return res.json("No phone");
    }
    //check whether num is larger than stock
    if (phoneListing.stock < num) {
      return res.json({ stock: phoneListing.stock, data: "Stock bad" });
    }

    //update item number in cart db
    const updatePromises = [];
    const total = cart.totalPrice + (num - cartItem.num) * cartItem.price;
    updatePromises.push(
      Cart.updateOne(
        { userId: currentUserId, "cartItems.phone_id": phone_id },
        { $set: { "cartItems.$.num": num } }
      )
    );
    await Promise.all(updatePromises);
    await Cart.updateOne({ userId: currentUserId }, { totalPrice: total });

    return res.json("Success");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const AddCartItem = async (req, res) => {
  const { userId, phone_id, title, num, price, brand } = req.body;
  const cart = await Cart.findOne({ userId });
  // console.log(userId, phone_id, title, num, price, brand);

  //check stock before add item to cart
  const phone = await PhoneListing.findOne({_id: phone_id});
  if(phone.stock < num) {
    res.json({data: "Bad stock", msg: "insufficient stock, only " + phone.stock +" left." });
    return;
  }
  if (!cart) {
    // Create new cart if not already exists
    const newCart = new Cart({
      userId,
      cartItems: [{ phone_id, title, num, price, brand }],
    });
    await newCart.save();
    return res.send({ status: "ok", message: "Added to cart" });
  } else {
    // Add item to existing cart
    let ItemExistsInCart = false;

    for(const cartItem of cart.cartItems) {
      if(cartItem.phone_id.toString() === phone_id.toString()) {
        if(cartItem.num + num > phone.stock) {
          res.json({data: "Bad stock", msg: "Insufficient stock, there is/are " + cartItem.num + " already in the cart, only " + phone.stock +" in stock." });
          return;
        }
        cartItem.num += num;
        await cart.save();
        ItemExistsInCart = true;
        return;
      }
    }

    if(!ItemExistsInCart) {
      cart.cartItems.push({ phone_id, title, num, price, brand });
      await cart.save();
    }
    return res.send({ status: "ok", message: "Added to the cart exist" });
  }
};

const deleteCartItem = async (req, res) => {
  const { currentUserId, phone_id } = req.body;

  try {
    const cart = await Cart.findOne({ userId: currentUserId });
    if (!cart) {
      return res.json("No cart");
    }

    const cartItem = cart.cartItems.find(
      (item) => item.phone_id.toString() === phone_id
    );
    if (!cartItem) {
      return res.json("No item");
    }
    const updatePromises = [];
    const total = cart.totalPrice - cartItem.price * cartItem.num;
    updatePromises.push(
      cart.updateOne({ userId: currentUserId }, { totalPrice: total })
    );
    await Promise.all(updatePromises);
    const updateCheck = await Cart.findOneAndUpdate(
      { userId: currentUserId },
      { $pull: { cartItems: { phone_id: phone_id } } },
      { new: true }
    );

    if (updateCheck) {
      return res.json("Delete Success");
    } else {
      return res.json("Bad delete");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports = {
  getCartDataByUserId,
  updateAfterCheckout,
  updateNumWhenUserChangeItemNum,
  deleteCartItem,
  AddCartItem,
};
