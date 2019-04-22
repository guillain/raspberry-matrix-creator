var fs = require('fs');
var ps = require('pocketsphinx').ps;

persodir = "assets/2584";
modeldir = "/usr/local/share/pocketsphinx/model/en-us/en-us";

// pocketsphinx_continuous -hmm  /usr/local/share/pocketsphinx/model/en-us/en-us -lm assets/2584.lm -dict assets/2584.dic -samprate 16000/8000/48000  -inmic yes  -logfn /dev/null

var config = new ps.Decoder.defaultConfig();
config.setString("-hmm", modeldir );
config.setString("-dict", persodir + ".dic");
config.setString("-lm", presodir + ".lm");
var decoder = new ps.Decoder(config);

fs.readFile("recording.raw", function(err, data) {
	    if (err) throw err;
	    decoder.startUtt();
	    decoder.processRaw(data, false, false);
	    decoder.endUtt();
	    console.log(decoder.hyp())
});

