import firebase from 'firebase';

export default class FirebaseManager {
    constructor(){
        this.firebase = null;
    }
    
    //bot-settings.js파일 firebase json 데이터
    initialize(config){
        this.firebase = firebase.initializeApp(config);
    }

    get Firebase(){
        return this.firebase;
    }

    get Database(){
        return firebase.database(this.Firebase);
    }
    
    get Storage(){
        return firebase.storage(this.Firebase);
    }
}