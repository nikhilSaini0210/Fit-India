const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { env } = require("../config/env");

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = env.timezone.IST;

const formatDate = (date) => dayjs(date).tz(IST).format("YYYY-MM-DD");

const calculateStreak = (dates = []) => {
  if (!dates.length) {
    return {
      current: 0,
      longest: 0,
    };
  }

  const unique = [...new Set(dates.map((d) => formatDate(d)))].sort(
    (a, b) => dayjs(a).tz(IST).valueOf() - dayjs(b).tz(IST).valueOf(),
  );

  let longestStreak = 1;
  let currentStreak = 1;
  let tempStreak = 1;

  const today = dayjs().tz(IST).format("YYYY-MM-DD");
  const yesterday = dayjs().tz(IST).subtract(1, "day").format("YYYY-MM-DD");

  for (let i = 0; i < unique.length; i++) {
    const prev = dayjs(unique[i - 1]).tz(IST);
    const curr = dayjs(unique[i]).tz(IST);
    const diff = curr.diff(prev, "day");

    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const lastDate = unique[unique.length - 1];
  if (lastDate !== today && lastDate !== yesterday) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
    for (let i = unique.length - 1; i > 0; i--) {
      const curr = dayjs(unique[i]).tz(IST);
      const prev = dayjs(unique[i - 1]).tz(IST);
      if (curr.diff(prev, "day") === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak),
  };
};

const hasLoggedToday = (dates = []) => {
  const today = dayjs().tz(IST).format("YYYY-MM-DD");

  return dates.some((d) => formatDate(d) === today);
};

module.exports = { calculateStreak, hasLoggedToday };
