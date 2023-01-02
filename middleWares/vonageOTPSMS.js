const Vonage = require("@vonage/server-sdk");
const vonage = new Vonage({
  applicationId: "dc487bc0-0039-4f56-aeeb-6c7acdd8bdb7",
  privateKey: "../private.key",
});
module.exports = vonage;
