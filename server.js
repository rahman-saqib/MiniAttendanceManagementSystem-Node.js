const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const xss = require("xss-clean");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize') 
//const fetch = require('node-fetch');
//const { stringify } = require('querystring');
const app = express();
var port = process.env.PORT || 8080
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://Sam:softaweb@cluster0-xe3q0.mongodb.net/test?retryWrites=true&w=majority';
//var Recaptcha = require('express-recaptcha').RecaptchaV3;
//sfsgdfgdgdgddgdg
app.use(express.json({ limit: '10kb' }));
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests' // message to send
});
app.use('/form', limit);
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.get('/form', (_, res) => res.sendFile(`${__dirname}/sites/index.html`));


app.post('/thankyou', async (req, res) => {
    //console.log(req.body);
    res.sendFile(`${__dirname}/sites/success.html`);
    MongoClient.connect(url, function(err , db){
        var q = req.body;
        var dbo = db.db("AttendanceData");
        console.log(q);
        if(err) throw err;
        dbo.collection('stuattendance').insertOne(q, function(err , result){
            if(err) throw err;
            
            console.log("1 Data inserted success");
            db.close();
        });

    });

    
  });

app.listen(port, () => console.log('Server started on port'));
