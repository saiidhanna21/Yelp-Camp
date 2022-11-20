const Campground = require("../models/campground");
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find();
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/addCamp");
};

module.exports.createCampground = async (req, res) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.campground.location,
		limit: 1
	}).send();
	const camp = new Campground(req.body.campground);
	camp.geometry = geoData.body.features[0].geometry;
	camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	camp.author = req.user._id;
	await camp.save();
	req.flash("success", "You have successfully added a campground");
	res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");
	if (!camp) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { camp });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}

	res.render("campgrounds/editCamp", { camp });
};

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(
		id,
		req.body.campground
	);
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	await campground.save();
	const deleteImages = req.body.deleteImages;
	if (deleteImages) {
		for (let filename of deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });
	}
	req.flash("success", "You have successfully updated a campground");
	res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "You have successfully deleted a campground");
	res.redirect("/campgrounds");
};

module.exports.checkReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
}