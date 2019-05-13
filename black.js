const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function

// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Holds amount of LEDs on MATRIX device
let matrix_device_leds = 0;

// Everloop class overload the matrix object
class Everloop extends MatrixCreator {
    port_base(config) {
        console.log("port_base config:%j", config);
        
        // Create a Pusher socket
        let configSocket = this.port_connect(this.matrix_ip, this.matrix_port, 'push');

        // Create an empty Everloop image
        var image = matrix_io.malos.v1.io.EverloopImage.create();

        console.log('matrix_device_leds '+matrix_device_leds);

        // Loop every 50 milliseconds
        setInterval(function(){
            // For each device LED
            for (var i = 0; i < matrix_device_leds; ++i) {
                // Set individual LED value
                image.led[i] = {
                    black: 0
                };
            }

            // Store the Everloop image in driver configuration
            var config = matrix_io.malos.v1.driver.DriverConfig.create({
                'image': image
            });

            // Send driver configuration to MATRIX device
            if(matrix_device_leds > 0){
                console.log('setInterval config:%j', config);
                configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
            }
        },500);
    }

    port_data_update(type, element) {
        console.log("port_data_update type:%s element:%s", type, element);

        // Create a Subscriber socket
        this.updateSocket = this.port_connect(this.matrix_ip, this.matrix_port + 3, 'sub');

        // On Message
        this.updateSocket.on('message', function(buffer){
            let data = matrix_io.malos.v1.io.EverloopImage.decode(buffer);// Extract message
            matrix_device_leds = data.everloopLength;// Save MATRIX device LED count
        });
    }
}

// Instance the object
let app = new Everloop('127.0.0.1', 20021);

// Initialise the port connection
app.port_init();

// Get data update
app.port_data_update('io','EverloopImage');

