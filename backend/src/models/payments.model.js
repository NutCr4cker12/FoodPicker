module.exports = function (app) {
    const modelName = process.env.NODE_ENV == 'production' ? "payments" : "paymentsdevelopments"
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const payments = new Schema({
		amount: {type: Number, required: true },
		date: {type: Date, required: true },
		notes: String,
        mailed: {Boolean, default: false},
        paid: Boolean,
        imageName: String,
        imageData: String,
	}, {
	  	timestamps: true
	});
  
    return mongooseClient.model(modelName, payments);
  };
  