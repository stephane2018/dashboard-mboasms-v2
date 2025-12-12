"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle } from 'iconsax-react';
import { Button } from './ui/button';
import { format } from 'date-fns';

type CallType = 'calendar' | 'whatsapp';

interface EventData {
  date: Date;
  time: string;
  title: string;
  description: string;
}

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleCallModal = ({ isOpen, onClose }: ScheduleCallModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [callType, setCallType] = useState<CallType>('calendar');

  // Current month and year for calendar
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Previous month days to show
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => ({
      day: daysInPrevMonth - firstDay + i + 1,
      currentMonth: false,
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDay + i + 1)
    }));
    
    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
      date: new Date(currentYear, currentMonth, i + 1)
    }));
    
    // Next month days to fill the calendar
    const totalDaysShown = 42; // 6 rows of 7 days
    const nextMonthDays = Array.from(
      { length: totalDaysShown - (prevMonthDays.length + currentMonthDays.length) },
      (_, i) => ({
        day: i + 1,
        currentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i + 1)
      })
    );
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays();
  
  // Morning time slots
  const morningSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  
  // Afternoon time slots
  const afternoonSlots = ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    } else if (step === 2 && callType) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const generateGoogleCalendarLink = (eventData: EventData): string => {
    // Parse the time string (e.g., "9:00 AM") to get hours and minutes in 24-hour format
    const parseTime = (timeStr: string): { hours: number; minutes: number } => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return { hours: 0, minutes: 0 };
      
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return { hours, minutes };
    };
    
    // Create a new date object for the event date
    const eventDate = new Date(eventData.date);
    
    // Parse the time and set hours and minutes
    const { hours, minutes } = parseTime(eventData.time);
    eventDate.setHours(hours, minutes, 0, 0);
    
    // Create end time (30 minutes later)
    const endDate = new Date(eventDate.getTime() + 30 * 60000);

    // Format dates for Google Calendar
    const formatForCalendar = (date: Date): string => {
      return format(date, "yyyyMMdd'T'HHmmss");
    };
    
    const startFormatted = formatForCalendar(eventDate);
    const endFormatted = formatForCalendar(endDate);

    // Create URL parameters
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: eventData.title,
      details: eventData.description,
      dates: `${startFormatted}/${endFormatted}`,
      add: "contact@mboasms.com"
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateWhatsAppLink = (eventData: EventData): string => {
    const message = encodeURIComponent(
      `Hello! I would like to schedule a call on ${format(eventData.date, "MMMM d")} at ${eventData.time}.\n\n${eventData.title}\n${eventData.description}`
    );
    return `https://wa.me/237670424589?text=${message}`;
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const eventData: EventData = {
      date: selectedDate,
      time: selectedTime,
      title: "MboaSMS - Consultation Call",
      description: "Discussion about MboaSMS messaging services and solutions for your business."
    };

    const calendarLink = callType === "calendar" 
      ? generateGoogleCalendarLink(eventData)
      : generateWhatsAppLink(eventData);

    window.open(calendarLink, "_blank");
    
    // Close the modal and reset state
    onClose();
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setCallType('calendar');
  };

  const renderStep1 = () => (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-white">Select a Date</h2>
      
      <div className="bg-[#1E1B24] rounded-lg p-3">
        <div className="text-center mb-2">
          <h3 className="text-base font-medium text-white">
            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-white py-0.5">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isToday = day.currentMonth && day.date.getDate() === currentDate.getDate() && day.date.getMonth() === currentDate.getMonth();
            const isSelected = selectedDate && day.currentMonth && day.date.getDate() === selectedDate.getDate() && day.date.getMonth() === selectedDate.getMonth();
            const isPast = day.date < new Date(new Date().setHours(0, 0, 0, 0));
            
            return (
              <button
                key={index}
                onClick={() => !isPast && day.currentMonth && handleDateSelect(day.date)}
                disabled={isPast || !day.currentMonth}
                className={`
                  text-center py-1 rounded-md text-xs
                  ${!day.currentMonth ? 'text-gray-600' : isPast ? 'text-gray-500' : 'text-white'}
                  ${isToday ? 'bg-primary/20 font-bold' : ''}
                  ${isSelected ? 'bg-primary text-white font-bold' : ''}
                  ${!isPast && day.currentMonth && !isSelected ? 'hover:bg-gray-700' : ''}
                `}
              >
                {day.day}
              </button>
            );
          })}
        </div>
      </div>
      
      <h2 className="text-lg font-semibold text-white">Select a Time</h2>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-medium mb-1 text-white">Morning</h3>
          <div className="grid grid-cols-2 gap-2">
            {morningSlots.map((time, index) => {
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    py-1.5 px-2 rounded-md text-xs flex items-center
                    ${isSelected ? 'bg-primary text-white' : 'bg-[#1E1B24] text-white hover:bg-gray-700'}
                  `}
                >
                  <span className="mr-1.5">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {time}
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 className="text-xs font-medium mb-1 text-white">Afternoon</h3>
          <div className="grid grid-cols-2 gap-2">
            {afternoonSlots.map((time, index) => {
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    py-1.5 px-2 rounded-md text-xs flex items-center
                    ${isSelected ? 'bg-primary text-white' : 'bg-[#1E1B24] text-white hover:bg-gray-700'}
                  `}
                >
                  <span className="mr-1.5">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center text-sm"
        disabled={!selectedDate || !selectedTime}
      >
        Continue
        <svg className="w-4 h-4 ml-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-white">Selected Date & Time</h2>
        <div className="mt-2 p-3 bg-[#1E1B24] rounded-lg flex items-center">
          <svg className="w-4 h-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-white">{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''} at {selectedTime}</span>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold text-white">Select Call Type</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setCallType('calendar')}
          className={`p-3 rounded-lg border-2 flex flex-col items-center ${callType === 'calendar' ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-600'}`}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="font-medium text-white">Google Calendar</span>
          <p className="text-white text-sm mt-1">Schedule via Calendar</p>
        </button>
        
        <button
          onClick={() => setCallType('whatsapp')}
          className={`p-3 rounded-lg border-2 flex flex-col items-center ${callType === 'whatsapp' ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-600'}`}
        >
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.9 20.6C8.4 21.5 10.2 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.5 3.3 17L2.44 20.44C2.2 21.56 3.26 22.62 4.38 22.38L6.9 20.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 14.8485C16.5 15.0105 16.4639 15.177 16.3879 15.339C16.3119 15.501 16.2089 15.654 16.0789 15.798C15.8729 16.014 15.6444 16.173 15.3879 16.278C15.1359 16.383 14.8659 16.437 14.5779 16.437C14.1629 16.437 13.7209 16.338 13.2564 16.137C12.7919 15.936 12.3274 15.654 11.8674 15.291C11.4029 14.9235 10.9654 14.52 10.5504 14.0715C10.1399 13.6185 9.77238 13.1655 9.44988 12.7125C9.13188 12.2595 8.87988 11.8065 8.69388 11.358C8.50788 10.905 8.41488 10.4655 8.41488 10.0395C8.41488 9.7605 8.46388 9.4905 8.56138 9.2385C8.65888 8.982 8.81388 8.748 9.02538 8.5365C9.28188 8.2845 9.56238 8.163 9.85788 8.163C9.95988 8.163 10.0619 8.1855 10.1534 8.2305C10.2494 8.2755 10.3319 8.343 10.3954 8.442L11.3879 9.8865C11.4514 9.9765 11.4964 10.0575 11.5279 10.134C11.5594 10.2105 11.5774 10.287 11.5774 10.3545C11.5774 10.4445 11.5504 10.5345 11.4964 10.6245C11.4469 10.7145 11.3744 10.8045 11.2829 10.8945L10.9204 11.2705C10.8794 11.3115 10.8614 11.358 10.8614 11.4165C10.8614 11.4435 10.8659 11.4705 10.8749 11.502C10.8884 11.5335 10.8974 11.556 10.9024 11.574C10.9879 11.7405 11.1334 11.952 11.3429 12.2055C11.5569 12.459 11.7844 12.717 12.0299 12.975C12.2934 13.233 12.5469 13.4685 12.8049 13.6815C13.0584 13.89 13.2744 14.031 13.4469 14.1165C13.4604 14.1165 13.4784 14.1255 13.5054 14.139C13.5369 14.1525 13.5684 14.157 13.6044 14.157C13.6674 14.157 13.7164 14.1345 13.7569 14.094L14.1194 13.7355C14.2154 13.6365 14.3069 13.5645 14.3929 13.5195C14.4789 13.4655 14.5649 13.4385 14.6599 13.4385C14.7274 13.4385 14.7994 13.452 14.8794 13.4835C14.9594 13.515 15.0439 13.56 15.1334 13.6185L16.5959 14.625C16.6954 14.6925 16.7629 14.7735 16.8034 14.868C16.8394 14.9625 16.5 15.057 16.5 15.1515V14.8485Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
            </svg>
          </div>
          <span className="font-medium text-white">WhatsApp</span>
          <p className="text-white text-sm mt-1">Call via WhatsApp</p>
        </button>
      </div>
      
      <div className="bg-[#1E1B24] rounded-lg p-3">
        <h3 className="font-medium mb-2 text-white">Your Selected Date & Time</h3>
        <div className="flex items-center text-white mb-1">
          <svg className="w-4 h-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-white">{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}</span>
        </div>
        <div className="flex items-center text-white">
          <svg className="w-4 h-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white">{selectedTime}</span>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={handleBack}
          className="flex-1 bg-transparent border border-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg"
        >
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg"
          disabled={!callType}
        >
          Continue
          <svg className="w-4 h-4 ml-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center text-center py-6">
      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h2 className="text-lg font-bold mb-2 text-white">Call Scheduled!</h2>
      <p className="text-white mb-4">We&apos;ve scheduled your {callType === 'calendar' ? 'Calendar' : 'WhatsApp'} call for:</p>
      
      <div className="bg-[#1E1B24] rounded-lg p-3 mb-4 w-full">
        <div className="flex items-center justify-center text-white">
          <svg className="w-4 h-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="font-medium">{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''} at {selectedTime}</span>
        </div>
      </div>
      
      <p className="text-white mb-4">You&apos;ll receive a confirmation email with all the details and a calendar invitation.</p>
      
      <Button 
        onClick={handleConfirm}
        className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg"
      >
        Done
      </Button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-[#2D2A37] rounded-xl w-full max-w-sm overflow-hidden relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-white">Schedule a Call</h1>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <CloseCircle size="20" className="text-gray-400" />
                </button>
              </div>
              
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleCallModal;
