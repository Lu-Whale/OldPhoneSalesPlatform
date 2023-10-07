import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseURL } from "../../utils/constant";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PhoneList.css";
import AddCommentForm from "./AddComment";
import { useNavigate } from "react-router-dom";

const PhoneListing = () => {
  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const modalContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [phoneLists, setPhoneLists] = useState([]);
  const [inputPhoneList, setInputPhoneList] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showLess, setShowLess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseURL}/getAllPhoneList?enable=true`)
      .then((res) => {
        console.log(res.data.data);
        setPhoneLists(res.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const modalContainer = modalContainerRef.current;
    if (modalContainer) {
      modalContainer.scrollTop = scrollPosition; // Restore the saved scroll position
    }
  }, [scrollPosition]);

  const handleShowDetails = (phoneId) => {
    axios
      .get(`${baseURL}/getPhoneList/${phoneId}`)
      .then((res) => {
        setSelectedPhone(res.data);
        setShowDetailModal(true);
      })
      .catch((error) => console.log(error));
  };

  const handleAddToCart = async (phone) => {
    if(currentUser) {
      try {
        const quantity = parseInt(window.prompt("Enter quantity:", "1"), 10);
          if(quantity === null || quantity === "") {
            return;
        }
        if (quantity.length >= 3) {
            window.alert("Please specify integer only within the scope (0, 999]");
            return;
        } 
        for (let i =0; i < quantity.length; i++){
            if (parseInt(quantity[i]) == null) {
                window.alert("Please specify integer only within the scope (0, 999]");
                return;
            }
        }
        if (isNaN(quantity) || quantity <= 0) {
          alert("You must input integer larger than 0")
          return; // Exit if the quantity is not valid
        }
        const response = await axios.post(`${baseURL}/checkout/add-to-cart`, {
          userId: currentUser.userId,
          phone_id: phone._id,
          title: phone.title,
          num: quantity, // assuming that you always add one phone to the cart
          price: phone.price,
          brand: phone.brand,
        });

        if (response.data.data === "Bad stock") {
          alert(response.data.msg);
        }
        console.log(response.data, phone._id, phone.title);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      navigate("/login");
    }
  };

  const handleShowMore = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 3);
  };

  const stayScroll = () => {
    const modalContainer = modalContainerRef.current;
    if (modalContainer) {
      setScrollPosition(modalContainer.scrollTop); // Save the current scroll position
    }
  };

  //For dropdown filter based on brand
  const handleSelectChange = (e) => {
    setBrand(e.target.value);
  };

  //Filter phone lists based on selected brand
  const filteredPhoneLists = phoneLists.filter((phone) => {
    if (brand === "") {
      return true;
    }
    return phone.brand.toLowerCase() === brand.toLowerCase();
  });

  //Filter phone lists based on inputPhoneList
  const searchedPhoneLists = filteredPhoneLists.filter((phone) => {
    if (inputPhoneList === "") {
      return true;
    }
    return phone.title.toLowerCase().includes(inputPhoneList.toLowerCase());
  });

  const closeModal = () => {
    setShowDetailModal(false);
  };

  // Show phone lists details modal with comments
  const ShowModal = () => {
    if (selectedPhone && showDetailModal) {
      const phone = selectedPhone.data;
      phone.image = "./imgs/" + phone.brand + ".jpeg";
      return (
        <div ref={modalContainerRef} className="modal-container">
          <button type="button" onClick={closeModal} className="x-btn">
            <FontAwesomeIcon icon={faX} className="x-icon" />
          </button>
          <div className="flex-container modal-detail">
            <img src={phone.image} alt={phone.title} />
            <div className="details">
              <h3 className="phone-title">{phone.title}</h3>
              <p className="left-par">Brand: {phone.brand}</p>
              <p className="left-par">Price: $ {phone.price}</p>
              <p className="left-par">Stock: {phone.stock}</p>
              <p className="left-par">Seller: {phone.sellerName}</p>
              <button
                onClick={() => handleAddToCart(phone)}
                type="button"
                className="btn btn-yellow"
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className="comment-container">
            <h2>Reviews</h2>
            <table className="comment-table">
              <thead>
                <tr>
                  <th>Comments</th>
                  <th>Rating</th>
                  <th>Reviewer</th>
                </tr>
              </thead>
              <tbody>
                {phone.reviews
                  .filter((review) => !review.hidden)
                  .slice(0, visibleReviews)
                  .map((review, index) => {
                    const commentToShow =
                      review.comment.length > 200
                        ? showLess
                          ? review.comment
                          : `${review.comment.substring(0, 200)}...`
                        : review.comment;
                    return (
                      <tr className="comments" key={review._id}>
                        <td
                          className="left-par"
                          style={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                          }}
                        >
                          {review.comment.length > 200 ? (
                            <div>
                              {commentToShow}
                              {review.comment.length > 200 && (
                                <button
                                  type="button"
                                  className="showmore-btn"
                                  onClick={() => {
                                    setShowLess(!showLess);
                                    stayScroll();
                                  }}
                                >
                                  {showLess ? "Show less" : "Show more"}
                                </button>
                              )}

                              <br />
                            </div>
                          ) : (
                            review.comment
                          )}
                          <br />
                          {index === visibleReviews - 1 && (
                            <button
                              onClick={() => {
                                handleShowMore();
                                stayScroll();
                              }}
                              className="btn btn-green"
                              disabled={index !== visibleReviews - 1}
                            >
                              {index === visibleReviews - 1
                                ? "Show more Comments"
                                : ""}
                            </button>
                          )}
                        </td>
                        <td>{review.rating}</td>
                        <td>{review.reviewerName}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <AddCommentForm phone_id = {phone._id}/>
        </div>
      );
    }
  };

  return (
    <div>
      <section className="section-phonelisting container">
        <h2>Phone Lists</h2>

        <div className="input-container">
          <div>
            <select
              id="dropdown"
              value={brand}
              onChange={handleSelectChange}
              className="input-phone"
            >
              <option value="" selected>
                -- Please Select Brand--
              </option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="lg">LG</option>
              <option value="huawei">Huawei</option>
              <option value="sony">Sony</option>
              <option value="blackberry">BlackBerry</option>
              <option value="nokia">Nokia</option>
              <option value="motorola">Motorola</option>
              <option value="htc">HTC</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Enter phone name"
            className="input-phone input-phone-name"
            value={inputPhoneList}
            onChange={(e) => setInputPhoneList(e.target.value)}
          />
        </div>

        <ShowModal />

        <div className="flex-container">
          {searchedPhoneLists
            .filter((phone) => phone.enable) // Filter only enabled phones
            .filter((phone) => phone.stock > 0)
            .map((phone) => (
              <div className="phone-details" key={phone._id}>
                <img src={phone.image} alt={phone.title} />
                <b>{phone.title}</b>
                <p>{phone.brand}</p>
                <p>$ {phone.price}</p>
                <div className="flex-container btn-container">
                  <button
                    onClick={() => handleAddToCart(phone)}
                    type="button"
                    className="btn btn-yellow"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShowDetails(phone._id)}
                    className="btn btn-blue"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default PhoneListing;
