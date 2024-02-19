const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : null;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).send("Forbidden: Insufficient role privileges");
    }
    next();
  };
};

module.exports = roleMiddleware;
