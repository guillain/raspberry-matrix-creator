// Load the Matrix Creator library
var matrix_object = require('object');

// Initialize the class
var app = matrix_object('127.0.0.1', 20013);

// Initialise the port connection
app.port_init();

// Get and display the result
console.log("IMU result: " + app.port_data_update('sense', 'Imu'));
