'use strict';

var expect = require('chai').expect;
var fixDate = require('../../src/util/fix-date').fixDate;

describe('src/util/fix-date.js:', function() {
	it('returns undefined for null/undefined input', function() {
		expect(fixDate(null)).to.equal(undefined);
		expect(fixDate(undefined)).to.equal(undefined);
	});

	it('returns a real Date for a valid input', function() {
		var result = fixDate('2026-01-15T00:00:00.000Z');
		expect(result).to.be.instanceOf(Date);
		expect(result.toISOString()).to.equal('2026-01-15T00:00:00.000Z');
	});

	it('returns the string "invalid" for an unparseable input', function() {
		expect(fixDate('not a date')).to.equal('invalid');
	});
});
