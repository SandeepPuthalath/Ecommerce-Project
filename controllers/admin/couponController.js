import Coupon from '../../model/couponModel';
import mongoose from 'mongoose';


export const handleGetAllCoupons = async (req, res) => {
    const admin = req.session.admin;
    try {
        const coupons = await Coupon.find({}).lean();
        res.status(201).render('admin/coupon', { admin, coupons: coupons });
    } catch (error) {
        res.status(404);
    }
}

export const handleCreateCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon(req.body);
        const savedCoupn = await newCoupon.save();
        res.status(201).json(`Coupon has been created ${savedCoupn}`);
    } catch (error) {
        if (error.code == 11000) {
            res.status(404).json({ error: `Coupon ${req.body.code} already exists` })
        } else {
            res.status(404).redirect('/error');
        }
    }
}

export const handleGetCouponById = async (req, res) => {
    const couponId = new mongoose.Types.ObjectId(req.params.id);
    console.log(couponId)
    try {
        await Coupon.findById(couponId, (err, coupon) => {
            if (err) {
               res.status(404).json({error : `There is no such coupon`});
            }
            else {
                res.status(201).json(coupon);
            }
        });
    }
    catch (error) {
        res.status(404);
    }
}

export const handleEditCoupon = async (req, res) =>{
    const couponId = mongoose.Types.ObjectId(req.body.couponId);
    console.log(req.body)
    try {
         await Coupon.findById(couponId, async (err, coupon) =>{
            if(err){
                res.status(404).json({error : "somthing went wrong"})
            }
            else{
                console.log(coupon)
                coupon.code = req.body.code;
                coupon.discount = parseInt(req.body.discount);
                coupon.description = req.body.description;
                coupon.expirationDate = new Date(req.body.expirationDate);
                await coupon.save();
                res.status(201).json(`Coupon ${coupon.code} has been updated!`)
            }
        })

    } catch (error) {
        res.status(404);
    }
   
}