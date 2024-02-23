import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="bg-white text-gray-900">
            <div className="container mx-auto px-4">
                <header className="py-4 flex justify-between items-center">
                    <Link to="/" className="text-3xl font-bold text-yellow-400">
                        M
                    </Link>
                    <button className="md:hidden text-gray-700 hover:text-gray-600">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                    <nav className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-gray-600">
                            Hot crafts
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-600">
                            Types
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-600">
                            A-Z List
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-600">
                            News
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex space-x-2">
                            <Link to="/" className="text-gray-700 hover:text-gray-600">
                                Instagram
                            </Link>
                            <Link to="/" className="text-gray-700 hover:text-gray-600">
                                Facebook
                            </Link>
                            <Link to="/" className="text-gray-700 hover:text-gray-600">
                                Discord
                            </Link>
                        </div>
                        <button className="bg-blue-600 px-3 py-1 rounded text-gray-700">Dark Mode</button>
                        <button className="border border-gray-700 px-3 py-1 rounded text-gray-700">
                            Become creator
                        </button>
                    </div>
                </header>
                <main className="mt-8">
                    <div className="bg-gradient-to-r from-blue-600 to-pink-600 p-8 rounded-lg shadow-lg">
                        <div className="flex flex-col lg:flex-row lg:items-center">
                            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:mr-4">
                                <h2 className="text-sm font-semibold">New product: Tutorial in [EN]</h2>
                                <h1 className="text-4xl font-bold mt-2">Bath bombs</h1>
                                <p className="mt-4 text-white">
                                    Bath bombs. Bath bombs are a blast to make because you can make them in all kinds of
                                    shapes, sizes, and colors! You can order most of the ingredients you ...
                                </p>
                                <div className="flex flex-col lg:flex-row lg:space-x-2 mt-4">
                                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded mt-2 lg:mt-0">
                                        View tutorial
                                    </span>
                                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded mt-2 lg:mt-0">
                                        Detail
                                    </span>
                                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded mt-2 lg:mt-0">
                                        Price
                                    </span>
                                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded mt-2 lg:mt-0">
                                        Maker
                                    </span>
                                </div>
                                <div className="flex space-x-4 mt-6">
                                    <button className="bg-yellow-500 px-6 py-2 rounded text-gray-900 font-semibold">
                                        Buy it now
                                    </button>
                                    <button className="bg-yellow-400 px-6 py-2 rounded text-gray-900 font-semibold">
                                        View Info
                                    </button>
                                </div>
                            </div>
                            <div className="lg:w-1/2 flex justify-center">
                                <img
                                    alt="Bath bombs"
                                    className="rounded-lg shadow-lg"
                                    src="https://i.pinimg.com/736x/71/55/dc/7155dc282b825cc30348b127763dc1c4.jpg"
                                    width="300"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-gray-700">
                            Welcome to our handmade crafts community, where artisans can showcase and sell their unique
                            creations while offering tutorials for others to learn and share their crafting journey.
                            Whether you're a seasoned artisan or just starting out, our platform provides a supportive
                            space to connect, inspire, and create beautiful handmade treasures together. Join us and
                            unleash your creativity!
                        </p>
                    </div>
                </main>
                <footer className="mt-8 py-4 border-t border-gray-700 text-center">
                    <p className="text-gray-400">Privacy 🍪</p>
                </footer>
            </div>
        </div>
    );
}

export default Home;
