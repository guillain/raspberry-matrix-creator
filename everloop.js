// Load the Matrix Creator library
var matrix_object = require('object');

// Initialize the class
var app = Everloop('127.0.0.1', 20021);

// Initialise the port connection
app.port_init();

// Everloop class overload the matrix object
class Everloop extends matrix_object {
    port_base(config) {
        console.log("port_base");
        
        // Create a Pusher socket
        this.configSocket = this.zmq.socket('push');
        
        // Connect Pusher to Base Port
        this.configSocket.connect('tcp://' + this.matrix_ip + ':' + this.matrix_port);
        
        // Create an empty Everloop image
        var image = this.matrix_io.malos.v1.io.EverloopImage.create();
        
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
            var config = this.matrix_io.malos.v1.driver.DriverConfig.create({
                'image': image
            });
            
            // Send driver configuration to MATRIX device
            if (this.matrix_device_leds > 0)
                this.configSocket.send(this.matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
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