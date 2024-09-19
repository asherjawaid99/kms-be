const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    meals: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    total: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: String,
        required: true,
    },
    billingInfo: {
        type: Object,
        required: true,
    },
    orderId: {
        type: String,
    },
}, { timestamps: true });


orderSchema.pre("save", async function (next) {
    // unique order id from prefix and order count
    const prefix = "ORD";
    const count = await Order.countDocuments();
    this.orderId = `${prefix}${count + 1}`;
    next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;