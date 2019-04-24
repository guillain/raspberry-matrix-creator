class MatrixObject {
    constructor(matrix_ip, matrix_port) {
        console.log("constructor");
        
        this.matrix_ip = matrix_ip;
        this.matrix_port = matrix_port;
        
        this.delayBetweenUpdates = 2.0; // 2 seconds between updates
        this.keepAlivePing = 5.0; // keep-alive pings interval of 5s
        this.timeoutAfterLastPing = 6.0; // Stop sending updates 6 seconds after pings.
        this.matrix_device_leds = 0;// Holds amount of LEDs on MATRIX device
        
        this.zmq = require('zeromq');// Asynchronous Messaging Framework
        this.matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function
    }
    
    port_init(config='') {
        console.log("port_init");
    
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
        console.log("port_base");
        
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
        this.set_interval(this.keepAlivePing, this.pingSocket.send(''));
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
        console.log("port_data_update");
        
        // Create a Subscriber socket
        this.updateSocket = this.zmq.socket('sub');
        
        // Connect Subscriber to Data Update port
        this.updateSocket.connect('tcp://' + this.matrix_ip + ':' + (this.matrix_port + 3));
        
        // Subscribe to messages
        this.updateSocket.subscribe('');
        
        // On Message
        this.updateSocket.on('message', function (buffer) {
            // var data = this.matrix_io.malos.v1.sense.UV.decode(buffer);// Extract message
            // var data = matrix_io.malos.v1.sense.Humidity.decode(buffer);// Extract message
            // var data = matrix_io.malos.v1.sense.Imu.decode(buffer);// Extract message
            // var data = this.matrix_io.malos.v1.io.WakeWordParams.decode(buffer);
            // var data = this.matrix_io.malos.v1.io.GpioParams.decode(buffer);
            var data = this.matrix_io.malos.v1[type][element].decode(buffer);// Extract message
            console.log("port_data_update: " + data);// Log new data
            return data;
        });
    }
    
    set_interval(timeout_s, action){
        setInterval(function () {
            action();
        }, timeout_s * 1000);
    }
}
