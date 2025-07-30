// import { verifyJWT } from "../utils/jwt.js";

// function auth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   let authToken;

//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     authToken = authHeader.split(" ")[1];
//   } else {
//     const cookie = req.headers.cookie;

//     if (!cookie) return res.status(401).send("User not authenticated.");

//     authToken = cookie.split("=")[1];
//   }

//   verifyJWT(authToken)
//     .then((data) => {
//       req.user = data;
//       console.log("Auth middleware user:", req.user); // <--- add this
//       next();
//     })
//     .catch(() => {
//       res.status(400).send("Invalid token");
//     });
// }

// export default auth;
// middlewares/auth.js
import { verifyJWT } from "../utils/jwt.js";

function auth(req, res, next) {
  let authToken;

  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    authToken = authHeader.split(" ")[1];
  }
  // If no Authorization header, try to get from cookies
  else if (req.cookies && req.cookies.authToken) {
    authToken = req.cookies.authToken;
  }
  // Manual cookie parsing as fallback
  else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("authToken=")
    );
    if (authCookie) {
      authToken = authCookie.split("=")[1];
    }
  }

  if (!authToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  verifyJWT(authToken)
    .then((userData) => {
      req.user = userData;
      console.log("Auth middleware user:", req.user); // Debug log
      console.log("User roles:", req.user.roles); // Debug log
      next();
    })
    .catch((error) => {
      console.error("JWT verification error:", error);
      res.status(401).json({ message: "Invalid token" });
    });
}

export default auth;
