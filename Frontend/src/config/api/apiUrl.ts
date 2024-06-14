const base = "https://mtd-crm.vercel.app"

export const apiUrl = {
    login :`${base}/loginUser`,

    addCustomer:`${base}/addCustomer`,
    getCustomers:`${base}/getCustomers`,

    addOrder:`${base}/addOrder`,
    getOrderByID:`${base}/getOrderById/:id`,
    getAllOrders:`${base}/getAllOrders`,
    getAllProducts:`${base}/products`,
    addPaymentToOrder:`${base}/addPaymentToOrderId`
    

    

}