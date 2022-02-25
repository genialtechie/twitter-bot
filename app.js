require('dotenv').config();
const axios = require('axios').default;
const Twitter = require('twitter');
const fs = require('fs');

const App = {
    meme: {},
    client: new Twitter({
        consumer_key: process.env.API_KEY,
        consumer_secret: process.env.API_KEY_SECRET,
        access_token_key: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }),

    getMeme: async _ => {
        try{
            App.meme = await(await axios.get('https://api.imgflip.com/get_memes')).data.data.memes[0];
        }
        catch(error){
            console.error(error);
        }
        return App.captionMeme();
    },

    captionMeme: async _ => {
        const params = new URLSearchParams({
            template_id: `${App.meme.id}`,
            username: `${process.env.IMG_USERNAME}`,
            password: `${process.env.IMG_KEY}`,
            text0: 'posting memes the normal way',
            text1: 'writing a bot to post your memes'
        });
        
        const res = await axios.post('https://api.imgflip.com/caption_image', params.toString());
        App.meme.url = `${res.data.data.url}`;
        return App.postMeme();
    },

    postMeme: async _ => {
        //Get img using get request
        const res = await axios({
            method: 'get',
            url: App.meme.url,
            responseType: 'stream'
        });
        //pipe data to root folder
        res.data.pipe(fs.createWriteStream('meme.jpg'));
        
        const img = fs.readFileSync('./meme.jpg');
        App.client.post('media/upload', {media: img}, (error, media, response) => {
            if(!error) {
                // If successful, a media object will be returned.
                console.log(media);

                // Lets tweet it
                const status = {
                status: 'I am a tweet',
                media_ids: media.media_id_string // Pass the media id string
                }

                App.client.post('statuses/update', status, function(error, tweet, response) {
                if (!error) {
                    console.log(tweet);
                }
                });
            }
            console.error(error)
        });

    }
}
App.getMeme();
