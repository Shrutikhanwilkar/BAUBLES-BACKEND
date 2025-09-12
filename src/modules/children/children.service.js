
import httpStatus from "http-status";
import Children from "../../models/children.model.js";
import AppError from "../../utils/appError.js"

export default class ChildrenService {

    static async addChild(reqBody) {
        const { firstName, dob, state, gender } = reqBody;
        const parentId = reqBody.user.id;
        const childCount = await Children.countDocuments({ parentId });
        if (childCount >= 5) {
            throw new AppError({
                status: false,
                message: "You cannot add more than 5 children",
                httpStatus: httpStatus.OK,
            });
        }
        // Create child
        const child = await Children.create({
            firstName,
            dob,
            state,
            gender,
            parentId,
        });
        return {
            _id: child._id,
            firstName: child.firstName,
            dob: child.dob,
            state: child.state,
            gender: child.gender,
        };
    }
    static async updateChild(reqBody) {
        const { childId, firstName, dob, state, gender } = reqBody;
        const parentId = reqBody.user.id;
        const child = await Children.findOne({ _id: childId, parentId });
        if (!child) {
            throw new AppError({
                status: false,
                message: "Child not found or not authorized",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        if (firstName) child.firstName = firstName;
        if (dob) child.dob = dob;
        if (state) child.state = state;
        if (gender) child.gender = gender;

        await child.save();

        return {
            _id: child._id,
            firstName: child.firstName,
            dob: child.dob,
            state: child.state,
            gender: child.gender,
        };
    }
    // List all children of a parent
    static async listChildren(reqBody) {
        const parentId = reqBody.user.id;
        const children = await Children.find({ parentId }).sort({ createdAt: -1 });

        return children.map((child) => ({
            _id: child._id,
            firstName: child.firstName,
            dob: child.dob,
            state: child.state,
            gender: child.gender,
        }));
    }
    static async deleteChild(reqBody) {
        const { childId } = reqBody;
        const parentId = reqBody.user.id;
        const child = await Children.findOne({ _id: childId, parentId });
        if (!child) {
            throw new AppError({
                status: false,
                message: "Child not found or not authorized",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        await child.deleteOne();

        return {
            _id: childId,
        };
    }
    
}
