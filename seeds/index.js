const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

mongoose
	.connect("mongodb://localhost:27017/yelp-camp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("CONNECTION OPEN!!!");
	})
	.catch((err) => {
		console.log("OH NO ERROR!!!!");
		console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];     
 
const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++){
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "637255692c990741e3f001f8",
			location: `${cities[random1000].city} , ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: "https://res.cloudinary.com/drq5dj8kp/image/upload/v1668712375/YelpCamp/kskdbe73mtyloip7b5sy.png",
					filename: "YelpCamp/kskdbe73mtyloip7b5sy",
				},
				{
					url: "https://res.cloudinary.com/drq5dj8kp/image/upload/v1668712373/YelpCamp/pbfza5t1fbhjpguxdye7.jpg",
					filename: "YelpCamp/pbfza5t1fbhjpguxdye7",
				},
			],
			description:
				"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi veritatis iure neque iste id nobis impedit, perferendis aliquid exercitationem ea a illum temporibus necessitatibus, perspiciatis adipisci magnam architecto nostrum quod.",
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				]
			},
			price,
		});
        await camp.save();
    }
}

seedDb()
    .then(() => {
        mongoose.connection.close()
    });
