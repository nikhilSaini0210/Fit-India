const MESSAGE_TEMPLATES = {
  morning: (user, meals) => {
    const breakfast = meals?.meals?.breakfast?.name || "a healthy breakfast";
    return `🌅 Good morning ${user.name}! Today's breakfast: *${breakfast}*.\n\n💧 Start with 2 glasses of water.\n\nYour full plan is ready in the FitIndia app! 💪`;
  },
  afternoon: (user, meal) => {
    const lunch = meals?.meals?.lunch?.name || "a nutritious lunch";
    return `☀️ Lunch time, ${user.name}! Today's lunch: *${lunch}*.\n\nStay hydrated and eat mindfully. You're doing great! 🥗`;
  },
  evening: (user) => {
    return `🌆 Evening reminder, ${user.name}!\n\nTime for your workout 🏋️ Don't skip it — consistency is key!\n\nOpen FitIndia to see today's workout plan. 💪🔥`;
  },
};

module.exports = MESSAGE_TEMPLATES;