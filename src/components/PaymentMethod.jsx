import React from 'react';

const PaymentMethod = () => {
    const paymentMethods = [
        {
            name: "MTN MOMO",
            logo: "https://uploads-eu-west-1.insided.com/mtngroup-en/attachment/96f3ec28-bc42-49ee-be5d-6ed5345e516c_thumb.png"
        },
        {
            name: "MTN MOMO",
            logo: "https://lh3.googleusercontent.com/z4nOBXDSMJ2zwyW9Nd1KHYEJgbhuqnVLvAGUXh0uEUn8f9QHnPYUY_64oYwOxRsDx26SEb5PgZJzLJRU6RwToFL00Wq--pBGmAwe=s0"
        },
        {
            name: "Visa",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
        },
        {
            name: "Mastercard",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
        }
    ];
    return (
        <div className="flex">
            <span className="w-1/4 text-gray-800">Payments:</span>
            <div className="w-2/4 flex space-x-2">
                {paymentMethods.map((method, index) => (
                    <div key={index} className="border-[3px] border-black p-2 rounded flex items-center justify-center w-20 h-12">
                        <img className="max-h-6" src={method.logo} alt={method.name} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethod;