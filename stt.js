// https://github.com/cmusphinx/node-pocketsphinx/blob/master/demo/test.js
var fs = require('fs');
var ps = require('pocketsphinx'); //.ps;

// pocketsphinx_continuous -hmm  /usr/local/share/pocketsphinx/model/en-us/en-us -lm assets/2584.lm -dict assets/2584.dic -samprate 16000/8000/48000  -inmic yes  -logfn /dev/null

perso_dir = "assets/2584";
model_dir = "/usr/local/share/pocketsphinx/model/en-us/en-us";

class STT {
    constructor(){
        this.config = new ps.Decoder.defaultConfig();
        config.setString("-hmm", model_dir );
        config.setString("-dict", perso_dir + ".dic");
        config.setString("-lm", preso_dir + ".lm");
        this.decoder = new ps.Decoder(config);
    }

    read_file(file="assets/recording.raw"){
        fs.readFile(file, function(err, data) {
	    if (err) throw err;
	    decoder.startUtt();
	    decoder.processRaw(data, false, false);
	    decoder.endUtt();
	    console.log(decoder.hyp())

            it = decoder.seg().iter()
            while ((seg = it.next()) != null) {
                console.log(seg.word, seg.startFrame, seg.endFrame);
            }
    
            it = decoder.nbest().iter()
            for (i = 0; i < 10 && ((hyp = it.next()) != null); i++) {
	        console.log(hyp.hypstr)
            }
        });
    }

}

let stt = new STT();




