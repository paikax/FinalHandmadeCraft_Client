import React, { useState } from 'react';

function DateOfBirthPicker() {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // Define dropdown options for days, months, and years.
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

    // Handle dropdown changes and update state variables.
    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    // You can add validation logic here to ensure the selected date is valid.

    return (
        <div>
            <label>Date of Birth:</label>
            <div>
                <select value={selectedDay} onChange={handleDayChange}>
                    <option value="">Day</option>
                    {days.map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
                <select value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">Month</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
                <select value={selectedYear} onChange={handleYearChange}>
                    <option value="">Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default DateOfBirthPicker;
