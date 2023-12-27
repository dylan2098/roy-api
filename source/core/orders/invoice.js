const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const { options } = require("pdfkit");
var cloudinary = require('cloudinary').v2
const ProductModel = require('../product/model');
const ProductPriceModel = require("../product-price/model");

class InvoicePDF {
    static urlExport = './invoices/';
    static createPDF = async (paramInvoice) => {

        const doc = new PDFDocument();

        const urlFile = this.urlExport + paramInvoice.invoiceNumber + ".pdf";

        doc.pipe(fs.createWriteStream(urlFile));

        doc.fontSize(20).font('Helvetica-Bold').text("WEBSITE E-COMMERCE", { lineBreak: true, lineGap: 10 });

        const linebreak = { lineBreak: true, lineGap: 5 };

        doc.fontSize(12).font('Helvetica').text("Support 24/7", linebreak);
        doc.fontSize(12).text("Hotline: 0949667264", linebreak);
        doc.fontSize(12).text("Order ID: " + "#112334232", linebreak);
        doc.fontSize(12).text("Order date: " + "20-10-1998 20:30:19", linebreak);
        doc.fontSize(12).text("Payment method: " + "Cash of delivery", linebreak);
        doc.fontSize(12).text("Shipping method: " + "Shipping COD", linebreak);
        doc.fontSize(12).text("Shipping Fee: " + "Free ship", linebreak);


        doc.text(" ", { lineBreak: true, lineGap: 15 })

        const tablePaymentInformation = {
            headers: [
                { label: "Payment Information", property: 'info', width: 215, align: "center" },
                { label: "Address Delivery", property: 'address', width: 215, align: "center" },
            ],
            datas: [
                {
                    info: paramInvoice.customerName + ", " + paramInvoice.customerEmail + ", " + paramInvoice.customerPhone + ", " + paramInvoice.customerZipcode,
                    address: paramInvoice.customerAddress
                }
            ],
        };

        doc.table(tablePaymentInformation, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12)
        });


        doc.text(" ", { lineBreak: true, lineGap: 15 })

        if (paramInvoice.carts.length <= 0) {
            return false;
        }


        let productsInCart = [];
        let total = 0;

        for (let pro of paramInvoice.carts) {
            let product = await ProductModel.getOne({ id: pro.productId, locale: req.locale });
            product.productPrice = await ProductPriceModel.getPriceByProductIdAndLocale(pro.productId, paramInvoice.locale) || [];

            if (product.productPrice && product.productPrice.length > 0) {
                total += pro.amount * product.productPrice[0].grossPrice;
                productsInCart.push({
                    name: product.productName,
                    amount: pro.amount,
                    price: product.productPrice[0].grossPrice,
                    promotion: 0,
                });
            }
        }

        const tableProduct = {
            headers: [
                { label: "Product", property: 'name', width: 150, renderer: null, align: "center" },
                { label: "Amount", property: 'amount', width: 80, renderer: null, align: "center" },
                { label: "Price", property: 'price', width: 100, renderer: null, align: "center" },
                { label: "Promotion", property: 'promotion', width: 100, renderer: null, align: "center" },
            ],
            datas: productsInCart,
        };

        doc.table(tableProduct, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12)
        });


        doc.text(" ", { lineBreak: true, lineGap: 15, align: "right" })


        doc.fontSize(12).text("Total: $" + total, { lineBreak: true, lineGap: 15, align: "right", width: 410 })

        // Finalize PDF file
        doc.end();


        cloudinary.config({
            cloud_name: 'dvweth7yl',
            api_key: '429776856742478',
            api_secret: 'OITKAXtTvSaKLL-zA0wlGVWNN4A',
            secure: true,
        });

        const filePDF = await cloudinary.uploader.upload(urlFile, {
            upload_preset: "rc2w4ipi"
        });

        return filePDF;
    }

    static deleteFileLocal = async (filename) => {
        await fs.unlinkSync(this.urlExport + filename + ".pdf");
    }
}

module.exports = InvoicePDF;