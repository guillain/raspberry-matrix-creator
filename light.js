const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function

// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Holds amount of LEDs on MATRIX device
let matrix_device_leds = 0;

// Get arguments parameters
const args = require('minimist')(process.argv.slice(2))
//const args = process.argv.slice(2)
const type = args['type'] || 'fix'; 
const timer = args['timer'] || 500;
const mod_value = args['mod_value'] || 2;
let c_front = args['c_front'] || { red:0, green:255, blue:0, white:0 };
let c_background = args['c_background'] || { red:0, green:0, blue:0, white:0 };

// App class overload the matrix object
class App extends MatrixCreator {
    port_base(config) {
        console.log("port_base config:%j", config);

        // Create a Pusher socket
        let configSocket = this.port_connect(this.matrix_ip, this.matrix_port, 'push');

        // Create an empty Everloop image
        var image = matrix_io.malos.v1.io.EverloopImage.create();

        // My loop
        let i_light = 0;
        let the_led = 0;
        let mem_light = 0;

        // Loop every 50 milliseconds
        setInterval(function(){
            // For each device LED
            for (var i = 0; i < matrix_device_leds; ++i){
                if (type == "all") {
                    image.led[i] = c_front;
                }
                if (type == "off") {
                    image.led[i] = c_background;
                }
                if (type == "mod") {
                    if (i%mod_value)  image.led[i] = c_front;
                    else              image.led[i] = c_background;
                }
                if (type == "dot") {
                    if (i == the_led) image.led[i] = c_front;
                    else              image.led[i] = c_background;

                    if ((i+1) == matrix_device_leds) the_led++;
                    if (the_led == matrix_device_leds) the_led = 0;
                }
                if (type == "flash") {
                    if (i < i_light)  image.led[i] = c_front;
                    else              image.led[i] = c_background;

                    if (i_light > matrix_device_leds) {
                        let cc_front = c_front;
                        c_front = c_background;
                        c_background = cc_front;
                        i_light = 0;
                    }
                }
                if (type == "circle") {
                    if (i < the_led)   image.led[i] = c_front;
                    else               image.led[i] = c_background;

                    if ((i+1) == matrix_device_leds) the_led++;
                    if (the_led == matrix_device_leds) {
                        the_led = 0;
                        let cc_front = c_front;
                        c_front = c_background;
                        c_background = cc_front;
                    }
                }
                if (type == "circle_snake") {
                    if ((i < i_light) && (i > matrix_device_leds - i_light)) image.led[i] = c_front;
                    else              image.led[i] = c_background;

                    if (i_light > matrix_device_leds) i_light = 0;
                }
                if (type == "snake") {
                    if (i_light%3)    image.led[i] = c_front;
                    else              image.led[i] = c_background;
                }
                if (type == "dancing") {
                  if (i_light%2)      image.led[i] = { red:255, green:0, blue:0, white:0 };
                  else if (i_light%3) image.led[i] = { red:0, green:255, blue:0, white:0 };
                  else                image.led[i] = { red:0, green:0, blue:255, white:0 };
                }
                i_light++;
            }

            // Store the Everloop image in driver configuration
            var config = matrix_io.malos.v1.driver.DriverConfig.create({ 'image': image });

            // Send driver configuration to MATRIX device
            if(matrix_device_leds > 0)
                configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
        },timer);
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
let app = new App('127.0.0.1', 20021);

// Initialise the port connection
app.port_init();

// Get data update
app.port_data_update('io','EverloopImage');

