var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  try {
    res.status(200).sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  }
  catch(e) {
    console.debug(e);
    res.sendStatus(404);
  }
});

module.exports = router;
