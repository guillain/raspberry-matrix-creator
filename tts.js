// Require the module
var picoSpeaker = require('pico-speaker');

// lang='fr-FR';
// device='CARD=PCH';


// Define the TTS class
class TTS {
    constructor(lang='en-US', device=null){
        this.config = {
            AUDIO_DEVICE: lang, // will use default alsa device
            LANGUAGE: device
        };
    }

    // Initialize with config
    init(config=''){
        config = (config != '') ? config : this.config;
        picoSpeaker.init(config);
    }

    say(data='hello !'){
        picoSpeaker.speak(data).then(function() {
            console.log("say data:%s", data);
        }.bind(this))
    }
}

tts = new TTS(lang='fr-FR');
tts.init();
tts.say('salut les terriens');

