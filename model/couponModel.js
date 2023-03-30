import { default as mongoose } from "mongoose";


const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true,
        uppercase: true
    },
    discount: {
        type: Number,
        require: true,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        require: true
    },
    expirationDate: {
        type: Date,
        require: true,
    },
    usersUsed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isActive: {
        type: String,
        enum: ['Active', 'Expired'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

// checking whether the coupon is active of not
couponSchema.pre('save', function (next) {
    const now = new Date();
    if (this.expirationDate < now) {
        this.isActive = 'Expired';
    } else {
        this.isActive = 'Active';
    }
    next();
});

// pre-save middleware to make the 'name' field uppercase
couponSchema.pre('save', function (next) {
    if (this.name) {
        this.name = this.name.toUpperCase();
    }
    next();
});

const Coupon = mongoose.model('coupon', couponSchema);

export default Coupon;