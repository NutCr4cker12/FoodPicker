// foods.model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const Schema = mongooseClient.Schema;
	const hwinfo = new Schema({
        "2070": {
            GPUTemp: { type: Number },
            GPUHotSpotTemp: { type: Number },
            GPUPower: { type: Number },
            GPUFan: { type: Number },
        },
        "3090": {
            GPUTemp: { type: Number },
            GPUMemJuncTemp: { type: Number },
            GPUHotSpotTemp: { type: Number },
            GPUPower: { type: Number },
            GPUFan: { type: Number },
        },
        time: { type: Date },
        CPUTemp: { type: Number},
        CPUPower: { type: Number },
	}, {
        collection: "hwinfo"
    });
  
	return mongooseClient.model('hwinfo', hwinfo);
  };
  