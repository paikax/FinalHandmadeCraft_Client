import React, { useState } from 'react';

const DateOfBirthSelector = () => {
    // State to store selected date values
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // Arrays for days, months, and years
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div className="flex space-x-4">
            {/* Day Selector */}
            <div className="relative">
                <select
                    className="block w-20 py-2 pl-3 pr-10 text-base border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                >
                    <option value="">Day</option>
                    {days.map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.293 5.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 9.414V15a1 1 0 01-2 0V9.414L6.293 10.707a1 1 0 01-1.414-1.414l3-3z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Month Selector */}
            <div className="relative">
                <select
                    className="block w-32 py-2 pl-3 pr-10 text-base border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.293 5.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 9.414V15a1 1 0 01-2 0V9.414L6.293 10.707a1 1 0 01-1.414-1.414l3-3z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Year Selector */}
            <div className="relative">
                <select
                    className="block w-28 py-2 pl-3 pr-10 text-base border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="">Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.293 5.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 9.414V15a1 1 0 01-2 0V9.414L6.293 10.707a1 1 0 01-1.414-1.414l3-3z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default DateOfBirthSelector;
