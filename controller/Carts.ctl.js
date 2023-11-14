const CartModel = require('../model/Carts.model');

class Cart {
    async showAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const totalCart = await CartModel.countDocuments();
            const totalPages = Math.ceil(totalCart / limit);

            const carts = await CartModel.find()
                .skip((page - 1) * limit)
                .populate({ path: 'user', select: '-password -refreshToken -code_security' })
                .populate({ path: 'product.id', select: '-id' })
                .limit(limit);
            if (!carts) {
                return res.status(400).json({ msg: 'Carts not found' });
            }
            res.status(200).json({ carts, totalPages, page, totalCart });
        } catch (error) {
            return res.status(400).json({ msg: 'Error get all Carts', error: error });
        }
    }

    async createCart(req, res) {
        try {
            const { user, product } = req.body;
            const cart = new CartModel({
                user,
                product,
            });
            await cart.save();
            res.status(200).json({ msg: 'Post Cart Success' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error create new a Cart', error: error });
        }
    }

    async changeCart(req, res) {
        try {
            const id = req.params._id;
            const updateDataCart = req.body;
            // Check Cart info
            const Cart = await CartModel.findById({ _id: id });
            if (!Cart) return res.status(400).json({ msg: 'Cart not found' });

            // Update Cart info
            await CartModel.findByIdAndUpdate(id, updateDataCart);
            res.status(200).json({ msg: 'Updated Cart info' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error updating Cart info', error: error });
        }
    }

    async deleteCart(req, res) {
        try {
            const { _id } = req.params;
            // Check Cart
            const cart = await CartModel.findById({ _id: _id });
            if (!cart) return res.status(404).json({ msg: 'Cart not found' });
            await CartModel.findOneAndDelete({ _id });
            res.status(200).json({ msg: 'Cart removed successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error Cart Delete', error: error });
        }
    }

    async detail(req, res) {
        try {
            const { _id } = req.params;
            const cart = await CartModel.findById({ _id });
            if (!cart) return res.status(400).json({ msg: 'cart not found' });
            res.status(200).json(cart);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Get Detail cart', error: error });
        }
    }
}
module.exports = new Cart();
