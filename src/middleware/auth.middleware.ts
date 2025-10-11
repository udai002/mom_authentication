import jwt from "jsonwebtoken";
import ApiError from "../Error/ApiError.js";

const authMiddleware = (req: { headers: { authorization: any; }; user: { id: any; roleId: any; clusterId: any; storeId: any; }; }, res: any, next: () => void) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Authorization token missing", 401, false);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded info to request
    req.user = {
      id: decoded.id,
      roleId: decoded.roleId,
      clusterId: decoded.clusterId,
      storeId: decoded.storeId,
    };

    console.log("Decoded JWT:", req.user);

    next();
  } catch (error) {
    throw new ApiError("Invalid or expired token", 401, false);
  }
};

export default authMiddleware;
