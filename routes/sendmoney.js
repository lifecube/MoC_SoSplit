var express = require('express');
var router = express.Router();

/* GET send money page. */
router.get('/:transferId', function(req, res, next) {
  var transferId = req.param('transferId');
  var transfers = req.app.locals.transfers;
  if (transfers[transferId]) {
    res.render('send_money', { transfer: transfers[transferId], transferId: transferId, layout: 'send_money_layout' });
  }else {
    res.status(404).end();
  }
});

module.exports = router;
