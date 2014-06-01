
/*
 * GET home page.
 */
exports.esriMap = function(req, res) {
	res.render('esriMap.jade');
};

exports.signIn = function(req, res) {
	res.render('sign_in.jade');
};

exports.more = function(req, res) {
	res.render('alittlemore.jade');
};

exports.social = function(req, res) {
	res.render('esriTwitter.jade')
}