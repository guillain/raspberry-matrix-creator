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
    
    // Type: sub, push
    port_connect(ip, port, type){
        console.log("port_connect ip:%s port:%d type:%s", ip, port, type);

        // Create a socket with the requsted type
        let socket = this.zmq.socket(type);

        // Connect the port
        socket.connect('tcp://' + ip + ':' + port);

        // if 'type' == Subscribe => Connect Subscriber to the port
        if (type == 'sub')
            socket.subscribe('');

        // Return the connected port/socket
        return socket;
    } 

    port_base(config) {
        console.log("port_base config:%j", config);

        // Create and connect a Pusher socket
        this.configSocket = this.port_connect(this.matrix_ip, this.matrix_port, 'push');

        // Send driver configuration
        this.configSocket.send(
            this.matrix_io.malos.v1.driver.DriverConfig.encode(config).finish()
        );
    }
    
    port_keep_alive() {
        console.log("port_keep_alive");

        // Create and connect a Pusher socket
        this.pingSocket = this.port_connect(this.matrix_ip, this.matrix_port + 1, 'push');

        // Send initial ping
        this.pingSocket.send('');
        
        // Send ping every 5 seconds
        this.set_interval(this.keepAlivePing, function(){this.pingSocket.send('')});
    }
    
    port_error() {
        console.log("port_error");

        // Create and connect a Subscriber socket
        this.errorSocket =  this.port_connect(this.matrix_ip, this.matrix_port + 2, 'sub');

        // On Message
        this.errorSocket.on('message', function (error_message) {
            console.log('port_error: ' + error_message.toString('utf8'));// Log error
        });
    }
    
    port_data_update(type, element) {
        console.log("port_data_update type:%s element:%s", type, element);

        // Create and connect a Subscriber socket
        this.updateSocket = this.port_connect(this.matrix_ip, this.matrix_port + 3, 'sub');

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
