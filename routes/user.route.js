const router = require("express").Router();
const userController = require("../app/controllers/user.controller");
const auth = require("../middleWares/authorization");

router.get(
  "/getUser",
  auth("admin", "master", "readOnly"),
  userController.getUser
);
router.get("/usersPIN", userController.getUsersPIN);
router.post("/newUser", auth("master", "admin"), userController.newUser);
router.post("/editUser/:id", auth("master", "admin"), userController.editUser);
router.post(
  "/deleteUser/:id",
  auth("master", "admin"),
  userController.deleteUser
);
router.post("/qrCounter/:id", userController.qrCounter);
router.get("/user/:id", userController.targetUser);

module.exports = router;
