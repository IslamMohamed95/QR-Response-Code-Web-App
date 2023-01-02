const router = require("express").Router();
const adminController = require("../app/controllers/admin.controller");
const auth = require("../middleWares/authorization");

router.post("/addReadOnly", auth("master"), adminController.addReadOnlyAdmin);
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post(
  "/logout",
  auth("master", "admin", "readOnly"),
  adminController.logout
);
router.post(
  "/logoutAll",
  auth("master", "admin", "readOnly"),
  adminController.logoutAllDevices
);
router.post(
  "/warningAndPenalties",
  auth("master", "admin"),
  adminController.addWarningPenalty
);
router.post(
  "/editMasterAdmin",
  auth("master"),
  adminController.toggleAdminMaster
);
router.post("/generatePIN", auth("admin"), adminController.generatePIN);
router.post("/edit/:id", auth("master", "admin"), adminController.editAdmin);
router.post(
  "/delete/:id",
  auth("master", "admin"),
  adminController.deleteAdmin
);
router.post(
  "/editAdmin",
  auth("master", "admin"),
  adminController.editAdminProfile
);
router.get("/admins", adminController.getAdmins);
router.get(
  "/admin",
  auth("master", "admin", "readOnly"),
  adminController.getCurrentAdmin
);
router.get("/master", adminController.getMasterAdmin);
router.get(
  "/adminsMaster",
  auth("master", "admin"),
  adminController.adminsExceptMaster
);
router.post("/addMaster", auth("master"), adminController.addMasterAdmin);
module.exports = router;
