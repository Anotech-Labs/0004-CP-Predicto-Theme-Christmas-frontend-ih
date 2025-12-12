import React, { useMemo } from "react";
import VerticalPicker from "./VerticalPicker";
import { Box } from "@mui/material";

const DatePickerBody = ({ year, month, day, daysInMonth, setYear, setMonth, setDay }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Generate year options from 5 years ago up to current year
  const yearOptions = useMemo(() => {
    const startYear = currentYear - 5;
    return [0, ...Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)];
  }, [currentYear]);

  // Generate month options only up to the current month if it's the current year
  const monthOptions = useMemo(() => {
    const maxMonth = year === currentYear ? currentMonth : 12;
    return [0, ...Array.from({ length: maxMonth }, (_, i) => i + 1)];
  }, [year, currentYear, currentMonth]);

  // Generate day options based on selected year and month
  const dayOptions = useMemo(() => {
    if (!daysInMonth || !daysInMonth.length) return [0];

    if (year === currentYear && month === currentMonth) {
      return [0, ...Array.from({ length: currentDay }, (_, i) => i + 1)];
    }
    return [0, ...Array.from({ length: daysInMonth.length }, (_, i) => i + 1)];
  }, [year, month, currentYear, currentMonth, currentDay, daysInMonth]);

  // Handle month change to ensure valid date
  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    const maxDays =
      year === currentYear && newMonth === currentMonth
        ? currentDay
        : new Date(year, newMonth, 0).getDate();

    if (day > maxDays) {
      setDay(maxDays);
    }
  };

  // Handle year change to ensure valid date
  const handleYearChange = (newYear) => {
    setYear(newYear);

    // If switching to current year, adjust month and day limits
    if (newYear === currentYear) {
      if (month > currentMonth) {
        setMonth(currentMonth);
      }
      if (day > currentDay) {
        setDay(currentDay);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        backgroundColor: "#232626", // Updated background color
      }}
    >
      <VerticalPicker initialValue={year} onChange={handleYearChange} options={yearOptions} />
      <VerticalPicker initialValue={month} onChange={handleMonthChange} options={monthOptions} />
      <VerticalPicker initialValue={day} onChange={setDay} options={dayOptions} />
    </Box>
  );
};

export default DatePickerBody;