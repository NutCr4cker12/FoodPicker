module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const payments = new Schema({
		amount: Number,
		date: Date,
		notes: String,
	}, {
	  	timestamps: true
	});
  
	return mongooseClient.model('payments', payments);
  };
  