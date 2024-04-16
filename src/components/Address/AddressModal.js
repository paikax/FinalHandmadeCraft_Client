import React, { useState } from 'react';

const AddressModal = ({ isOpen, onClose, onSubmit }) => {
    const [address, setAddress] = useState({
        name: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phoneNumber: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Validate the address fields if needed
        onSubmit(address);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="bg-white p-8 rounded-md z-10">
                <h2 className="text-2xl font-semibold mb-4">Enter Your Address</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-800 font-semibold mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={address.name}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="streetAddress" className="block text-gray-800 font-semibold mb-1">
                        Street Address
                    </label>
                    <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={address.streetAddress}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 w-full"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="city" className="block text-gray-800 font-semibold mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={address.city}
                            onChange={handleChange}
                            className="border rounded-md px-4 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-gray-800 font-semibold mb-1">
                            State/Province/Region
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                            className="border rounded-md px-4 py-2 w-full"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="postalCode" className="block text-gray-800 font-semibold mb-1">
                            ZIP/Postal Code
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={address.postalCode}
                            onChange={handleChange}
                            className="border rounded-md px-4 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-gray-800 font-semibold mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={address.country}
                            onChange={handleChange}
                            className="border rounded-md px-4 py-2 w-full"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block text-gray-800 font-semibold mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={address.phoneNumber}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 w-full"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mr-2"
                    >
                        Submit
                    </button>
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
