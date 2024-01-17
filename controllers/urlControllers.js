const shortId = require('shortid')
const UrlModel = require('../models/urlModel');
const {validateUrl} = require('../utils/validationUrl');
require('dotenv').config();

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

                l
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



module.exports = {
    urlSortenGenerator,
    getRedirectUrl,
    getAllUrls
}