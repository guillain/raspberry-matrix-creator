const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function

// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Holds amount of LEDs on MATRIX device
let matrix_device_leds = 0;

const c_hour = { red:255, green:0, blue:0, white:0 };
const c_minute = { red:0, green:255, blue:0, white:0 };
const c_second = { red:0, green:0, blue:255, white:0 };
const c_not_used = { black:0 };
const c_cadran = { red:20, green:20, blue:20, white:2 };
const c_cadran_top = { white:200 };

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
        var i = 0;

        setInterval(function(){
            // Init time
            var time = new Date();
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            var ms = time.getMilliseconds();
            h = ( h > 12 ) ? h - 12 : h; // ampm normalize

            // translate hours (12) + minutes (0-60 = 0-1 ) to angle (360) and convert it to index
            let i_hour = Math.floor((h + (m/60) + (s/3600)) * 3);

            // translate minutes ( 60 ) to angle ( 360 ) and convert it to index
            let i_minute = Math.floor((m + (s/60) + (ms/60000)) * 6 / 10);

            // translate seconds (60) to angle (360) and convert it to index
            let i_second = Math.floor((s + (ms/1000)) * 6 / 10);

            // For each device LED set to black
            for (var i = 0; i < matrix_device_leds; ++i){
              if      (i == i_hour)   image.led[i] = c_hour;
              else if (i == i_minute) image.led[i] = c_minute;
              else if (i == i_second) image.led[i] = c_second;
              else if (i==matrix_device_leds - 1)          image.led[i] = c_cadran_top;
              else if ((i==8) || (i==17) || (i==26)) image.led[i] = c_cadran;
              else                    image.led[i] = c_not_used;
            }

            // Store the Everloop image in driver configuration
            var config = matrix_io.malos.v1.driver.DriverConfig.create({'image': image});

            // Send driver configuration to MATRIX device
            if(matrix_device_leds > 0)
                configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
        }, 50);
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

