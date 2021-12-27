const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const xss = require("xss-clean");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize') 


const app = express();
var port = process.env.PORT || 8080
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_URL;

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
app.get('/form', (req, res) => res.sendFile(`${__dirname}/sites/index.html`));


app.post('/thankyou', (req, res) => {
    //console.log(req.body);
    res.sendFile(`${__dirname}/sites/success.html`);
    MongoClient.connect(url, function(err , client){
         if(err) throw err;
        var q = req.body;
        var db;
        const dbo = client.db("AttendanceData");
        //console.log(q);
       
        dbo.collection('stuattendance').insertOne(q, function(err , result){
            if(err) throw err;
            
            console.log("1 Data inserted success");
            client.close();
        });

    });

    
  });

app.listen(port, () => console.log('Server started on port'));


