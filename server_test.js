var http = require('http');
const https = require('https');
const fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer'); 
const Email = require('email-templates');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

var myPassword = "alikem1995";

const { fork } = require('child_process');
var mailer = fork('mailer.js',['mail.yatitrend@gmail.com', myPassword]);

mailer.on('error', (err) => {
   console.log("\n\t\tERROR: spawn failed! (" + err + ")");
   mailer = fork('mailer.js',['mail.yatitrend@gmail.com', myPassword]);
 });


app.use(bodyParser.json()); // for parsing application/json
//app.use(cookieParser());


//function to serve static pages
app.use('/',express.static(path.join(__dirname,'')));


//With no particular path stated, we will redirect to homepage
app.get('/', serveHomePage);

app.post('/SubmitOrder', submitOrder);

app.post('/Request', processRequest);

http.createServer(app).listen(80);

console.log('Server running at local host :80');


function serveHomePage(req,res)
{
	res.redirect('/hu/index.html');
}

function submitOrder(req,res){
	
	req=req.body;
	let template;
	
	if(req.paymentMethod=='payOnDelivery')
		template='Dome_payOnDelivery';
	else template='Dome_bank';
	
	package = {template: template, to: req.contact.email, locals:{order: req}};
	mailer.send(package);
	
	res.json(JSON.stringify({Result:"OK"}));	
}

function processRequest(req,res){
	req=req.body;
	
	package = {template: 'dome_request', to: req.email, locals:{contact: req}};
	mailer.send(package);
	res.json(JSON.stringify({Result:"OK"}));
}








