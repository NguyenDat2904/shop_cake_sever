require('dotenv').config();
const ProductModel = require('../model/Products.model');

class ProductController {
    async showAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { name } = req.query;
            const nameFiler = name ? { name: { $regex: name.toString(), $options: 'i' } } : {};

            // Total number Products
            const totalProducts = await ProductModel.countDocuments({
                ...nameFiler,
            });
            const totalPages = Math.ceil(totalProducts / limit);

            const products = await ProductModel.find({ ...nameFiler })
                .skip((page - 1) * limit)
                .limit(limit);
            if (!products) return res.status(400).json({ msg: 'Product not found' });
            res.status(200).json(products, page, totalProducts, totalPages);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Getting All Products', error: error });
        }
    }

    async postProduct(req, res) {
        try {
            const { name, cost, color, type, price, trend, size, topic } = req.body;
            const file = req.file;
            let img_product;
            if (file) {
                img_product = `${process.env.LOCALHOST}/images/${file.filename}`;
            } else {
                img_product = '';
            }
            const newProduct = new ProductModel({
                name,
                cost,
                color,
                type,
                price,
                trend,
                size,
                topic,
                img: img_product,
            });
            await newProduct.save();
            res.status(200).json({ msg: 'Save Product Success' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error Saving Product', error: error });
        }
    }

    async changeProduct(req, res) {
        try {
            const id = req.params._id;
            const updatedData = req.body;
            const file = req.file;
            const product = await ProductModel.findById({ _id: id });
            if (!product) {
                return res.status(400).json({ msg: 'Product not found' });
            }
            if (file) {
                updatedData.img = `${process.env.LOCALHOST}/images/${file.filename}`;
            }
            await ProductModel.findByIdAndUpdate(id, updatedData);
            res.status(200).json({ message: 'Information edited successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error Change Product', error: error });
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params._id;
            const product = await ProductModel.findById({ _id: id });
            if (!product) {
                return res.status(400).json({ msg: 'Product not found' });
            }
            await ProductModel.findOneAndDelete({ _id: id });
            res.status(200).json({ msg: 'Successful deleted product' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error deleting product', error: error });
        }
    }
    async detail(req, res) {
        try {
            const id = req.params._id;
            const product = await ProductModel.findById({ _id: id });
            if (!product) {
                return res.status(400).json({ msg: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Get detail a product', error: error });
        }
    }
}

module.exports = new ProductController();
