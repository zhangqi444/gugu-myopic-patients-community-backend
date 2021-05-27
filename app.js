
const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = (app) => {
  // app.beforeStart(async () => {
  //   const mongoose = app.mongoose;
  //   mongoose.set('useUnifiedTopology', true);
  //   mongoose.set('useCreateIndex', true);
  // });
};
