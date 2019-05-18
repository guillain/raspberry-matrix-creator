# raspberry-matrix-creator
It's a tools to play easily with [Raspberry](https://www.raspberrypi.org) + [Matrxi Creator](https://www.matrix.one/products/creator) by providing a genercial class 'MatrixCreator' to overload by usage.


The idea is to keep NodeJS as main langage to do fast and easy development and integration.


Some examples using this class are provided coming from the original examples:
- https://github.com/matrix-io/matrix-core-examples/tree/master/javascript


# Requirements
* nodeJS
* npm


# Installation
```
git clone https://github.com/guillain/raspberry-matrix-creator.git
cd raspberry-matrix-creator
npm install
```

# Example
You cna use the main to orchestrate the execution by a remote tools or directly by executing the node script.

## Main
### One shot execution (ie get sensor value)
```
../main humidity
cat /tmp/matrix_humidity.sig
```

### Looping mode - as node daemon (ie light dance)
```
../main everloop loop
sleep 10
../main everloop # to stop the run
../main black # to stop the light
```

## Humidity
```
node humidity.js
[Ctrl+C]
```
## IMU
```
node imu.js
[Ctrl+C]
```
## Pressure
```
node pressure.js
[Ctrl+C]
```


