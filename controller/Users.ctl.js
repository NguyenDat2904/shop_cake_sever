require('dotenv').config();
const UserModel = require('../model/Users.model');
class UserController {
    async showAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { phone } = req.query;
            const phoneFiler = phone ? { phone: { $regex: phone.toString(), $options: 'i' } } : {};

            // Total number Users
            const totalUsers = await UserModel.countDocuments({
                role: 'regular',
                ...phoneFiler,
            });
            const totalPages = Math.ceil(totalUsers / limit);

            const users = await UserModel.find({ role: 'regular', ...phoneFiler })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-password -refreshToken -code_security -role');
            if (!users) return res.status(400).json({ msg: 'User not found' });
            res.status(200).json(users, page, totalUsers, totalPages);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Getting Users', error: error });
        }
    }

    async changeUser(req, res) {
        try {
            const id = req.params._id;
            const updateDataUser = req.body;
            const file = req.file;
            // Check User info
            const user = await UserModel.findById({ _id: id });
            if (!user) return res.status(400).json({ msg: 'User not found' });
            if (file) {
                updateDataUser.img = `${process.env.LOCALHOST}/images/${file.filename}`;
            }
            // Update User info
            await UserModel.findByIdAndUpdate(id, updateDataUser);
            res.status(200).json({ msg: 'Updated user info' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error updating user info', error: error });
        }
    }

    async deleteUser(req, res) {
        try {
            const { _id } = req.params;
            // Check User
            const user = await UserModel.findById({ _id: _id });

            if (!user) return res.status(404).json({ msg: 'User not found' });
            await UserModel.findOneAndDelete({ _id });
            res.status(200).json({ msg: 'User removed successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error User Delete', error: error });
        }
    }

    async detail(req, res) {
        try {
            const { _id } = req.params;
            const user = await UserModel.findById({ _id }).select('-password -refreshToken -code_security');
            if (!user) return res.status(400).json({ msg: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Get Detail User', error: error });
        }
    }
}

module.exports = new UserController();
