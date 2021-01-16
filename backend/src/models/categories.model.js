module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const Schema = mongooseClient.Schema;
    const categories = new Schema({
        name: { type: String, required: true, unique: true },
        main: {
            type: String,
            required: true,
        },
        sub: { type: String, },
        sub2: { type: String, },
    }, {
        timestamps: true
    });

    return mongooseClient.model('categories', categories);
};
