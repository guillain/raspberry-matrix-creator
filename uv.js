// Load the Matrix Creator library
var matrix_object = require('object');

// Initialize the class
var app = matrix_object('127.0.0.1', 20029);

// Initialise the port connection
app.port_init();

// Get and display the result
console.log("UV result: " + app.port_data_update('sense', 'UV'));
