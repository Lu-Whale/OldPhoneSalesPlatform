import { useState, useEffect } from "react";
import { baseURL } from "../../utils/constant";
import axios from "axios";
import "./Top5SoldOut.css";

function PhoneList() {
  const [phones, setPhones] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [soldOutPhones, setSoldOutPhones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/getAllPhoneList`);
        const data = response.data.data;
        setPhones(data);

        // Filter best sellers
        const bestSellersData = data
          .filter(
            (phone) =>
              phone.averageRating &&
              phone.averageRating > 0 &&
              phone.reviews.length >= 2 &&
              !phone.disabled
          )
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 5);
        setBestSellers(bestSellersData);

        // Filter sold out phones
        const soldOutPhonesData = data
          .filter((phone) => phone.stock > 0 && !phone.disabled)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);
        setSoldOutPhones(soldOutPhonesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section className="flex-container section-best-top">
        <div className="best flex-container">
          <h2>Best Sellers</h2>

          {bestSellers.map((phone) => (
            <ul key={phone._id} className="best-top-container">
              <li>
                <img src={phone.image} alt={phone.title} />
              </li>
              <li>
                <h3>{phone.title}</h3>
              </li>
              <li>$ {phone.price}</li>
              <li>Stock: {phone.stock}</li>
              <li>Average Rating: {phone.averageRating.toFixed(2)}</li>
            </ul>
          ))}
        </div>

        <div className="sold-out flex-container">
          <h2>Sold Out Soon</h2>

          {soldOutPhones.map((phone) => (
            <ul key={phone._id} className="best-top-container">
              <li>
                <img src={phone.image} alt={phone.title} />
              </li>
              <li>
                <h3>{phone.title}</h3>
              </li>
              <li>$ {phone.price}</li>
              <li>Stock: {phone.stock}</li>
              <li>Average Rating: {phone.averageRating.toFixed(2)}</li>
            </ul>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PhoneList;
