//mami-sensortag.js

Module.register("mami-sensortag",{
	// Default module config.
	defaults: {
	},

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);

		this.sensorConnected = false;
		this.irTemperature = undefined;
		this.humidity = undefined;
		this.barometricPressure = undefined;
		this.luxometer = undefined;

    this.sendSocketNotification("ENABLE_SENSORTAG", this.config);
  },

	// Override dom generator.
  // TODO: translate() function will fail if value is not found from cameradata
	getDom: function() {

		if (! this.sensorConnected) {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = this.translate("NO_CONNECTION");
			wrapper.className = "dimmed light small";
			return wrapper;
		} else {

			var table = document.createElement("table");
			table.className = "small";

			// IR temperature : ambient
			if (this.irTemperature) {
				var ambientTempRow = document.createElement("tr");
				table.appendChild(ambientTempRow);
				var ambientTempLabel = document.createElement("td");
				ambientTempLabel.className = "dimmed small";
				ambientTempLabel.innerHTML = this.translate("IR_AMBIENT_TEMPERATURE");
				ambientTempRow.appendChild(ambientTempLabel);
				var ambientTempValue = document.createElement("td");
				ambientTempValue.className = "bright small";
				ambientTempValue.innerHTML = this.irTemperature.ambientTemperature.toFixed(1) + " °C";
				ambientTempRow.appendChild(ambientTempValue);
				// IR temperature: object
				var objectTempRow = document.createElement("tr");
				table.appendChild(objectTempRow);
				var objectTempLabel = document.createElement("td");
				objectTempLabel.className = "dimmed small";
				objectTempLabel.innerHTML = this.translate("IR_OBJECT_TEMPERATURE");
				objectTempRow.appendChild(objectTempLabel);
				var objectTempValue = document.createElement("td");
				objectTempValue.className = "bright small";
				objectTempValue.innerHTML = this.irTemperature.objectTemperature.toFixed(1) + " °C";
				objectTempRow.appendChild(objectTempValue);
			}

			// Humidity: percentage
			if (this.humidity) {
				var humidityRow = document.createElement("tr");
				table.appendChild(humidityRow);
				var humidityLabel = document.createElement("td");
				humidityLabel.className = "dimmed small";
				humidityLabel.innerHTML = this.translate("HUMIDITY");
				humidityRow.appendChild(humidityLabel);
				var humidityValue = document.createElement("td");
				humidityValue.className = "bright small";
				humidityValue.innerHTML = this.humidity.humidity.toFixed(1) + " %";
				humidityRow.appendChild(humidityValue);
			}

			// Barometric pressure
			if (this.barometricPressure) {
				var pressureRow = document.createElement('tr');
				table.appendChild(pressureRow);
				var pressureLabel = document.createElement('td');
				pressureLabel.className = 'dimmed small';
				pressureLabel.innerHTML = this.translate('BAROMETRIC_PRESSURE');
				pressureRow.appendChild(pressureLabel);
				var pressureValue = document.createElement('td');
				pressureValue.className = 'bright small';
				pressureValue.innerHTML = this.barometricPressure.toFixed(1) + ' mBar';
				pressureRow.appendChild(pressureValue);
			}

			//
			if (this.luxometer) {
				var luxometerRow = document.createElement('tr');
				table.appendChild(luxometerRow);
				var luxometerLabel = document.createElement('td');
				luxometerLabel.className = 'dimmed small';
				luxometerLabel.innerHTML = this.translate('LUXOMETER');
				luxometerRow.appendChild(luxometerLabel);
				var luxometerValue = document.createElement('td');
				luxometerValue.className = 'bright small';
				luxometerValue.innerHTML = this.luxometer.toFixed(1) + " lx";
				luxometerRow.appendChild(luxometerValue);
			}

			return table;
		}
	},

  socketNotificationReceived: function(notification, payload) {

     Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);

		 if (notification == 'CONNECTED') {
			 this.sensorConnected = true;
		 } else if (notification == 'DISCONNECTED') {
			 this.sensorConnected = false;
		 } else if (notification == 'IR_TEMPERATURE_CHANGE') {
			 this.irTemperature = payload;
		 } else if (notification == 'HUMIDITY_CHANGE') {
			 this.humidity = payload;
		 } else if (notification == 'BAROMETRIC_PRESSURE_CHANGE') {
			 this.barometricPressure = payload;
		 } else if (notification == 'LUXOMETER_CHANGE') {
			 this.luxometer = payload;
		 }

		 //this.updateDom(500);
		 this.updateDom();
  },

	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			//this.hide();
		}
	},

  getTranslations: function() {
  	return {
  			fi: "fi.json"
  	}
  },


});
