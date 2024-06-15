const base = "https://mtd-crm.vercel.app"
// const base = "http://localhost:3000"

export const apiUrl = {
    login :`${base}/loginUser`,

    addCustomer:`${base}/addCustomer`,
    getCustomers:`${base}/getCustomers`,

    addOrder:`${base}/addOrder`,
    updateOrder:`${base}/updateOrder`,
    getOrderByID:`${base}/getOrderById`,
    getAllOrders:`${base}/getAllOrders`,
    
    getProductById:`${base}/products`,
    createProduct:`${base}/addProduct`,
    getAllProducts:`${base}/products`,
    updateProduct:`${base}/updateProductById`,

    getPaymentByID:`${base}/getPaymentByOrderId`,
    addPaymentToOrder:`${base}/addPaymentToOrderId`
    

    

}