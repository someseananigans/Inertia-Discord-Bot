module.exports = require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost/Inertia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
