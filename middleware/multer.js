import multer from "multer";

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/product-images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const bannerStorge = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, "uploads/banner-images");
    },
    filename : (req, file, cb) =>{
        cb(null, Date.now() +"-"+file.originalname);
    }
});

const userProfileStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, "uploads/user-images");
    },
    filename : (req, file, cb) =>{
        cb(null, Date.now()+"-"+file.originalname);
    }
})
export default {
    productUpload: multer({ storage: productStorage }).fields(
        [
            { name : "img1", maxCount: 1 },
            { name : "img2", maxCount: 1 }, 
            { name : "img3", maxCount: 1 }, 
            { name : "img4", maxCount: 1 }
        ]
    ),
    bannerUpload : multer({storage : bannerStorge}).single("image"),
    userProfileUpload : multer({storage : userProfileStorage}).single("userImage")
}

