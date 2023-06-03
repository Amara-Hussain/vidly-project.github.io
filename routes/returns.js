const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const customer = req.body.customerId;
  const movie = req.body.movieId;
  if (!customer) {
    return res.status(400).send("CustomerId not provided");
  }
  if (!movie) {
    return res.status(400).send("MovieId not provided");
  }

  const rental = await Rental.findOne({
    "customer._id": customer,
    "movie._id": movie,
  });

  if (!rental) {
    return res.status(404).send("Rental not found");
  }

  if (rental.dateReturned) {
    return res.status(400).send("Return rental already processed");
  }

  rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});

module.exports = router;
