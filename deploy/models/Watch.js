const { model, Schema } = require('mongoose')

const Watch = new Schema({
  name: String,
  key: {
    type: String,
    unique: true,
    required: true
  }
})

module.exports = model('Watch', Watch)