const { Api } = require('./nh.api')

exports.NH = class NH {
    constructor() {
        this.api = new Api({
            apiHost: 'https://api2.nicehash.com',
            apiKey: process.env.REACT_APP_NH_API_KEY,
            apiSecret: process.env.REACT_APP_NH_API_SECRET,
            orgId: process.env.REACT_APP_NH_ORGANIZATION
        })
    }

    async get(params) {
        if (params.fee) {
            const fees = await this.api.get('/main/api/v2/public/service/fee/info')
            return fees;
        }
        const workers = await this.api.get('/main/api/v2/mining/rigs2')
        return workers;
    }
};
