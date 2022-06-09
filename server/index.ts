// 0.000000001 SOL === 1 Lamport

const express = require("express");
const asyncHandler = require('express-async-handler')
const request = require('request');

const PORT = process.env.PORT || 3001;

const app = express();

app.get("", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get(
  "/top20",
  [],
  asyncHandler(async (req, res) => {
    const headers = {
      'Content-Type': 'application/json'
    };

    const dataString = '{ "jsonrpc": "2.0", "id": 1, "method": "getLargestAccounts" }';
    
    const options = {
      url: 'http://localhost:8899',
      method: 'POST',
      headers: headers,
      body: dataString
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        const top20 = JSON.parse(body);
        top20.result.value.forEach((account, i) => {
          account.sol = account.lamports / 1000000000
          // TODO - Find out how to request exact sol conversion rate 
          account.usd = account.sol * 0.27
        })
        return res.json(top20.result.value)
      } else {
        return error
      }
    }
    
    request(options, callback);
    
  }),
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});