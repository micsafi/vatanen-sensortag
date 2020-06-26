// node_helper for mami-sensortag

var NodeHelper = require("node_helper");

var SensorTag = require('sensortag');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting module: " + this.name);

  },

	enableSensorTag: function(sensorConfig) {

		var self = this;

		SensorTag.discover(function (sensorTag) {
			console.log('discovered: ' + sensorTag);
			self.sendSocketNotification("CONNECTED");

		  sensorTag.on('disconnect', function() {
		    console.log('disconnected!');
		    self.sendSocketNotification("DISCONNECTED");
		  });

			console.log("trying to connect...");
			sensorTag.connectAndSetUp(function (err) {
				if (err) {
					console.log(err);
				}

				// IR Temperature
				console.log("Trying to enable sensor.....");
				sensorTag.enableIrTemperature(function (error) {
					console.log("enabled IR sensor");
					sensorTag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
		        console.log('\tobject temperature = %d °C', objectTemp.toFixed(1));
		        console.log('\tambient temperature = %d °C', ambientTemp.toFixed(1));
						self.sendSocketNotification("IR_TEMPERATURE_CHANGE", {objectTemperature: objectTemp, ambientTemperature: ambientTemp});
		      });
					console.log("IR event handler binded");

					sensorTag.setIrTemperaturePeriod(2000, function(error) {
						console.log("Enabling IR temperature measurement....");
						sensorTag.notifyIrTemperature(function (error) {
							console.log("Enabled IR temperature measurement");
						});
					}); // period min 300ms, default period is 1000 ms
				});

				// Humidity sensor
				sensorTag.enableHumidity(function (error) {

					sensorTag.on('humidityChange', function(temp, humi) {
            console.log('\ttemperature = %d °C', temp.toFixed(1));
            console.log('\thumidity = %d %', humi.toFixed(1));
						self.sendSocketNotification("HUMIDITY_CHANGE", {temperature: temp, humidity: humi});
          });

					sensorTag.setHumidityPeriod(500, function(error) {
						sensorTag.notifyHumidity(function(error) {
						});
					});
				});

				// Baremetric pressure
				sensorTag.enableBarometricPressure(function (error) {

					sensorTag.on('barometricPressureChange', function(pressure) {
            console.log('\tpressure = %d mBar', pressure.toFixed(1));
						self.sendSocketNotification('BAROMETRIC_PRESSURE_CHANGE', pressure);
          });

					sensorTag.setBarometricPressurePeriod(500, function(error) {
						sensorTag.notifyBarometricPressure(function(error) {
						});
					});
				});

				// Luxometer
				sensorTag.enableLuxometer(function (error) {
					sensorTag.on('luxometerChange', function(lux) {
						console.log('\tlux = %d', lux.toFixed(1));
						self.sendSocketNotification('LUXOMETER_CHANGE', lux);
					});

					sensorTag.setLuxometerPeriod(500, function(error) {
          	console.log('notifyLuxometer');
            sensorTag.notifyLuxometer(function(error) {
						});
					});
				});


			});

		});

	},

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    console.log("Receiving notification, type: " + notification + ", payload: " + payload);
    if (notification === "ENABLE_SENSORTAG") {
      this.enableSensorTag(payload);
			console.log("Returning from notification");
	    return;

    }
  }
});
