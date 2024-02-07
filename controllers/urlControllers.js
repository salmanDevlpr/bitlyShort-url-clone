const shortId = require('shortid')
const UrlModel = require('../models/linkModel');
const ImageModel = require('../models/imageModel')
const CustomizeQrModel = require('../models/customizeQrModel.js');
const {validateUrl} = require('../utils/validationUrl');
require('dotenv').config();
const cloudinary  = require('../utils/cloudinary');
const QrCodeModel = require('../models/qrcodeModel');

const getAllUrls = async(req, res)=> {
    const urls = await UrlModel.find({}, {
        id: 1,
        qr_id: 1,
        long_url: 1,
        link: 1,
        qrCodeLink: 1,
        title: 1,
        clicks: 1,
        qrScanCount: 1,
        createdAt: 1
    });
    res.send(urls);
};

const getAllQrUrls = async(req, res)=> {
    const urls = await QrCodeModel.find({});
    res.send(urls);
};

const urlSortenGenerator = async (req, res) => {
    try {
        const { long_url, title } = req.body;
        const baseLinkUrl = process.env.BASE_LINK_URL;
        const baseQrCode = process.env.BASE_QRCODE_URL;
        const id = shortId();
        const qr_id = shortId();
        if(validateUrl(long_url)){
            try {
                let url = await UrlModel.findOne({long_url});
                if(url){
                    res.json(url);
                }else{
                    const link = `${baseLinkUrl}/${id}`
                    const qrCodeLink = `${baseQrCode}/${qr_id}`
                    const urlDetails = await UrlModel.create({
                        id,
                        qr_id,
                        link,
                        qrCodeLink,
                        long_url,
                        title,
                        date: new Date(),
                    });
                    return res.json(urlDetails)
    
                }
            } catch (error) {
                console.log('error in shorturl', error);
                res.status(500).json('Server Error')
            }
        }else{
            res.status(400).json({message: 'Invalid Url'});
        }
    } catch (error) {
        console.log('error in urlshortgenerator', error);
        res.status(500).json({message: error.message});
    }

};

const qrCodeSortenGenerator = async (req, res) => {
    try {
        const { long_url, title } = req.body;
        const base = process.env.BASE_QRCODE_URL;
        const qr_id = shortId();
        if(validateUrl(long_url)){
            try {
                let url = await QrCodeModel.findOne({long_url});
                if(url){
                    res.json(url);
                }else{
                    const qrCodeLink = `${base}/${qr_id}`
                    const urlDetails = await QrCodeModel.create({
                        qr_id,
                        qrCodeLink,
                        long_url,
                        title,
                        date: new Date(),
                    });
                    return res.json(urlDetails)
    
                }
            } catch (error) {
                console.log('error in qrCodeShortUrl', error);
                res.status(500).json('Server Error')
            }
        }else{
            res.status(400).json({message: 'Invalid Url'});
        }
    } catch (error) {
        console.log('error in qrcode genertor', error);
        res.status(500).json({message: error.message});
    }
};

const getRedirectUrl = async(req, res) => {
    try {
        const url = await UrlModel.findOne({id: req.params.id});
        if(url){
            await UrlModel.updateOne(
                {
                  id: req.params.id
                },
                {
                    $inc: {clicks: 1}
                }
            );
            return res.redirect(url.long_url);
        }else{
            res.status(400).json({message:'Not found url'});
        }  
    } catch (error) {
        console.log('error', error);
        res.status(500).json({message: 'server Error'})
    }

};

const getQrCodeScanned = async (req, res) => {
    try {
        const qrCodeScan = await UrlModel.findOne({qr_id: req.params.qr_id});
        if(qrCodeScan){
            await UrlModel.updateOne(
                {
                   qr_id: req.params.qr_id
                },
                {
                    $inc: {qrScanCount: 1}
                }
            );
            return res.redirect(qrCodeScan.long_url)
        }else{
            res.status(400).send('Url not found');
        }
    } catch (error) {
        console.log('error in qrcode scanned', error);
        res.status(500).json({message: 'server error'})
    }
}

const uplaodImage = async(req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        const imageFile = await ImageModel.create({
           imageUrl: result.secure_url,
           cloudinaryId: result.public_id,

        })
        res.status(200).json(imageFile)
    } catch (error) {
        console.log('error', error.message);
        res.status(500).json({message: error.message})
    }
}


const getAllImage = async(req, res)=> {
    const getImages = await ImageModel.find({});
    res.send(getImages)
}

const deleteImage = async(req, res) => {
    try {     
        const image = await ImageModel.findById(req.params.id);
    
        const cloudImg = image.cloudinaryId;
        if(cloudImg){
            await cloudinary.uploader.destroy(cloudImg)
        }
    
        const result = await ImageModel.findByIdAndDelete(req.params.id);
    
        res.status(200).json({
            success: true,
            message: 'Image delete successfully..',
            result
        })
    } catch (error) {
        console.log('error in delete request', error);
        res.status(500).json({message: error.message})
    }
}


const qrCodeCustomize = async(req, res) => {
    try {
        const { codeHex, bgColorHex, customizeId, imgUrl } = req.body;
        const result = await CustomizeQrModel.create({
            codeHex,
            bgColorHex,
            customizeId,
            imgUrl
        });
    
        res.status(201).json({
            message: 'qr code customize successfully',
            result
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({message: error.message})
    }
}

const getQrCodeCustomize = async(req, res) => {
    try {
        const result = await CustomizeQrModel.find({});
        res.status(201).json({
            message: 'All customize data fetched successfully',
            result
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({message: error.message})
    }
}


const deleteCustomizeQr = async(req, res) =>{

    const customizeQrCode  = await CustomizeQrModel.findOne({customizeId: req.params.customizeId});
    if(!customizeQrCode){
        return res.status(400).json({message: "Invalid customizeQrcode Id."})
    }
    const deletObj = await CustomizeQrModel.findByIdAndDelete(customizeQrCode?._id)
    res.json({success: true, deletObj})
}


module.exports = {
    urlSortenGenerator,
    getRedirectUrl,
    getAllUrls,
    uplaodImage,
    getAllImage,
    deleteImage,
    qrCodeSortenGenerator,
    getQrCodeScanned,
    getAllQrUrls,
    qrCodeCustomize,
    getQrCodeCustomize,
    deleteCustomizeQr
}