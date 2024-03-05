import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTutorials } from '~/services/tutorialService';

function Home() {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const tutorialsData = await getAllTutorials();
                setTutorials(tutorialsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutorials', error);
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTutorialIndex((prevIndex) => (prevIndex === tutorials.length - 1 ? 0 : prevIndex + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [tutorials]);

    const removeFileExtension = (url) => {
        const index = url.lastIndexOf('.');
        return index > 0 ? url.substring(0, index) : url;
    };

    return (
        <div className="bg-gray-100 min-h-screen">
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
                </header>

                <main className="mt-8">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="rounded-lg shadow-lg overflow-hidden">
                            <div className="relative">
                                <img
                                    alt={tutorials[currentTutorialIndex].title}
                                    className="w-full h-auto object-cover"
                                    src={`${removeFileExtension(tutorials[currentTutorialIndex].videoUrl)}.jpg`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                            {tutorials[currentTutorialIndex].title}
                                        </h1>
                                        <p className="text-lg md:text-xl">
                                            {tutorials[currentTutorialIndex].instruction}
                                        </p>
                                        <div className="mt-6 flex justify-center space-x-4">
                                            <Link
                                                to={`/tutorials/${tutorials[currentTutorialIndex].id}`}
                                                className="text-yellow-400 hover:text-yellow-500 font-semibold"
                                            >
                                                View Tutorial
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-b-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Difficulty: {tutorials[currentTutorialIndex].difficultLevel}
                                        </h2>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Link to={`/profile/${tutorials[currentTutorialIndex].createdById}`}>
                                            <img
                                                className="w-12 h-12 rounded-full"
                                                src={tutorials[currentTutorialIndex].userProfilePicture}
                                                alt="creator avatar"
                                            />
                                        </Link>
                                        <Link
                                            to={`/tutorials/${tutorials[currentTutorialIndex].id}`}
                                            className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded text-gray-900 font-semibold"
                                        >
                                            View Info
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
                <footer className="mt-8 py-4 border-t border-gray-700 text-center">
                    <p className="text-gray-400">Privacy 🍪</p>
                </footer>
            </div>
        </div>
    );
}

export default Home;
