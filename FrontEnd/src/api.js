import app from '.'

let isChrome = navigator.userAgent.indexOf('Chrome') > -1
// let isExplorer = navigator.userAgent.indexOf('MSIE') > -1
// let isFirefox = navigator.userAgent.indexOf('Firefox') > -1
let isSafari = navigator.userAgent.indexOf("Safari") > -1
let isOpera = navigator.userAgent.toLowerCase().indexOf("op") > -1
if (isChrome && isSafari) isSafari = false
if (isChrome && isOpera) isChrome = false

// const passwordChangeService = () => app.service('v1/password-change')
// const passwordResetRequestService = () => app.service('v1/password-requestreset')
// const passwordResetRequestAdminService = () => app.service('v1/password-requestreset-admin')
// const passwordResetService = () => app.service('v1/password-reset')
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
	//   signInGoogle: () => {
	//     window.location.href = process.env.REACT_APP_OAUTH_URL + '/google';
	//     return Promise.resolve(null)
	//   },
	signOut: () => app.logout(),
	//   changePassword: (oldPassword, newPassword) => passwordChangeService().create({ oldPassword, newPassword }),
	//   resetPassword: (id, token, password) => passwordResetService().create({ id, token, password }),
	//   requestPasswordReset: email => passwordResetRequestService().create({ email }),
	//   requestPasswordResetAdmin: email => passwordResetRequestAdminService().create({ email }),
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
			case "Food Amount":
				return "foodamount"
			case "Cooking Time":
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


const shopListService = () => app.service('v1/shoplist')
export const shoplist = {
	list: query => {
		return shopListService().find({ query: query })
	},
	get: id => shopListService().get(id),
	create: item => shopListService().create(item),
	patch: (id, item) => shopListService().patch(id, item),
	remove: id => shopListService().remove(id)
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
	create: pending => pendingPaymentsService().create(pending),
	// patch: (id, pending) => pendingPaymentsService().patch(id, pending),
	// remove: id => pendingPaymentsService().remove(id)
}

const transactionService = () => app.service('v1/transactions')
export const transactionsApi = {
    list: query => transactionService().find({ query: query }),
    get: id => transactionService().get(id),
    patch: (id, transaction) => transactionService().patch(id, transaction)
}

const categoriesService = () => app.service('v1/categories')
export const categoriesApi = {
    list: query => categoriesService().find({ query: query }),
    get: id => categoriesService().get(id),
    create: cateogry => categoriesService().create(cateogry),
	patch: (id, cateogry) => categoriesService().patch(id, cateogry),
	remove: id => categoriesService().remove(id)   
}

const categoryTypeService = () => app.service('v1/category-type')
export const categoryTypesApi = {
    list: query => categoryTypeService().find({ query: query }),
    get: id => categoryTypeService().get(id),
    create: type => categoryTypeService().create(type),
	patch: (id, type) => categoryTypeService().patch(id, type),
	remove: id => categoryTypeService().remove(id)   
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