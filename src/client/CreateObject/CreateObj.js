var fs = require('fs');
var _ = require('underscore');
const assert = require('assert');
var mysql = require("mysql");

// Handle arguments
// =============================================================================
var args = process.argv.slice(2);

assert.deepEqual(args.length,1,"Number of arguments are wrong! Syntax: CreateObject {new object name}")

// set objectnames

var name_object = args[0].toLowerCase();
var upper_case_name_object = name_object.charAt(0).toUpperCase() + name_object.slice(1);

// AddObject
// =============================================================================
fs.readFile('templates/AddObject.tmp', 'utf8',(err, data) => {

  if (err) throw err;

  var template = _.template(data);
  var content = '';

  content = template({ object_name: name_object,object_name_upper: upper_case_name_object });

  fs.writeFile('new/Add'+upper_case_name_object+'.js', content, (err) => {
    if (err) throw err;
    console.log('AddObject saved!');
  });
});

// EditObject
// =============================================================================
fs.readFile('templates/EditObject.tmp', 'utf8',(err, data) => {

  if (err) throw err;

  var template = _.template(data);
  var content = '';

  content = template({ object_name: name_object,object_name_upper: upper_case_name_object });

  fs.writeFile('new/Edit'+upper_case_name_object+'.js', content, (err) => {
    if (err) throw err;
    console.log('EditObject saved!');
  });
});

// ListObject
// =============================================================================
fs.readFile('templates/ListObject.tmp', 'utf8',(err, data) => {

  if (err) throw err;

  var template = _.template(data);
  var content = '';

  content = template({ object_name: name_object,object_name_upper: upper_case_name_object });

  fs.writeFile('new/List'+upper_case_name_object+'s.js', content, (err) => {
    if (err) throw err;
    console.log('ListObject saved!');
  });
});

// Server part
// =============================================================================
fs.readFile('templates/ServerPart.tmp', 'utf8',(err, data) => {

  if (err) throw err;

  var template = _.template(data);
  var content = '';

  content = template({ object_name: name_object,object_name_upper: upper_case_name_object });

  fs.writeFile('new/ServerPart'+upper_case_name_object+'.js', content, (err) => {
    if (err) throw err;
    console.log('ServerPart saved!');
  });
});

// index.js
// =============================================================================
fs.readFile('templates/IndexPart.tmp', 'utf8',(err, data) => {

  if (err) throw err;

  var template = _.template(data);
  var content = '';

  content = template({ object_name: name_object,object_name_upper: upper_case_name_object });

  fs.writeFile('new/IndexPart'+upper_case_name_object+'.js', content, (err) => {
    if (err) throw err;
    console.log('IndexPart saved!');
  });
});

// SideBar.js
// =============================================================================
fs.readFile('templates/SideBarPart.tmp', 'utf8',(err, data) => {

  if (err) throw err;

  var template = _.template(data);
  var content = '';

  content = template({ object_name: name_object,object_name_upper: upper_case_name_object });

  fs.writeFile('new/SideBarPart'+upper_case_name_object+'.js', content, (err) => {
    if (err) throw err;
    console.log('SideBarPart saved!');
  });
});

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : 'test',
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to DB');
    return;
  }
  console.log('Connection established');

  con.query(
    "CREATE TABLE IF NOT EXISTS "+ "K" + upper_case_name_object + "( id int(11) NOT NULL AUTO_INCREMENT, name varchar(256) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='utf8_general_ci';",
    [],
    function (err, result) {
      if (err) throw err;
      console.log('Changed');
      con.end(function(err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
      });
    }
  );

});
