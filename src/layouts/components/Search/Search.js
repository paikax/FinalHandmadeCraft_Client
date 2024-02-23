import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ClearIcon, SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';
import * as taskService from '~/services/taskService';
import { searchTutorials } from '~/services/tutorialService';

function Search({ id }) {
    const inputRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const userId = localStorage.getItem('userId');

    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const result = await searchTutorials(searchValue); // Call your search service function
                setSearchResult(result);
            } catch (error) {
                console.error('Error searching tutorials:', error);
            }
        };

        if (searchValue.trim() !== '') {
            fetchSearchResults();
        } else {
            setSearchResult([]);
        }
    }, [searchValue]);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);

        inputRef.current.focus();
    };

    const renderResult = () => {
        return <h3>Search Result</h3>;
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <div className="relative flex items-center w-[400px] max-sm:hidden">
            <span className="absolute top-0 left-0 bottom-0 flex items-center justify-center px-[8px] cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                <SearchIcon />
            </span>
            <input
                type="text"
                value={searchValue}
                ref={inputRef}
                spellCheck={false}
                placeholder="Search"
                className="flex-1 py-[8px] px-[40px] h-[32px] rounded-md text-xl"
                onChange={handleChange}
                onFocus={() => setShowResult(true)}
            />
            {searchValue && (
                <span
                    className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-[8px] cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                    onClick={handleClear}
                >
                    <ClearIcon />
                </span>
            )}
            {showResult && searchResult.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md overflow-hidden mt-2 z-10">
                    {searchResult.map((tutorial) => (
                        <Link
                            to={`/tutorials/${tutorial.id}`}
                            key={tutorial.id}
                            className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-100"
                            onClick={() => setShowResult(false)}
                        >
                            <h4 className="text-lg font-medium text-gray-800">{tutorial.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{tutorial.description}</p>
                            {/* Add other tutorial details as needed */}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(Search);
