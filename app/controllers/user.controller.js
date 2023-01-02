const userModel = require("../../db/models/user.model");
const adminModel = require("../../db/models/admin.model");

class user {
  static newUser = async (req, res) => {
    try {
      let Start = new Date(`${req.body.contractStartDate}`);
      let End = new Date(`${req.body.contractEndDate}`);
      let scanStart = new Date();
      let scanEnd = new Date();
      scanEnd.setMonth(scanEnd.getMonth() + 1);

      if (req.admin.role === "master") {
        var user = new userModel({
          ...req.body,
          location: {
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            address: req.body.address,
          },
          warning: {
            warningName:
              req.body.warning.warningName === "الإنذارات" ||
              !req.body.warning.warningName
                ? null
                : req.body.warning.warningName,
            warningDate:
              req.body.warning.warningName === "الإنذارات" ||
              !req.body.warning.warningDate
                ? null
                : req.body.warning.warningDate,
            warningNote:
              !req.body.warning.warningNote ||
              req.body.warning.warningName === "الإنذارات"
                ? "لا توجد ملاحظات"
                : req.body.warning.warningNote,
          },

          penalty: {
            penaltyName:
              req.body.penalty.penaltyName === "المخالفات" ||
              !req.body.penalty.penaltyName
                ? null
                : req.body.penalty.penaltyName,
            penaltyDate:
              req.body.penalty.penaltyName === "المخالفات" ||
              !req.body.penalty.penaltyDate
                ? null
                : req.body.penalty.penaltyDate,
            penaltyNote:
              !req.body.penalty.penaltyNote ||
              req.body.penalty.penaltyName === "المخالفات"
                ? "لا توجد ملاحظات"
                : req.body.penalty.penaltyNote,
          },

          scanning: {
            ...req.body.scanning,
            start: scanStart,
            end: scanEnd,
          },

          awarenessTimes: !req.body.awarenessTimes
            ? 0
            : req.body.awarenessTimes,
          contractStartDate: !req.body.contractStartDate ? null : Start,
          contractEndDate: !req.body.contractEndDate ? null : End,
        });
      } else {
        var user = new userModel({
          ...req.body,
          location: {
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            address: req.body.address,
          },
          warning: {
            warningName:
              req.body.warning.warningName === "الإنذارات" ||
              !req.body.warning.warningName
                ? null
                : req.body.warning.warningName,
            warningDate:
              req.body.warning.warningName === "الإنذارات" ||
              !req.body.warning.warningDate
                ? null
                : req.body.warning.warningDate,
            warningNote:
              !req.body.warning.warningNote ||
              req.body.warning.warningName === "الإنذارات"
                ? "لا توجد ملاحظات"
                : req.body.warning.warningNote,
          },
          warningsNumber:
            req.body.warning.warningName === "الإنذارات" ||
            !req.body.warning.warningName
              ? 0
              : 1,

          penalty: {
            penaltyName:
              req.body.penalty.penaltyName === "المخالفات" ||
              !req.body.penalty.penaltyName
                ? null
                : req.body.penalty.penaltyName,
            penaltyDate:
              req.body.penalty.penaltyName === "المخالفات" ||
              !req.body.penalty.penaltyDate
                ? null
                : req.body.penalty.penaltyDate,
            penaltyNote:
              !req.body.penalty.penaltyNote ||
              req.body.penalty.penaltyName === "المخالفات"
                ? "لا توجد ملاحظات"
                : req.body.penalty.penaltyNote,
          },
          penaltiesNumber:
            req.body.penalty.penaltyName === "المخالفات" ||
            !req.body.penalty.penaltyName
              ? 0
              : 1,

          scanning: {
            ...req.body.scanning,
            start: scanStart,
            end: scanEnd,
          },

          awarenessTimes: !req.body.awarenessTimes
            ? 0
            : req.body.awarenessTimes,
          site: req.admin.site,
          contractStartDate: !req.body.contractStartDate ? null : Start,
          contractEndDate: !req.body.contractEndDate ? null : End,
        });
      }

      if (req.body.type === "نظامية") {
        if (user.contractEndDate > Date.now()) {
          user.contractCondition = "ساري المفعول";
        } else {
          user.contractCondition = "العقد منتهي";
        }
      }
      if (req.body.type === "غير نظامية" && req.body.contractEndDate) {
        if (user.contractEndDate > Date.now()) {
          user.contractCondition = "ساري المفعول";
        } else {
          user.contractCondition = "العقد منتهي";
        }
      }
      if (req.body.type === "غير نظامية" && !req.body.contractEndDate) {
        user.contractCondition = "لا يوجد عقد إيجار";
      }
      if (
        req.body.warning.warningName !== "الإنذارات" &&
        req.body.warning.warningName !== ""
      ) {
        user.warnings.push(req.body.warning);
      }
      if (
        req.body.penalty.penaltyName !== "المخالفات" &&
        req.body.penalty.penaltyName !== ""
      ) {
        user.penalties.push(req.body.penalty);
      }

      user.history.push({
        adminName: req.admin.userName,
        role: req.admin.role,
        action: [
          {
            type: "اضافة",
            date: Date.now(),
            difference: null,
            differenceLength: 1,
          },
        ],
      });

      user.warningsNumber = user.warnings.length;
      user.penaltiesNumber = user.penalties.length;

      await user.save();

      const admins = await adminModel.find({ role: "admin" });
      admins.map((admin) => {
        if (admin.site === user.site) {
          user.pin = admin.pin;
          user.save();
        }
      });
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

  static editUser = async (req, res) => {
    try {
      var user = await userModel.findById(req.params.id);
      let different = [];
      let difLengths = [];
      let maxLength;
      let Start = !req.body.contractStartDate
        ? null
        : new Date(`${req.body.contractStartDate}`);
      let End = !req.body.contractEndDate
        ? null
        : new Date(`${req.body.contractEndDate}`);
      let dateTime = new Date().getTime();
      let bodyDate = new Date(`${req.body.contractEndDate}`).getTime();
      let warningDate =
        req.body.warning.warningDate === "المخالفات" ||
        !req.body.warning.warningDate
          ? null
          : new Date(`${req.body.warning.warningDate}`);
      let penaltyDate =
        req.body.penalty.penaltyDate === "المخالفات" ||
        !req.body.penalty.penaltyDate
          ? null
          : new Date(`${req.body.penalty.penaltyDate}`);

      if (user.unitArea !== req.body.unitArea) {
        different.push("رقم الوحدة");
      }
      if (user.ownerName !== req.body.ownerName) {
        different.push("اسم المالك");
      }
      if (user.ownerNumber !== req.body.ownerNumber) {
        different.push("رقم الهاتف المتحرك");
      }
      if (user.Id !== req.body.Id) {
        different.push("رقم الهوية");
      }
      if (user.site !== req.body.site) {
        different.push("المركز");
      }
      if (user.type !== req.body.type) {
        different.push("نوع العقد");
      }
      if (user.areaName !== req.body.areaName) {
        different.push("اسم الموقع");
      }
      if (user.location?.address !== req.body.address) {
        different.push("عنوان الموقع");
      }
      if (user.awarenessTimes !== req.body.awarenessTimes) {
        different.push("عدد مرات التوعية");
      }
      if (user.warning.warningName !== req.body.warning.warningName) {
        different.push("الانذار");
      }
      if (String(user.warning.warningDate) !== String(warningDate)) {
        different.push("تاريخ الانذار");
      }
      if (user.penalty.penaltyName !== req.body.penalty.penaltyName) {
        different.push("المخالفة");
      }
      if (String(user.penalty.penaltyDate) !== String(penaltyDate)) {
        different.push("تاريخ المخالفة");
      }
      if (String(user.contractStartDate) !== String(Start)) {
        different.push("تاريخ بداية العقد");
      }
      if (String(user.contractEndDate) !== String(End)) {
        different.push("تاريخ نهاية العقد");
      }

      await userModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
          location: {
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            address: req.body.address,
          },
          warning: {
            warningName:
              req.body.warning.warningName === "الإنذارات"
                ? null
                : req.body.warning.warningName,
            warningDate:
              req.body.warning.warningName === "الإنذارات" ||
              !req.body.warning.warningDate
                ? null
                : req.body.warning.warningDate,
            warningNote:
              !req.body.warning.warningNote ||
              req.body.warning.warningName === "الإنذارات"
                ? "لا توجد ملاحظات"
                : req.body.warning.warningNote,
          },

          penalty: {
            penaltyName:
              req.body.penalty.penaltyName === "المخالفات"
                ? null
                : req.body.penalty.penaltyName,
            penaltyDate:
              req.body.penalty.penaltyName === "المخالفات" ||
              !req.body.penalty.penaltyDate
                ? null
                : req.body.penalty.penaltyDate,
            penaltyNote:
              !req.body.penalty.penaltyNote ||
              req.body.penalty.penaltyName === "المخالفات"
                ? "لا توجد ملاحظات"
                : req.body.penalty.penaltyNote,
          },

          awarenessTimes: !req.body.awarenessTimes
            ? 0
            : req.body.awarenessTimes,
          contractStartDate: !req.body.contractStartDate ? null : Start,
          contractEndDate: !req.body.contractEndDate ? null : End,
        }
      );

      if (req.body.contractStartDate && req.body.contractEndDate) {
        if (bodyDate > dateTime) {
          user.contractCondition = "ساري المفعول";
        } else {
          user.contractCondition = "العقد منتهي";
        }
      } else {
        user.contractCondition = "لا يوجد عقد إيجار";
      }

      if (
        req.body.warning.warningName !== req.body.warning.warningName &&
        req.body.warning.warningName !== "الإنذارات"
      ) {
        user.warnings.push(req.body.warning);
      }
      if (
        req.body.penalty.penaltyName !== req.body.penalty.penaltyName &&
        req.body.penalty.penaltyName !== "المخالفات"
      ) {
        user.penalties.push(req.body.penalty);
      }

      user.history.push({
        adminName: req.admin.userName,
        role: req.admin.role,
        action: [
          {
            type: "تعديل",
            date: Date.now(),
            difference: different,
            differenceLength: different.length,
          },
        ],
      });

      user.history.map((h) => {
        h.action.map((a) => {
          difLengths.push(a.differenceLength);
        });
      });

      maxLength = Math.max(...difLengths);

      user.history.map((h) => {
        h.action.map((a) => {
          a.maxLength = maxLength;
        });
      });

      user.warningsNumber = user.warnings.length;
      user.penaltiesNumber = user.penalties.length;

      const admins = await adminModel.find({ role: "admin" });
      admins.map((a) => {
        if (a.site === user.site) {
          user.pin = a.pin;
        }
      });

      await user.save();

      different = [];

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

  static deleteUser = async (req, res) => {
    try {
      await userModel.findOneAndDelete({ _id: req.params.id });
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

  static getUser = async (req, res) => {
    try {
      if (req.admin.role === "master") {
        var masterUsers = await userModel.find();
      } else {
        var adminUsers = await userModel.find({ site: req.admin.site });
      }

      res.status(200).send({
        apiStatus: true,
        data: masterUsers || adminUsers,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static getUsersPIN = async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).send({
        apiStatus: true,
        data: users,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static targetUser = async (req, res) => {
    try {
      const user = await userModel.find({ Id: req.params.id });
      if (!user) throw new Error("user not found!");
      res.status(200).send({
        apiStatus: true,
        data: user,
      });
    } catch (e) {
      res.status().send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static qrCounter = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      user.scanning.scanningTimes = user.scanning.scanningTimes + 1;

      await user.save();
      res.status(200).send({
        apiStatus: true,
      });
    } catch (e) {
      res.status().send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
}

module.exports = user;
