'use strict';

const express = require('express');
const router = express.Router();
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');
const ProductModel = require('./model')
const ProductPriceModel = require('../product-price/model');
const { response } = require('express');


const Status = Instance.getInstanceStatus();
const Helper = Instance.getInstanceHelper();

router.get("/all-product", customerAuth, async (req, res, next) => {
    const products = await ProductModel.getAll(null);
    return Status.success(res, "Get success", products);
});

router.get("/", customerAuth, async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 1;
    const column = req.query.column || 'productId';
    const sort = req.query.sort || 'desc';
    const search = req.query.search;
    const categoryId = req.query.categoryId;
    const productType = req.query.productType;

    // filter option
    const isLowPrice = req.query.isLowPrice;
    const isHighPrice = req.query.isHighPrice;

    const priceRangeStart = req.query.priceRangeStart;
    const priceRangeEnd = req.query.priceRangeEnd;
    const size = req.query.size;
    const manuFacturer = req.query.manuFacturer;
    const brand = req.query.brand;

    const dataTotal = { search, categoryId, productType, priceRangeStart, isLowPrice, isHighPrice, priceRangeEnd, size, manuFacturer, brand, locale: req.locale };

    const total = await ProductModel.countTotal(dataTotal);
    const params = Helper.getParamPagination(total, limit, offset, column, sort);

    if (search) {
        params.search = search;
    }

    if (categoryId) {
        params.categoryId = categoryId;
    }

    if (productType) {
        params.productType = productType;
    }

    params.isLowPrice = isLowPrice;
    params.isHighPrice = isHighPrice;
    params.priceRangeStart = priceRangeStart;
    params.priceRangeEnd = priceRangeEnd;

    params.size = size;
    params.manuFacturer = manuFacturer;
    params.brand = brand;
    params.locale = req.locale;


    let products = await ProductModel.paging(params);
    const responseAttach = { showMore: params.showMore, limit: params.limit, offset: params.offset, numberPages: params.numberPages, total: total };

    return Status.success(res, "Get success", products, responseAttach);
});


router.post('/', adminAuth, validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    try {
        const product = await ProductModel.create(req.body);
        return Status.success(res, "Create success", product);
    } catch (error) {
        console.log("create message", error.message)
        return Status.error(res, "Create failed: " + error.message);
    }
});


router.delete('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = ProductModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await ProductModel.delete(req.body.id);
        return Status.success(res, "Delete success", data);

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
});



router.put('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = ProductModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Product not found");
    }

    const id = req.body.id;

    delete req.body.id;

    try {
        await ProductModel.update(id, req.body);
        const product = await ProductModel.getOne({ id, locale: req.locale });
        return Status.success(res, "Update success", product);
    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})



router.put('/change-status', adminAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = await ProductModel.isExist({ id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await ProductModel.update(id, { status: req.body.status });

        if (data) {
            const response = await ProductModel.getOne({ id, locale: req.locale }, true);
            return Status.success(res, "Change status success", response);
        } else {
            return Status.error(res, "Something wrong");
        }

    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})



router.post('/delete-image', adminAuth, async (req, res, next) => {
    if (!req.body.publicId) {
        return Status.error(res, "Data invalid");
    }

    try {
        const response = await Instance.getInstanceCloudinary().deleteImage(req.body.publicId);
        if (response.result === 'ok') {
            return Status.success(res, "Delete success", response);
        } else {
            return Status.error(res, "Delete failed " + response);
        }

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
})


router.post('/upload-image', adminAuth, async (req, res, next) => {
    if (!req.body.image) {
        return Status.error(res, "Data invalid");
    }

    const response = await Instance.getInstanceCloudinary().uploadImage(req.body.image);

    return Status.success(res, "Upload success", response);
})


router.get('/product-master', async (req, res, next) => {
    const response = await ProductModel.getAll('master');
    return Status.success(res, "Get success", response);
})


router.get('/product-variant', async (req, res, next) => {
    const response = await ProductModel.getAll('variant');
    return Status.success(res, "Get success", response);
})



// get product new
router.get('/hotnew', customerAuth, async (req, res, next) => {
    const typeGet = req.query.typeGet || 'new';

    const products = await ProductModel.getProductHotNew(typeGet, req.locale);

    for (let product of products) {
        product.productPrice = await ProductPriceModel.getPriceByProductIdAndLocale(product.productId, req.locale) || [];
    }

    return Status.success(res, "Get success", products);
})


// get wishlist
router.get('/product-wishlist', customerAuth, async (req, res, next) => {
    const products = await ProductModel.getProductWishList(req.id, req.locale);

    for (let product of products) {
        product.productPrice = await ProductPriceModel.getPriceByProductIdAndLocale(product.productId, req.locale) || [];
    }

    return Status.success(res, "Success", products);
})


// detail product
router.get('/:productId', customerAuth, async (req, res, next) => {
    const productId = req.params.productId;
    if (!productId) {
        return Status.error(res, "Data invalid");
    }

    let product = await ProductModel.getOne({ id: productId, locale: req.locale });

    if (product.productVariants) {
        let colors = [];
        let sizes = [];
        let listProductVariants = [];

        const productVariants = JSON.parse(product.productVariants);

        for (let pVariantId of productVariants) {
            let productVariant = await ProductModel.getOne({ id: pVariantId, type: 'master', locale: req.locale });
            listProductVariants.push(productVariant);

            // set colors and sizes
            if (colors.indexOf(productVariant.productColor) === -1) {
                colors.push(productVariant.productColor);
            }

            if (sizes.indexOf(productVariant.productSize) === -1) {
                sizes.push(productVariant.productSize);
            }
        }

        product.colors = colors;
        product.sizes = sizes;

        product.listProductVariants = listProductVariants;
    } else {
        product.colors = [product.productColor];
        product.sizes = [product.productSize];
    }
    return Status.success(res, "Get detail success", product);
})


module.exports = router;