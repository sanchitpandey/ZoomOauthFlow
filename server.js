console.log("Hello!");

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const request = require("request");
const app = express();
const tokenUrl = "https://zoom.us/oauth/token/?";
const qs = require("qs");
var buffer = require("buffer").Buffer;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on 3000");
});

app.get("/token", (req, res) => {
  res.send(req.query);
});

app.get("/", (req, res) => {
  var authCode = "ZgrWVmmnC7_8z1vP2MIRQiMmLz8qSCV4g";
  var auth =
    "Basic " +
    new buffer.from(
      "ZfyVB0fURFCcMywvpQOjxA:PwqfT0bKdzOmuPehmWCbM7R7fi8SR7te"
    ).toString("base64");
  request.post(
    {
      url:
        tokenUrl +
        `grant_type=authorization_code&code=${authCode}&redirect_uri=https://8c5e0b2b86a0.ngrok.io/token`,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    },
    function (err, res) {
      console.log(res);
      var json = JSON.parse(res.body);
      //console.log("Access Token:", json.access_token);
    }
  );
  res.status(200).send("hi");
});
