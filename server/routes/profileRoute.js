const express = require("express");
// const {middlewareAuth} = require("../utils/jwt");

const {
    getUser,
    changePassword,
    editProfile,
    addNewPhoneListing,
    getPhoneListingByUser,
    updatePhonelistingEnableStatus,
    deletePhoneListingById,
    getCommentsByPhoneListingsUser,
    updateCommentHiddenStatus,
    
} = require("../controller/profileController");

const profileRouter = express.Router();

profileRouter.post("/profile/user", getUser);
profileRouter.post("/profile/edit-profile", editProfile);
profileRouter.post("/profile/add-new-phone-listing", addNewPhoneListing);
profileRouter.post("/profile/change-password", changePassword);
profileRouter.post("/profile/get-phone-listings-by-user", getPhoneListingByUser);
profileRouter.get("/profile/get-comments-by-user", getCommentsByPhoneListingsUser);
profileRouter.post("/profile/update-enable", updatePhonelistingEnableStatus);
profileRouter.post("/profile/update-hidden", updateCommentHiddenStatus);
profileRouter.delete('/profile/:id', deletePhoneListingById);

module.exports = profileRouter;





