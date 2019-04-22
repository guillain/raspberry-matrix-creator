// Require the module
var picoSpeaker = require('pico-speaker');
 
// Define configuration
/*
var picoConfig = {
   AUDIO_DEVICE: 'default:CARD=PCH',
   LANGUAGE: 'fr-FR'
};*/
/* DEFAULT CONFIG */
var picoConfig = {
   AUDIO_DEVICE: null, // will use default alsa device
   LANGUAGE: 'en-US'
};

// Initialize with config
picoSpeaker.init(picoConfig);
 
// Say hello
picoSpeaker.speak('Hello !').then(function() {
       // console.log("done");
    }.bind(this))

