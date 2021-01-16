const { CategoryTypes } = require('./category-types.class');
const createModel = require('../../models/category-types.model');
const hooks = require('./category-types.hooks');

module.exports = function (app) {
  const categoryTypes = createModel(app);

  const options = {
    Model: categoryTypes,
    paginate: {
      default: 100,
      max: 100,
    },
  };

  // Initialize our service with any options it requires
  app.use('/v1/category-types', new CategoryTypes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('/v1/category-types');

  service.hooks(hooks);

  const createCategory = (name, type) => {
      service.create({name: name, type: type})
        .then(res => console.log(`Created cat type: ${name} ${type}`))
        .catch(err => console.log(`Failed to create type: ${name} ${type}, ${err.message}`))
    //   var c = new categoryTypes();
    //   c.name = name;
    //   c.type = type;
    //   c.save(err => {
    //       if (err) console.log(`Failed to create type: ${name} ${type}`)
    //       else console.log(`Created cat type: ${name} ${type}`)
    //   })
  }

  const CREATE = false;
  if (CREATE) {
      const types = [
          {
            type: "main",
            names: ["Koti", "Ruoka", "Auto", "Säästö", "Muu"]
          },
          {
            type: "sub",
            names: [
                "Laina", "Sähkö", "Vesi", "Netti", "Raksa",
                "Kauppa", "Ravintola",
                "Bensa", "Vakuutus", "Vero", "Huolto", "Katsastus",
                "Harrastus", "Viihde", "Puhelin",
                "Muu"
              ]
          },
          {
            type: "sub2",
            names: [
                "Työkalut", "Materiaalit", "Laajakaista", "Kodin elektroniikka",
                "K-kauppa", "S-ryhmä", "Lidl",
                "Jääkiekko", "Friba",
                "Muu"
              ]
          }
      ]
      types.forEach(t => {
          t.names.forEach(name => {
              createCategory(name, t.type)
          })
      })
  }
}