const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  //extract token from authorization header
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); //no token sent
  }

  //verify the signature + expiry
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      console.log("JWT verify failed:", err.message);
      return res.status(403).json({ message: "Forbidden" }); //token is invalid/expired/tampered
    }

    // Check user role for authorization (replace with your logic)
    const authorizedRoles = {
      // Only librarians can create books
      "POST /books": ["librarian"],
      // Anyone can view books
      "GET /books": ["member", "librarian"],
      // Only librarians can update availability
      "PUT /books/[0-9]+/availability": ["librarian"],
    };

    const requestedEndpoint = `${req.method} ${req.url}`; // Include method in endpointl;
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      },
    );

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = { verifyJWT };
