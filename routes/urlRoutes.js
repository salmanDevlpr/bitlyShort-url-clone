const express = require('express');
const router = express.Router();
const { urlSortenGenerator,getRedirectUrl, getAllUrls, uplaodImage,getAllImage } = require('../controllers/urlControllers');
const { upload } = require('../utils/upload');


router.get('/:id', getRedirectUrl)

router.get('/urls/shorts', getAllUrls)

router.post('/bitlyurl/generator', urlSortenGenerator)

router.post('/imageupload', upload.single('image'), uplaodImage)

router.get('/image/allimages', getAllImage)


module.exports = router;