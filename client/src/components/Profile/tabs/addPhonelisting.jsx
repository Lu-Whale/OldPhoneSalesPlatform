import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "../../../utils/constant";
import "../../../index.css";

const AddPhoneListing = () => {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const currUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!brand) {
      alert("Brand cannot empty.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/profile/add-new-phone-listing`,
        {
          title,
          brand,
          price,
          stock,
          currentUserId: currUser.userId,
        }
      );
      console.log(response.data);

      // Reset the form and state values
      setTitle("");
      setBrand("");
      setPrice("");
      setStock("");

      alert("Add phone listing success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="profile-add-phone-box">
        <div>
          <h3 className="add-phone-heading">Add New Phone</h3>
          <label htmlFor="title" className="profile-label">
            Title:{" "}
          </label>
          <input
            className="profile-input"
            type="text"
            id="title"
            name="title"
            value={title}
            required
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="brand" className="profile-label">
            Brand:{" "}
          </label>
          <select
            id="brand"
            name="brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="profile-input"
          >
            <option value="">Select a brand</option>
            <option value="Apple">Apple</option>
            <option value="BlackBerry">BlackBerry</option>
            <option value="HTC">HTC</option>
            <option value="Huaiwei">Huaiwei</option>
            <option value="LG">LG</option>
            <option value="Motorola">Motorola</option>
            <option value="Nokia">Nokia</option>
            <option value="Samsung">Samsung</option>
            <option value="Sony">Sony</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="profile-label">
            Price:{" "}
          </label>
          <input
            className="profile-input"
            type="number"
            id="price"
            name="price"
            step="0.1"
            min="0"
            value={price}
            required
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stock" className="profile-label">
            Stock:{" "}
          </label>
          <input
            className="profile-input"
            type="number"
            min="1"
            id="stock"
            name="stock"
            value={stock}
            required
            onChange={(event) => setStock(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-green">
          Add Listing
        </button>
      </form>
      <br></br>
    </div>
  );
};

export default AddPhoneListing;
