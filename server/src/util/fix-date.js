var _ = require('lodash');
var moment = require('moment');
/**
 * Return undefined if the object is null or undefined.
 * Return a valid date. Otherwise return a 'invalid' string.
 * @param object
 * @return {*}
 */
var fixDate = function (object) {
	if (_.isNil(object) === false) {
		var date = moment(object);
		return date.isValid() ? date.toDate() : "invalid";
	} else {
		return undefined;
	}
};

module.exports.fixDate = fixDate;