import { useState } from "react";
import axios from "axios";
import { baseURL } from "../../utils/constant";
import { Link } from "react-router-dom";
import "./PhoneList.css";

const AddCommentForm = (props) => {
  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/add-comment`, {
        phoneId: props.phone_id,
        rating: rating,
        comment: comment,
        currentUserId: currentUser.userId, // Assuming `currentUser` contains the `userId` property
      });

      console.log(response.data);
      alert("You have uploaded your comments! Please refresh the page")
      // Reset form fields
      setRating("");
      setComment("");
      setError(null);
    } catch (error) {
      console.log(error, e);
      setError("An error occurred while submitting the comment.");
      // Handle error response or display an error message
    }
  };

  if(currentUser) {
    return (
      <form
        onSubmit={handleAddComment}
        className="add-comment-container"
      >
        {error && <p className="error">{error}</p>}
          <label>Comment:</label>
          <br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-textarea"
            required
          />
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          placeholder="Rating 1 - 5"
          className="comment-number"
          required
        />
        <br />
        <button type="submit" className="btn btn-blue">
          Submit
        </button>
      </form>
    );
  } else {
    return (
      <>
      <strong>Please <Link to="/login" className="login-link">
          Login
        </Link> to add comment</strong></>
    )
  }

};

export default AddCommentForm;
