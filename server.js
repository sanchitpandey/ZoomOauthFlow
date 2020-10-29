console.log("Hello!");

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const tokenUrl = "https://zoom.us/oauth/token/?";
const zoom = "https://api.zoom.us/v2/users/";
const webAPIKey = "AIzaSyD1i2UpM9PjXkd9uRyxC23DBPbRnnwugr4";
const dynamicURL = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${webAPIKey}`;
const templateMeeting = {
  agenda: "string",
  duration: 3600,
  password: "string",
  //schedule_for: "string",
  settings: {
    alternative_hosts: "",
    approval_type: 2,
    audio: "both",
    auto_recording: "local",
    cn_meeting: false,
    enforce_login: false,
    enforce_login_domains: "",
    global_dial_in_countries: [null],
    host_video: false,
    in_meeting: false,
    join_before_host: true,
    mute_upon_entry: false,
    participant_video: false,
    registrants_email_notification: false,
    registration_type: 2,
    use_pmi: true,
    watermark: true,
  },
  start_time: Date.now().toString,
  timezone: "EST",
  topic: "string",
  type: 2,
};
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
        var token = json.access_token;
        // Create Meeting
        request.get(
          {
            url: zoom + "me",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          },
          (err, response) => {
            if (err) {
              console.log(err);
            } else {
              var json = JSON.parse(response.body);
              var uid = json.account_id;
              request.post(
                {
                  url: zoom + `me/meetings`,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                  },
                  json: true,
                  body: templateMeeting,
                },
                (err, response) => {
                  if (err) {
                    console.log(err);
                    res.send("Error");
                  } else {
                    var url = response.body.start_url;
                    //res.send("Success");
                    request.post(
                      {
                        url: dynamicURL,
                        body: JSON.stringify({
                          dynamicLinkInfo: {
                            domainUriPrefix: "https://doorapp.page.link",
                            link: "https://www.example.com/?url=" + url,
                            androidInfo: {
                              androidPackageName: "com.sanchit.door_app",
                            },
                            iosInfo: {
                              iosBundleId: "com.example.ios",
                            },
                          },
                        }),
                      },
                      (err, response) => {
                        if (err) {
                          console.log(err);
                        } else {
                          var json = JSON.parse(response.body);
                          res.redirect(json.shortLink);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  } else {
    console.log("2nd round");
  }
});
