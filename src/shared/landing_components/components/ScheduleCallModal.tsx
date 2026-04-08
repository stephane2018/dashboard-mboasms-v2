"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, Calendar, Clock, ArrowRight2, ArrowLeft2, TickCircle, Whatsapp } from 'iconsax-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  const handleClose = useCallback(() => {
    onClose();
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setCallType('calendar');
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => ({
      day: daysInPrevMonth - firstDay + i + 1,
      currentMonth: false,
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDay + i + 1),
    }));

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
      date: new Date(currentYear, currentMonth, i + 1),
    }));

    const totalDaysShown = 42;
    const nextMonthDays = Array.from(
      { length: totalDaysShown - (prevMonthDays.length + currentMonthDays.length) },
      (_, i) => ({
        day: i + 1,
        currentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i + 1),
      })
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays();

  const morningSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

  const handleContinue = () => {
    if (step === 1 && selectedDate && selectedTime) setStep(2);
    else if (step === 2 && callType) setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const generateGoogleCalendarLink = (eventData: EventData): string => {
    const parseTime = (timeStr: string): { hours: number; minutes: number } => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return { hours: 0, minutes: 0 };
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const eventDate = new Date(eventData.date);
    const { hours, minutes } = parseTime(eventData.time);
    eventDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(eventDate.getTime() + 30 * 60000);

    const formatForCalendar = (date: Date): string => format(date, "yyyyMMdd'T'HHmmss");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: eventData.title,
      details: eventData.description,
      dates: `${formatForCalendar(eventDate)}/${formatForCalendar(endDate)}`,
      add: "support@mboasms.com",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateWhatsAppLink = (eventData: EventData): string => {
    const message = encodeURIComponent(
      `Bonjour! Je souhaite planifier un appel le ${format(eventData.date, "d MMMM", { locale: fr })} à ${eventData.time}.\n\n${eventData.title}\n${eventData.description}`
    );
    return `https://wa.me/237670424589?text=${message}`;
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const eventData: EventData = {
      date: selectedDate,
      time: selectedTime,
      title: "MboaSMS - Consultation Call",
      description: "Discussion about MboaSMS messaging services and solutions for your business.",
    };

    const link = callType === "calendar"
      ? generateGoogleCalendarLink(eventData)
      : generateWhatsAppLink(eventData);

    window.open(link, "_blank", "noopener,noreferrer");
    handleClose();
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
            ${step >= s
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {step > s ? (
              <TickCircle size="16" variant="Bold" color="currentColor" />
            ) : s}
          </div>
          {s < 3 && (
            <div className={`w-8 sm:w-12 h-0.5 rounded-full transition-all duration-300 ${step > s ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="flex flex-col space-y-5">
      {/* Calendar */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar size="16" variant="Bulk" color="currentColor" className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Choisissez une date</h3>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <p className="text-center text-sm font-semibold text-foreground mb-3">
            {new Date(currentYear, currentMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} className="text-center text-[10px] font-medium text-muted-foreground py-1">
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
                  onClick={() => !isPast && day.currentMonth && setSelectedDate(day.date)}
                  disabled={isPast || !day.currentMonth}
                  className={`
                    text-center py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    ${!day.currentMonth ? 'text-muted-foreground/30' : isPast ? 'text-muted-foreground/40 cursor-not-allowed' : 'text-foreground hover:bg-primary/10'}
                    ${isToday && !isSelected ? 'ring-1 ring-primary/40 font-bold' : ''}
                    ${isSelected ? 'bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary' : ''}
                  `}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock size="16" variant="Bulk" color="currentColor" className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Choisissez une heure</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Matin</p>
            <div className="grid grid-cols-3 gap-2">
              {morningSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 border
                    ${selectedTime === time
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                      : 'bg-background border-border text-foreground hover:border-primary/40 hover:bg-primary/5'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Apres-midi</p>
            <div className="grid grid-cols-3 gap-2">
              {afternoonSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 border
                    ${selectedTime === time
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                      : 'bg-background border-border text-foreground hover:border-primary/40 hover:bg-primary/5'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleContinue}
        className="w-full rounded-xl h-11 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        disabled={!selectedDate || !selectedTime}
      >
        Continuer
        <ArrowRight2 size="16" color="currentColor" className="ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col space-y-5">
      {/* Recap */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Calendar size="18" variant="Bulk" color="currentColor" className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: fr }) : ''}
          </p>
          <p className="text-xs text-muted-foreground">{selectedTime} — 30 min</p>
        </div>
      </div>

      {/* Call type selection */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Comment souhaitez-vous etre contacte ?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setCallType('calendar')}
            className={`
              group relative rounded-xl border-2 p-4 text-left transition-all duration-200
              ${callType === 'calendar'
                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200
              ${callType === 'calendar' ? 'bg-primary text-white' : 'bg-blue-500/10 text-blue-500'}
            `}>
              <Calendar size="20" variant="Bulk" color="currentColor" />
            </div>
            <p className="text-sm font-semibold text-foreground">Google Calendar</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ajoutez l&apos;evenement a votre agenda</p>
            {callType === 'calendar' && (
              <div className="absolute top-3 right-3">
                <TickCircle size="18" variant="Bold" color="currentColor" className="text-primary" />
              </div>
            )}
          </button>

          <button
            onClick={() => setCallType('whatsapp')}
            className={`
              group relative rounded-xl border-2 p-4 text-left transition-all duration-200
              ${callType === 'whatsapp'
                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200
              ${callType === 'whatsapp' ? 'bg-primary text-white' : 'bg-green-500/10 text-green-500'}
            `}>
              <Whatsapp size="20" variant="Bulk" color="currentColor" />
            </div>
            <p className="text-sm font-semibold text-foreground">WhatsApp</p>
            <p className="text-xs text-muted-foreground mt-0.5">Planifiez via WhatsApp directement</p>
            {callType === 'whatsapp' && (
              <div className="absolute top-3 right-3">
                <TickCircle size="18" variant="Bold" color="currentColor" className="text-primary" />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex-1 rounded-xl h-11 font-semibold border-border hover:border-primary/40"
        >
          <ArrowLeft2 size="16" color="currentColor" className="mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 rounded-xl h-11 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          disabled={!callType}
        >
          Continuer
          <ArrowRight2 size="16" color="currentColor" className="ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center text-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5"
      >
        <TickCircle size="32" variant="Bold" color="currentColor" className="text-emerald-500" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-foreground mb-2"
      >
        Appel planifie !
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground mb-6 max-w-xs"
      >
        Votre appel {callType === 'calendar' ? 'Google Calendar' : 'WhatsApp'} a ete planifie avec succes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full rounded-xl border border-border bg-muted/30 p-4 mb-6"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size="16" variant="Bulk" color="currentColor" className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedDate ? format(selectedDate, 'd MMM yyyy', { locale: fr }) : ''}
            </span>
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <Clock size="16" variant="Bulk" color="currentColor" className="text-primary" />
            <span className="text-sm font-medium text-foreground">{selectedTime}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 w-full"
      >
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex-1 rounded-xl h-11 font-semibold border-border hover:border-primary/40"
        >
          <ArrowLeft2 size="16" color="currentColor" className="mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1 rounded-xl h-11 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          {callType === 'calendar' ? (
            <>
              <Calendar size="16" variant="Bulk" color="currentColor" className="mr-2" />
              Ouvrir l&apos;agenda
            </>
          ) : (
            <>
              <Whatsapp size="16" variant="Bulk" color="currentColor" className="mr-2" />
              Ouvrir WhatsApp
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl border border-border/50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className="h-1 bg-linear-to-r from-primary via-purple-500 to-fuchsia-500 rounded-t-2xl sm:rounded-t-2xl" />

            {/* Mobile drag indicator */}
            <div className="sm:hidden flex justify-center pt-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            <div className="p-5 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h1 className="text-lg font-bold text-foreground">Planifier un appel</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step === 1 && 'Choisissez une date et une heure'}
                    {step === 2 && 'Selectionnez le type d\'appel'}
                    {step === 3 && 'Confirmation de votre rendez-vous'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Fermer"
                >
                  <CloseCircle size="20" variant="Bulk" color="currentColor" className="text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>

              <StepIndicator />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleCallModal;
