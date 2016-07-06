var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
	
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));


router.route('/')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('Torrent').find({}, function (err, torrents) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
						/*
                        res.render('torrents/index', {
                              title: 'All my Torrents',
                              "torrents" : torrents
                          });
						 */
						
							res.json(torrents);
						
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(torrents);
                    }
                });
              }     
        });
    })
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var torrent_link = req.body.torrent_link;
        var date_added = req.body.date_added;
        var isActive = req.body.isActive;
		console.log("Name " + name);
		console.log("Torrent Link " + torrent_link);
		console.log("Date Added " + date_added);
		//console.log("Date Added " + date_added);
        //call the create function for our database
        mongoose.model('Torrent').create({
            name : name,
            torrent_link : torrent_link,
            date_added : date_added,
            isActive : isActive
        }, function (err, torrent) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Blob has been created
                  console.log('POST creating new torrent: ' + torrent);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        //res.location("torrents");
                        // And forward to success page
                        //res.redirect("/torrents");
						res.json(torrent);
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(torrent);
                    }
                });
              }
        })
    });
	
/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('torrents/new', { title: 'Add New Torrent' });
});	

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Torrent').findById(id, function (err, torrent) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    //next(err);
					res.json({message : err.status  + ' ' + err});
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Torrent').findById(id, function (err, torrent) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    //next(err);
					 res.json({message : err.status  + ' ' + err});
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Torrent').findById(req.id, function (err, torrent) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
		  if(!torrent)
		  {
			  res.json({message:"Id not found"});
			  return;
		  }
        console.log('GET Retrieving ID: ' + torrent._id);
        var link = torrent.torrent_link;
        //blobdob = blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
			  /*
              res.render('torrents/show', {
                "link" : link,
                "torrent" : torrent
              });
			  */
			   res.json(torrent);
          },
          json: function(){
              res.json(torrent);
          }
        });
      }
    });
  });
  
  
router.post('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var torrent_link = req.body.torrent_link;
    

   //find the document by ID
        mongoose.model('Torrent').findById(req.id, function (err, torrent) {
            //update it
            torrent.update({
                name : name,
                torrent_link : torrent_link,
                
            }, function (err, torrent) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.json(torrent);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(torrent);
                         }
                      });
               }
            })
        });
		
	});	

//DELETE a Blob by ID
router.get('/:id/delete', function (req, res){
    //find blob by ID
    mongoose.model('Torrent').findById(req.id, function (err, torrent) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            torrent.remove(function (err, torrent) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + torrent._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               //res.redirect("/torrents");
							   res.json({message : 'deleted',
                                   item : torrent
                               });
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : torrent
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;