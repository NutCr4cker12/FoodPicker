// foods.model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const foods = new Schema({
		name: String,
		link: String,
		maintype: String,
		sidetype: [String],
		foodamount: Number,
		time: Number,
		timeseaten: Number,
		lasteaten: Array
	}, {
	  	timestamps: true
	});
  
	return mongooseClient.model('foodpickers', foods);
  };
  