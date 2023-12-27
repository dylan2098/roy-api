const setting = require('../settings/general.json');
const cloudinary = require('cloudinary');

class Cloudinary {
    static getCloudName() {
        return setting.CLOUD_DINARY.CLOUD_NAME;
    }

    static getCloudApiKey() {
        return setting.CLOUD_DINARY.KEY;
    }

    static getCloudSecretKey() {
        return setting.CLOUD_DINARY.SECRET;
    }

    static getCloudConfig() {
        const cloud = cloudinary.v2;

        cloud.config({
            cloud_name: this.getCloudName(),
            api_key: this.getCloudApiKey(),
            api_secret: this.getCloudSecretKey()
        });

        return cloud;
    }

    static deleteImage(publicId) {
        return this.getCloudConfig().uploader.destroy(publicId);
    }

    static uploadImage(imageFile) {
        return this.getCloudConfig().uploader.upload(imageFile);
    }
}

module.exports = Cloudinary;