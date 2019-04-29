// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// App class overload the matrix object
class App extends MatrixCreator {
    port_base(config) {
        console.log("port_base config:%j", config);
        
        this.configSocket = this.zmq.socket('push');// Create a Pusher socket
        this.configSocket.connect('tcp://' + this.matrix_ip + ':' + this.matrix_port);// Connect Pusher to Base port
        
        // Loop every 50 milliseconds
        this.set_interval(this.keepAlivePing, function () {
            // Create an empty Everloop image
            var image = this.matrix_io.malos.v1.io.EverloopImage.create();
            
            // For each device LED
            for (var i = 0; i < this.matrix_device_leds; ++i) {
                // Set individual LED value
                image.led[i] = {
                    red: Math.floor(Math.random() * 200) + 1,
                    green: Math.floor(Math.random() * 255) + 1,
                    blue: Math.floor(Math.random() * 50) + 1,
                    white: 0
                };
            }
        
            // Store the Everloop image in MATRIX configuration
            var config = this.matrix_io.malos.v1.driver.DriverConfig.create({'image': image});
        
            // Send MATRIX configuration to MATRIX device
            if (this.matrix_device_leds > 0)
                this.configSocket.send(this.matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
        
        });
    }
}

// Instance the object
let app = new App('127.0.0.1', 20021);

// Initialise the port connection
app.port_init();

