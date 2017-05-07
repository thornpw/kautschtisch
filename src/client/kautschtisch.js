/** 2657
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// requirements
// =============================================================================
var winston = require('winston');
var fs = require('fs');
var path = require('path');

var sprintf = require("sprintf").sprintf
var vsprintf = require("sprintf").vsprintf

// express
// -----------------------------------------------------------------------------
var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var app = express();

// MySql connection
// -----------------------------------------------------------------------------
var connection  = require('express-myconnection');
var mysql = require('mysql');

// variables
// =============================================================================
var COMMENTS_FILE = path.join(__dirname, 'comments.json');

// logging configuration
// =============================================================================
// two loggers:
// *****************************************************************************
// errors: everything with status > 200
// access: any status = 200
// =============================================================================

winston.loggers.add('logError', {
  console: {
    colorize: true,
  },
  file: {
    filename: 'error.log'
  }
});

winston.loggers.add('logAccess', {
  console: {
    colorize: true,
  },
  file: {
    level : 'debug',
    filename: 'access.log'
  }
});

winston.loggers.add('logDegug', {
  console: {
    colorize: true,
  },
  file: {
    level : 'debug',
    filename: 'debug.log'
  }
});

var logError = winston.loggers.get('logError')
var logAccess = winston.loggers.get('logAccess')

// app configureation
// =============================================================================
// Set EJS template Engine
// -----------------------------------------------------------------------------
//app.set('views','./views');
//app.set('view engine','ejs');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

// Additional middleware which will set headers that we need on each request.
// -----------------------------------------------------------------------------
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// configure MySQL connection
// -----------------------------------------------------------------------------
app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'test',
        debug    : false //set true if you wanna see debug logger
    },'request')
);

// =============================================================================
// start Server
// =============================================================================
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
