import permissional from '../models/Permissions.model.js'
import TryCatch from '../utils/TryCatch.js'
import ApiError from '../Error/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { permission } from '../schemas/permissions.schema.js'

class permissionsControllers {

    CreatePeremissions = TryCatch(async (req, res) => {
        console.log("this is okey")
        const parse = permission.safeParse(req.body)
        if (!parse.success) throw new ApiError("Validation failed", 401, false)
        const newPermission = await permissional.create(parse.data)
        res.json(new ApiResponse("Permissions created successfully", 201, newPermission))
    })

    getPermissions = TryCatch(async (req, res) => {
        const permissionData = await permissional.find({})
        res.json(new ApiResponse("Data fetched successfully", 200, permissionData))
    })

    getPermissionsById = TryCatch(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("id is required", 400, false);
        }
        const permissionDataById = await permissional.findById(id);
        if (!permissionDataById) {
            throw new ApiError("Permission not found", 404, false);
        }
        res.json(new ApiResponse("Data fetched successfully", 200, permissionDataById));
    });

 


updatePermissionsById = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { permissionId, status } = req.body;

    if (!id || !permissionId) {
        throw new ApiError("id and permissionId are required", 400, false);
    }

    const updateById = await permissional.findOneAndUpdate(
        {
            _id: id,
            "permissions.permissionId": permissionId
        },
        {
            $set: { 
                "permissions.$.status": status
            }
        },
        {
            new: true,          // return the updated document
            runValidators: true // ensure schema validation
        }
    );

    if (!updateById) {
        throw new ApiError("Role or Permission not found", 404, false);
    }

    res.json(new ApiResponse("Permission updated successfully", 200, updateById));
});


    deletePermissionById = TryCatch(async (req, res) => {
        const { id } = req.params;

        const deleted = await permissional.findByIdAndDelete(id);
        if (!deleted) {
            throw new ApiError("Permission not found", 404, false);
        }
        res.json(new ApiResponse("Permission deleted successfully", 200, deleted));
    })

    deleteAllPermissions = TryCatch(async (req, res) => {
        const deletepermission = await permissional.deleteMany({});
        res.json(new ApiResponse("All permissions deleted successfully", 200, deletepermission));
    })
}

export default permissionsControllers