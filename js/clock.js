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
		_this.bindEvents();
	},

	bindEvents: function() {
		var _this = this;

		$('input select').change(function(evt) {
			console.log('evt', evt);
			
			if (evt.currentTarget.name === 'alarm') {
				if (this.value === 'off') {
					_this.unsetAlarm();
				} else {
					_this.setAlarm();
				}
			}

			return true;
		});
	},

	setClock: function() {
    	var _this = this,
    		time = new Date(), // get date from client computer
    		meridiem = 'AM',
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

				console.log('hour', h);

				if (h >= 12) {
					h = hh-12;
					meridiem = "PM";
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

    	document.getElementById('clock').innerHTML = formatHour(_this.hour) + ':' + _this.min + ':' + _this.sec + " " + meridiem;

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

		$select.append($('<option label="' + obj.name + '"/>'));
		
		for (i=obj.min; i<=obj.max; i++) {
			$option = $('<option value="' + i + '">' + i + '</option>');
			$select.append($option);
		}
	},

	setAlarm: function() {
		var _this = this;

		_this.config.alarmOn = true;
		console.log('setAlarm');
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
	}
};

(function() {
	wp.alarmClock.init();
})();