require('dotenv').config();
const axios = require('axios').default;
const Twitter = require('twitter');
const fs = require('fs');
const storage = require('node-persist');


const App = {
    meme: { id: '102156234' },
    twtObj: {
        tweets_ids: [],
        text: '',
        reply_to_id: '',
        username: ''
    },
    client: new Twitter({
        //create env file with the following credentials from your twitter developer acct
        consumer_key: process.env.API_KEY,
        consumer_secret: process.env.API_KEY_SECRET,
        access_token_key: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }),

    searchTweets: () => {
        App.client.get('search/tweets', { q: '#GTMBot' }, function (error, tweets, response) {
            const tweetsArr = tweets.statuses;
            tweetsArr.forEach(async element => {
                //init node-persist and update the tweets_ids array
                await storage.init();
                App.twtObj.tweets_ids = await storage.getItem('twt_ids');
                console.log(App.twtObj.tweets_ids)
                const found = App.twtObj.tweets_ids.includes(element.id_str);
                //Run this code if the tweet hasn't been replied to before
                if (!found) {
                    App.twtObj.text = `${element.text}`;
                    App.twtObj.reply_to_id = `${element.id_str}`;
                    App.twtObj.username = `${element.user.screen_name}`;
                    //manipulate text and remove hashtag
                    App.twtObj.text = App.twtObj.text.split(' ');
                    App.twtObj.text.pop();
                    App.twtObj.text = App.twtObj.text.join(' ');
                    //push id to array
                    App.twtObj.tweets_ids.push(element.id_str);
                    await storage.setItem('twt_ids', App.twtObj.tweets_ids);
                    App.captionMeme(App.twtObj.text);
                } else return;
            });
        });
    },

    captionMeme: async text => {
        // params required to caption meme 
        const params = new URLSearchParams({
            template_id: `${App.meme.id}`,
            username: `${process.env.IMG_USERNAME}`, // create an imgflip acct and replace 
            password: `${process.env.IMG_KEY}`,      // these values with your own credentials in env file
            text0: 'NOBODY:',
            text1: `YOU: ${text}`
        });
        
        const res = await axios.post('https://api.imgflip.com/caption_image', params.toString());
        App.meme.url = `${res.data.data.url}`;
        console.log(App.meme.url);
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
        await res.data.pipe(fs.createWriteStream('meme.jpg'));
        const img = fs.readFileSync('./meme.jpg');
        App.client.post('media/upload', {media: img}, (error, media, response) => {
            if(!error) {

                // Lets tweet it
                const status = {
                status: `@${App.twtObj.username} #GTMBotResponse`,
                in_reply_to_status_id: `${App.twtObj.reply_to_id}`,
                media_ids: media.media_id_string // Pass the media id string
                }

                App.client.post('statuses/update', status, function(error, tweet, response) {
                if (!error) {
                    console.log('tweet was posted!');
                }
                });
            } else console.error(error);
        });
    }
}
App.searchTweets();

