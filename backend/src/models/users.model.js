module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const users = new Schema({
  
	  googleId: { type: String },
	  google: { type: Schema.Types.Mixed },
	  email: { type: String, unique: true },
	  password: { type: String },
	  name: { type: String },
	  role: { type: String, default: "user" },
	}, {
	  timestamps: true
	});
  
	return mongooseClient.model('users', users);
  };
  