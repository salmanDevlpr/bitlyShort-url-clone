const express = require('express');
const router = express.Router();
const { urlSortenGenerator,getRedirectUrl, getAllUrls } = require('../controllers/urlControllers')


router.get('/:id', getRedirectUrl)

router.get('/urls/shorts', getAllUrls)

router.post('/bitlyurl/generator', urlSortenGenerator)


module.exports = router;