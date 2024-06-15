import { FloatingLabel, Select } from 'flowbite-react';
import React from 'react';

interface PaymentFormProps {
    payment: Payment;
    onChange: (field: string, value: string | number) => void;
    isExisting?: boolean
}

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

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onChange, isExisting }) => {
    const renderFields = () => {
        switch (payment.mode) {
            case 'Online':
                return (
                    <>
                        <FloatingLabel
                            type="text"
                            variant="outlined"
                            label="Transaction ID"
                            disabled={isExisting}
                            value={payment.txn_id || ''}
                            onChange={(e) => onChange('txn_id', e.target.value)}
                        // className="my-2"
                        />
                        <FloatingLabel
                            type="text"
                            variant="outlined"
                            label="Link"
                            disabled={isExisting}
                            value={payment.link || ''}
                            onChange={(e) => onChange('link', e.target.value)}
                        // className="my-2"
                        />
                    </>
                );
            case 'Interac':
                return (
                    <>
                        <FloatingLabel
                            type="text"
                            variant="outlined"
                            label="Sender's Name"
                            disabled={isExisting}
                            value={payment.sender_name || ''}
                            onChange={(e) => onChange('sender_name', e.target.value)}
                        // className="my-2"
                        />
                        <FloatingLabel
                            type="email"
                            variant="outlined"
                            label="Sender's Email"
                            disabled={isExisting}
                            value={payment.sender_email || ''}
                            onChange={(e) => onChange('sender_email', e.target.value)}
                        // className="my-2"
                        />
                    </>
                );
            case 'Finance':
                return (
                    <>
                        <FloatingLabel
                            type="text"
                            variant="outlined"
                            label="Institution Name"
                            disabled={isExisting}
                            value={payment.institution_name || ''}
                            onChange={(e) => onChange('institution_name', e.target.value)}
                        // className="my-2"
                        />
                        <FloatingLabel
                            type="text"
                            variant="outlined"
                            label="Finance ID"
                            disabled={isExisting}
                            value={payment.finance_id || ''}
                            onChange={(e) => onChange('finance_id', e.target.value)}
                        // className="my-2"
                        />
                    </>
                );
            case 'Cash':
            case 'Card':
            default:
                return null;
        }
    };

    return (
        <div className="p-4 rounded-md flex flex-col gap-2">
            <Select
                disabled={isExisting}
                value={payment.mode}
                onChange={(e) => onChange('mode', e.target.value)}
                className="my-2"
            >
                <option value="Online">Online</option>
                <option value="Interac">Interac</option>
                <option value="Finance">Finance</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
            </Select>
            <FloatingLabel
                disabled={isExisting}
                variant='outlined'
                type="number"
                label="Amount *"
                min={0}
                value={payment.amount === 0 ? "" : payment.amount}
                required
                onChange={(e) => onChange('amount', parseFloat(e.target.value))}
                className="accent-indigo-600"
            />
            {renderFields()}
        </div>
    );
};

export default PaymentForm;
