import Order from '../../model/orderModel';

export const handleGetSalesReport = async (req, res) => {
    const admin = req.session.admin;
    try {
        const orders = await Order.find({ status: { $eq: 'Delivered' } }).lean();
        res.status(201).render('admin/sales-report', { admin, orders });
    } catch (error) {
        res.status(500).redirect('/error');
    }
}

export const handleCreateSalesReport = async (req, res) => {
    let { startDate, endDate } = req.body
    const date = new Date ();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(date.getDate()+1);
        const salesReport = await Order.find({ createAt: { $gte: start, $lte: end }, status: { $eq: 'Delivered' } }).exec();
        console.log(salesReport)
        res.status(200).json(salesReport);

    } catch (error) {
        res.status(500).redirect('/error');
    }
}

