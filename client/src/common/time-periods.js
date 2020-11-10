'use strict'

import moment from 'moment'

const last7Days = {
	from: function () {
		return moment().subtract('7', 'days').toDate()
	},
	to: function () {
		return moment().add(1, 'day').startOf('day').toDate()
	}
}

const currentWeek = {
	from: function () {
		return moment().startOf('isoWeek').toDate()
	},
	to: function () {
		return moment().endOf('isoWeek').toDate()
	}
}

const lastWeek = {
	from: function () {
		return moment().subtract(1, 'weeks').startOf('isoWeek').toDate()
	},
	to: function () {
		return moment().subtract(1, 'weeks').endOf('isoWeek').toDate()
	}
}

const last30Days = {
	from: function () {
		return moment().subtract('30', 'days').toDate()
	},
	to: function () {
		return moment().add(1, 'day').startOf('day').toDate()
	}
}

const currentMonth = {
	from: function () {
		return moment().startOf('month').toDate()
	},
	to: function () {
		return moment().endOf('month').toDate()
	}
}

const lastMonth = {
	from: function () {
		return moment().subtract(1, 'months').startOf('month').toDate()
	},
	to: function () {
		return moment().subtract(1, 'months').endOf('month').toDate()
	}
}

const last90Days = {
	from: function () {
		return moment().subtract('90', 'days').toDate()
	},
	to: function () {
		return moment().add(1, 'day').startOf('day').toDate()
	}
}

const lastQuarter = {
	from: function () {
		return moment().subtract(1, 'quarter').startOf('quarter').toDate()
	},
	to: function () {
		return moment().subtract(1, 'quarter').endOf('quarter').toDate()
	}
}

const currentQuarter = {
	from: function () {
		return moment().startOf('quarter').toDate()
	},
	to: function () {
		return moment().endOf('quarter').toDate()
	}
}

const oneYear = {
	from: function () {
		return moment().subtract('1', 'years').toDate()
	},
	to: function () {
		return moment().add(1, 'day').startOf('day').toDate()
	}
}

const yearToDate = {
	from: function () {
		return moment().startOf('year').toDate()
	},
	to: function () {
		return moment().add(1, 'day').startOf('day').toDate()
	}
}

const fiveYearToDate = {
	from: function () {
		return moment().subtract(5, 'year').startOf('year').toDate()
	},
	to: function () {
		return moment().add(1, 'day').startOf('day').toDate()
	}
}

const lastYear = {
	from: function () {
		return moment().subtract('1', 'years').startOf('year').toDate()
	},
	to: function () {
		return moment().subtract('1', 'years').endOf('year').toDate()
	}
}

const timePeriods = {
	'last7Days': last7Days,
	'currentWeek': currentWeek,
	'lastWeek': lastWeek,
	'last30Days': last30Days,
	'currentMonth': currentMonth,
	'lastMonth': lastMonth,
	'last90Days': last90Days,
	'currentQuarter': currentQuarter,
	'lastQuarter': lastQuarter,
	'oneYear': oneYear,
	'yearToDate': yearToDate,
	'fiveYearToDate': fiveYearToDate,
	'lastYear': lastYear
}

export default timePeriods
