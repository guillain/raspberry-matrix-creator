// Load the Matrix Creator library
var matrix_object = require('object');

// Initialize the class
var app = matrix_object('127.0.0.1', 20017);

// Prepare the configuration
var config = app.matrix_io.malos.v1.driver.DriverConfig.create({
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
console.log("Humidity result: " + app.port_data_update('sense', 'Humidity'));
