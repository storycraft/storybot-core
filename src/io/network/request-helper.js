import http from 'http';
import https from 'https';

import { URL } from 'url';

export default class RequestHelper {
    static async get(requestUrl, isHttps){
        return await RequestHelper.request(new URL(requestUrl), null, isHttps || RequestHelper.isHttps(requestUrl));
    }

    static async post(requestUrl, data, isHttps){
        return await RequestHelper.request(new URL(requestUrl), data, isHttps || RequestHelper.isHttps(requestUrl));
    }

    static async request(option, data, isHttps){
        var module = isHttps ? https : http;

        return await new Promise((resolve, reject) => {
            var req = module.request(option,(res) => {
                var data = '';
                res.on('data', (chunk) => data += chunk);
    
                res.on('end', () => resolve(data));
            });

            if (data)
                req.write(data);
            req.end();
        });
    }

    static isHttps(requestUrl){
        return requestUrl.startsWith('https');
    }
}