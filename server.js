var express = require("express");
var app = express();
var port = process.env.PORT || 3300;
var dotenv = require('dotenv');
dotenv.config();
var cors = require('cors');
var bodyParser = require('body-parser');

//SSL certificates
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./certs/server-key.pem'),
    cert: fs.readFileSync('./certs/server-cert.pem'),
};


var sgMail = require('@sendgrid/mail');
var templateId = "d-37104ac913374aee92260eae82b89079";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.get("/", (req,res) => {
  return res.send("Get Request");
})

app.post("/send-email", (req, res) => {

const data = req.body;

console.log(data)
 
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: data.email, // your recipient
  from: 'dev.jorawar.singh@gmail.com', //  verified sender
  // subject: 'Zest - Recommendation for you',
  templateId: templateId,
  dynamic_template_data: {
    name: data.name,
    supplements: data.recommendedSupplementsForEmail,
    subject: 'Longevity supplement quiz: your results',
  }
  // html: template,
}

// console.log("Recommended ------------------", data.recommendedSupplementsForEmail[0])

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
    res.send(req.body);
  })
  .catch((error) => {
    console.error("Error: ",error)
    res.status(400).send(error);
  })

  
});

// app.listen(port);

var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

