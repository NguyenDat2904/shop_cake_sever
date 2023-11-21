require('dotenv').config();
const paypal = require('paypal-rest-sdk');
const convertVndToUsd = require('../helpers/convertVndToUsd.helper');
const OrderModel = require('../model/Orders.model');

class Payment {
    async pay(req, res) {
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
                deliveryMethod,
            } = req.body;
            const total = await convertVndToUsd(formattedTotal);

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
                payIn: 'Chưa thanh toán',
                deliveryMethod,
            });
            await order.save();

            // Config Paypal
            paypal.configure({
                mode: 'sandbox', //sandbox or live
                client_id: process.env.CLIENT_ID_PAYPAL,
                client_secret: process.env.SECRET_KEY_PAYPAL,
            });

            const create_payment_json = {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal',
                },
                redirect_urls: {
                    return_url: `${process.env.LOCALHOST}/payment/paypal/success`,
                    cancel_url: `${process.env.LOCALHOST}/payment/paypal/cancel`,
                },
                transactions: [
                    {
                        item_list: {
                            items: [
                                {
                                    name: 'Thanh toán đơn hàng',
                                    sku: order._id.toString(),
                                    price: total,
                                    currency: 'USD',
                                    quantity: 1,
                                },
                            ],
                        },
                        amount: {
                            currency: 'USD',
                            total: total,
                        },
                        description: 'Hóa đơn thanh toán đơn hàng BUCKER SHOP.',
                    },
                ],
            };

            paypal.payment.create(create_payment_json, async function (error, payment) {
                if (error) {
                    return res.status(400).json({ errorMsg: 'Create bill paypal payment failed', error: error });
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            return res.status(200).json(payment.links[i]);
                        }
                    }
                }
            });
        } catch (error) {
            return res.status(400).json({ errorMsg: 'Error Create Bill Paypal Payment', error: error });
        }
    }

    async cancel(req, res) {
        res.status(400).json({ msg: 'Payment Error' });
    }

    async success(req, res) {
        try {
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const execute_payment_json = {
                payer_id: payerId,
            };

            paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                if (error) {
                    throw new Error(error);
                } else {
                    try {
                        const orderID = payment.transactions[0].item_list.items[0].sku;
                        const order = await OrderModel.findById({ _id: orderID });
                        if (!order) {
                            return res.status(400).json({ msg: 'order not found' });
                        }
                        // Update status of order
                        await OrderModel.findByIdAndUpdate(orderID, { payIn: 'Đã thanh toán' });

                        res.status(200).send(
                            `<script>window.location.href = "https://shop-cake-online.vercel.app/pay";</script>`,
                        );
                    } catch (error) {
                        return res.status(400).json({ msg: 'Payment fail' });
                    }
                }
            });
        } catch (error) {
            return res.status(400).json({ errorMsg: 'Error Paypal Payment', error: error });
        }
    }
}
module.exports = new Payment();
