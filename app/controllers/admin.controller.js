const adminModel = require("../../db/models/admin.model");
const userModel = require("../../db/models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class admin {
  static register = async (req, res) => {
    try {
      if (req.body.userName === "salemmak") {
        var masterAdmin = new adminModel({
          ...req.body,
          role: "master",
          master: true,
          site: " ",
        });
        await masterAdmin.save();
      } else {
        var admin = new adminModel({ ...req.body, master: false });
        var editMaster = await adminModel.findOneAndUpdate(
          { userName: "salemmak" },
          {
            master: true,
          }
        );
        await editMaster.save();
        await admin.save();
      }

      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  /*----------- Logging -----------*/
  static login = async (req, res) => {
    try {
      const admin = await adminModel.findOne({ userName: req.body.userName });
      if (!admin) throw new Error("خطأ في اسم المستخدم أو كلمة السر");
      const validatePassword = await bcrypt.compare(
        req.body.password,
        admin.password
      );
      if (!validatePassword)
        throw new Error("خطأ في اسم المستخدم أو كلمة السر");
      const token = jwt.sign({ _id: admin._id }, "TokenDecPass");
      admin.tokens.push({ token });
      admin.save();
      res.status(200).send({
        apiStatus: true,
        token: token,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static logout = async (req, res) => {
    try {
      req.admin.tokens = req.admin.tokens.filter((t) => {
        return t.token != req.token;
      });
      req.admin.save();
      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static logoutAllDevices = async (req, res) => {
    try {
      req.admin.tokens = [];
      req.admin.save();
      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static generatePIN = async (req, res) => {
    try {
      var code = "";
      for (var i = 0; i < 5; i++) {
        code = code.concat(parseInt(Math.random() * 10));
      }
      if (req.admin.role === "admin") {
        req.admin.pin = code;
        req.admin.save();
      }
      const admins = await adminModel.find({ role: "admin" });
      admins.map((a) => {
        if (a.site === req.admin.site) {
          a.pin = code;
          a.save();
        }
      });

      const users = await userModel.find();
      users.map((u) => {
        if (u.site === req.admin.site) {
          u.pin = code;
          u.save();
        }
      });
      res.status(200).send({
        apiStatus: true,
        data: code,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static getCurrentAdmin = async (req, res) => {
    res.send(req.admin);
  };
  static toggleAdminMaster = async (req, res) => {
    try {
      if (req.admin.master === true) {
        req.admin.master = false;
      } else {
        req.admin.master = true;
      }
      req.admin.save();
      res.send({
        apiStatus: true,
        data: req.admin,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static getMasterAdmin = async (req, res) => {
    try {
      const masterAdmin = await adminModel.findOne({ userName: "salemmak" });
      await masterAdmin.save();
      res.status(200).send({
        apiStatus: true,
        data: masterAdmin,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static getAdmins = async (req, res) => {
    try {
      const admins = await adminModel.find();
      res.status(200).send({
        apiStatus: true,
        admins: admins,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  /*--- Edit Admins by master admin ----*/
  static editAdmin = async (req, res) => {
    try {
      const admin = await adminModel.findById(req.params.id);
      await adminModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
          password: await bcrypt.hash(req.body.password, 10),
        }
      );
      await admin.save();
      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static deleteAdmin = async (req, res) => {
    try {
      await adminModel.findOneAndDelete({ _id: req.params.id });
      var admins = await adminModel.find();
      admins = admins.filter((admin) => {
        return admin.userName !== "salemmak";
      });
      res.status(200).send({
        apiStatus: true,
        data: admins,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: true,
        message: e.message,
      });
    }
  };
  static adminsExceptMaster = async (req, res) => {
    try {
      var admins = await adminModel.find();
      admins = admins.filter((admin) => {
        return admin.userName !== "salemmak";
      });
      res.status(200).send({
        apiStatus: true,
        data: admins,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  /*--------- Edit admin profile -----------*/
  static editAdminProfile = async (req, res) => {
    try {
      await adminModel.findOneAndUpdate(
        { _id: req.admin._id },
        {
          ...req.body,
          password: await bcrypt.hash(req.body.password, 10),
        }
      );
      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  /*-------------- Add Master --------------*/
  static addMasterAdmin = async (req, res) => {
    try {
      if (req.admin.role === "master") {
        var newMaster = new adminModel({
          ...req.body,
          role: "master",
          master: true,
          site: " ",
        });
      }
      await newMaster.save();
      res.status(200).send({
        apiStatus: true,
        data: newMaster,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  /*-------- Add ReadOnly Admin -------------*/
  static addReadOnlyAdmin = async (req, res) => {
    try {
      if (req.admin.userName === "salemmak") {
        const readOnlyAdmin = new adminModel({
          ...req.body,
          role: "readOnly",
        });
        await readOnlyAdmin.save();
      }

      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  /*---------- Add Warning or Penalty ------ */
  static addWarningPenalty = async (req, res) => {
    try {
      const user = await userModel.findOne({ Id: req.body.Id });
      if (req.body.Type === "انذار") {
        user.warning = {
          warningName: req.body.warning.warningName,
          warningDate: req.body.warning.warningDate,
          warningNote: req.body.warning.warningNote,
        };
        user.warnings.push(req.body.warning);
        user.warningsNumber = user.warnings.length;
      } else if (req.body.Type === "مخالفة") {
        user.penalty = {
          penaltyName: req.body.penalty.penaltyName,
          penaltyDate: req.body.penalty.penaltyDate,
          penaltyNote: req.body.penalty.penaltyNote,
        };
        user.penalties.push(req.body.penalty);
        user.penaltiesNumber = user.penalties.length;
      }

      await user.save();

      res.status(200).send({
        apiStatus: true,
        data: user,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
}

module.exports = admin;
