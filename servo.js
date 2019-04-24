// Load the Matrix Creator library
var matrix_object = require('object');

// Initialize the class
var app = matrix_object('127.0.0.1', 20045);

// Create driver configuration
var config = app.matrix_io.malos.v1.driver.DriverConfig.create({
  // Create servo configuration
  servo: app.matrix_io.malos.v1.io.ServoParams.create({
    pin: 0,// Use pin 0
    angle: 0// Set angle 0
  })
});

// Initialise the port connection
app.port_init(config);

// Loop every second
app.set_interval(1, function(){
  console.log("set_interval");
  
  // Pick number from 1-180
  var angle = Math.floor(Math.random() * 180)+1;
  // Set number as new random angle
  config.servo.angle = angle;
  // Log angle
  console.log('Angle: ' + angle);
  // Send driver configuration
  app.configSocket.send(
      app.matrix_io.malos.v1.driver.DriverConfig.encode(config).finish()
  );
});
