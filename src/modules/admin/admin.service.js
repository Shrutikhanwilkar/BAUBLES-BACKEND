import User from "../../models/auth.model.js"
import Children from "../../models/children.model.js"
import Gift from "../../models/gift.model.js"
import Music from "../../models/music.model.js"

export default class AdminService {
    static async getDashboardStats() {
        const [userCount, childrenCount, giftCount, musicCount] = await Promise.all([
            User.countDocuments({ role: "USER" }),
            Children.countDocuments(),
            Gift.countDocuments(),
            Music.countDocuments(),
        ]);

        return {
            userCount,
            childrenCount,
            giftCount,
            musicCount,
        };
    }

}


