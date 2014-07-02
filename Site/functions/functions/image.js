
/**
 * Functions related to the images.
 */
module.exports.buildPage =  function(req, res, database) {
	database.imageInfo(req.params.imageid, function(image, error){
	    if(error)
		res.end(error)
	    else
		database.commentInfo(image.imageid, function(comment, error){
		    if (error)
			res.end(error)
		    else
			res.render('../public/views/singleimage.jade', {
			comment:comment,
			user: req.session.user,
			loggedIn: req.session.loggedIn,
			image: image
	    });
	});
	});
};

module.exports.saveComment= function(req, res, database) {
    database.saveComment(req.session.user.userid, req.params.imageid, req.body.newComment, function(success, error) {
	if(!success)
	    res.end(error)
	else
	   res.redirect('/');
   });
}