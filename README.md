# Angular DateTimePicker

A directive which simplifies selecting dates for user.


## Requirements
* Angular 1.4+
* Bootstrap 3
* [AngularUI Bootstrap](https://angular-ui.github.io/bootstrap/)
* [Angular DateParser](https://github.com/dnasir/angular-dateParser)

## Getting started
Copy and include `dist/angular-datetimepicker.js` and `dist/angular-datetimepicker.css` into your project. In order to run DateTimePicker properly you will also need to include required modules.

## Usage
Angular DateTimePicker consists of three directives: `date-picker`, `date-time-picker` and `time-picker`. First is used to pick only a date, second allows to select also time and the last one is used to pick only time. All of them require to assign a model. The simplest usage looks like:
```html
<date-picker ng-model="date" />
<date-time-picker ng-model="datetime" />
<time-picker ng-model="time" />
```

## Options
You can customize behavior and look by setting proper options. All options can be configured globally and most of them can be set for single directive usage. To configure DateTimePicker globally use [`Angular configuration block`](https://docs.angularjs.org/guide/module):
```javascript
angular
		.module('your.module')
		.config(['dateTimePickerProvider', function(dateTimePickerProvider) {
		    dateTimePickerProvider.dateFormat = 'MM/dd/yyyy';
		    dateTimePickerProvider.minuteStep = 15;
		}]);
```

### Date format
Specifies which format date/time is displayed and can be entered. There are three global settings, one for each directive:
```javascript
dateTimePickerProvider.dateFormat = 'yyyy-MM-dd';
dateTimePickerProvider.dateTimeFormat = 'yyyy-MM-dd HH:mm';
dateTimePickerProvider.timeFormat = 'HH:mm';
```
The above are default values. Format string is composed of elements specified in [`Angular documentation`](https://docs.angularjs.org/api/ng/filter/date). To set date format for one directive, use `date-format` attribute (for each directive):
```html
<date-time-picker ng-model="date" date-format="HH:mm MM/dd/yyyy" />
```

### Minimum and maximum date
Restricts possible date selection. User cannot pick day which is before specified minimum date and day which is after specified maximum date. To configure these globally:
```javascript
dateTimePickerProvider.minimumDate = new Date(1900, 0, 1);
dateTimePickerProvider.maximumDate = new Date(2099, 11, 31);
```
The above are default values. To set maximum and/or minimum date for one directive, use `date-min` and `date-max` attributes (notice that they will have no effect on `time-picker`):
```html
<date-time-picker ng-model="date" date-min="date_object_from_scope" />
```

### Minimum and maximum hour
Restricts possible time selection. User cannot pick time which is before specified minimum hour and time which is after specified maximum hour. To configure these globally:
```javascript
dateTimePickerProvider.minimumHour = undefined;
dateTimePickerProvider.maximumHour = undefined;
```
The above are default values. They are set to undefined, because there are no default constraints for them, so user can pick time between 0:00 and 23:59. To set maximum and/or minimum hour for one directive, use `hour-min` and `hour-max` attributes (notice that they will have no effect on `date-picker`):
```html
<date-time-picker ng-model="date" hour-min="6" hour-max="22" />
```

### Minute step
Restricts possible minutes selection. Proper value for minute step is divisor of 60 (e.g: 1, 2, 5, 15). If minute step is set to 5 then user can pick every fifth minute. To configure this globally:
```javascript
dateTimePickerProvider.minuteStep = 1;
```
The above is default value. To set minute step for one directive, use `minute-step` attribute:
```html
<date-time-picker ng-model="date" minute-steo="15" />
```

### Show week numbers
In order to display week numbers beside calendar this setting has to be set. To configure it globally:
```javascript
dateTimePickerProvider.showWeekNumbers = true;
```
and for one directive:
```html
<date-time-picker ng-model="date" show-week-numbers />
```
Notice that it will have no effect on `time-picker`.

### Templates
There are three html templates: for calendar, timer and modal, which contain them. It is possible to modify existing templates, so for example `i18n/l10n` can be applied. It is only possible to configure it globally:
```javascript
dateTimePickerProvider.calendarTemplate = 'templates/dateTimePickerCalendar.html';
dateTimePickerProvider.timerTemplate = 'templates/dateTimePickerTimer.html';
dateTimePickerProvider.modalTemplate = 'templates/dateTimePickerModal.html';
```

### Required
Directive can be marked with `required` attribute, so `clear` button will not be visible.
```html
<date-picker ng-model="date" required />
```
It cannot be configured globally.

### Placeholder
There is possibility to define `placeholder` for directive like for any other `input`:
```html
<date-picker ng-model="date" placeholder="enter date" />
```

### onChange
It is possible to listen for date change by specifiing expression that will be executed when user changes date using picker or manually. In order to get updated value, it is neccessary to use special varable $value, for example:
```html
<date-picker ng-model="date" on-change="changed($value)" />
```

## Validation
It is possible to display validation errors of DateTimePicker input, so user could be informed about invalid data that hey entered manually. In order to get access to validation errors, one have to put DateTimePicker inside `form`. There are three types of validation errors that DateTimePicker can produce:
* `required` - when there is no data and directive is marked with `required` attribute
* `format` - when date format is invalid
* `date` - when date is out of imposed range, e.g. is before minimum date
Validation could look like:
```html
<form name="someForm">
	<date-picker name="theDay" ng-model="date" date-min="dateMin" required />
	
	<p ng-show="someForm.theDay.$error.required && someForm.theDay.$dirty" class="text-danger">
		Field is required
	</p>
	<p ng-show="someForm.theDay.$error.format" class="text-danger">
		Invalid date format
	</p>
	<p ng-show="someForm.theDay.$error.date" class="text-danger">
		Date out of allowed range
	</p>
</form>
```
