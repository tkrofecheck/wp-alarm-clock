var wp = wp || {};

wp.alarmClock = {
	now: null,
	hour: null,
	min: null,
	sec: null,

	init: function() {
		var _this = this;

		_this.setClock();
	},

	setClock: function() {
    	var _this = this,
    		now = new Date(), // get date from client computer
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
			},
    		refreshClock;

		// get hours using Date.prototype.getHours()
		_this.hour = now.getHours();

		// get minutes using Date.prototype.getMinutes()
		_this.min = now.getMinutes();

		// get seconds using Date.prototype.getSeconds()
		_this.sec = now.getSeconds();

		// adjust display of minutes and seconds to prevent text shifting
		_this.min = doubleDigit(_this.min);
    	_this.sec = doubleDigit(_this.sec);

    	document.getElementById('clock').innerHTML = formatHour(_this.hour) + ':' + _this.min + ':' + _this.sec + " " + meridiem;

    	// Use setTimeout to allow clock to refresh as seconds count up
    	refreshClock = setTimeout(function() {
    		_this.setClock();
    	}, 500);
	},

	setAlarm: function() {
		console.log('setAlarm');
	},

	unsetAlarm: function() {
		console.log('unsetAlarm');
	}
};

(function() {
	wp.alarmClock.init();
})();