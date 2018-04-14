const express = require('express');
const request = require('request');
const app = express();

const oauthDetails = {
  client_id: 'oauth2client_00009VT3ke3SbB6V5jy2G9',
  client_secret: 'mnzpub.ZEQf2U7yYIKt8YrGgbA+boAeVOTXJIts9nrCSPYsacfanD6+VFLkzXCUUavqdoIid10zq9NMAg98KvJJCw8r',
  redirect_uri: 'http://localhost:3000/oauth/callback'
};

// Will be populated once received
let accessToken = null;

app.get('/', (req, res) => {
  const { client_id, redirect_uri } = oauthDetails;
  const monzoAuthUrl = 'https://auth.monzo.com';
  res.type('html');
  res.send(`
    <h1>Hello</h1>
    <form action="${monzoAuthUrl}">
      <input type="hidden" name="client_id" value="${client_id}" />
      <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
      <input type="hidden" name="response_type" value="code" />
      <button>Sign in</button>
    </form>
  `);
});

app.get('/oauth/callback', (req, res) => {
  const { client_id, client_secret, redirect_uri } = oauthDetails;
  const { code } = req.query;
  const monzoAuthUrl = `https://api.monzo.com/oauth2/token`;
  
  // Initiate request to retrieve access token
  request.post({
    url: monzoAuthUrl,
    form: {
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      redirect_uri,
      code
    } 
  }, (err, response, body) => {
    accessToken = JSON.parse(body); // Populate accessToken variable with token response
    res.redirect('/accounts'); // Send user to their accounts
  });
});

app.get('/accounts', (req, res) => {
  const { token_type, access_token } = accessToken;
  const accountsUrl = 'https://api.monzo.com/accounts';
  
  request.get(accountsUrl, {
    headers: {
      Authorization: `${token_type} ${access_token}` 
    }
  }, (req, response, body) => {
    const { accounts } = JSON.parse(body);

    res.type('html');
    res.write('<h1>Accounts</h1><ul>');
    
    for(let account of accounts) {
      const {id, type, description } = account;
      res.write(`
        <li>
          ${description}(<i>${type}</i>) - <a href="/transactions/${id}">View transaction history</a>
        </li>
      `);
    }
    
    res.end('</ul>');
  });
});

// // customizing the behavior of app.param()
// app.param(function(param, option) {
//   return function (req, res, next, val) {
//     if (val == option) {
//       next();
//     }
//     else {
//       next('route');
//     }
//   }
// });

// // using the customized app.param()
// app.param('id', "acc_00009Ps4RPjuHJJHfAXJth");

app.get('/transactions/:acc_id', (req, res) => {
  console.log("TEST");
  const acc_id = req.params.acc_id;
  console.log(acc_id);
  const { token_type, access_token } = accessToken;
  console.log(accessToken);
  const transUrl = `https://api.monzo.com/transactions?expand[]=merchant&account_id=${acc_id}`;
  
  request.get(transUrl, {
    headers: {
      Authorization: `${token_type} ${access_token}`
    }
  }, (req, response, body) => {
    const { transactions } = JSON.parse(body);
    console.log(response);
    console.log(transactions);
    var balance = 0;
    res.type('html');
    res.write('<h1>Transactions</h1> <ul>');
    for(let transaction of transactions) {
      const {account_balance, amount, created, currency, description, merchant} = transaction;
      balance = (balance + amount/100);
      const pence = amount/100;

      if (merchant == null) {
        const name = 'Top Up';
        // Top Up - (<i>£${pence}</i>)
        res.write(`
          <li>
            ${name}(<i>£${pence}</i>)
          </li>
        `);
      }
      else {
        const name = merchant.name;
        console.log(name);
        res.write(`
          <li>
            ${name}(<i>£${pence}</i>)
          </li>
        `);
      }
      // console.log(name)

      // console.log(balance);

    }
    // res.send('</ul>');
    res.end('</ul>');
    // res.end(`<p>${money}</p>`);
  });
});

app.listen(3000,function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});




// var express = require('express');
// var request = require('request');
// // var bodyParser = require('body-parser');
// // var fs = require('fs');
// // var http = require('http');

// var app = express();

// app.set('view engine', 'ejs');  //tell Express we're using EJS
// app.set('views', __dirname + '/views');  //set path to *.ejs files
// //put your static files (js, css, images) into /public directory
// app.use('/public', express.static(__dirname + '/public'));


// //get some server data for sending it to the client
// "use strict";



// app.get('/', function(req, res) {
//   request.get(
//       "https://auth.monzo.com/?\
//       client_id=oauth2client_00009VT3ke3SbB6V5jy2G9&\
//       redirect_uri=localhost:8000/callback&\
//       response_type=code&\
//       state=555",
//       function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//               console.log(body)
//           }
//       }
//   );
//   // res.render('producer'); 
// });

// app.get('/callback', function(req, res) {
//   res.render('producer'); 
// });



// app.listen(8000,function () {
//   console.log('Server is listening on port 8000. Ready to accept requests!');
// });