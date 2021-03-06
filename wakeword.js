const zmq = require('zeromq');// Asynchronous Messaging Framework
const matrix_io = require('matrix-protos').matrix_io;// MATRIX Protocol Buffers

// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Set Initial Variables
const LM_PATH = 'assets/2584.lm';// Language Model File
const DIC_PATH = 'assets/2584.dic';// Dictation File

// Create driver configuration
const config = matrix_io.malos.v1.driver.DriverConfig.create({ // Create & Set wakeword configurations
    wakeword: matrix_io.malos.v1.io.WakeWordParams.create({
        lmPath: LM_PATH,// Language model file path
        dicPath: DIC_PATH,// Dictation file path
        channel: matrix_io.malos.v1.io.WakeWordParams.MicChannel.channel8,// Desired MATRIX microphone
        enableVerbose: false// Enable verbose option
    })
});

// Wakerwork class overload the matrix object
class Wakework extends MatrixCreator {
    port_data_update(type, element) {
        // Create and connect a Subscriber socket
        this.updateSocket = this.port_connect(this.matrix_ip, this.matrix_port + 3, 'sub');
        
        // On Message
        this.updateSocket.on('message', function (wakeword_buffer) {
            // Extract message
            var wakeWordData = matrix_io.malos.v1.io.WakeWordParams.decode(wakeword_buffer);
            
            // Log message
            // console.log("port_data_update wakeword_buffer:%j", wakeword_buffer);
            console.log("port_data_update wakeWordData:%s", wakeWordData.wakeWord);
            
            // Run actions based on the phrase heard
            switch (wakeWordData.wakeWord) {
                // CHANGE TO YOUR PHRASE
                case "MATRIX START":
                    console.log('I HEARD MATRIX START!');
                    break;
                // CHANGE TO YOUR PHRASE
                case "MATRIX STOP":
                    console.log('I HEARD MATRIX STOP!');
                    break;
            }
        });
    }
}
// Instance the object
let app = new Wakework('127.0.0.1', 60001);

// Initialise the port connection
app.port_init(config);

// Send port update
app.port_data_update('io','WakeWordParams');

