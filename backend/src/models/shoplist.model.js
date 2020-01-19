// foods.model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const foods = new Schema({
		name: String,
		section: String,
		bought: [Date],
		type: String,
		need: Boolean,
	}, {
	  	timestamps: true
	});
  
	return mongooseClient.model('shoplist', foods);
  };
  