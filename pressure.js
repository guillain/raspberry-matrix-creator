// Load the Matrix Creator library
var matrix_object = require('object');

// Initialize the class
var app = Pressure('127.0.0.1', 20025);

// Initialise the port connection
app.port_init();

// Get the result
console.log("Pressure result: " + app.port_data_update());

// Pressure class overload the matrix object
class Pressure extends matrix_object {
    port_data_update() {
        this.updateSocket = this.zmq.socket('sub');

        // Connect Subscriber to Data Update port
        this.updateSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 3));

        // Subscribe to messages
        this.updateSocket.subscribe('');

        // On Message
        this.updateSocket.on('message', function (buffer) {
            var data = this.matrix_io.malos.v1.sense.Pressure.decode(buffer);// Extract message
            console.log(data);// Log new pressure data
        });
    }
}