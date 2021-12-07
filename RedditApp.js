// import snoowrap from 'snoowrap';
import { promises as fs } from "fs";

// var clientSecretToken = "01tFtRuhDKhtAHJSB04UVDIcs6N8JQ";
// var clientIDKey = "dz-5UGsi3SzGxFXNOKaiVg";
// var clientRefreshToken = "1107866923307-Gw2N8yOmRUfdbEB4xpMpeXGPdkpH_Q";
// var accessToken = "1107866923307-6zZiryJscram9GD4UgqaiiNgOPH4kQ";

// function postLink(title, text, subreddit) {
//     const r = new snoowrap({
//         userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36',
//         clientId: clientIdKey,
//         clientSecret: clientSecretToken,
//         refreshToken: clientRefreshToken,

//     });

//     r.getSubreddit(subreddit).submitSelfpost({
//         title: title,
//         text: text,
//         sendReplies: false
//     });
// };

// postLink(title, link, subreddit);clientSecretToken

// var postTimer = setInterval (function () {
//     async function makePost() {
        
//         async function sortUsers() {
//             for 
//         }
//     }
// })


// function for reading data from JSON file
// async function readData(file){
//     let dataX = fs.readFile(file, "utf8", function (err, data) {
//         return data;
//     });

//     return dataX;

// }

// calculate total wait time between posts
async function timeToWait() {
    async function readData(file){
        let dataX = fs.readFile(file, "utf8", function (err, data) {
            return data;
        });
    
        return dataX;
    
    }
    var accountFile = 'accounts.json';
    var dataFromFile = await readData(accountFile);
        dataFromFile = JSON.parse(dataFromFile);

    
    var totalUsers = 0;
    var postTimer = dataFromFile.forEach(user => {
        totalUsers++;
    });

    var minutesToWait = 30 / totalUsers;
    return minutesToWait * 60 * 1000;

}

// Variable for time in between posts
let timeInterval = await timeToWait();


// Post to reddit
var postToReddit = setInterval( function () {

    // Function to select the next account to post
    async function selectAccount() {

        async function readData(file){
            let dataX = fs.readFile(file, "utf8", function (err, data) {
                return data;
            });
        
            return dataX;
        
        };

        var accountFile = 'accounts.json';
        var dataFromFile = await readData(accountFile);
        dataFromFile = JSON.parse(dataFromFile);

        dataFromFile.forEach(user => {
            var timestamp = Date.now();
            var timeToWait = 0.5 * 60 * 60 * 1000;
            var userToUse;

            if (user.last_post_timestamp < timestamp) {
                timestamp = user.last_post_timestamp;
                userToUse = user.account_username;
            };
            console.log(userToUse);
        });
        
        // var timeSinceLastTimestamp = Date.now() - timestamp;

        // if (timeSinceLastTimestamp < timeToWait) {
                
        // };
    };
    selectAccount();
}, 5000);
