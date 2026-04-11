import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const currentYear = new Date().getFullYear();
const fromYear = 1900;
const toYear = currentYear;

function YearMonthForm({ date, onChange }) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [];
  for (let i = fromYear; i <= toYear; i++) {
    years.push(i);
  }

  const handleChange = (e) => {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption flex items-center space-x-2">
      <select
        name="month"
        onChange={handleChange}
        value={date.getMonth()}
        className="border p-1 rounded"
      >
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select
        name="year"
        onChange={handleChange}
        value={date.getFullYear()}
        className="border p-1 rounded"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </form>
  );
}

export const ChildBirthDatePicker = ({ kid, handleInputChange, setIsPickerOpen }) => {
  if (!kid) {
    console.error("Kid prop is missing!");
    return null;
  }
  console.log(kid)
  const handleDateChange = (date) => {
    handleInputChange(kid.id, "dateOfBirth", date);
    setIsPickerOpen(false);
  };

  return (
    <div className="relative">
      <DayPicker
        mode="single"
        selected={kid.dateOfBirth}
        onSelect={handleDateChange}
        captionLayout="dropdown"
        components={{
          Caption: YearMonthForm, // Use custom YearMonthForm for dropdowns
        }}
      />
    </div>
  );
};

export const NormalBirthDatePicker = ({ setPersonInfo,personInfo, setIsPickerOpen }) => {

    const handleDateChange = (date) => {
      setPersonInfo(prevState => ({
        ...prevState,
        dateOfBirth: date,
      }));
      setIsPickerOpen(false);
    };
  
    return (
      <div className="relative">
        <DayPicker
          mode="single"
          selected={personInfo.dateOfBirth}
          onSelect={handleDateChange}
          captionLayout="dropdown"
          components={{
            Caption: YearMonthForm, // Use custom YearMonthForm for dropdowns
          }}
        />
      </div>
    );
  };

  export default ChildBirthDatePicker;
