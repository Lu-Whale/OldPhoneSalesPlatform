const { Router } = require('express');
const { getPhoneLists, addComment, getPhoneListsById } = require('../controller/PhoneListControllers');

const router = Router();

router.get("/getAllPhoneList", getPhoneLists);
router.get("/getPhoneList/:id", getPhoneListsById);
router.post("/add-comment", addComment);
module.exports = router;