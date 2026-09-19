export const guideQuestions = [
  {
    title: "Which room are you choosing for?",
    hint: "Choose one room.",
    choices: ["Living room", "Bedroom", "Entrance", "Workspace", "Dining room"],
  },
  {
    title: "How should the room feel?",
    hint: "Choose the feeling you want to return to.",
    choices: [
      "Bright & clear",
      "Soft & restful",
      "Warm & enveloping",
      "Deep & dramatic",
      "Polished & welcoming",
    ],
  },
  {
    title: "Which notes are you drawn to?",
    hint: "Choose up to two note families.",
    choices: [
      "Citrus & fresh",
      "Soft florals",
      "Amber & vanilla",
      "Spice & woods",
      "Incense & musk",
      "Spa-like calm",
    ],
    multiple: true,
  },
  {
    title: "How present should it feel?",
    hint: "Choose one level of presence.",
    choices: ["Quiet background", "Noticeable balance", "Rich presence"],
  },
  {
    title: "When will you enjoy it most?",
    hint: "Choose the time that best represents the room.",
    choices: ["Morning", "Throughout the day", "Evening", "Any time"],
  },
] as const;

export type GuideAnswers = string[][];

export const guideStages = [
  "Room",
  "Feeling",
  "Notes",
  "Presence",
  "Time",
] as const;
