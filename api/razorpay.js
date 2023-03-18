import Razorpay from "razorpay";
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: `${key_id}`,
  key_secret: `${key_secret}`,
});


export function processRazorpay(orderId, totalAmount) {
  return new Promise((resolve, reject) => {
    const options = {
      amount: `${totalAmount * 100}`,
      currency: "INR",
      receipt: `${orderId}`,
      payment_capture: 1,
    };
    razorpay.orders.create(options, function (err, order) {
      if (err) {
        console.log(err);
      } else {
        resolve(order);
      }
    });
  });
}

