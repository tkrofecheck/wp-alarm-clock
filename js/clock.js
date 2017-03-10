var wp = wp || {};

wp.alarmClock = {
	$clock: null,

	config: {
		alarmMessage: 'THIS IS YOUR ALARM! GET UP!',
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
		meridiem: {
			name: 'meridiem',
			min: 'AM',
			max: 'PM'
		},
		snooze: {
			name: 'snooze',
			min: 1,
			max: 60,
			time: 2
		}
	},

	
	meridiem: null,
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	time: null,
	month: null,
	date: null,
	year: null,
	refreshClock: null,
	alarmOn: false,
	alarmTime: null,

	init: function() {
		var _this = this;

		_this.$clock = $('#clock');
		_this.$alarm = $('#');

		_this.setClock();

		_this.createAlarmDropDown(_this.config.hour);
		_this.createAlarmDropDown(_this.config.minute);
		_this.createAlarmDropDown(_this.config.meridiem);

		_this.bindEvents();
	},

	doubleDigit: function(i) {
		// Check if value is less than 10
		if (i < 10) {
			// Prepend value with 0, if less than 10
			i = '0' + i;
		}

		// Return value
		return i;
	},

	formatHour: function(h) {
		var _this = this,
			hh = h;

		_this.meridiem = "AM";

		if (h >= 12) {
			h = hh - 12;
			_this.meridiem = "PM";
		}

		if (h === 0) {
			h = 12;
		}

		h = _this.doubleDigit(h);

		return h;
	},

	setClock: function() {
		var _this = this,
			$date = _this.$clock.find('.date'),
			$time = _this.$clock.find('.time'),
			$buzzer = _this.$clock.find('.buzzer'),
			time = new Date(), // get date from client computer
			hour = time.getHours(), // get hours using Date.prototype.getHours()
			min = time.getMinutes(), // get minutes using Date.prototype.getMinutes()
			sec = time.getSeconds(); // get seconds using Date.prototype.getSeconds()

		_this.month = time.getMonth();
		_this.date = time.getDate();
		_this.year = time.getFullYear();

		$date.html(_this.months[_this.month] + ' ' + _this.date + ', ' + _this.year);

		// adjust display of hour, minutes and seconds
		$time.html(_this.formatHour(hour) + ':' + _this.doubleDigit(min) + ':' + _this.doubleDigit(sec) + " " + _this.meridiem);

		// Use setTimeout to allow clock to refresh as seconds count up
		// Check alarm with current time (hh:mm) to determine if alarm should be triggered
		_this.refreshClock = setTimeout(function() {
			if (_this.alarmOn && _this.alarmTime !== null) {
				if ((time.getHours() === _this.alarmTime.getHours()) && (time.getMinutes() === _this.alarmTime.getMinutes())) {
					$buzzer.find('span').html(_this.config.alarmMessage);
					$buzzer.show();
				}
			}
			_this.setClock();
		}, 500);
	},

	createAlarmDropDown: function(obj) {
		var _this = this,
			$select,
			$option,
			val,
			label,
			i;

		_this.$clock.find('.alarm').append($('<select name="' + obj.name + '" id="' + obj.name + '"/>'));
		$select = $('select[name="' + obj.name + '"]');

		if (!isNaN(obj.min) || !isNaN(obj.max)) {
			if (typeof obj.name !== 'undefined' && obj.name !== null && obj.name !== '') {
				$select.append($('<option label="' + obj.name + '" value="' + obj.name + '"/>'));
			}

			for (i = obj.min; i <= obj.max; i++) {
				if (i < 10) {
					label = "0" + i;
				} else {
					label = i;
				}

				if (obj.name === 'hour' && i === 12) {
					val = 0;
				} else {
					val = i;
				}

				$option = $('<option value="' + val + '">' + label + '</option>');
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
			hour = parseInt($('select[name="hour"]').val()),
			min = parseInt($('select[name="minute"]').val()),
			alarmTime = new Date(),
			hour24 = function(h) {
				var hh = h;

				if (_this.meridiem === 'PM') {
					h = hh + 12;
				}

				return h;
			};

		_this.meridiem = $('select[name="meridiem"]').val();

		alarmTime.setHours(hour24(hour));
		alarmTime.setMinutes(min);

		if (Object.prototype.toString.call(alarmTime) === "[object Date]") {
			if (!isNaN(alarmTime.getTime())) {
				_this.alarmTime = alarmTime;
				console.log('alarm set: ', _this.alarmTime);
			}
		}
	},

	snoozeAlarm: function(time) {
		var _this = this,
			snoozeMessage = function(time) {
				return 'Alarm Snoozed ' + time + ' minutes.<br/>Next Alarm at ' + _this.formatHour(_this.alarmTime.getHours()) + ':' + _this.alarmTime.getMinutes() + ' ' + _this.meridiem;
			};

		_this.alarmTime = new Date();
		_this.alarmTime.setMinutes(_this.alarmTime.getMinutes() + time);
		_this.$clock.find('.buzzer span').html(snoozeMessage(time));
	},

	bindEvents: function() {
		var _this = this;

		$('input, select').change(function(evt) {
			if (evt.currentTarget.name === 'alarm') {
				if (this.value === 'off') {
					console.log('alarm OFF');
					_this.alarmOn = false;
				} else {
					console.log('alarm ON');
					_this.alarmOn = true;
					_this.setAlarm();
				}
			} else {
				if (_this.alarmOn) {
					_this.setAlarm();
				}
			}

			return true;
		});

		$('button.snooze').click(function() {
			_this.snoozeAlarm(_this.config.snooze.time);
		});
	}
};

$(function() {
	wp.alarmClock.init();
});