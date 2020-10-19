require('dotenv').config()
const firebase = require('firebase');

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "headlines-fa045.firebaseapp.com",
  projectId: "headlines-fa045",
  databaseURL: "https://headlines-fa045.firebaseio.com",
  storageBucket: "headlines-fa045.appspot.com",
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let subheading = process.env.URL_PATH == undefined ? "default" : `${process.env.URL_PATH.replace('/', '-')}`;
let extract = database.ref(`headlines/${subheading}`)
let data = []
const fs = require('fs');
let file = fs.createWriteStream(`${subheading}-extract.txt`);

extract.on('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    console.log(childSnapshot.val())
    file.write(`${childSnapshot.val()}\n`)
	})
})

