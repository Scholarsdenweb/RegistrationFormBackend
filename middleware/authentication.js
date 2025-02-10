const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Student = require('../models/Student');  

const verifyToken = (allowedModels) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      const { _id, role } = decoded;

      if (!allowedModels.includes(role)) {
        return res.status(403).json({ message: "Invalid user type" });
      }

      let UserModel;
      // if (role === 'Employee') UserModel = Employee;
       if (role === 'Student') UserModel = Student;
       else UserModel = Employee;
      // else return res.status(403).json({ message: "User type not supported" });
      const user = await UserModel.findById(_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(`Authenticated ${role}:`, user);
      req.user = user; 
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};


const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log("User Role:", userRole);

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. Insufficient role" });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };
