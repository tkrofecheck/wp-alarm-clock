var wp = wp || {};

wp.alarmClock = {
	divAlarm: null,
	divBuzzer: null,
	divClock: null,
	divAlert: null,

	config: {
		alarmMessage: 'THIS IS YOUR ALARM! GET UP!',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
	time: null,
	month: null,
	date: null,
	year: null,
	refreshClock: null,
	alarmOn: false,
	alarmTime: null,

	init: function() {
		var _this = this,
			cfg = _this.config;

		_this.divClock = document.getElementById('clock');
		_this.divAlarm = document.getElementById('alarm');
		_this.divBuzzer = document.getElementById('buzzer');
		_this.divAlert = document.getElementById('alert');

		_this.setClock();

		_this.createAlarmDropDown(cfg.hour);
		_this.createAlarmDropDown(cfg.minute);
		_this.createAlarmDropDown(cfg.meridiem);

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
			divDate = document.querySelector('.date'),
			divTime = document.querySelector('.time'),
			divBuzzer = document.querySelector('#buzzer'),
			time = new Date(), // get date from client computer
			hour = time.getHours(), // get hours using Date.prototype.getHours()
			min = time.getMinutes(), // get minutes using Date.prototype.getMinutes()
			sec = time.getSeconds(); // get seconds using Date.prototype.getSeconds()

		_this.month = time.getMonth();
		_this.date = time.getDate();
		_this.year = time.getFullYear();

		divDate.innerHTML = _this.config.months[_this.month] + ' ' + _this.date + ', ' + _this.year;

		// adjust display of hour, minutes and seconds
		divTime.innerHTML = _this.formatHour(hour) + ':' + _this.doubleDigit(min) + ':' + _this.doubleDigit(sec) + " " + _this.meridiem;

		// Use setTimeout to allow clock to refresh as seconds count up
		// Check alarm with current time (hh:mm) to determine if alarm should be triggered
		_this.refreshClock = setTimeout(function() {
			if (_this.alarmOn && _this.alarmTime !== null) {
				if ((time.getHours() === _this.alarmTime.getHours()) && (time.getMinutes() === _this.alarmTime.getMinutes())) {
					if (/\bsnoozed/.test(_this.divAlert.classList)) {
						_this.removeClass(_this.divAlert, 'snoozed');
					}

					_this.divAlert.innerHTML = _this.config.alarmMessage;
					_this.divAlert.style.display = 'block';
				}
			}
			_this.setClock();
		}, 500);
	},

	createAlarmDropDown: function(obj) {
		var _this = this,
			dd_select,
			sel_option,
			val,
			label,
			i;

		dd_select = document.createElement('select');
		dd_select.setAttribute('name', obj.name);
		dd_select.setAttribute('id', obj.name);
		_this.divAlarm.querySelector('.wrapper .dropdowns').appendChild(dd_select);

		dd_select = document.querySelector('select[name="' + obj.name + '"]');

		if (!isNaN(obj.min) || !isNaN(obj.max)) {
			if (typeof obj.name !== 'undefined' && obj.name !== null && obj.name !== '') {
				sel_option = document.createElement('option');
				sel_option.setAttribute('label', obj.name);
				sel_option.setAttribute('value', obj.name);
				dd_select.appendChild(sel_option);
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

				sel_option = document.createElement('option');
				sel_option.setAttribute('value', val);
				sel_option.setAttribute('label', label);
				dd_select.appendChild(sel_option);
			}
		} else {
			sel_option = document.createElement('option');
			sel_option.setAttribute('value', obj.min);
			sel_option.innerHTML = obj.min;
			dd_select.appendChild(sel_option);

			sel_option = document.createElement('option');
			sel_option.setAttribute('value', obj.max);
			sel_option.innerHTML = obj.max;
			dd_select.appendChild(sel_option);
		}
	},

	setAlarm: function() {
		var _this = this,
			hour = parseInt(document.getElementById('hour').value),
			min = parseInt(document.getElementById('minute').value),
			alarmTime = new Date(),
			hour24 = function(h) {
				var hh = h;

				if (_this.meridiem === 'PM') {
					h = hh + 12;
				}

				return h;
			};

		console.log('setAlarm');

		_this.meridiem = document.querySelector('select[name="meridiem"]').value;

		alarmTime.setHours(hour24(hour));
		alarmTime.setMinutes(min);

		if (Object.prototype.toString.call(alarmTime) === "[object Date]") {
			if (!isNaN(alarmTime.getTime())) {
				_this.alarmTime = alarmTime;
				console.log('alarm set: ', _this.alarmTime);
			}
		}
	},

	addClass: function(el, className) {
		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	},

	removeClass: function(el, cls) {
		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},

	snoozeAlarm: function(time) {
		var _this = this,
			snoozeMessage = function(time) {
				return 'Alarm Snoozed ' + time + ' minutes.<br/>Next Alarm at ' + _this.formatHour(_this.alarmTime.getHours()) + ':' + _this.alarmTime.getMinutes() + ' ' + _this.meridiem;
			};

		_this.alarmTime = new Date();
		_this.alarmTime.setMinutes(_this.alarmTime.getMinutes() + time);
		_this.divAlert.innerHTML = snoozeMessage(time);
		_this.addClass(_this.divAlert, 'snoozed');
	},

	bindEvents: function() {
		var _this = this,
			elements,
			changeAlarm = function(evt) {
				var alarmChecked;

				console.log('evt', evt);
				if (evt.currentTarget !== null && evt.currentTarget.name === 'alarm') {
					alarmChecked = evt.currentTarget.checked;

					if (alarmChecked) {
						console.log('alarm ON');
						_this.alarmOn = true;
						_this.setAlarm();
					} else {
						console.log('alarm OFF');
						_this.alarmOn = false;
					}
				} else {
					console.log('dropdown', evt.currentTarget);
					if (_this.alarmOn) {
						_this.setAlarm();
					}
				}

				return true;
			},
			snoozeAlarm = function() {
				_this.snoozeAlarm(_this.config.snooze.time);
			};

		document.querySelector('button.snooze').addEventListener('click', snoozeAlarm);

		elements = document.querySelectorAll('select,input');
		Array.prototype.forEach.call(elements, function(el, i){
			el.addEventListener('change', changeAlarm);
		});
	}
};

(function() {
	wp.alarmClock.init();
})();