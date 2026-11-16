import { Language } from './types';

const translations: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  hi: {
    'Her Future. Her Finance. Her Freedom.': 'उसका भविष्य। उसका वित्त। उसकी स्वतंत्रता।',
    'Fintech & Career Hub': 'वित्तीय तकनीक और करियर केंद्र',
    'Home': 'होम',
    'About Us': 'हमारे बारे में',
    'Explore Modules': 'मॉड्यूल देखें',
    'How It Works': 'यह कैसे काम करता है',
    'Success Stories': 'सफलता की कहानियाँ',
    'Go to Dashboard': 'डैशबोर्ड पर जाएँ',
    'Open Dashboard': 'डैशबोर्ड खोलें',
    'Log In': 'लॉग इन करें',
    'Get Started Free': 'निःशुल्क शुरू करें',
    'Language:': 'भाषा:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'नौकरियाँ, अनुदान, बजट टूल, पाठ्यक्रम या मेंटर खोजें... (Enter दबाएँ)',
    'Toggle navigation menu': 'नेविगेशन मेनू टॉगल करें',
    'Overview': 'अवलोकन',
    'HerFinance': 'हरफाइनेंस',
    'HerCareer': 'हरकरियर',
    'HerBusiness': 'हरबिज़नेस',
    'HerFund': 'हरफंड',
    'HerMarket': 'हरमार्केट',
    'HerLearn': 'हरलर्न',
    'HerNetwork': 'हरनेटवर्क',
    'AI Assistant': 'एआई सहायक',
    'My Profile': 'मेरी प्रोफ़ाइल',
    'Settings': 'सेटिंग्स',
    'Main Website': 'मुख्य वेबसाइट',
    'Modules & Platform': 'मॉड्यूल और प्लेटफ़ॉर्म',
    'Account & Preferences': 'खाता और प्राथमिकताएँ',
    'Expand sidebar': 'साइडबार फैलाएँ',
    'Collapse sidebar': 'साइडबार संक्षिप्त करें',
    'Return to Main Website': 'मुख्य वेबसाइट पर लौटें',
    'Platform Preferences & Settings': 'प्लेटफ़ॉर्म प्राथमिकताएँ और सेटिंग्स',
    'Configure language, notification alerts, and data privacy': 'भाषा, सूचना अलर्ट और डेटा गोपनीयता कॉन्फ़िगर करें',
    'Platform Language Selection': 'प्लेटफ़ॉर्म की भाषा चुनें',
    'Standard Interface & Resources': 'मानक इंटरफ़ेस और संसाधन',
    'हिंदी अनुवाद व संसाधन': 'हिंदी अनुवाद और संसाधन',
    'मराठी भाषा व मार्गदर्शक': 'मराठी भाषा और मार्गदर्शिकाएँ',
    'Active': 'सक्रिय',
    'Localized': 'स्थानीयकृत',
    'Notification Alerts': 'सूचना अलर्ट',
    'Weekly Financial Health Digest': 'साप्ताहिक वित्तीय स्थिति सारांश',
    'Receive a summary of budget spending vs emergency savings.': 'बजट खर्च और आपातकालीन बचत का सारांश पाएँ।',
    'Live Workshop & Masterclass Reminders': 'लाइव कार्यशाला और मास्टरक्लास रिमाइंडर',
    'Calendar ping 1 hour before scheduled mentorship events.': 'निर्धारित मेंटरशिप कार्यक्रम से 1 घंटे पहले कैलेंडर सूचना पाएँ।',
    'Funding & Grant Application Deadlines': 'फंडिंग और अनुदान आवेदन की समय-सीमाएँ',
    'Alerts for women entrepreneurship cohorts closing soon.': 'जल्द बंद होने वाले महिला उद्यमिता कार्यक्रमों के अलर्ट पाएँ।',
    'Privacy & Security': 'गोपनीयता और सुरक्षा',
    'Allow Verified Mentors to View Profile': 'सत्यापित मेंटर्स को प्रोफ़ाइल देखने दें',
    'Enables priority matching during career returnship reviews.': 'करियर में वापसी की समीक्षा के दौरान प्राथमिकता मिलान सक्षम करता है।',
    'Save Preferences': 'प्राथमिकताएँ सहेजें',
    'Reset Demo Data': 'डेमो डेटा रीसेट करें',
    'Preferences Saved': 'प्राथमिकताएँ सहेजी गईं',
    'Your notification and privacy settings are updated': 'आपकी सूचना और गोपनीयता सेटिंग्स अपडेट हो गई हैं',
    'Language Updated': 'भाषा अपडेट हो गई',
    'Demo Data Reset': 'डेमो डेटा रीसेट हो गया',
    'Dashboard': 'डैशबोर्ड',
    'Welcome back': 'वापसी पर स्वागत है',
    'Your Dashboard': 'आपका डैशबोर्ड',
    'Quick Actions': 'त्वरित कार्रवाइयाँ',
    'Recent Activity': 'हाल की गतिविधि',
    'View All': 'सभी देखें',
    'View Details': 'विवरण देखें',
    'Learn More': 'और जानें',
    'Get Started': 'शुरू करें',
    'Continue': 'जारी रखें',
    'Cancel': 'रद्द करें',
    'Save': 'सहेजें',
    'Submit': 'जमा करें',
    'Search': 'खोजें',
    'Loading...': 'लोड हो रहा है...',
    'No results found': 'कोई परिणाम नहीं मिला',
    'Back': 'वापस',
    'Next': 'आगे',
    'Close': 'बंद करें',
    'Edit': 'संपादित करें',
    'Delete': 'हटाएँ',
    'View': 'देखें',
    'Profile': 'प्रोफ़ाइल',
    'Notifications': 'सूचनाएँ',
    'Welcome to HerRise': 'HerRise में आपका स्वागत है',
    'Create Account': 'खाता बनाएँ',
    'Already have an account?': 'क्या आपका पहले से खाता है?',
    'Don’t have an account?': 'क्या आपका खाता नहीं है?',
    "Don't have an account?": 'क्या आपका खाता नहीं है?',
    'Email': 'ईमेल',
    'Password': 'पासवर्ड',
    'Full Name': 'पूरा नाम',
    'Phone Number': 'फ़ोन नंबर',
    'Forgot Password?': 'पासवर्ड भूल गईं?',
    'Sign In': 'साइन इन करें',
    'Sign Up': 'साइन अप करें',
    'Dashboard Overview': 'डैशबोर्ड अवलोकन',
    'Financial Overview': 'वित्तीय अवलोकन',
    'Career Overview': 'करियर अवलोकन',
    'Business Overview': 'व्यवसाय अवलोकन',
    'Funding Opportunities': 'फंडिंग के अवसर',
    'Explore Courses': 'पाठ्यक्रम देखें',
    'Find a Mentor': 'मेंटर खोजें',
    'Find Jobs': 'नौकरियाँ खोजें',
    'Build Your Resume': 'अपना रिज़्यूमे बनाएँ',
    'Track Applications': 'आवेदनों को ट्रैक करें',
    'My Savings Goals': 'मेरे बचत लक्ष्य',
    'Monthly Budget': 'मासिक बजट',
    'Total Savings': 'कुल बचत',
    'Recent Transactions': 'हाल के लेन-देन',
    'Add Transaction': 'लेन-देन जोड़ें',
    'Create Budget': 'बजट बनाएँ',
    'Create Goal': 'लक्ष्य बनाएँ',
    'Start Learning': 'सीखना शुरू करें',
    'Browse Marketplace': 'मार्केटप्लेस देखें',
    'Join Community': 'समुदाय से जुड़ें',
    'Upcoming Events': 'आगामी कार्यक्रम',
    'Recommended for You': 'आपके लिए सुझाव',
    'My Applications': 'मेरे आवेदन',
    'My Courses': 'मेरे पाठ्यक्रम',
    'My Business': 'मेरा व्यवसाय',
    'Explore Grants': 'अनुदान देखें',
    'Get AI Advice': 'एआई सलाह पाएँ',
    'Tell us about yourself': 'अपने बारे में बताएँ',
    'Choose your language': 'अपनी भाषा चुनें',
    'English': 'अंग्रेज़ी',
    'Hindi': 'हिंदी',
    'Marathi': 'मराठी'
  },
  mr: {
    'Her Future. Her Finance. Her Freedom.': 'तिचे भविष्य. तिचे अर्थविश्व. तिचे स्वातंत्र्य.',
    'Fintech & Career Hub': 'फिनटेक आणि करिअर केंद्र',
    'Home': 'मुख्यपृष्ठ',
    'About Us': 'आमच्याबद्दल',
    'Explore Modules': 'विभाग पाहा',
    'How It Works': 'हे कसे कार्य करते',
    'Success Stories': 'यशोगाथा',
    'Go to Dashboard': 'डॅशबोर्डवर जा',
    'Open Dashboard': 'डॅशबोर्ड उघडा',
    'Log In': 'लॉग इन करा',
    'Get Started Free': 'मोफत सुरुवात करा',
    'Language:': 'भाषा:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'नोकऱ्या, अनुदाने, बजेट साधने, अभ्यासक्रम किंवा मार्गदर्शक शोधा... (Enter दाबा)',
    'Toggle navigation menu': 'नेव्हिगेशन मेनू बदला',
    'Overview': 'आढावा',
    'HerFinance': 'हरफायनान्स',
    'HerCareer': 'हरकरिअर',
    'HerBusiness': 'हरबिझनेस',
    'HerFund': 'हरफंड',
    'HerMarket': 'हरमार्केट',
    'HerLearn': 'हरलर्न',
    'HerNetwork': 'हरनेटवर्क',
    'AI Assistant': 'एआय सहाय्यक',
    'My Profile': 'माझे प्रोफाइल',
    'Settings': 'सेटिंग्ज',
    'Main Website': 'मुख्य वेबसाइट',
    'Modules & Platform': 'विभाग आणि प्लॅटफॉर्म',
    'Account & Preferences': 'खाते आणि प्राधान्ये',
    'Expand sidebar': 'साइडबार विस्तृत करा',
    'Collapse sidebar': 'साइडबार संक्षिप्त करा',
    'Return to Main Website': 'मुख्य वेबसाइटवर परत जा',
    'Platform Preferences & Settings': 'प्लॅटफॉर्म प्राधान्ये आणि सेटिंग्ज',
    'Configure language, notification alerts, and data privacy': 'भाषा, सूचना आणि डेटा गोपनीयता सेट करा',
    'Platform Language Selection': 'प्लॅटफॉर्मची भाषा निवडा',
    'Standard Interface & Resources': 'मानक इंटरफेस आणि संसाधने',
    'हिंदी अनुवाद व संसाधन': 'हिंदी अनुवाद आणि संसाधने',
    'मराठी भाषा व मार्गदर्शक': 'मराठी भाषा आणि मार्गदर्शक',
    'Active': 'सक्रिय',
    'Localized': 'स्थानिकीकृत',
    'Notification Alerts': 'सूचना',
    'Weekly Financial Health Digest': 'साप्ताहिक आर्थिक स्थितीचा सारांश',
    'Receive a summary of budget spending vs emergency savings.': 'बजेट खर्च आणि आपत्कालीन बचतीचा सारांश मिळवा.',
    'Live Workshop & Masterclass Reminders': 'थेट कार्यशाळा आणि मास्टरक्लास स्मरणपत्रे',
    'Calendar ping 1 hour before scheduled mentorship events.': 'नियोजित मार्गदर्शन सत्राच्या 1 तास आधी सूचना मिळवा.',
    'Funding & Grant Application Deadlines': 'निधी आणि अनुदान अर्जाच्या अंतिम मुदती',
    'Alerts for women entrepreneurship cohorts closing soon.': 'लवकरच बंद होणाऱ्या महिला उद्योजकता कार्यक्रमांच्या सूचना मिळवा.',
    'Privacy & Security': 'गोपनीयता आणि सुरक्षा',
    'Allow Verified Mentors to View Profile': 'सत्यापित मार्गदर्शकांना प्रोफाइल पाहण्याची परवानगी द्या',
    'Enables priority matching during career returnship reviews.': 'करिअरमध्ये पुनरागमनाच्या पुनरावलोकनात प्राधान्य जुळवणी सक्षम करते.',
    'Save Preferences': 'प्राधान्ये जतन करा',
    'Reset Demo Data': 'डेमो डेटा रीसेट करा',
    'Preferences Saved': 'प्राधान्ये जतन झाली',
    'Your notification and privacy settings are updated': 'तुमची सूचना आणि गोपनीयता सेटिंग्ज अद्ययावत झाली',
    'Language Updated': 'भाषा अद्ययावत झाली',
    'Demo Data Reset': 'डेमो डेटा रीसेट झाला',
    'Dashboard': 'डॅशबोर्ड',
    'Welcome back': 'पुन्हा स्वागत आहे',
    'Your Dashboard': 'तुमचा डॅशबोर्ड',
    'Quick Actions': 'जलद कृती',
    'Recent Activity': 'अलीकडील हालचाली',
    'View All': 'सर्व पाहा',
    'View Details': 'तपशील पाहा',
    'Learn More': 'अधिक जाणून घ्या',
    'Get Started': 'सुरुवात करा',
    'Continue': 'पुढे सुरू ठेवा',
    'Cancel': 'रद्द करा',
    'Save': 'जतन करा',
    'Submit': 'सबमिट करा',
    'Search': 'शोधा',
    'Loading...': 'लोड होत आहे...',
    'No results found': 'कोणतेही परिणाम सापडले नाहीत',
    'Back': 'मागे',
    'Next': 'पुढे',
    'Close': 'बंद करा',
    'Edit': 'संपादित करा',
    'Delete': 'हटवा',
    'View': 'पाहा',
    'Profile': 'प्रोफाइल',
    'Notifications': 'सूचना',
    'Welcome to HerRise': 'HerRise मध्ये तुमचे स्वागत आहे',
    'Create Account': 'खाते तयार करा',
    'Already have an account?': 'तुमचे खाते आधीच आहे का?',
    'Don’t have an account?': 'तुमचे खाते नाही का?',
    "Don't have an account?": 'तुमचे खाते नाही का?',
    'Email': 'ईमेल',
    'Password': 'पासवर्ड',
    'Full Name': 'पूर्ण नाव',
    'Phone Number': 'फोन नंबर',
    'Forgot Password?': 'पासवर्ड विसरलात?',
    'Sign In': 'साइन इन करा',
    'Sign Up': 'साइन अप करा',
    'Dashboard Overview': 'डॅशबोर्डचा आढावा',
    'Financial Overview': 'आर्थिक आढावा',
    'Career Overview': 'करिअरचा आढावा',
    'Business Overview': 'व्यवसायाचा आढावा',
    'Funding Opportunities': 'निधीच्या संधी',
    'Explore Courses': 'अभ्यासक्रम पाहा',
    'Find a Mentor': 'मार्गदर्शक शोधा',
    'Find Jobs': 'नोकऱ्या शोधा',
    'Build Your Resume': 'तुमचा बायोडेटा तयार करा',
    'Track Applications': 'अर्जांचा मागोवा घ्या',
    'My Savings Goals': 'माझी बचतीची उद्दिष्टे',
    'Monthly Budget': 'मासिक बजेट',
    'Total Savings': 'एकूण बचत',
    'Recent Transactions': 'अलीकडील व्यवहार',
    'Add Transaction': 'व्यवहार जोडा',
    'Create Budget': 'बजेट तयार करा',
    'Create Goal': 'उद्दिष्ट तयार करा',
    'Start Learning': 'शिकायला सुरुवात करा',
    'Browse Marketplace': 'मार्केटप्लेस पाहा',
    'Join Community': 'समुदायात सामील व्हा',
    'Upcoming Events': 'आगामी कार्यक्रम',
    'Recommended for You': 'तुमच्यासाठी शिफारस',
    'My Applications': 'माझे अर्ज',
    'My Courses': 'माझे अभ्यासक्रम',
    'My Business': 'माझा व्यवसाय',
    'Explore Grants': 'अनुदाने पाहा',
    'Get AI Advice': 'एआय सल्ला घ्या',
    'Tell us about yourself': 'तुमच्याबद्दल सांगा',
    'Choose your language': 'तुमची भाषा निवडा',
    'English': 'इंग्रजी',
    'Hindi': 'हिंदी',
    'Marathi': 'मराठी'
  }
};

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

// Pre-build fast lookup map for reverse translation
const reverseTranslationMap = new Map<string, string>();
for (const lang of ['hi', 'mr'] as const) {
  for (const [enKey, trVal] of Object.entries(translations[lang])) {
    reverseTranslationMap.set(normalize(trVal), enKey);
  }
}

function englishSource(value: string): string {
  const key = normalize(value);
  return reverseTranslationMap.get(key) || value;
}

export function translateText(value: string, language: Language): string {
  if (language === 'en') return value;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  const source = englishSource(value);
  const translated = translations[language]?.[normalize(source)];
  return translated ? `${leading}${translated}${trailing}` : value;
}

function localizeNode(node: Node, language: Language): void {
  if (language === 'en') return;

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (text && text.trim().length > 0) {
      const translated = translateText(text, language);
      if (translated !== text) {
        node.textContent = translated;
      }
    }
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as Element;

  // Never traverse into SVG, Canvas, or chart elements to prevent ResizeObserver infinite loops
  const tag = element.tagName.toLowerCase();
  if (
    tag === 'svg' ||
    tag === 'canvas' ||
    tag === 'script' ||
    tag === 'style' ||
    element.classList.contains('recharts-responsive-container') ||
    element.closest('.recharts-responsive-container')
  ) {
    return;
  }

  for (const attribute of ['placeholder', 'title', 'aria-label', 'alt']) {
    const value = element.getAttribute(attribute);
    if (value) {
      const translated = translateText(value, language);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
  }

  for (const child of Array.from(element.childNodes)) {
    localizeNode(child, language);
  }
}

let isMutating = false;

export function observeLocalization(language: Language): () => void {
  if (typeof document === 'undefined') return () => undefined;

  document.documentElement.lang = language;
  if (language === 'en') {
    return () => undefined;
  }

  isMutating = true;
  try {
    localizeNode(document.body, language);
  } finally {
    isMutating = false;
  }

  const observer = new MutationObserver((records) => {
    if (isMutating) return;
    isMutating = true;
    try {
      for (const record of records) {
        if (record.type === 'characterData' && record.target) {
          localizeNode(record.target, language);
        } else if (record.type === 'childList') {
          for (const node of Array.from(record.addedNodes)) {
            localizeNode(node, language);
          }
        } else if (record.type === 'attributes' && record.target) {
          localizeNode(record.target, language);
        }
      }
    } finally {
      isMutating = false;
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
    characterData: true,
    childList: true,
    subtree: true
  });

  return () => observer.disconnect();
}
