# twitter-bot

This is a JavaScript app that uses both the IMGFlip and Twitter api. It sends a get request to the imgflip server, picks the first returned image object, it then sends a post request to caption the image. Then it eventually writes the image to memory and posts to twitter.

# Requirements
* Twitter Developer account with elevated access to API. [Apply here, its completely free!](https://developer.twitter.com/en/apply-for-access "Named link title")
* IMGFlip account
 
# Usage 
* Clone this repository
* Run `npm install` to install dependencies
* Create a .env file 
* Get required twitter and IMGFlip credentials, and store in env file
* Run `node app.js`, and there you go, your meme will be tweeted.
* Play around with the texts and/or change the picture gotten from the API! 

Feel free to suggest any upgrades/ corrections.
