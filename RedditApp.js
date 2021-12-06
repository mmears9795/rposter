import snoowrap from 'snoowrap';
import { Puppeteer } from 'puppeteer';
import {clientSecretToken, clientIDKey } from api;

function postLink(title, link, subreddit) {
    const r = new snoowrap({
        userAgent: 'whatever',
        clientID: clientIDKey,
        clientSecret: clientSecretToken,
        username: 'TestUsername',
        password: 'TestPassword'
    });

    r.getSubreddit(subreddit).submitLink({
        title: title,
        url: link,
        sendReplies: true
    });
};
