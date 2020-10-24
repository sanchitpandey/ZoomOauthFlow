console.log("Hello!");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on 3000");
});

// Agora
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const appID = "1d613ab954ca4b0096d7cad92e1402a1";
const appCertificate = "8b06a2bb174645eebcfb7a75c9b0594a";
var channelName = "7d72365eb983485397e3e3f9d460bdda";
var uid = 2882341273;
const role = RtcRole.BROADCASTER;

const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

app.get("/", (req, res) => {
  uid = req.query.id;
  channelName = req.query.channel;
  const tokenB = RtcTokenBuilder.buildTokenWithAccount(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  // const tokenA = RtcTokenBuilder.buildTokenWithUid(
  //   appID,
  //   appCertificate,
  //   channelName,
  //   uid,
  //   role,
  //   privilegeExpiredTs
  // );
  res.status(200).send(tokenB);
});

// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

// Build token with uid

// Build token with user account

//console.log("Token With UserAccount: " + tokenB);
