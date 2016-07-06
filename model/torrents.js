var mongoose = require('mongoose');  
var blobSchema = new mongoose.Schema({  
  name: String,
  torrent_link: String,
  date_added: { type: Date, default: Date.now },
  isActive: Boolean
});
mongoose.model('Torrent', blobSchema);