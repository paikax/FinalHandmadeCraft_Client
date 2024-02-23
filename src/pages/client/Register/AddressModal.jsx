import React, { useEffect, useState } from 'react';

function AddressModal({ isOpen, onClose, onAddressSelect, addressDetails, setAddressDetails }) {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
    });

    // Sync addressDetails to local state when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setAddress(addressDetails);
        }
    }, [isOpen, addressDetails]);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        onAddressSelect(address);
        setAddressDetails(address); // Update the addressDetails in parent
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${!isOpen && 'hidden'}`}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Select Address</h3>
                    <div className="mt-2 px-7 py-3">
                        <input
                            className="mb-3 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="text"
                            name="street"
                            placeholder="Street"
                            value={address.street}
                            onChange={handleChange}
                        />
                        <input
                            className="mb-3 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="text"
                            name="city"
                            placeholder="City"
                            value={address.city}
                            onChange={handleChange}
                        />
                        <input
                            className="mb-3 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="text"
                            name="state"
                            placeholder="State"
                            value={address.state}
                            onChange={handleChange}
                        />
                        <input
                            className="mb-3 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={address.country}
                            onChange={handleChange}
                        />
                        <input
                            className="mb-3 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="text"
                            name="zipCode"
                            placeholder="Zip Code"
                            value={address.zipCode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={handleSubmit}
                        >
                            Save Address
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddressModal;
