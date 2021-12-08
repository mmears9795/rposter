import snoowrap from 'snoowrap';
import { promises as fs, write } from "fs";

// Variable for time in between posts
let timeInterval = await timeToWait();

var postInterval = setInterval( function () {
    
    // Function to create post
    async function createPost(){
        
        // Will update timestamps if true at end of function
        var writeFile = false;

        // Obtain the user object and subreddit object
        var user = await selectAccount();

        do {
        let user = await selectAccount();
        } while (user == undefined);

        let subreddit = await selectSub();

        // Check if timestamp for sub in the account is > 24 hours

        var subFound = false;

        for (var i = 0; i < user.last_timestamp_per_sub.length; i++) {
            if (user.last_timestamp_per_sub[i][0] == subreddit.subreddit) {
                var twenty_four_hours = 24 * 60 * 60 * 1000;
                var timeSinceLastTimeStamp = Date.now() - user.last_timestamp_per_sub[i][1];

                if (timeSinceLastTimeStamp > twenty_four_hours) {
                    subFound = true;
                    writePost(user.userAgent, user.redditClientId, user.redditClientSecret, user.redditRefreshToken, subreddit.subreddit);

                    // Update timestamp
                    user.last_post_timestamp = Date.now();
                    user.lasttimestamp_per_sub[i][1] = Date.now();
                    subreddit.last_post_timestamp = Date.now();
                    writeFile = true;
                };
            };
        };

        if (subFound == false) {
            writePost(user, subreddit);
            user.last_post_timestamp = Date.now();
            var newSubTimestamp = [subreddit.subreddit, Date.now()]
            user.last_timestamp_per_sub.push(newSubTimestamp);
            subreddit.last_post_timestamp = Date.now();
            writeFile = true;       
        };

        // Update timestamps in all files
        if(writeFile == true){
            // Accounts file
            updateFile('accounts.json', user);
            updateFile('subreddits.json', subreddit);
        };
    };
    createPost();
}, 5000);

// function for reading data from JSON file
async function readData(file){
    let dataX = fs.readFile(file, "utf8", function (err, data) {
        return data;
    });

    return dataX;

}

// calculate total wait time between posts
async function timeToWait() {
    var accountFile = 'accounts.json';
    var dataFromFile = await readData(accountFile);
        dataFromFile = JSON.parse(dataFromFile);

    
    var totalUsers = 0;

    dataFromFile.forEach(user => {
        totalUsers++;
    });

    var minutesToWait = 30 / totalUsers;
    return minutesToWait * 60 * 1000;

};

// Function to send the next post
async function selectAccount() {

    // Parse information from accounts.json
    var accountFile = 'accounts.json';
    var dataFromFile = await readData(accountFile);
    dataFromFile = JSON.parse(dataFromFile);

    var userTimestamp = Date.now();
    var userToUse = "";

    // Check each user to find lowest timestamp
    dataFromFile.forEach(user => {

        if (user.last_post_timestamp < userTimestamp) {
            userTimestamp = user.last_post_timestamp;
            userToUse = user;
        };
    });

    // Check if time has been 30 minutes since user last posted 

    var timeToWait = 0.5 * 60 * 60 * 1000;

    var timeSinceLastTimestamp = Date.now() - userTimestamp;

    // if greater than 30 - return user object
    if (timeSinceLastTimestamp > timeToWait) {
            return userToUse;
    };
};

// Selects a subreddit from the subreddits.json file
async function selectSub() {
    var subredditFile = 'subreddits.json';
    var dataFromFile = await readData(subredditFile);
    var dataFromFile = JSON.parse(dataFromFile);

    var timestamp = Date.now();
    var subToUse = "" 

    dataFromFile.forEach(sub => {
        if (sub.last_post_timestamp < timestamp) {
            timestamp = sub.last_post_timestamp
            subToUse = sub;
        };
    });
    return subToUse;
};

async function grabPost() {
    var postFile = 'posts.json';
    var dataFromFile = await readData(postFile);
    var dataFromFile = JSON.parse(dataFromFile);
    return dataFromFile;
};

async function writePost(user, subreddit) {

    const r = new snoowrap({
        userAgent: user.account_details.userAgent,    
        clientId: user.account_details.redditClientId,
        clientSecret: user.account_details.redditClientSecret,
        refreshToken: user.account_details.redditRefreshToken
    });

    var postData = await grabPost();
    var title = postData.title;
    var text = postData.text;
    var sub = subreddit.subreddit

    r.getSubreddit('TheCyberInu').submitSelfpost({
        title: 'Title',
        text: 'Test'
    });
};

async function updateFile(fileName, object) {
    var dataFromFile = await readData(fileName);
    var dataFromFile = JSON.parse(dataFromFile);
    
    if (fileName == 'subreddits.json') {
        for (var i=0; i < dataFromFile.length; i++) {
            if (dataFromFile[i].subreddit == object.subreddit) {
                dataFromFile[i] = object;

            };
        };
    };
    
    if (fileName == 'accounts.json') {

        for (var i=0; i < dataFromFile.length; i++) {
            if (dataFromFile[i].account_username == object.account_username) {
                dataFromFile[i] = object;

            };
        };
    };

    fs.writeFile(fileName, JSON.stringify(dataFromFile), function(err){
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
};
