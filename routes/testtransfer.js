var express = require('express');
var uuid = require('uuid');
var request = require('request');
var transferServiceClass = require('../node_modules/mastercard-api-node/services/moneysend/TransferService');
var environment = require('../node_modules/mastercard-api-node/common/Environment');

var OAuth = require('mashape-oauth').OAuth;
var sha1 = require('sha1');
var base64 = require('base64-js');
var xml2js = require('xml2js');
//var dateUtils = require('date-utils');


var CONSUMER_SECRET = '-----BEGIN RSA PRIVATE KEY-----\n' +
'MIIEpAIBAAKCAQEAzNn6rvOq9fMADEwtrddWmCeuRowp6jz5ERHXhv7xH6DRZGmo\n' +
'0PFifjfH8bGOw7U3ND0HzH1hTVw/1NceCpf5OfGo3ckG49cP8XWJR5t53MsCUnlC\n' +
'Q43o7U+/smrs4Uu+CeJ+no83jeppOsULQDmlruzkEv72rqkNwpHW7AqCwGnFNT1c\n' +
'AHo3xoyQ0TDeDE/kn7tZljbzwsrZIb+seZkmZ6XrB2AiqZXfFrBhzFs8hb3nqyV/\n' +
'A2O0R0Fmk3+tKmU1QiAwWMKD1GE6pU7JNvb/Bo4AybjdrOYM7ssGODcLlhn9iFPR\n' +
'faRSxj8usH5HkmKPbSwGdxQg3wZE6wuVl8YdCQIDAQABAoIBAHnqkUNmSa0u/ixT\n' +
'eiwoKKVNmG7sJFYAC8uY7sitGhxUvcohCBOyVYgA8sJphin7w+sXF3kgdbRw3pxx\n' +
'mrN7VxyhMnsslSksaZSu+xDe+1vohm1HNaS25JW4DMLG2EwNpACGCA2d9tZDWHVd\n' +
'qCCFLpI48lRL4cx5WHMgEOVSLBcOyv0gnKl3FIikHdS/v3LcA/HPSsKFGAcPk6xd\n' +
'OwFl+TyGE3v3N4SrSYf7p8ygSMf82kwAu7YTEPTw3hoYeS4/qHJH5yPA+KeyOi0e\n' +
'OUYqv++xnqfusXc5ydT4/pm65IomykoyvessmWzHO8fCrDx4A0h5CouF9Pq6uOSg\n' +
'JQt8xgECgYEA8ujdd9gSwmK43Lk5TopemrE5VaWUPRHjAQ8wC2C5ktfw+yCKfRdn\n' +
'A7lj/XoV+PWUmC/qHhqOvXFeyR47XRgFIKm8vS0fF4zUZ7Yo7WaG3TsgUWCF31uX\n' +
'huZPTENPAiFVWK2CJ9nVS4LAhWTZkcB6FaOrVxGcdBfxO6jFTCZrxHECgYEA1+QS\n' +
'OJN+p1pELzfGs3v8iIIwpsDu/X8Na+GeQbn1sOWI4iGgCkE5cu6UJQxNyYH/+N1f\n' +
'7PRkPLJTYY3ME1Q9igPymiIbh/JPxZNIk50qEsLwNAjW1W2PhVUZb25EfNWYo8xR\n' +
'9rwGPGsbeJn36IWCFn4MIAVm3oYh5yjaqXR9zhkCgYBRDm2gqSSRYvoHBXPfBoNN\n' +
'IWhdcRRHUKmsV9ITaeJi4tYSJqiv11hTwNBh7BRa8C/2nL6F7xzEkIktmX37saE8\n' +
'ZgeKJP1kEWVrejisB3NnbWx6Wzgw8VJd/Ipni2pY7qCZJ8Tv4Vuwh+AQYzfK0Cys\n' +
'/eGV+1V20+p2mvnDUGrTsQKBgQCnNMc/9kxTxT+l6mcEv/R4rYyMukTfJLX6ZgWy\n' +
'FhrJ5Ry9NxnCl32tHEa04vCkLwFXd+1Bko7Hy710guQZ3FbFPAV7hwsXoX5TIZ1G\n' +
'ZqUdXsm3I1lwd6h+tcg7W4XDwZK02hxpInsZ9EKUh3tQJYb5cKpnaoeftPcxF50z\n' +
'PTvqkQKBgQDAmTOO690ac19F8V9ZKAIbuAkwXeICi5m/PS11WunG1YMzShSx4bhl\n' +
'o701h2Dm8Ey8it6ic6STV56nRwiMLLZmgKUb9yOJKCEvEm7lAhW/fnnxyACnH7EO\n' +
'lIXpJ8IDN3J/4VWJiOIAYIF0IPIezNX/e+CCspLw+8aewWRsJeJvDw==\n' +
'-----END RSA PRIVATE KEY-----';

var CONSUMER_KEY = 'wXK3RStuVKm5JaFgh6YqVwW4Y_muoJWCmQdbz9g0dc4e4a4a!414b454234503964364e36382f6c6e704a4975766e6e673d';

var MONEYSEND_OAUTH_OPTIONS = {
  version: '1.0',
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  signatureMethod: OAuth.signatures.rsa
};

var router = express.Router();
var mcAPIConstructMoneySend = function(sender, receiver, amount) {

  //var localDate = dateUtils.toFormat("DDMM");
  //var localDate = now.format("mmdd");

  //console.log("localDate::"+localDate);
   //console.log("localTime::"+localTime);*/
  var txnRef ="039999"+Date.now();

  console.log("txnRef::"+txnRef);


    var transferReq =
    {
        TransferRequest: {
            LocalDate: "1212",
            LocalTime:  "161222",
            TransactionReference: txnRef,
            SenderName: "John Doe",
            SenderAddress: {
                Line1:"123 Main Street",
              //  Line2: line2 = "#5A",
                City:"Arlington",
                CountrySubdivision:"VA",
                PostalCode:"22207",
                Country:"USA"
            },
            FundingCard: {
                AccountNumber:"5184680430000006",
                ExpiryMonth:"11",
                ExpiryYear:"2016"
            },
            //FundingUCAF: fundingUCAF = "MjBjaGFyYWN0ZXJqdW5rVUNBRjU=1111",
            //FundingMasterCardAssignedId: fundingMasterCardAssignedId = "123456",
            FundingAmount: {
                Value:"15503",
                Currency:"702"
            },
            ReceiverName:"Jose Lopez",
            ReceiverAddress: {
                Line1:"Pueblo Street",
              //  Line2: line2 = "PO BOX 12",
              //  City: city = "El PASO",
              //  CountrySubdivision: countrySubdivision = "TX",
              //  PostalCode: postalCode = "79906",
              //  Country: country = "USA"
            },
            //ReceiverPhone: receiverPhone = "1800639426",
            ReceivingCard: {
                AccountNumber:"5184680430000014"
            },
            ReceivingAmount: {
                Value:"182206",
                Currency: "702"
            },
            Channel:  "W",
            UCAFSupport:"true",
            ICA:"009674",
            ProcessorId:"9000000442",
            RoutingAndTransitNumber:"990442082",
            CardAcceptor: {
                Name:"My Local Bank",
                City:"Saint Louis",
                State:"MO",
                //PostalCode:"63101",
                Country:"USA"
            },
            TransactionDesc: "P2P",
            //MerchantId: merchantId = "123456"
        }
    };
    //var temp = transferReq;

    var builder = new XML2JS.Builder();
    var body = builder.buildObject(transferReq);


  return body;
};


router.get('/', function(req, res, next) {

var sender = null;
var receiver = null;
var amount = null;



  var moneySendBody = mcAPIConstructMoneySend(sender, receiver, amount);
  console.log(" MoneySendBody"+moneySendBody);

var oa = new OAuth(MONEYSEND_OAUTH_OPTIONS, function() {/*swallow*/});
  oa.post({
    url: 'https://sandbox.api.mastercard.com/moneysend/v2/transfer',
    type: 'application/xml; charset=UTF-8',
    body: moneySendBody,
    oauth_body_hash: base64.fromByteArray(sha1(moneySendBody, {asBytes: true}))
  }, function(code, responseBody, request) {
    console.log('rbody: ', responseBody);

  });

/*  var service = new transferServiceClass.TransferService(
      CONSUMER_KEY,
      CONSUMER_SECRET,
      environment.sandbox);

  var transfer = service.getTransfer(request);

  service.setCallback(function (response) {
      console.log(util.inspect(response, false, null));
      console.log(response);
      done();

  });*/



  res.status(200).end();
});

module.exports = router;
