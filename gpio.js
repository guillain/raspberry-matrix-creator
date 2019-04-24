// Load the Matrix Creator object
const MatrixCreator = require('./matrix_creator.js');

// Instance the object
let app = new MatrixCreator('127.0.0.1', 20049);

var counter = 1;// Counter for gpio value toggle

// Initialise the port connection
app.port_init();

// Extract message
var data = app.port_data_update('GpioParams');
// String value to represent all GPIO pins as off
var zeroPadding = '0000000000000000';
// Remove padding to make room for GPIO values
var gpioValues = zeroPadding.slice(0, zeroPadding.length - data.values.toString(2).length);
// Convert GPIO values to 16-bit and add to string
gpioValues = gpioValues.concat(data.values.toString(2));
// Convert string to chronologically ordered array
gpioValues = gpioValues.split("").reverse();

// Log GPIO pin states from gpioValues[0-15]
console.log('GPIO PINS-->[0-15]\n' + '[' + gpioValues.toString() + ']');
console.log("GPIO result: " + app.port_data_update('EverloopImage'));


class GPIO extends matrix_object {
    port_base(config) {
        console.log("port_base");
        
        // Create a Pusher socket
        this.configSocket = zmq.socket('push');
        
        // Connect Pusher to Base port
        this.configSocket.connect('tcp://' + this.matrix_ip + ':' + this.matrix_port);
        
        //Create driver configuration
        var outputConfig = matrix_io.malos.v1.driver.DriverConfig.create({
            // Update rate configuration
            delayBetweenUpdates: this.delayBetweenUpdates,// 2 seconds between updates
            timeoutAfterLastPing: this.timeoutAfterLastPing,// Stop sending updates 6 seconds after pings.
            
            //GPIO Configuration
            gpio: matrix_io.malos.v1.io.GpioParams.create({
                pin: 0,// Use pin 0
                mode: matrix_io.malos.v1.io.GpioParams.EnumMode.OUTPUT,// Set as output mode
                value: 0// Set initial pin value as off
            })
        });
        
        //Function to toggle gpio value to 0 or 1
        function toggle() {
            outputConfig.gpio.value = counter % 2;// Set pin value as 1 or 0
            counter++;// increase counter
            // Send MATRIX configuration to MATRIX device
            this.configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(outputConfig).finish());
        }
    }
}
