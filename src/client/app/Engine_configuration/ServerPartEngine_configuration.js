// =============================================================================
// Engine_configuration
// =============================================================================
var engine_configuration = router.route('/engine_configuration');

// POST engine_configuration data to the DB
// *****************************************************************************
engine_configuration.post(function(req,res,next){
    // validation
    // -------------------------------------------------------------------------
    req.assert('name','Name is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    // get data
    // -------------------------------------------------------------------------
    var data = {
        name:req.body.name,
     };

    // inserting into mysql
    // -------------------------------------------------------------------------
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect");
        var query = conn.query("INSERT INTO KEngine_configuration set ? ",data, function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
           res.status(200);
           res.json({'msg':'ok'});
        });
     });
});

// GET engine_configurations from the DB
// *****************************************************************************
engine_configuration.get(function(req,res,next){
    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var query = conn.query('SELECT * FROM KEngine_configuration',function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            res.status(200);
            res.json(rows);
         });
    });
});

// Engine single route (GET,DELETE,PUT)
// =============================================================================
var engine_configuration_single = router.route('/engine_configuration/:id');

// GET single engine_configuration from the DB
// *****************************************************************************
engine_configuration_single.get(function(req,res,next){
    var id = req.params.id;

    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var query = conn.query("SELECT * FROM KEngine_configuration WHERE id = ? ",[id],function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1) {
              return res.json({'msg':'engine_configuration not found'});
            }
            res.status(200);
            res.json(rows);
        });
    });
});

// PUT engine_configuration to the DB
// *****************************************************************************
engine_configuration_single.put(function(req,res,next){
    var id = req.params.id;

    //validation
    req.assert('name','Name is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    // get data
    // -------------------------------------------------------------------------
    var data = {
        name:req.body.name,
     };

    //inserting into mysql
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect");
        var query = conn.query("UPDATE KEngine_configuration set ? WHERE id = ? ",[data,id], function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
           res.status(200);
           res.json(JSON.stringify({'msg':'ok'}));
        });
     });
});

// DELETE engine_configuration from the DB
// *****************************************************************************
engine_configuration_single.delete(function(req,res,next){
  var id = req.params.id;

  req.getConnection(function (err, conn) {
    if (err) return next("Cannot Connect");
    var query = conn.query("DELETE FROM KEngine_configuration WHERE id = ?",[id], function(err, rows){
      if(err){
        console.log(err);
        return next("Mysql error, check your query");
      }
      res.status(200);
      res.json({'msg':'ok'});
    });
  });
});

// Engine count route
// =============================================================================
var engine_configurationcountroute = router.route('/engine_configuration/count/:pattern');

// GET number of engine_configurations from the DB that match the pattern
// *****************************************************************************
engine_configurationcountroute.get(function(req,res,next){
    var pattern = req.params.pattern;

    if(pattern == '<EMPTY>') {
      pattern = '';
    }

    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var query = conn.query("SELECT count(*) as number FROM KEngine_configuration WHERE name like ?",'%'+[pattern]+'%',function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            res.status(200);
            res.json(rows);
        });
    });
});

// Count route
// =============================================================================
var engine_configurationsliceroute = router.route('/engine_configuration/:offset/:limit/:filter')

// GET engine_configurations slice from the DB
// *****************************************************************************
engine_configurationsliceroute.get(function(req,res,next){
  console.log("slice");

  var offset = req.params.offset;
  var limit = req.params.limit;
  var filter = req.params.filter;

  if(filter == '<EMPTY>') {
    filter = '';
  }

  req.getConnection(function(err,conn){
      if (err) return next("Cannot Connect");
      var query = conn.query(sprintf("SELECT * FROM KEngine_configuration where name like ? limit %s offset %s",limit,offset),'%'+[filter]+'%',function(err,rows){
          if(err){
              console.log(err);
              return next("Mysql error, check your query");
          }
          res.json(rows);
       });
  });
});

// single route (GET,DELETE,PUT)
var engine_configurationsearchroute = router.route('/engine_configuration/search/:pattern');

// GET single engine_configuration from the DB
// =============================================================================
engine_configurationsearchroute.get(function(req,res,next){
    var pattern = req.params.pattern;

    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var query = conn.query("SELECT * FROM KEngine_configuration WHERE name like ?",[pattern]+'%',function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1) {
              return res.json({'msg':'engine_configuration not found'});
            }
            res.json(rows);
        });
    });
});
