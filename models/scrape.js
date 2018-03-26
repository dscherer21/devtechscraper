//mongoose enabled
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScrapeSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: 'note'
  }
});

var scrape = mongoose.model('scrape', ScrapeSchema);

module.exports = scrape;
