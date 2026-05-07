export const onlySystemAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "system_admin") {
    return res.status(403).json({
      message: "Only System Administrator can perform this action",
    });
  }
  next();
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden — insufficient role",
      });
    }
    next();
  };
};
