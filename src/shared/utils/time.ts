export const isTimeExpired = (expTimestamp: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > expTimestamp;
};

export const formatTimeSpan = (seconds: number, shortFormat = false): string => {
  if (seconds < 0) {
    return "";
  }

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const year = day * 365.25;

  let value: number;
  let unit: string;

  if (seconds < minute) {
    value = seconds;
    unit = seconds === 1 ? (shortFormat ? "s" : "second") : shortFormat ? "s" : "seconds";
  } else if (seconds < hour) {
    value = Math.floor(seconds / minute);
    unit = value === 1 ? (shortFormat ? "m" : "minute") : shortFormat ? "m" : "minutes";
  } else if (seconds < day) {
    value = Math.floor(seconds / hour);
    unit = value === 1 ? (shortFormat ? "h" : "hour") : shortFormat ? "h" : "hours";
  } else if (seconds < week) {
    value = Math.floor(seconds / day);
    unit = value === 1 ? (shortFormat ? "d" : "day") : shortFormat ? "d" : "days";
  } else if (seconds < year) {
    value = Math.floor(seconds / week);
    unit = value === 1 ? (shortFormat ? "w" : "week") : shortFormat ? "w" : "weeks";
  } else {
    value = Math.floor(seconds / year);
    unit = value === 1 ? (shortFormat ? "y" : "year") : shortFormat ? "y" : "years";
  }

  return `${value} ${unit}`;
};
