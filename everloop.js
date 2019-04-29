const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function

// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Everloop class overload the matrix object
class Everloop extends MatrixCreator {
    port_base(config) {
        console.log("port_base config:" + config);
        
        // Create a Pusher socket
        this.configSocket = this.zmq.socket('push');
        
        // Connect Pusher to Base Port
        this.configSocket.connect('tcp://' + this.matrix_ip + ':' + this.matrix_port);
        
        // Create an empty Everloop image
        var image = matrix_io.malos.v1.io.EverloopImage.create();
        
        // Loop every 50 milliseconds
        this.set_interval(0.05, function () {
            // For each device LED
            for (var i = 0; i < matrix_device_leds; ++i) {
                // Set individual LED value
                image.led[i] = {
                    red: Math.floor(Math.random() * 200) + 1,
                    green: Math.floor(Math.random() * 255) + 1,
                    blue: Math.floor(Math.random() * 50) + 1,
                    white: 0
                };
            }
            
            // Store the Everloop image in driver configuration
            var config = matrix_io.malos.v1.driver.DriverConfig.create({
                'image': image
            });
            
            // Send driver configuration to MATRIX device
            if (this.matrix_device_leds > 0) {
                this.configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
            }
        });
    }
    
    port_keep_alive() {
        console.log("port_keep_alive");
        
        // Create a Pusher socket
        this.pingSocket = this.zmq.socket('push');
        
        // Connect Pusher to Keep-alive port
        this.pingSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 1));
        
        // Send initial ping
        this.pingSocket.send('');
    }
}

// Instance the object
let app = new MatrixCreator('127.0.0.1', 20021);

// Initialise the port connection
app.port_init();

