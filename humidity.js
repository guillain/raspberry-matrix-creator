// Load the Matrix Creator class
const MatrixCreator = require('./matrix_creator.js');

/*
const matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function
const config = matrix_io.malos.v1.driver.DriverConfig.create({
  // Update rate configuration
  delayBetweenUpdates: 2.0, //app.delayBetweenUpdates,// 2 seconds between updates
  timeoutAfterLastPing: 6.0, //app.delayBetweenUpdates,// Stop sending updates 6 seconds after pings.

  // Humidity configuration
  humidity: matrix_io.malos.v1.sense.HumidityParams.create({
    currentTemperature: 23// Real current temperature [Celsius] for calibration
  })
});
*/

// Instancy the class
// let app = new MatrixCreator('127.0.0.1', 20017, config, 'sense', 'Humidity');
let app = new MatrixCreator('127.0.0.1', 20017);

// Prepare the configuration
const config = app.matrix_io.malos.v1.driver.DriverConfig.create({
  // Update rate configuration
  delayBetweenUpdates: app.delayBetweenUpdates,// 2 seconds between updates
  timeoutAfterLastPing: app.delayBetweenUpdates,// Stop sending updates 6 seconds after pings.
  
  // Humidity configuration
  humidity: app.matrix_io.malos.v1.sense.HumidityParams.create({
    currentTemperature: 23// Real current temperature [Celsius] for calibration 
  })
});

// Initialise the port connection
app.port_init(config);

// Get and display the result
app.port_data_update('sense', 'Humidity');

