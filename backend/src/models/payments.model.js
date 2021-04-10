module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const payments = new Schema({
		amount: {type: Number, required: true },
		date: {type: Date, required: true },
		notes: String,
        mailed: Boolean,
        imageName: String,
        imageData: String,
	}, {
	  	timestamps: true
	});
  
	return mongooseClient.model('payments', payments);
  };
  