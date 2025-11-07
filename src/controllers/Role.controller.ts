import TryCatch from "../utils/TryCatch.js";
import ApiError from "../Error/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { role } from "../schemas/role.schema.js";
import Roles from "../models/roles.js";
import Permissions from "../models/Permissions.model.js";

class RoleController {

  createRole = TryCatch(async (req, res) => {
    const parsed = role.parse(req.body);
    console.log(parsed)
    const existingRole = await Roles.findOne({ roleName: parsed.roleName });
    if (existingRole) {
      throw new ApiError("Role name already exists", 409, false);
    }
    console.log("role name already exists");
     // Fetch all permissions from the Permissions model
  const allPermissions = await Permissions.find({}, "_id");
  // Assign all permissions to the new role with default status "Read"
  const permissions = allPermissions.map((perm) => ({
    permissionId: perm._id,
    status: "Read",
  }));

    const newRole = await Roles.create({ ...parsed, permissions });
    const populatedRole = await newRole.populate({
      path: "permissions.permissionId",
      select: "permissionName service active", 
    });
    res
      .status(201)
      .json(new ApiResponse("Role created successfully", 201, populatedRole));
  });


  getAllRoles = TryCatch(async (req, res) => {
    const roles = await Roles.find().populate({
      path: "permissions.permissionId",
      select: "permissionName service active", 
    });

    res.json(new ApiResponse("Roles fetched successfully", 200, roles));
    console.log("roles permission by id",roles);
  });

  
  getRoleById = TryCatch(async (req, res) => {
    const { id } = req.params;

    const roleData = await Roles.findById(id).populate({
      path: "permissions.permissionId",
      select: "permissionName service active",
    });

    if (!roleData) {
      throw new ApiError("Role not found", 404, false);
    }

    res.json(new ApiResponse("Role fetched successfully", 200, roleData));
  });

  // updating the permission inside the role by id
updateRole = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body; 

  const roleDoc = await Roles.findById(id);
  if (!roleDoc) {
    throw new ApiError("Role not found", 404, false);
  }

  let updated = false;
  if (Array.isArray(permissions)) {
    roleDoc.permissions = roleDoc.permissions.map((perm) => {
      const updatePerm = permissions.find(
        (p) => p.permissionId === perm.permissionId.toString()
      );
      if (updatePerm) {
        updated = true;
        return { ...perm, status: updatePerm.status };
      }
      return perm;
    });
  } else {
    throw new ApiError("Permissions should be an array", 400, false);
  }

  if (!updated) {
    throw new ApiError("No matching permissions found to update", 404, false);
  }

  await roleDoc.save();

  const populatedRole = await Roles.findById(id).populate({
    path: "permissions.permissionId",
    select: "permissionName service active",
  });

  res.json(new ApiResponse("Role updated successfully", 200, populatedRole));
});






  
  deleteRole = TryCatch(async (req, res) => {
    const { id } = req.params;

    const deletedRole = await Roles.findByIdAndDelete(id);
    if (!deletedRole) {
      throw new ApiError("Role not found", 404, false);
    }

    res.json(new ApiResponse("Role deleted successfully", 200, deletedRole));
  });
}

export default RoleController;