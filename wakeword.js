// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Instance the object
let app = new MatrixCreator('127.0.0.1', 20023);

// Set Initial Variables
const LM_PATH = '2584.lm';// Language Model File
const DIC_PATH = '2584.dic';// Dictation File

// Create driver configuration
const config = matrix_io.malos.v1.driver.DriverConfig.create({ // Create & Set wakeword configurations
    wakeword: matrix_io.malos.v1.io.WakeWordParams.create({
        lmPath: LM_PATH,// Language model file path
        dicPath: DIC_PATH,// Dictation file path
        channel: matrix_io.malos.v1.io.WakeWordParams.MicChannel.channel8,// Desired MATRIX microphone
        enableVerbose: false// Enable verbose option
    })
});

// Initialise the port connection
app.port_init(config);

// Send port update
app.port_data_update();

// Wakerwork class overload the matrix object
class Wakework extends matrix_object {
    port_data_update() {
        console.log("port_data_update");
        
        // super.port_data_update();
        
        // Create a Subscriber socket
        this.updateSocket = zmq.socket('sub');
        
        // Connect Subscriber to Data Update port
        this.updateSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 3));
        
        // Subscribe to messages
        this.updateSocket.subscribe('');
        
        // On Message
        this.updateSocket.on('message', function (wakeword_buffer) {
            // Extract message
            var wakeWordData = matrix_io.malos.v1.io.WakeWordParams.decode(wakeword_buffer);
            
            // Log message
            console.log("port_data_update: " + wakeWordData);
            
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
