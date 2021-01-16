module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const Schema = mongooseClient.Schema;
    const categoryTypes = new Schema({
        name: { type: String, required: true, },
        type: {
            type: String,
            required: true,
            enum: ["main", "sub", "sub2"]
        }
    }, {
        timestamps: true
    });

    return mongooseClient.model('categoryTypes', categoryTypes);
};
