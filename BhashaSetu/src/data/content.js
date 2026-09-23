// Static content for the BhashaSetu UI.
// NOTE: Santhali (Ol Chiki) strings below are SAMPLE text used to demonstrate the UI.
// Have a native Santhali speaker verify them, or replace them with output from your real engine.

export const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

export const LANGS = {
  hi: { key: 'hi', label: 'Hindi', native: 'हिन्दी', font: 'hi' },
  sat: { key: 'sat', label: 'Santhali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', font: 'sat' },
};

export const SAMPLES = [
  {
    id: 'trees',
    hi: 'बच्चों, आज हम पेड़ के बारे में सीखेंगे।',
    sat: 'ᱦᱩᱰᱤᱧ ᱠᱚ, ᱧᱤᱫᱟᱹ ᱟᱞᱮ ᱫᱟᱨᱮ ᱵᱟᱵᱚᱛ ᱥᱤᱠᱷᱟᱣ ᱟ᱾',
    roman: 'Hudiñ kō, ñidā āle dare bābot sikhāw-a.',
    meaning: 'Children, today we will learn about trees.',
    explainHi: 'पेड़ हमें छाया, फल और साफ़ हवा देते हैं।',
  },
  {
    id: 'water',
    hi: 'पेड़ों को पानी की ज़रूरत होती है।',
    sat: 'ᱫᱟᱨᱮ ᱠᱚ ᱫᱟᱜ ᱨᱮᱭᱟᱜ ᱪᱮᱛ ᱦᱩᱭ ᱠᱟᱱᱟ᱾',
    roman: 'Dare kō dak reyāk cet huy kana.',
    meaning: 'Trees need water.',
    explainHi: 'पानी से पौधे बढ़ते हैं और हरे रहते हैं।',
  },
  {
    id: 'repeat',
    hi: 'अब सब मेरे साथ दोहराइए।',
    sat: 'ᱱᱤᱛᱚᱜ ᱥᱟᱱᱟᱢ ᱤᱧ ᱥᱟᱶᱛᱮ ᱫᱚᱦᱚᱨᱟᱣ ᱢᱮ᱾',
    roman: 'Nitog sanam iñ sāwte dohorāw me.',
    meaning: 'Now, everyone repeat with me.',
    explainHi: 'बच्चे शिक्षक के बाद एक-एक शब्द दोहराएँगे।',
  },
];

export const WORDS = [
  { id: 'tree', en: 'Tree', hi: 'पेड़', sat: 'ᱫᱟᱨᱮ', roman: 'dare' },
  { id: 'leaf', en: 'Leaf', hi: 'पत्ता', sat: 'ᱥᱟᱠᱟᱢ', roman: 'sakam' },
  { id: 'flower', en: 'Flower', hi: 'फूल', sat: 'ᱵᱟᱦᱟ', roman: 'baha' },
  { id: 'water', en: 'Water', hi: 'पानी', sat: 'ᱫᱟᱜ', roman: 'dak' },
];

export const RHYME = {
  title: 'हरा-भरा पेड़',
  lines: [
    'पेड़ हरा, पत्ता हरा,',
    'फूल खिला, पानी भरा।',
    'आओ मिलकर गाएँ हम,',
    'पेड़ लगाएँ, बढ़ाएँ हम।',
  ],
  glossary: ['tree', 'leaf', 'flower', 'water'],
};

export const TODAY_LESSON = {
  title: 'Nature Around Us',
  meta: 'Grade 1 • Lesson 04',
  desc: 'Learn about trees, plants and our environment.',
};

export const NAV = [
  { key: '/', label: 'Home', icon: 'home' },
  { key: '/live', label: 'Live Class', icon: 'mic' },
  { key: '/learn', label: 'Learn', icon: 'book' },
  { key: '/assess', label: 'Assess', icon: 'assess' },
  { key: '/progress', label: 'Progress', icon: 'progress' },
  { key: '/resources', label: 'Resources', icon: 'folder' },
  { key: '/settings', label: 'Settings', icon: 'settings' },
];

export const RESOURCES = [
  { key: 'books', title: 'Bilingual Books', desc: 'Read • Listen • Learn', tone: 'orange', to: '/learn?mode=books' },
  { key: 'rhymes', title: 'Rhymes & Poems', desc: 'Fun with Language', tone: 'teal', to: '/learn?mode=rhymes' },
  { key: 'activities', title: 'Activities', desc: 'Games • Practice', tone: 'violet', to: '/learn?mode=activities' },
  { key: 'progress', title: 'Student Progress', desc: 'Track & Support', tone: 'amber', to: '/progress' },
];

export const DOWNLOADS = [
  { id: 'b1', group: 'Bilingual Books', title: 'पेड़ और हम', sub: 'Trees and Us • 12 pages', mb: 14 },
  { id: 'b2', group: 'Bilingual Books', title: 'मेरा गाँव', sub: 'My Village • 10 pages', mb: 11 },
  { id: 'r1', group: 'Rhymes & Poems', title: 'हरा-भरा पेड़', sub: 'Rhyme with audio', mb: 6 },
  { id: 'a1', group: 'Activities', title: 'Word Match: Nature', sub: 'Picture matching game', mb: 4 },
];

export const STUDENTS = [
  { name: 'Sita Murmu', score: 86 },
  { name: 'Ravi Soren', score: 74 },
  { name: 'Mangal Hembrom', score: 92 },
  { name: 'Puja Tudu', score: 68 },
  { name: 'Sunil Kisku', score: 79 },
  { name: 'Anita Besra', score: 88 },
];

export const ANSWER_SHEET = {
  student: 'Sita Murmu',
  questions: [
    { q: 'चित्र में क्या है? (पेड़)', expected: 'पेड़', answerSat: 'ᱫᱟᱨᱮ', answerHi: 'पेड़' },
    { q: 'चित्र में क्या है? (पत्ता)', expected: 'पत्ता', answerSat: 'ᱵᱟᱦᱟ', answerHi: 'फूल' },
    { q: 'चित्र में क्या है? (पानी)', expected: 'पानी', answerSat: 'ᱫᱟᱜ', answerHi: 'पानी' },
    { q: 'चित्र में क्या है? (फूल)', expected: 'फूल', answerSat: 'ᱵᱟᱦᱟ', answerHi: 'फूल' },
    { q: 'चित्र में क्या है? (पेड़)', expected: 'पेड़', answerSat: 'ᱥᱟᱠᱟᱢ', answerHi: 'पत्ता' },
  ],
};
