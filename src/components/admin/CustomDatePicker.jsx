import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ label, selectedDate, setSelectedDate }) => {
  return (
    <div>
      <label style={{ color: "#071251", marginBottom: "5px", display: "block" }}>
        {label}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        className="custom-datepicker"
        style={{
          borderColor: "#071251",
          padding: "8px",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default CustomDatePicker;
