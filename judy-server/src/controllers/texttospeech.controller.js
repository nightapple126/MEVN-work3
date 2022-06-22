
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var credentials = require('../../config/watson.json');
const uuid = require("uuid/v1");

var fs = require('fs');

let controller = {

    synthesize(text) {

        var textToSpeech = new TextToSpeechV1({
            username: credentials.text_to_speech[0].credentials.username,
            password: credentials.text_to_speech[0].credentials.password,
            url: credentials.text_to_speech[0].credentials.url
        });

        var params = {
            text: text,
            voice: 'en-US_MichaelVoice', // Optional voice
            accept: 'audio/wav'
        };
        return new Promise((resolve,reject)=>{
            //reject({});
            //return;
            textToSpeech
            .synthesize(params, function (err, audio) {
                if (err) {
                    reject(err);
                }
                textToSpeech.repairWavHeader(audio);
                var filename= uuid();
                fs.writeFileSync('public/tmp/audio/'+filename+'.wav', audio);
                resolve(filename+".wav");
            });
        })
    },
    destroy(filename){
        return new Promise((resolve,reject)=>{
            
            fs.unlink('public/tmp/audio/'+filename, (err)=>{
                if (err) reject(err);

                resolve();
            });

        })
    }

}


module.exports = controller;