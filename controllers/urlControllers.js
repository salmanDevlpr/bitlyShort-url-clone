const shortId = require('shortid')
const UrlModel = require('../models/urlModel');
const {validateUrl} = require('../utils/validationUrl');
require('dotenv').config();

const getAllUrls = async(req, res)=> {
    const urls = await UrlModel.find({});
    res.send(urls);
};

const urlSortenGenerator = async (req, res) => {
    const { originalUrl, title } = req.body;
    const base = process.env.BASE_URL;
    const urlId = shortId();
    if(validateUrl(originalUrl)){
        try {
            let url = await UrlModel.findOne({originalUrl});
            if(url){
                res.json(url);
            }else{
                const shortUrl = `${base}/${urlId}`
                const urlDetails = await UrlModel.create({
                    urlId,
                    shortUrl,
                    originalUrl,
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
    console.log('req', req);
    try {
        const url = await UrlModel.findOne({urlId: req.params.urlId});
        if(url){
            await UrlModel.updateOne(
                {
                  urlId: req.params.urlId
                },
                {
                    $inc: {clicks: 1}
                }
            );
            return res.redirect(url.originalUrl);
        }else{
            res.status(400).json({message:'Not found'});
        }
    } catch (error) {
        console.log('error', error);
        res.status(500).json({message: 'server Error'})
    }

};



module.exports = {
    urlSortenGenerator,
    getRedirectUrl,
    getAllUrls
}