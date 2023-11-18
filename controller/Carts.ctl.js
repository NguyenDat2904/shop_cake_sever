const CartModel = require('../model/Carts.model');
const ProductModel = require('../model/Products.model');

class Cart {
    async showAll(req, res) {
        try {
            const id = req.params._id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const totalCart = await CartModel.countDocuments();
            const totalPages = Math.ceil(totalCart / limit);

            const carts = await CartModel.find({ user: id })
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
            const { userID, id } = req.body;
            const _id = req.params._id;
            const cart = await CartModel.findOne({ user: _id })
                .populate({ path: 'user', select: '-password -refreshToken -code_security' })
                .populate({ path: 'product.id', select: '-id' });
            console.log(cart === null);
            if (cart === null) {
                const newCart = new CartModel({
                    user: userID,
                    product: [{ id: id, quantity: 1 }],
                });
                await newCart.save();
                return res.status(200).json({ msg: 'Create new a Cart Success' });
            } else {
                const product = await ProductModel.findById({ _id: id });
                const filterProduct = cart.product.filter((item) => item.id.name === product.name);
                if (filterProduct.length !== 0) {
                    filterProduct[0].quantity += 1;
                    await cart.save();
                    return res.status(200).json({ msg: 'The product is increased by 1 unit' });
                } else {
                    const newProduct = {
                        id: product,
                        quantity: 1,
                    };
                    cart.product.push(newProduct);
                    await cart.save();
                    return res.status(200).json({ msg: 'Add a new product to the cart' });
                }
            }
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
            const idProduct = req.body.id;
            // Check Cart
            const cart = await CartModel.findOne({ user: _id })
                .populate({ path: 'user', select: '-password -refreshToken -code_security' })
                .populate({ path: 'product.id', select: '-id' });
            if (!cart) return res.status(404).json({ msg: 'Cart not found' });
            const updatedProducts = cart.product.filter((product) => product.id._id.toString() !== idProduct);
            if (updatedProducts.length > 0) {
                cart.product = updatedProducts;
                await cart.save();
                return res.status(200).json({ msg: 'Cart removed one item successfully' });
            } else {
                await CartModel.findOneAndDelete({ user: _id });
                return res.status(200).json({ msg: 'Cart removed successfully' });
            }
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
