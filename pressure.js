// Load the Matrix Creator library
const MatrixCreator = require('./matrix_creator.js');

// Load the matrix protos
const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function

// Pressure class overload the matrix object
class Pressure extends MatrixCreator {
    port_data_update() {
        this.updateSocket = this.zmq.socket('sub');

        // Connect Subscriber to Data Update port
        this.updateSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 3));

        // Subscribe to messages
        this.updateSocket.subscribe('');

        // On Message
        this.updateSocket.on('message', function (buffer) {
            var data = matrix_io.malos.v1.sense.Pressure.decode(buffer);// Extract message
            console.log("port_data_update: %j", data);// Log new pressure data
        });
    }
}

// Initialize the class
let app = new Pressure('127.0.0.1', 20025);

// Initialise the port connection
app.port_init();

// Get the result
app.port_data_update();

