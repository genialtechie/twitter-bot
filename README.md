# twitter-bot

This is a JavaScript app that uses both the IMGFlip and Twitter api. It sends a get request to the imgflip server, picks the first returned image object, it then sends a post request to caption the image. Then it eventually writes the image to memory and posts to twitter.

# Requirements
* Twitter Developer account with elevated access to API. [Apply here, its completely free!](https://developer.twitter.com/en/apply-for-access "Named link title")
* Imgflip account
 
# Usage 
* Clone this repository
* Run `npm install` to install dependencies
* Create a .env file 
* Get required twitter and IMGFlip credentials, and store in env file
* Tweet with #GTMBot
* Run `node app.js`, and there you go, your tweet will be made to a meme and sent as a reply to your tweet.
* Play around with the texts and/or change the picture id gotten from the API! 

Or you can just log into twitter and tweet with #GTMBot and the bot will mock your tweet!
