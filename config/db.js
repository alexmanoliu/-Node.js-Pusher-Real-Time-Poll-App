const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect('mongodb://alex:0011@ds237748.mlab.com:37748/puhserpoll')
.then(() => console.log('MongoDb connected'))
.catch(err => console.log(err));