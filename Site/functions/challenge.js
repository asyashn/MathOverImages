/**
* challenge.js
*   Functions for handling challenge pages.
*/

var utils = require('./utils.js');

// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Put quotes around a string for MySQL.
 */
var quote = function(str) {
  return "'" + str + "'";
}; // quote

// +--------------------+--------------------------------------------
// | Exported Functions |
// +--------------------+

/**
 * The api for adding challenges.
 */
module.exports.add = function(req, res, database, info) {
  // Note: I should think about "START TRANSACTION" and "COMMIT",
  // although they didn't help when I tried them.

  // Set up the info for the queries
  var info = [
    ['categoryid', database.sanitize(info.category)],
    ['position', database.sanitize(info.position)],
    ['userid', req.session.user.userid],
    ['createdAt', "now()"],
    ['modifiedAt', "now()"],
    ['title', quote(database.sanitize(info.title))],
    ['name', quote(database.sanitize(info.name))],
    ['description', quote(database.sanitize(info.description))],
    ['code', quote(database.sanitize(info.code))],
    ['rating', 0]
  ];

  var fields = [];
  var values = [];
  var criteria = [];

  for (var i = 0; i < info.length; i++) {
    fields[i] = info[i][0];
    values[i] = info[i][1];
    if ((fields[i] != 'createdAt') && (fields[i] != 'modifiedAt')) {
      criteria.push(fields[i] + "="+ values[i]);
    } // if
  } // for

  var iquery = "INSERT INTO challenges (" + fields.join(",") +
      ") values (" + values.join(",") + ");";
  var squery = "SELECT id FROM challenges WHERE " + criteria.join(" and ") +
      " ORDER BY modifiedAt DESC LIMIT 1;"
  console.log(iquery);
  console.log(squery);

  // See if the challenge is already in the database.
  database.query(squery, function(rows, error) {
    if (error) {
      res.send(error);
      return;
    } // if error
    if (rows.length != 0) {
      var id = rows[0]['id'];
      console.log("ID",id);
      res.redirect('/challenges/view/' + id);
      return;
    } // if it's already in the database

    // Insert into the database
    console.log("Inserting");
    database.query(iquery, function(rows, error) {
      if (error) {
        res.send(error);
        return;
      }

      // Get the id
      database.query(squery, function(rows, error) {
        if (error) {
          res.send(error);
          return;
        } // if error
        var id = rows[0]['id'];
        console.log("ID",id);
        res.redirect('/challenges/view/' + id);
      }) // get the id
    }); // insert
  }); // check if it's there already
}; // add

/**
 * A form for editing challenges.
 */
module.exports.edit = function(req, res, database) {
  res.send("Editing challenges is not yet implemented.");
}; // edit

/**
 * The form for creating challenges.
 */
module.exports.create = function(req, res, database) {
  res.render('create-challenge.ejs', {
    user: req.session.user
  });
}; // create

module.exports.gallery = function(req, res, database, info) {
  var level = database.sanitize(info.level || "Beginning");
  var color = database.sanitize(info.color || "Greyscale");
  var animation = database.sanitize(info.animation || "Static");
  var category = level + ", " + color + ", " + animation;
  var query = "SELECT challenges.id, challenges.name, challenges.title, challenges.code FROM challengecategories,challenges WHERE challengecategories.description='" + category + "' and challengecategories.id = challenges.categoryid ORDER BY challenges.position;";
  console.log(query);
  database.query(query, function(rows, error) {
    // Sanity check
    if (error) {
      res.send(error);
      return;
    }
    // We got a result, so render it
    res.render('challenge-gallery', {
      user: req.session.user,
        challenge: {},
        level: level,
        color: color,
        animation: animation,
        sample: [
          { id:1, name:"First", code:"x" },
          { id:9, name:"Second", code:"y" }
        ],
        challenges: rows
    }); // res.render
  }); // database.query
}; // gallery

/**
 * The page for showing challenges.
 */
module.exports.view = function(req, res, database) {
  var id = database.sanitize(req.params.id);

  // First try to query by name
  var query = "SELECT title,description,code FROM challenges WHERE name='" 
      + id + "';";
  console.log(query);
  database.query(query, function(rows, error) {
    // Sanity check 1
    if (error) {
      utils.error(req, res, "Database problem", error);
      return;
    } // if (error)

    // Make sure that we have a row.
    if (rows.length > 0) {
      console.log("Rendering by name", rows[0]);
      res.render('view-challenge.ejs', {
        user: req.session.user,
        challenge: rows[0]
      }); // render
      return;
    } // if (rows.length > 0)

    // If it's not a number, we can't search by numeric id
    if (isNaN(id)) {
      utils.error(req, res, "Unknown challenge", "Challenge " + id + 
        " does not exist");
    } // if isNaN(id)

    // OKay, if we got to here, we didn't generate a page, so we should
    // try the other query
    var query = "SELECT title,description,code FROM challenges WHERE id=" 
      + id + ";";
    console.log(query);
    database.query(query, function(rows, error) {
      // Sanity check 1
      if (error) {
        utils.error(req, res, "Database problem", error);
        return;
      } // if (error)

      // Make sure that we have a row.
      if (rows.length > 0) {
        console.log("Rendering by id", rows[0]);
        res.render('view-challenge.ejs', {
          user: req.session.user,
          challenge: rows[0]
        }); // render
        return;
      } // if (rows.length > 0)

      // If we got to here, we couldn't find the challenge.
      utils.error(req, res, "Unknown challenge", "Challenge " + id + 
          " does not exist.");
    }); // inner database.query
  }); // outer database.query

  return;
};

module.exports.submission = function(req, res, database, info) {
//need to set up sending of INFO
  var info = [ // submission
    ['userid', req.session.user.userid],
    ['code', quote(database.sanitize(info.code))]
  ];

  var id = database.sanitize(req.params.id); // challenge
  var query = "SELECT code FROM challenges WHERE id=" + id + ";";
  database.query(query, function(rows, error) {
//positive match with 90% jpeg similarity
    if (error) {
      res.send(error);
      return;
    } // if error
    var similarity=0;
    var code1=MIST.sanitize(builtinsPattern, info.code);
    var code2=MIST.sanitize(builtinsPattern, rows[0]['code']);
    var code1Parsed=MIST.parse(code1);
    var code2Parsed=MIST.parse(code2);
    //Find how MIST.render works with parsed code (mistui-animator.js)
    var rows=img1.width;
    var cols=img1.height;
    var d = new Date();
    var t = {
      s: d.getMilliseconds()/500 - 1,
      m: (d.getSeconds()*1000 + d.getMilliseconds())/30000 - 1,
      h: (d.getMinutes()*60 + d.getSeconds())/1800 - 1,
      d: (d.getHours()*60 + d.getMinutes())/720 - 1
    };
    var m = {
      x: MIST.mouseX,
      y: MIST.mouseY,
      X: MIST.clickX,
      Y: MIST.clickY
    };
    var fun1 = MIST.expToRGB("untitled image", code1Parsed, context); // NEED CONTEXT VARIABLE
    // Evaluate the function
    var rgb = fun(x,y,t,m);
    for (var i=0; i<rows; i+=4) //y
    {
      for (var j=0; j<cols; j+=4) //x
      {
        var pixel1=[0,0,0];
        var pixel2=[0,0,0];
        var diffR=abs(pixel2[0]-pixel1[0]);
        var diffG=abs(pixel2[1]-pixel1[1]);
        var diffB=abs(pixel2[2]-pixel1[2]);
        // apply how MIST render works with code
        if (diffR < .01 && diffG < .01 && diffB < .01)
        {
          similarity++;
        }
      }
    }
    if (similarity >= (pixelData1.length*.9))
    {
      //res.redirect(); // need to redirect to a submission correct page
    }
    else
    {
      //res.redirect(); // need to redirect to a submission incorrect page
    }
    console.log(code);
  })
};
