module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const transactions = new Schema({
        pvm: { type: Date, required: true },
        eur: { type: Number, required: true },
        laji: { type: Number },
        selitys: { type: String },
        saaja: { type: String },
        saajanTilinro: { type: String },
        viite: { type: String },
        tili: { 
            type: String, 
            enum: ["Käyttötili", "Yhteinen", "Luotto"],
            default: "Luotto"
        },
        viesti: { type: String },
        arkistointitunnus: { type: String },
        category: {
            main: { type: String },
            sub: { type: String },
            sub2: { type: String },
        },
        note: { type: String },
	}, {
	  timestamps: true
	});
  
	return mongooseClient.model('transactions', transactions);
  };
  