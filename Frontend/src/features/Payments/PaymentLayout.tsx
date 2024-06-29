import React, { useEffect, useState } from 'react';
import PaymentForm from './PaymentForm';
import { BsTrash3Fill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApis } from '../../config/orderApi';
import { toast } from 'react-toastify';
import { FaChevronLeft } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import Loading from '../../util/Loading';

interface Payment {
    mode: string;
    amount: number;
    txn_id?: string;
    link?: string;
    sender_name?: string;
    sender_email?: string;
    institution_name?: string;
    finance_id?: string;
    createdAt?: string;
}

const PaymentLayout: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([{ mode: 'Online', amount: 0 }]);
    const [existingPayments, setExistingPayments] = useState<Payment[]>([]);
    const [activeIndex, setActiveIndex] = useState<string | null>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [due_amount, setDue_amount] = useState<number | null>(null);

    let params = useParams()
    const navigate = useNavigate()
    const { id } = params;

    useEffect(() => {
        getPaymentDetails();
    }, [])

    const getPaymentDetails = async () => {
        try {
            setLoading(true);
            const response = await orderApis.getPaymentById(id);
            if (response.data.status) {
                setExistingPayments(response.data.data.payments);
                setDue_amount(response.data.data.due_amount)
            } else {
                toast.error(response?.data.err.toString() ?? "Something went wrong while fetching payments.");
            }
        } catch (error: any) {
            toast.error(error.response?.data.err.toString() ?? error.message.toString());
        } finally {
            setLoading(false);
        }
    }
    const handlePaymentChange = (index: number, field: string, value: string | number) => {
        if(typeof value === "string" && field!=="link" && field!=="mode")
            value=value?.toUpperCase()
        const newPayments = payments.map((payment, i) =>
            i === index ? { ...payment, [field]: value } : payment
        );
        setPayments(newPayments);
    };

    const addPayment = () => {
        setPayments([...payments, { mode: 'Online', amount: 0 }]);
        setActiveIndex(`${payments.length}_unpaid`); // Open the new payment form
    };

    const removePayment = (index: number) => {
        setPayments(payments.filter((_, i) => i !== index));
        setActiveIndex(null);
    };

    const toggleAccordion = (index: string) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const registerPayments = async () => {
        if (payments.length < 1) {
            toast.info("Please add transaction details before proceeding.")
            return;
        }

        try {
            setLoading(true)
            // console.log(payments)
            let res = await orderApis.addPaymentToOrder(id, payments)
            if (res.data.status) {
                toast.success(`Payment of amount ${res.data.data.amount} has been received for the order.`)
                navigate("/orders")
            } else {
                toast.error(res.data.err ?? "Something went wrong while registering payments.")
            }
            // console.log(res)
        } catch (error: any) {
            toast.error(error.response.data.err)
        } finally {
            setLoading(false)
        }
    }
    return (
        loading ? <Loading /> : <div className='mx-8'>
            <div className="flex mb-4 justify-between items-center">
                <Button className='' color={'gray'} onClick={() => navigate("/orders")}>
                    <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
                </Button>
                <p className='text-2xl font-semibold text-gray-500'>Transaction Record</p>
                {due_amount ? <p className='text-gray-400 font-semibold'>Amount Due:<span className='font-normal'>{due_amount}</span></p> : <p></p>}
            </div>
            {existingPayments?.length > 0 && <p className='mb-2 mt-8 font-semibold text-gray-500'>Recorded Transactions:</p>}
            {existingPayments?.map((payment, index) => (
                <div key={index + "_paid"} className="mb-4 border border-gray-300 rounded-md shadow-md">
                    <div className="flex flex-col bg-gray-50 p-4 rounded-t-md cursor-pointer" onClick={() => toggleAccordion(`${index}_paid`)}>
                        <h3 className="text-lg font-semibold">{payment.mode}</h3>
                        {/* <BsTrash3Fill onClick={() => removePayment(index)}
                            className="text-red-500 text-2xl" /> */}
                        <h3 className="">{new Date(payment.createdAt ?? "").toDateString() ?? ""}</h3>
                    </div>
                    {activeIndex === `${index}_paid` && (
                        <div className="p-4">
                            <PaymentForm
                                isExisting={true}
                                payment={payment}
                                onChange={(field, value) => handlePaymentChange(index, field, value)}
                            />
                        </div>
                    )}

                </div>
            ))}

            <p className='mb-2 mt-8 font-semibold text-gray-500'>Add New Transactions:</p>
            {payments.map((payment, index) => (
                <div key={index} className="mb-4 border border-gray-300 rounded-md shadow-md">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-t-md cursor-pointer" onClick={() => toggleAccordion(`${index}_unpaid`)}>
                        <h3 className="text-lg font-semibold">New Payment {index + 1}</h3>
                        <BsTrash3Fill onClick={() => removePayment(index)}
                            className="text-red-500 text-2xl" />
                    </div>
                    {activeIndex === `${index}_unpaid` && (
                        <div className="p-4">
                            <PaymentForm
                                payment={payment}
                                onChange={(field, value) => handlePaymentChange(index, field, value)}
                            />
                        </div>
                    )}

                </div>
            ))}
            <div className='flex items-center justify-center gap-3'>
                <button
                    onClick={registerPayments}
                    className="m-2 ml-8 bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
                >
                    Record Payment
                </button>
                <button
                    onClick={addPayment}
                    className=" bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                >
                    + Add Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentLayout;
