const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const offersRouter = require("./routes/offers");
const discountsRouter = require("./routes/discounts");
const promotionsRouter = require("./routes/promotions");
const bannerRouter = require("./routes/banner");
const wishlistRouter = require("./routes/wishlist");
const addtocartRouter = require("./routes/add_to_cart");
const reviewsRouter = require("./routes/reviews");



const app = express();

// Body parser middleware setup
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Route setup
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/offers", offersRouter);
app.use("/discounts", discountsRouter);
app.use("/promotions", promotionsRouter);
app.use("/banner", bannerRouter);
app.use("/wishlist", wishlistRouter);
app.use("/addtocart", addtocartRouter);
app.use("/reviews", reviewsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
