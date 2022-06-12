var jwt = require("jsonwebtoken");
const JWT_SECRET = "Harryisagoodb$oy";

const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  let statusDescription = {};

  const token = req.header("auth-token");
  if (!token) {
    statusDescription = {
      statusMessage: "Invalid JWT signature !!",
      statusCode: "301",
    };
    res.status(200).send({ statusDescription });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    // console.log("Here", req.user, data.user);
    next();
  } catch (error) {
    console.log("Error", error);
    statusDescription = {
      statusMessage: "Invalid JWT signature !!",
      statusCode: "301",
    };
    res.status(400).send({ statusDescription });
  }
};

module.exports = fetchuser;
