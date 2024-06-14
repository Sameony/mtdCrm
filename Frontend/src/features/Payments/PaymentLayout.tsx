import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import { BsTrash3Fill } from 'react-icons/bs';

interface Payment {
    mode: string;
    amount: number;
    txn_id?: string;
    link?: string;
    sender_name?: string;
    sender_email?: string;
    institution_name?: string;
    finance_id?: string;
}

const PaymentLayout: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([{ mode: 'Online', amount: 0 }]);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const handlePaymentChange = (index: number, field: string, value: string | number) => {
        const newPayments = payments.map((payment, i) =>
            i === index ? { ...payment, [field]: value } : payment
        );
        setPayments(newPayments);
    };

    const addPayment = () => {
        setPayments([...payments, { mode: 'Online', amount: 0 }]);
        setActiveIndex(payments.length); // Open the new payment form
    };

    const removePayment = (index: number) => {
        setPayments(payments.filter((_, i) => i !== index));
        setActiveIndex(null);
    };

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className='mx-8'>
            {payments.map((payment, index) => (
                <div key={index} className="mb-4 border border-gray-300 rounded-md shadow-md">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-t-md cursor-pointer" onClick={() => toggleAccordion(index)}>
                        <h3 className="text-lg font-semibold">Payment {index + 1}</h3>
                        <BsTrash3Fill onClick={() => removePayment(index)}
                            className="text-red-500 text-2xl" />
                    </div>
                    {activeIndex === index && (
                        <div className="p-4">
                            <PaymentForm
                                payment={payment}
                                onChange={(field, value) => handlePaymentChange(index, field, value)}
                            />
                        </div>
                    )}
                </div>
            ))}
            <button
                onClick={addPayment}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
                + Add Payment
            </button>
        </div>
    );
};

export default PaymentLayout;
