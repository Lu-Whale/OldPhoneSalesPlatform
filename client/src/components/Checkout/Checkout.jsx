import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../utils/constant";
import "../../index.css";
import "./Checkout.css";

const Checkout = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [phones, setPhones] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [buy, setBuy] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/checkout/get-cart-data?currentUserId=${currentUser.userId}`
        );
        if (res.data === "no data") {
          return;
        }
        setPhones(res.data.cartItems);
        setTotalPrice(res.data.totalPrice);
        setErrorMsg("");
      } catch (error) {
        console.log(error);
        setErrorMsg("Server error");
      }
    };
    if (currentUser != null) {
      fetchCartData();
    }
  }, []);

  async function pay() {
    try {
      const res = await axios.post(`${baseURL}/checkout/update-after-pay`, {
        currentUserId: currentUser.userId,
      });

      if (["No items in cart", "No such user"].includes(res.data)) {
        alert("Something went wrong, please login again");
        return;
      }

      if (res.data === "no such phone") {
        alert("Something went wrong, please login again");
        return;
      }

      if (res.data.data === "phone disabled") {
        alert(res.data.msg);
        return;
      }

      if (res.status === 401) {
        alert(res.data);
        return;
      }
      if (res.data === "good") {
        setPhones(null);
        setTotalPrice(0);
        setBuy(true);
        alert(
          "Congratulations! Transaction successful, now you will be navigate to the home page."
        );
        navigate("/"); //navigate to home page
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function modify(v, phone) {
    let new_totalPrice = 0;
    if (v < 0) {
      alert("The quantity of item must larger than 0.");
      // setErrorMsg("The quantity of item must larger than 0.")
    } else if (v === 0) {
      const res = await axios.post(`${baseURL}/checkout/delete-item`, {
        currentUserId: currentUser.userId,
        phone_id: phone.phone_id,
      });

      if (["No cart", "No item"].includes(res.data)) {
        alert("Something went wrong, please login again");
        // setErrorMsg("Something went wrong, please login again");
        return;
      }

      if (res.data === "Bad delete") {
        alert("Item delete failed, please try again");
        // setErrorMsg("Item delete failed, please try again");
        return;
      }

      if (res.data === "Delete success") {
        alert("Item successful delete");
        // setErrorMsg("Item successful delete");
      }
    } else if (v > 0) {
      const res = await axios.post(`${baseURL}/checkout/update-num`, {
        currentUserId: currentUser.userId,
        phone_id: phone.phone_id,
        num: v,
      });
      console.log(res.data);

      if (["No user", "No phone", "No cart", "No item"].includes(res.data)) {
        alert("Data base has lost your user/phone data, please login again ");
        // setErrorMsg("Something went wrong, please login again");
        return;
      }

      if (res.data.data === "Stock bad") {
        alert("Stock insufficient, only " + res.data.stock + " left.");
        // setErrorMsg("Stock insufficient, only " + res.data.stock + "left.");
        return;
      }
      if (res.data === "Success" || res.data === "test") {
        //检查以下代码逻辑
        phone.num = v;
        const updatedPhones = phones.map((p) => {
          if (p === phone) {
            p.num = phone.num;
            if (p.num === 0) {
              return null;
            }
          }
          return p;
        });

        setPhones(updatedPhones.filter((p) => p !== null));
        for (let i = 0; i < phones.length; i++) {
          new_totalPrice += phones[i].num * phones[i].price;
        }
        setTotalPrice(new_totalPrice);
      }
    }

    //以下注释待删
    // await axios, post phone_id and v(v is new quantity of phone) to backend
    // check stock for this item and alert user if no enough stock
    // if successfully update, response with {msg: ok, totalPrice: calculated new total price}
  }

  async function remove(phone) {
    try {
      //检查以下代码逻辑
      let new_totalPrice = totalPrice - phone.num * phone.price;
      if (new_totalPrice < 0) {
        new_totalPrice = 0;
      }
      setTotalPrice(new_totalPrice);
      const updatedPhones = phones.map((p) => {
        if (p === phone) {
          p.num = 0;
          return null;
        }
        return p;
      });
      setPhones(updatedPhones.filter((p) => p !== null));

      const res = await axios.post(`${baseURL}/checkout/delete-item`, {
        currentUserId: currentUser.userId,
        phone_id: phone.phone_id,
      });

      if (["No cart", "No item"].includes(res.data)) {
        alert("Something went wrong, please login again");
        // setErrorMsg("Something went wrong, please login again");
        return;
      }

      if (res.data === "Bad delete") {
        alert("Item delete failed, please try again");
        // setErrorMsg("Item delete failed, please try again");
        return;
      }

      if (res.data === "Delete success") {
        alert("Item successful delete");
        // setErrorMsg("Item successful delete");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Server error");
    }
  }

  function goBack() {
    navigate(-1);
  }

  return (
    <div className="checkout-container">
      <h2>Shopping Cart Items</h2>
      {errorMsg && <p>{errorMsg}</p>}
      <button onClick={goBack} className="btn btn-blue">
        &larr; Back
      </button>
      <br></br>
      {phones && phones.length ? (
        <div>
          {phones.map((item, index) => (
            <div key={index} className="cart-list-container">
              <img src={`./imgs/${item.brand}.jpeg`} alt={item.title} />
              <div>
                <p className="checkout-heading">{item.title}</p>
                <p>
                  Quantity:{" "}
                  <input
                    className="checkout-input"
                    type="number"
                    min="0"
                    onChange={(e) => modify(e.target.value, item)}
                    value={item.num}
                  ></input>
                </p>
                <p>
                  Price of Each Item: <strong>$ {item.price}</strong>
                </p>
                <p>Brand: {item.brand}</p>
                <button
                  id="delete"
                  className="btn btn-red"
                  onClick={() => remove(item)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}

          <h2>Total price: $ {totalPrice}</h2>
          <button id="checkout" onClick={pay} className="btn btn-green">
            confirm the transaction
          </button>
        </div>
      ) : (
        <div>
          <p>There is no item to chekcout currently</p>
        </div>
      )}
      {buy && (
        <div>
          <h1>Thank you for your purchase!</h1>
          <p>Your order has been confirmed and will be shipped soon.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
