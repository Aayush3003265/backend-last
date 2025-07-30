// function roleBasedAuth(role) {
//   return (req, res, next) => {
//     if (req.user.roles.includes(role)) return next();

//     res.status(403).send("Access denied.");
//   };
// }

// export default roleBasedAuth;

// middlewares/roleBasedAuth.js
function roleBasedAuth(requiredRole) {
  return (req, res, next) => {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    console.log("Required role:", requiredRole); // Debug log
    console.log("User roles:", req.user.roles); // Debug log

    // Check if user has roles array
    if (!req.user.roles || !Array.isArray(req.user.roles)) {
      return res
        .status(403)
        .json({ message: "Access denied. No roles assigned." });
    }

    // Check if user has the required role
    if (!req.user.roles.includes(requiredRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${requiredRole}. User roles: ${req.user.roles.join(", ")}`,
      });
    }

    next();
  };
}

export default roleBasedAuth;
