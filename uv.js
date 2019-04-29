// Load the Matrix Creator object
let MatrixCreator = require('./matrix_creator.js');

// Instance the object
let app = new MatrixCreator('127.0.0.1', 20029);

// Initialise the port connection
app.port_init();

// Get and display the result
app.port_data_update('sense', 'UV');

