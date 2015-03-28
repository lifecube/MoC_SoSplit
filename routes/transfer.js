var express = require('express');
var uuid = require('uuid');
var request = require('request');

var OAuth = require('mashape-oauth').OAuth;
var sha1 = require('sha1');
var base64 = require('base64-js');

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

var postToFacebook = function(accessToken, message, transUrl, callback) {
  var billObject = {
    'og:url': transUrl,
    'og:title': 'SoSplit: Easy Send Money',
    'og:type': 'sosplit:bill',
    'og:image': 'https://fbcdn-photos-c-a.akamaihd.net/hphotos-ak-xpa1/t39.2081-0/p128x128/11057103_1583262395289591_101451603_n.png',
    'og:description': 'Click this to send money back to your friend.',
    'fb:app_id': '1566586846957146'
  };

  request.post({
    url: 'https://graph.facebook.com/v2.3/me/sosplit:split?access_token=' + accessToken,
    form: {
      message: message,
      bill: JSON.stringify(billObject),
      'fb:explicitly_shared': true
    }
  }, callback);
};

var addCommentToFacebook = function(accessToken, postId, comment, callback) {
  request.post({
    url: 'https://graph.facebook.com/v2.3/' + postId + '/comments?access_token=' + accessToken,
    form: {
      message: comment
    }
  }, callback);
};

var findSender = function(transfer, senderId) {
  var requests = transfer.requests;
  for (i = 0; i < requests.length; i++) {
    if (requests[i].id == senderId) {
      return requests[i];
    }
  }
};

/* Create transfer request. */
router.post('/', function(req, res, next) {
  console.log('POST /transfers', req.body);

  var transferId = uuid.v1();
  var transfers = req.app.locals.transfers;
  transfers[transferId] = req.body;
  var transUrl = 'http://sosplit.herokuapp.com/send/' + transferId;
  postToFacebook(req.body.post.accessToken, req.body.message, transUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var responseJSON = JSON.parse(body);
      //save the postId
      transfers[transferId].post.postId = responseJSON.id;
      res.json({
        transferId: transferId,
        postId: responseJSON.id
      });
    }else {
      res.status(500).send('Something wrong on posting to facebook wall.');
    }
  });
});

var constructMoneySend = function(sender, receiver, amount) {
  var bodyXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<TransferRequest>\n' +
  '    <LocalDate>0612</LocalDate>\n' +
  '    <LocalTime>161222</LocalTime>\n' +
  '    <TransactionReference>4000000001010101012</TransactionReference>\n' +
  '    <SenderName>John Doe</SenderName>\n' +
  '    <SenderAddress>\n' +
  '        <Line1>123 Main Street</Line1>\n' +
  '        <Line2>#5A</Line2>\n' +
  '        <City>Arlington</City>\n' +
  '        <CountrySubdivision>VA</CountrySubdivision>\n' +
  '        <PostalCode>22207</PostalCode>\n' +
  '        <Country>USA</Country>\n' +
  '    </SenderAddress>\n' +
  '    <FundingCard>\n' +
  '        <AccountNumber>5184680430000006</AccountNumber>\n' +
  '        <ExpiryMonth>11</ExpiryMonth>\n' +
  '        <ExpiryYear>2017</ExpiryYear>\n' +
  '    </FundingCard>\n' +
  '    <FundingUCAF>MjBjaGFyYWN0ZXJqdW5rVUNBRjU=1111</FundingUCAF>\n' +
  '    <FundingMasterCardAssignedId>123456</FundingMasterCardAssignedId>\n' +
  '    <FundingAmount>\n' +
  '         <Value>15000</Value>\n' +
  '        <Currency>840</Currency>\n' +
  '    </FundingAmount>\n' +
  '    <ReceiverName>Jose Lopez</ReceiverName>\n' +
  '    <ReceiverAddress>\n' +
  '        <Line1>Pueblo Street</Line1>\n' +
  '        <Line2>PO BOX 12</Line2>\n' +
  '        <City>El PASO</City>\n' +
  '        <CountrySubdivision>TX</CountrySubdivision>\n' +
  '        <PostalCode>79906</PostalCode>\n' +
  '        <Country>USA</Country>\n' +
  '    </ReceiverAddress>\n' +
  '    <ReceiverPhone>1800639426</ReceiverPhone>\n' +
  '    <ReceivingCard>\n' +
  '        <AccountNumber>5184680430000014</AccountNumber>\n' +
  '    </ReceivingCard>\n' +
  '    <ReceivingAmount>\n' +
  '        <Value>182206</Value>\n' +
  '        <Currency>484</Currency>\n' +
  '    </ReceivingAmount>\n' +
  '    <Channel>W</Channel>\n' +
  '    <UCAFSupport>true</UCAFSupport>\n' +
  '    <ICA>009674</ICA>\n' +
  '    <ProcessorId>9000000442</ProcessorId>\n' +
  '    <RoutingAndTransitNumber>990442082</RoutingAndTransitNumber>\n' +
  '    <CardAcceptor>\n' +
  '        <Name>My Local Bank</Name>\n' +
  '        <City>Saint Louis</City>\n' +
  '        <State>MO</State>\n' +
  '        <PostalCode>63101</PostalCode>\n' +
  '        <Country>USA</Country>\n' +
  '    </CardAcceptor>\n' +
  '    <TransactionDesc>P2P</TransactionDesc>\n' +
  '    <MerchantId>123456</MerchantId>\n' +
  '</TransferRequest>';
  return bodyXml;
};

router.put('/:transferId/send', function(req, res, next) {
  var transferId = req.param('transferId');
  var transfers = req.app.locals.transfers;
  var transfer = transfers[transferId];
  var sender = findSender(transfer, req.body.sender.id);

  var moneySendBody = constructMoneySend(sender, transfer.receiver, sender.amount);

  var oa = new OAuth(MONEYSEND_OAUTH_OPTIONS, function() {/*swallow*/});
  oa.post({
    url: 'https://sandbox.api.mastercard.com/moneysend/v2/transfer',
    type: 'application/xml; charset=UTF-8',
    body: moneySendBody,
    oauth_body_hash: base64.fromByteArray(sha1(moneySendBody, {asBytes: true}))
  }, function(code, responseBody, request) {
    console.log('rbody: ', responseBody);
    var comment = 'Thanks ' + sender.display + ' to send me back the money.';
    addCommentToFacebook(transfer.post.accessToken, transfer.post.postId, comment, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var responseJSON = JSON.parse(body);
        //save the postId
        sender.sent = true;
        res.status(200).end();
      }else {
        res.status(500).send('Something wrong on posting to facebook wall.');
      }
    });
  });
});

module.exports = router;
