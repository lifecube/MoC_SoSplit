var express = require('express');
var uuid = require('uuid');
var request = require('request');

var router = express.Router();

/* Create transfer request. */
router.post('/', function(req, res, next) {
  console.log('POST /transfers', req.body);

  var transferId = uuid.v1();
  var transfers = req.app.locals.transfers;
  transfers[transferId] = req.body;
  var transUrl = 'http://sosplit.herokuapp.com/send/' + transferId;
  request.post({
    url: 'https://graph.facebook.com/v2.2/me/sosplit:split?access_token=' + req.body.post.accessToken,
    form: {
      message: req.body.message,
      bill: JSON.stringify({
        'og:url': transUrl,
        'og:title': 'SoSplit: Easy Send Money',
        'og:type': 'sosplit:bill',
        'og:image': 'https://fbcdn-photos-c-a.akamaihd.net/hphotos-ak-xpa1/t39.2081-0/p128x128/11057103_1583262395289591_101451603_n.png',
        'og:description': 'Click this to send money back to your friend.',
        'al:web:url':'http://sosplit.herokuapp.com/send/test1',
        'al:web:should_fallback':true
      })
    }
  }, function(error, response, body) {
    console.log(response);
    res.json({
      transferId: transferId
    });
  });
});

router.put('/:transferId/:postId', function(req, res, next) {
  var transferId = req.param('transferId');
  var transfers = req.app.locals.transfers;
  var postId = req.param('postId');
  transfers[transferId].postId = postId;
  res.status(200).end();
});

router.put('/:transferId/send/:receiverId', function(req, res, next) {
  res.status(200).end();
});

module.exports = router;
