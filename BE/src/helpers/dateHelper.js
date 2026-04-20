const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { env } = require("../config/env");

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = env.timezone.IST;

const getNow = () => dayjs().tz(IST);

const getISTDay = (date) => dayjs(date).tz(IST).format("YYYY-MM-DD");

const getTodayIST = () => dayjs().tz(IST).format("YYYY-MM-DD");

const getStartOfWeekIST = () => dayjs().tz(IST).startOf("week").toDate();

const getEndOfWeekIST = () => dayjs().tz(IST).endOf("week").toDate();

const getStartOfMonthIST = () => dayjs().tz(IST).startOf("month").toDate();

const toIST = (date) => dayjs(date).tz(IST);

const formatIST = (date, fmt = "DD MMM YYYY, hh:mm A") =>
  dayjs(date).tz(IST).format(fmt);

const addDays = (date, days) => dayjs(date).add(days, "day").toDate();

const isSameDayIST = (date1, date2) => {
  return (
    dayjs(date1).tz(IST).format("YYYY-MM-DD") ===
    dayjs(date2).tz(IST).format("YYYY-MM-DD")
  );
};

const getAnyMonths = (m) => dayjs().tz(IST).subtract(m, "month").toDate();

const getAnyYears = (y) => dayjs().tz(IST).subtract(y, "year").toDate();

module.exports = {
  IST,
  getTodayIST,
  getStartOfWeekIST,
  getEndOfWeekIST,
  getStartOfMonthIST,
  toIST,
  formatIST,
  addDays,
  isSameDayIST,
  getISTDay,
  getNow,
  getAnyMonths,
  getAnyYears,
};
