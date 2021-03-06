const passport = require('passport');
const User = require('../models/User');
require('./serializers');
require('./localStrategy');
const AmazonStrategy = require('passport-amazon').Strategy;

// AMAZON STRATEGY - OATH:
passport.use(
	new AmazonStrategy(
		{
			clientID: process.env.AMAZON_CLIENT_ID,
			clientSecret: process.env.AMAZON_CLIENT_SECRET,
			callbackURL: 'http://localhost:5555/api/auth/amazon/callback',
			scope: [ 'profile', 'postal_code' ]
		},
		function(accessToken, refreshToken, profile, done) {
			console.log(profile);
			User.findOne({ amzId: profile.id })
				.then((user) => {
					if (user) {
						console.log('User', user);
						done(null, user);
					} else {
						return User.create({
							clientId: profile.id,
							username: profile.displayName
						}).then((newUser) => {
							done(null, newUser);
						});
					}
				})
				.catch((err) => {
					console.log('error', err);
					done(err);
				});
		}
	)
);

// GOOGLE STRATEGY - OATH:
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: `${process.env.GOOGLE_CALLBACK}/api/auth/google/callback`,
			scope: [ 'profile' ]
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleId: profile.id })
				.then((user) => {
					if (user) {
						console.log('User', user);
						done(null, user);
					} else {
						return User.create({
							googleId: profile.id,
							username: profile.displayName
						}).then((newUser) => {
							done(null, newUser);
						});
					}
				})
				.catch((err) => {
					console.log('error', err);
					done(err);
				});
		}
	)
);

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());
};
