const zmq = require('zeromq');// Asynchronous Messaging Framework
const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function

class MatrixCreator {
    constructor(matrix_ip, matrix_port, config='', type='', element='') {
        console.log("constructor matrix_ip:%s matrix_port:%s config:%j type:%s element:%s", matrix_ip, matrix_port, config, type, element);
        
        this.matrix_ip = matrix_ip; // Set local ip address
        this.matrix_port = matrix_port; // Set local tcp port
        
        this.delayBetweenUpdates = 2.0; // 2 seconds between updates
        this.keepAlivePing = 5.0; // keep-alive pings interval of 5s
        this.timeoutAfterLastPing = 6.0; // Stop sending updates 6 seconds after pings.
        this.matrix_device_leds = 0;// Holds amount of LEDs on MATRIX device

        this.zmq = zmq; // Asynchronous Messaging Framework
        this.matrix_io = matrix_io;// Protocol Buffers for MATRIX function

        if (config != '') this.port_init(config); // Port initialisation if the config is provided

        // Update data on port if the type and element are provided
        if ((type != '') && (element != '')) this.port_data_update(type, element);
    }
    
    port_init(config='') {
        console.log("port_init config:%j", config);

        // Driver configuration
        if (config == '') {
            var config = this.matrix_io.malos.v1.driver.DriverConfig.create({
                // Update rate configuration
                delayBetweenUpdates: this.delayBetweenUpdates,// 2 seconds between updates
                timeoutAfterLastPing: this.timeoutAfterLastPing,// Stop sending updates 6 seconds after pings.
            });
        }
        
        this.port_base(config);
        this.port_keep_alive();
        this.port_error();
    }
    
    port_base(config) {
        console.log("port_base config:%j", config);

        // Create a Pusher socket
        this.configSocket = this.zmq.socket('push');
        
        // Connect Pusher to Base port
        this.configSocket.connect('tcp://' + this.matrix_ip + ':' + this.matrix_port);
        
        // Send driver configuration
        this.configSocket.send(
            this.matrix_io.malos.v1.driver.DriverConfig.encode(config).finish()
        );
    }
    
    port_keep_alive() {
        console.log("port_keep_alive");

        // Create a Pusher socket
        this.pingSocket = this.zmq.socket('push');
        
        // Connect Pusher to Keep-alive port
        this.pingSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 1));
        
        // Send initial ping
        this.pingSocket.send('');
        
        // Send ping every 5 seconds
        this.set_interval(this.keepAlivePing, function(){this.pingSocket.send('')});
    }
    
    port_error() {
        console.log("port_error");

        // Create a Subscriber socket
        this.errorSocket = this.zmq.socket('sub');
        
        // Connect Subscriber to Error port
        this.errorSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 2));
        
        // Connect Subscriber to Error port
        this.errorSocket.subscribe('');
        
        // On Message
        this.errorSocket.on('message', function (error_message) {
            console.log('port_error: ' + error_message.toString('utf8'));// Log error
        });
    }
    
    port_data_update(type, element) {
        console.log("port_data_update type:" + type + " element:" + element);

        // Create a Subscriber socket
        this.updateSocket = this.zmq.socket('sub');
        
        // Connect Subscriber to Data Update port
        this.updateSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 3));
        
        // Subscribe to messages
        this.updateSocket.subscribe('');
        
        // On Message
        this.updateSocket.on('message', function (buffer) {
            let data = matrix_io.malos.v1[type][element].decode(buffer);// Extract message
            console.log("port_data_update: %j", data);// Log new data
        });
    }
    
    set_interval(timeout_s, cb){
        setInterval(function () {
        }, timeout_s * 1000);
    }
}

module.exports = MatrixCreator;
