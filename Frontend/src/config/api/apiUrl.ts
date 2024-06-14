const base = "http://localhost:3000"

export const apiUrl = {
    login :`${base}/loginUser`,

    addCustomer:`${base}/addCustomer`,
    getCustomers:`${base}/getCustomers`,

    addOrder:`${base}/addOrder`,
    getOrderByID:`${base}/getOrderById/:id`,
    getAllOrders:`${base}/getAllOrders`,
    getAllProducts:`${base}/products`
    

}