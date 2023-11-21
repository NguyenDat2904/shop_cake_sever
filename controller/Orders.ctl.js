const OrderModel = require('../model/Orders.model');
class OrderController {
    async showAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const totalOrder = await OrderModel.countDocuments();
            const totalPages = Math.ceil(totalOrder / limit);

            const orders = await OrderModel.find()
                .populate({ path: 'userID', select: '-password -refreshToken -code_security' })
                .populate('product.id')
                .skip((page - 1) * limit)
                .limit(limit);
            if (!orders) {
                return res.status(400).json({ msg: 'Orders not found' });
            }
            res.status(200).json({ orders, totalPages, page, totalOrder });
        } catch (error) {
            return res.status(400).json({ msg: 'Error get all order', error: error });
        }
    }

    async createOder(req, res) {
        try {
            const {
                userID,
                nameBuy,
                email,
                phoneBuy,
                nameReceive,
                phoneReceive,
                province,
                district,
                ward,
                address,
                product,
                formattedTotal,
                payIn,
                deliveryMethod,
            } = req.body;

            const order = new OrderModel({
                userID,
                nameBuy,
                email,
                phoneBuy,
                nameReceive,
                phoneReceive,
                province,
                district,
                ward,
                address,
                product,
                formattedTotal,
                payIn,
                deliveryMethod,
            });
            await order.save();
            res.status(200).json({ msg: 'Post Order Success' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error create new a order', error: error });
        }
    }
    async changeOder(req, res) {
        try {
            const id = req.params._id;
            const updateDataOrder = req.body;
            // Check Order info
            const Order = await OrderModel.findById({ _id: id });
            if (!Order) return res.status(400).json({ msg: 'Order not found' });

            // Update Order info
            await OrderModel.findByIdAndUpdate(id, updateDataOrder);
            res.status(200).json({ msg: 'Updated Order info' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error updating Order info', error: error });
        }
    }

    async detail(req, res) {
        try {
            const { _id } = req.params;
            const order = await OrderModel.findById({ _id });
            if (!order) return res.status(400).json({ msg: 'Order not found' });
            res.status(200).json(order);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Get Detail Order', error: error });
        }
    }

    async deleteOrder(req, res) {
        try {
            const { _id } = req.params;
            // Check Order
            const order = await OrderModel.findById({ _id: _id });

            if (!order) return res.status(404).json({ msg: 'Order not found' });
            await OrderModel.findOneAndDelete({ _id });
            res.status(200).json({ msg: 'Order removed successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error Order Delete', error: error });
        }
    }

    async detailUser(req, res) {
        try {
            const _id = req.params._id;
            const order = await OrderModel.findOne({ userID: _id })
                .populate({
                    path: 'userID',
                    select: '-password -refreshToken -code_security -role',
                })
                .populate('product.id');
            console.log(order);
            res.status(200).json(order);
        } catch (error) {
            return res.status(400).json({ msg: 'Error get order of user', error: error });
        }
    }
}
module.exports = new OrderController();
