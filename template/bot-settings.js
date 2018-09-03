export default {
    //디스코드 봇 설정
    "discord": {
        "enabled": true,

        "clientId": "",
        "clientSecret": "",

        "userToken": ""
    },

    //라인 챗 봇 설정
    "line": {
        "enabled": true,

        "channelId": "",
        "channelSecret": "",

        "channelAccessToken": 0
    },

    //페이스북 메신져 설정
    "facebook": {
        "enabled": true,

        "email": "",
        "password": "",
    },

    //Socket 설정
    "socket": {
        "enabled": true,
        "path": "storybot-socket",
        "port": 7000,
    },

    "command-prefix": "*",
    
    //데이터 저장을 위한 firebase 설정
    "firebase-enabled": true,
    "firebase": {
        "apiKey": "",
        "authDomain": "",
        "databaseURL": "",
        "projectId": "",
        "storageBucket": "",
        "messagingSenderId": ""
    }
}