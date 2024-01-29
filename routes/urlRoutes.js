const express = require('express');
const router = express.Router();
const { 
    urlSortenGenerator,
    getRedirectUrl, 
    getAllUrls, 
    uplaodImage,
    getAllImage, 
    deleteImage,
    qrCodeSortenGenerator,
    getQrCodeScanned,
    getAllQrUrls
} = require('../controllers/urlControllers');

const { registerController, getLoginUsers, loginController, logoutController } = require('../controllers/authControllers')
const { upload } = require('../utils/upload');
const authMiddleware = require('../middleware/authMiddleware')


router.get('/link/:id', getRedirectUrl)

router.get('/qrcode/:qr_id', getQrCodeScanned)

router.get('/short/urls', getAllUrls)

router.get('/qrcode/scan/links', getAllQrUrls)

router.get('/logged/user', getLoginUsers)

router.post('/bitlyurl/generator', urlSortenGenerator)

router.post('/bitlyqrcode/generator', qrCodeSortenGenerator)

router.post('/register', registerController)

router.post('/login/users', loginController)

router.post('/logout/users',authMiddleware, logoutController)


router.post('/imageupload', upload.single('image'), uplaodImage)

router.get('/image/allimages', getAllImage)

router.delete('/delete/:id', deleteImage)


module.exports = router;