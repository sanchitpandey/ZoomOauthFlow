console.log("Hello!");

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const tokenUrl = "https://zoom.us/oauth/token/?";
var buffer = require("buffer").Buffer;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on 3000");
});

app.get("/token", (req, res) => {
  if (req.query.code != null) {
    var authCode = req.query.code;
    var auth =
      "Basic " +
      new buffer.from(
        "ZfyVB0fURFCcMywvpQOjxA:PwqfT0bKdzOmuPehmWCbM7R7fi8SR7te"
      ).toString("base64");
    request.post(
      {
        url:
          tokenUrl +
          `grant_type=authorization_code&code=${authCode}&redirect_uri=http://fathomless-sands-96704.herokuapp.com/token`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      },
      function (err, response) {
        if (err) res.send("Error");
        console.log(response);
        var json = JSON.parse(response.body);
        //console.log("Access Token:", json.access_token);
        res.status(200).send(json.access_token);
      }
    );
  } else {
    console.log("2nd round");
  }
});

app.get("/", (req, res) => {
  res.status(200).send(req.query);
});
