const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
}

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, err => {
			if (err) return next(err);
			req.flash('success', 'Welcome to Yelp Camp!');
			res.redirect('/campgrounds');
		});
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/register');
	}
}

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
}

module.exports.login = (req, res) => {
	req.flash('success', 'welcome back!');
	const reviewCheck = res.locals.returnTo.split('/');
	if (reviewCheck.length > 3) {
		res.locals.returnTo = '/'+ reviewCheck[1] +'/'+ reviewCheck[2];
	}
	const redirectUrl = res.locals.returnTo || '/campgrounds';
	res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash('success', 'GoodBye!');
		res.redirect('/campgrounds');
	});
};
