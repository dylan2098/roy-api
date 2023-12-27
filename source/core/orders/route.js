'use strict';

const express = require('express');
const router = express.Router();
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');
const OrdersModel = require('./model');
const ShippingModel = require('../shipping/model');
const randomstring = require('randomstring');
const InvoicePDF = require('./invoice');
const CartModel = require('../cart/model');

const moment = require("moment");


const Status = Instance.getInstanceStatus();

router.get("/", async (req, res, next) => {
    const data = await OrdersModel.getAll();
    return Status.success(res, "Get data success", data);
});


router.post("/", customerAuth, validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    const today = Date.now();

    // data create order
    const params = {};
    params.orderNo = today + randomstring.generate(8) + req.id;
    params.customerNo = req.id;
    params.expectedDate = moment(moment().add(3, 'days')).format("MM-DD-YYYY");
    params.currencyCode = req.body.currencyCode;
    params.customerEmail = req.body.customerEmail;
    params.customerName = req.body.customerName;
    params.customerLocaleID = req.body.customerLocaleID;
    params.createdBy = req.body.createdBy;
    params.affiliatePartnerName = "IOSSYSTEM";


    // data cart
    const carts = req.body.carts;
    try {
        const orderId = await OrdersModel.create(params);

        if (orderId) {

            // create data order item
            for (let product of carts) {

                const dataOrderItem = {
                    orderId: orderId
                };

                dataOrderItem.productId = product.productId;
                dataOrderItem.quantity = product.amount;

                await OrdersModel.createOrderItem(dataOrderItem);
            }

            // create invoice
            const paramInvoice = {};

            const { customerName, customerPhone, customerEmail, customerAddress, customerZipCode } = req.body;

            paramInvoice.invoiceNumber = today + randomstring.generate(6);
            // format lại thành ivroy_ddmmyy_hhmmss_randomstring
            paramInvoice.orderId = orderId;
            paramInvoice.orderNo = params.orderNo;
            paramInvoice.orderItem = JSON.stringify(carts);
            paramInvoice.grossPrice = 100.00;
            paramInvoice.tax = 2.0;
            paramInvoice.customerName = customerName;
            paramInvoice.customerPhone = customerPhone;
            paramInvoice.customerEmail = customerEmail;
            paramInvoice.customerAddress = customerAddress;
            paramInvoice.customerZipcode = customerZipCode;
            paramInvoice.carts = carts;
            paramInvoice.locale = req.locale;


            // create shipping
            const paramShipping = {};
            paramShipping.orderId = orderId;
            paramShipping.shippingNo = 'S' + today + randomstring.generate(6)
            paramShipping.status = 0;
            paramShipping.invoiceNumber = paramInvoice.invoiceNumber;
            paramShipping.grossPrice = 100.00;
            paramShipping.orderItem = JSON.stringify(carts);
            paramShipping.orderNo = params.orderNo;

            if (req.body.giftId) {
                paramShipping.giftId = req.body.giftId;
            }


            // create invoice
            const fileInvoice = await InvoicePDF.createPDF(paramInvoice);

            //delete invoice at host
            await InvoicePDF.deleteFileLocal(paramInvoice.invoiceNumber);

            // delete data thua de tranh bi loi unfined column
            delete paramInvoice.carts;
            delete paramInvoice.locale;

            const dataCart = await Promise.all([OrdersModel.createInvoice(paramInvoice), ShippingModel.create(paramShipping)]);

            //TODO: update url into dataCart
            const invoiceId = dataCart[0][0];

            if (!fileInvoice) {
                return Status.error(res, "Create order failed");
            }

            await OrdersModel.updateInvoice(invoiceId, { urlInvoice: fileInvoice.url });


            // update empty cart
            await CartModel.update({ userId: req.id, contentCart: JSON.stringify([]) });


            return Status.success(res, "Create success", dataCart);
        }

        return Status.error(res, "Create order failed");

    } catch (error) {
        return Status.error(res, "Create failed: " + error.message);
    }
});



module.exports = router;