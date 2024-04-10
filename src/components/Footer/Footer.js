import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                    <h3 className="text-xl lg:text-2xl font-bold mb-2">Connect with Us</h3>
                    <ul className="flex justify-center lg:justify-start space-x-4">
                        <li>
                            <a
                                href="https://www.facebook.com/profile.php?id=61555011780257"
                                className="text-gray-500 hover:text-gray-400 transition duration-300"
                            >
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-500 hover:text-gray-400 transition duration-300">
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-500 hover:text-gray-400 transition duration-300">
                                Instagram
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="text-center lg:text-right">
                    <p className="text-sm lg:text-2xl">&copy; 2024 Your HandmadeCraft. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
