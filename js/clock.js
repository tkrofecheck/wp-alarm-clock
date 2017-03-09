var wp = wp || {};

wp.alarmClock = {
	config: {
		alarmOn: false,
		hour: {
			name: 'hour',
			min: 1,
			max: 12
		},
		minute: {
			name: 'minute',
			min: 0,
			max: 59
		},
		second: {
			name: 'second',
			min: 0,
			max: 59
		},
		meridiem: {
			min: 'AM',
			max: 'PM'
		}
	},

	time: null,

	hour: null,

	min: null,

	sec: null,

	stop: false,

	refreshClock: null,

	init: function() {
		var _this = this;

		_this.setClock();
		_this.createAlarmDropDown(_this.config.hour);
		_this.createAlarmDropDown(_this.config.minute);
		_this.createAlarmDropDown(_this.config.second);
		_this.createAlarmDropDown(_this.config.meridiem);
		_this.bindEvents();
	},

	setClock: function() {
    	var _this = this,
    		time = new Date(), // get date from client computer
    		doubleDigit = function(i) {
    			// Check if value is less than 10
    			if (i < 10) {
    				// Prepend value with 0, if less than 10
    				i = '0' + i;
    			}

    			// Return value
    			return i;
			},
			formatHour = function(h) {
				var hh = h;

				_this.meridiem = "AM";
				console.log('hour', h);

				if (h >= 12) {
					h = hh-12;
					_this.meridiem = "PM";
				}

				if (h === 0) {
					h = 12;
				}

				h = doubleDigit(h);

				return h;
			};

		// get hours using Date.prototype.getHours()
		_this.hour = time.getHours();

		// get minutes using Date.prototype.getMinutes()
		_this.min = time.getMinutes();

		// get seconds using Date.prototype.getSeconds()
		_this.sec = time.getSeconds();

		// adjust display of minutes and seconds to prevent text shifting
		_this.min = doubleDigit(_this.min);
    	_this.sec = doubleDigit(_this.sec);

    	document.getElementById('clock').innerHTML = formatHour(_this.hour) + ':' + _this.min + ':' + _this.sec + " " + _this.meridiem;

    	// Continue if stopClock is not set
    	// Use setTimeout to allow clock to refresh as seconds count up
    	if (!_this.stop) {
    		_this.refreshClock = setTimeout(function() {
	    		_this.setClock();
	    	}, 500);
	    }
	},

	createAlarmDropDown: function(obj) {
		var _this = this,
			$select,
			$option,
			i;

		$('#alarm').append($('<select name="' + obj.name + '" id="' + obj.name + '"/>'));
		$select = $('select[name="' + obj.name + '"]');

		if (typeof obj.name !== 'undefined' && obj.name !== null && obj.name !== '') {
			$select.append($('<option label="' + obj.name + '"/>'));
		}
		
		if (!isNaN(obj.min) || !isNaN(obj.max)) {
			for (i=obj.min; i<=obj.max; i++) {
				$option = $('<option value="' + i + '">' + i + '</option>');
				$select.append($option);
			}
		} else {
			$option = $('<option value="' + obj.min + '">' + obj.min + '</option>');
			$select.append($option);
			$option = $('<option value="' + obj.max + '">' + obj.max + '</option>');
			$select.append($option);
		}
	},

	setAlarm: function() {
		var _this = this,
			hour = $('select[name="hour"]').val(),
			min = $('select[name="minute"]').val(),
			sec = $('select[name="second"]').val(),
			msg;

		if (noErr()) {
			console.log('set hour', hour);

			_this.config.alarmOn = true;
			_this.alarmTime = new Date(hour + ":" + min + ":" + sec + " " + meridian);
			console.log('setAlarm');
		} else {
			alert(msg);
		}

		function noErr() {
			if (isNaN(hour)) {
				msg = 'Please select an hour\n';
			}

			if (isNaN(min)) {
				msg = 'Please select an minute\n';
			}

			if (isNaN(sec)) {
				msg = 'Please select a second\n';
			}

			if (msg.length > 1) {
				return false;
			}

			return true;
		}
	},

	unsetAlarm: function() {
		var _this = this;

		_this.config.alarmOn = false;
		console.log('unsetAlarm');
	},

	startClock: function() {
		var _this = this;

		_this.stop = false;
	},

	stopClock: function() {
		var _this = this;

		_this.stop = true;
	},

	bindEvents: function() {
		var _this = this;

		$('input, select').change(function(evt) {
			console.log('evt', evt);
			
			if (evt.currentTarget.name === 'alarm') {
				if (this.value === 'off') {
					_this.unsetAlarm();
				} else {
					_this.setAlarm();
				}
			} else {
				if (_this.config.alarmOn) {
					_this.setAlarm();
				}
			}

			return true;
		});
	}
};

(function() {
	wp.alarmClock.init();
})();