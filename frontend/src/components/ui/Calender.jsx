import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ onDateSelect, selectedDate, allSubmission = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

 const submissionMap = useMemo(() => {
  const map = new Map();
  allSubmission?.forEach((sub) => {
    const dateStr = new Date(sub.createdAt).toDateString();
    map.set(dateStr, (map.get(dateStr) || 0) + 1);
  });
  return map;
}, [allSubmission]);

const getSubmissionCount = (date) => submissionMap.get(date.toDateString()) || 0;


  const calendarDays = useMemo(() => {
    const days = [];
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        isNextMonth: false,
        fullDate: new Date(currentYear, currentMonth - 1, prevMonthDays - i)
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        isNextMonth: false,
        fullDate: new Date(currentYear, currentMonth, day)
      });
    }

    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isNextMonth: true,
        fullDate: new Date(currentYear, currentMonth + 1, day)
      });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayWeekday]);

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const isToday = (date) => date.toDateString() === today.toDateString();
  const isSelected = (date) => selectedDate?.toDateString() === date.toDateString();
  const isWeekend = (date) => [0, 6].includes(date.getDay());
  const hasSubmission = (date) => submissionMap.has(date.toDateString());

  const handleDateClick = (day) => {
    if (onDateSelect) onDateSelect(day.fullDate);
  };

  return (
    <div className="bg-white dark:bg-gray-500/5 rounded-xl shadow p-4 w-full max-w-sm border border-gray-100 dark:border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => navigateMonth("prev")} className="p-1 rounded hover:bg-blue-50">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={() => navigateMonth("next")} className="p-1 rounded hover:bg-blue-50">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 text-[11px] mb-1 text-center text-gray-500 dark:text-gray-300 font-medium uppercase">
        {dayNames.map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-[2px]">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.isCurrentMonth;
          const isTodayDate = isToday(day.fullDate);
          const isSelectedDate = isSelected(day.fullDate);
          const isWeekendDate = isWeekend(day.fullDate);

          return (
          <button
  key={index}
  onClick={() => handleDateClick(day)}
  title={
    getSubmissionCount(day.fullDate) > 0
      ? `${getSubmissionCount(day.fullDate)} problem${getSubmissionCount(day.fullDate) > 1 ? 's' : ''} solved`
      : ''
  }
  className={`
    relative h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
    flex items-center justify-center
    ${!isCurrentMonth
      ? 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'
      : isTodayDate
        ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 transform hover:scale-105'
        : isSelectedDate
          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          : isWeekendDate
            ? 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
    hover:shadow-md
    ${getSubmissionCount(day.fullDate) > 0 ? 'border border-blue-500' : ''}
  `}
>
  <span className="relative z-10">{day.date}</span>

  {getSubmissionCount(day.fullDate) > 0 && (
    <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-green-500"></div>
  )}
</button>

          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t text-xs border-gray-100 dark:border-white/10 text-center text-gray-500 dark:text-white">
        Today: {today.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric"
        })}
      </div>
    </div>
  );
};

export default Calendar;
