const shortId = require('shortid')
const UrlModel = require('../models/urlModel');
const ImageModel = require('../models/imageModel')
const {validateUrl} = require('../utils/validationUrl');
require('dotenv').config();
const router = require('../routes/urlRoutes');
const cloudinary  = require('../utils/cloudinary');

const getAllUrls = async(req, res)=> {
    const urls = await UrlModel.find({});
    res.send(urls);
};

const urlSortenGenerator = async (req, res) => {
    const { long_url, title } = req.body;
    const base = process.env.BASE_URL;
    const id = shortId();
    //adskfjasdf
    if(validateUrl(long_url)){
        try {
            let url = await UrlModel.findOne({long_url});
            if(url){
                res.json(url);
            }else{
                const link = `${base}/${id}`
                const urlDetails = await UrlModel.create({
                    id,
                    link,
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
            res.status(400).json({message:'Not found'});
        }
    } catch (error) {
        console.log('error', error);
        res.status(500).json({message: 'server Error'})
    }

};

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



module.exports = {
    urlSortenGenerator,
    getRedirectUrl,
    getAllUrls,
    uplaodImage,
    getAllImage
}