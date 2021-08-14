import app from '.'

const userService = () => app.service('v1/users')
export const users = {
	list: query => {
		return userService().find({ query: query });
	},
	get: id => {
		if (!id) {
			return app.get('authentication');
		}
		return userService().get(id)
	},
	create: user => userService().create(user),
	patch: (id, user) => userService().patch(id, user),
	remove: id => userService().remove(id),
	authenticate: () => app.authentication.reAuthenticate(true),
	signIn: (email, password) => app.authenticate({ strategy: 'local', email, password }),
	signOut: () => app.logout()
}

const getSorting = (sort) => { // desc = -1, asc = 1
	const s = {}
	const convertName = (name) => {
		switch (name) {
			case "main":
				return "maintype"
			case "side":
				return "sidetype"
			case "food":
				return "name"
			case "food amount":
				return "foodamount"
			case "cooking time":
				return "time"
			case "Last Eaten":
				return "lasteaten"
			default:
				return "timeseaten"
		}
	}
	Object.keys(sort).forEach(key => {
		const value = sort[key];
		if (value === "asc") {
			sort[key] = 1
		} else if (value === "desc") {
			sort[key] = -1
		}
		s[convertName(key)] = sort[key]
	})
	return s
}

const convertFilters = (filters) => {
	var f = {}
	Object.keys(filters).forEach(type => {
		var d = {}
		if (type === "speed") {
			d["time"] = filters[type]
			f = Object.assign(f, d)
		} else {
			var nins = []
			Object.keys(filters[type]).forEach(name => {
				if (filters[type][name] === "$nin") nins.push(name)
			})
			if (nins.length) {
				if (type === "day") {
					nins = nins.map(x => parseInt(x.split(" ")[0]))
					d["foodamount"] = { $nin: nins }
				} else {
					d[`${type}type`] = { $nin: nins }
				}
				f = Object.assign(f, d)
			}
		}
	})
	return f
}

const foodService = () => app.service('v1/foods')
export const foods = {
	list: (filters, page, sort, search = "", limit) => {
		const f = convertFilters(filters)
		const sorting = getSorting(sort)
		var query = Object.assign(f, {
			$skip: ((page - 1) < 0 ? 0 : page) * 10,
			$limit: limit,
			$sort: sorting,
		})
		if (search) query = Object.assign(query, { $search: search })
		return foodService().find({ query: query })
	},
	get: id => foodService().get(id),
	create: food => foodService().create(food),
	patch: (id, food) => foodService().patch(id, food),
	remove: id => foodService().remove(id),
	find: query => foodService().find({ query: query }),
	distincts: () => {
		return new Promise((resolve, reject) =>
			foodService().find({ query: { $limit: 10000 } })
				.then(result => {
					let mainTypes = []
					let sideTypes = []
					const dayTypes = [...Array(4).keys()].map(d => `${d + 1} day`)
					result.data.forEach(f => {
						mainTypes.push(f.maintype)
						f.sidetype.forEach(s => sideTypes.push(s))
					})
					resolve({
						main: [...new Set(mainTypes)],
						side: [...new Set(sideTypes)],
						day: dayTypes
					})
				})

		)
	},
	lastEaten: () => {
		return new Promise((resolve, reject) => {
			foodService().find({ query: {
				$sort: {
					lasteaten: -1
				},
				$lasteaten: true
			}}).then(res => {
				resolve(res)
			})
		})
	}
}

const paymentsService = () => app.service('v1/payments')
export const payments = {
	list: query => paymentsService().find({ query: query }),
	get: id => paymentsService().get(id),
	create: payment => paymentsService().create({ ...payment, paid: false }),
	patch: (id, payment) => paymentsService().patch(id, payment),
	remove: id => paymentsService().remove(id)
}

const pendingPaymentsService = () => app.service('v1/pending-payments')
export const pendingPayments = {
	list: query => pendingPaymentsService().find({ query: query }),
	get: id => pendingPaymentsService().get(id),
	create: pending => pendingPaymentsService().create(pending)
}

const hwinfoService = () => app.service('v1/hwinfo')
export const hwinfoApi = {
    list: query => hwinfoService().find({ query: query })
}

const nhService = () => app.service('v1/nh')
export const nhApi = {
    get: () => nhService().get({})
}

const binanceService = () => app.service('v1/binance')
export const binanceApi = {
    find: (query) => binanceService().find({ query: query })
}