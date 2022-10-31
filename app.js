const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config(); 
const https = require("https");
const AUTH = process.env.AUTH
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res) {

  const firstName = req.body.fName
  const lastName = req.body.lName
  const mail = req.body.mail

  const data = {
    members: [{
      email_address: mail,
      status: "subscribed",
      merge_field: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  var jsonData = JSON.stringify(data);
  const url = "https://us11.api.mailchimp.com/3.0/lists/9839fc3cf6"
  const option = {
    method: "POST",
    AUTH
  }
  const request = https.request(url, option, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failfure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })

  })
  request.write(jsonData);
  request.end();


  console.log(firstName, lastName, mail);

});

app.post("/failure", function(req, res){
   res.redirect("/");
});
app.post("/success", function(req, res){
   res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
});


