const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movie2 = await Movie.findById({ _id: movie._id });
    if (!movie2) {
      throw new Error("Movie not found");
    }

    await rental.save({ session });
    if (movie2.numberInStock === 0) {
      throw new Error("Movie is out of stock.");
    }

    movie2.numberInStock--;

    await movie2.save({ session });

    await session.commitTransaction();

    res.send(rental);
  } catch (error) {
    console.error("Error during transaction:", error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
});

router.get("./:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return req.status(404).send("The rental with the given id was not found");
  res.send(rental);
});

module.exports = router;
