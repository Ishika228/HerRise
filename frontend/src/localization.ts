import { Language } from './types';

const translations: Partial<Record<Exclude<Language, 'en'>, Record<string, string>>> = {
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
  },
  bn: {
    'Her Future. Her Finance. Her Freedom.': 'তার ভবিষ্যৎ। তার অর্থ। তার স্বাধীনতা।',
    'Fintech & Career Hub': 'ফিনটেক এবং ক্যারিয়ার হাব',
    'Home': 'হোম',
    'About Us': 'আমাদের সম্পর্কে',
    'Explore Modules': 'মডিউল এক্সপ্লোর করুন',
    'How It Works': 'এটি কীভাবে কাজ করে',
    'Success Stories': 'সাফল্যের গল্প',
    'Go to Dashboard': 'ড্যাশবোর্ডে যান',
    'Open Dashboard': 'ড্যাশবোর্ড খুলুন',
    'Log In': 'লগ ইন করুন',
    'Get Started Free': 'বিনামূল্যে শুরু করুন',
    'Language:': 'ভাষা:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'চাকরি, অনুদান, বাজেট টুল, কোর্স বা মেন্টর খুঁজুন... (Enter চাপুন)',
    'Overview': 'সংক্ষিপ্ত বিবরণ',
    'HerFinance': 'হারফাইন্যান্স',
    'HerCareer': 'হারক্যারিয়ার',
    'HerBusiness': 'হারবিজনেস',
    'HerFund': 'হারফান্ড',
    'HerMarket': 'হারমার্কেট',
    'HerLearn': 'হারলার্ন',
    'HerNetwork': 'হারনেটওয়ার্ক',
    'AI Assistant': 'এআই সহকারী',
    'My Profile': 'আমার প্রোফাইল',
    'Settings': 'সেটিংস',
    'Dashboard': 'ড্যাশবোর্ড',
    'Welcome back': 'স্বাগতম',
    'Your Dashboard': 'আপনার ড্যাশবোর্ড',
    'Quick Actions': 'দ্রুত পদক্ষেপ',
    'Recent Activity': 'সাম্প্রতিক কার্যকলাপ',
    'View All': 'সব দেখুন',
    'View Details': 'বিস্তারিত দেখুন',
    'Learn More': 'আরও জানুন',
    'Get Started': 'শুরু করুন',
    'Cancel': 'বাতিল করুন',
    'Save': 'সংরক্ষণ করুন',
    'Submit': 'জমা দিন',
    'Search': 'অনুসন্ধান করুন',
    'Loading...': 'লোড হচ্ছে...',
    'Sign In': 'সাইন ইন',
    'Sign Up': 'সাইন আপ',
    'Create Account': 'অ্যাকাউন্ট তৈরি করুন',
    'Email': 'ইমেল',
    'Password': 'পাসওয়ার্ড',
    'Full Name': 'পুরো নাম'
  },
  ta: {
    'Her Future. Her Finance. Her Freedom.': 'அவள் எதிர்காலம். அவள் நிதி. அவள் சுதந்திரம்.',
    'Fintech & Career Hub': 'ஃபின்டெக் மற்றும் தொழில் மையம்',
    'Home': 'முகப்பு',
    'About Us': 'எங்களை பற்றி',
    'Explore Modules': 'தொகுதிகளை ஆராயுங்கள்',
    'How It Works': 'இது எவ்வாறு செயல்படுகிறது',
    'Success Stories': 'வெற்றிக் கதைகள்',
    'Go to Dashboard': 'டாஷ்போர்டுக்குச் செல்லவும்',
    'Open Dashboard': 'டாஷ்போர்டைத் திறக்கவும்',
    'Log In': 'உள்நுழையவும்',
    'Get Started Free': 'இலவசமாகத் தொடங்கவும்',
    'Language:': 'மொழி:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'வேலைகள், மானியங்கள், பட்ஜெட் கருவிகள், படிப்புகள் அல்லது வழிகாட்டிகளைத் தேடுங்கள்... (Enter அழுத்தவும்)',
    'Overview': 'கண்ணோட்டம்',
    'HerFinance': 'ஹர்ஃபைனான்ஸ்',
    'HerCareer': 'ஹர்கரியர்',
    'HerBusiness': 'ஹர்பிசினஸ்',
    'HerFund': 'ஹர்ஃபண்ட்',
    'HerMarket': 'ஹர்மார்க்கெட்',
    'HerLearn': 'ஹர்லேர்ன்',
    'HerNetwork': 'ஹர்நெட்வொர்க்',
    'AI Assistant': 'AI உதவியாளர்',
    'My Profile': 'என் சுயவிவரம்',
    'Settings': 'அமைப்புகள்',
    'Dashboard': 'டாஷ்போர்டு',
    'Welcome back': 'மீண்டும் வருக',
    'Your Dashboard': 'உங்கள் டாஷ்போர்டு',
    'Quick Actions': 'விரைவான நடவடிக்கைகள்',
    'Recent Activity': 'சமீபத்திய செயல்பாடு',
    'View All': 'அனைத்தையும் காண்க',
    'View Details': 'விவரங்களைக் காண்க',
    'Learn More': 'மேலும் அறிக',
    'Get Started': 'தொடங்கவும்',
    'Cancel': 'ரத்துசெய்',
    'Save': 'சேமிக்க',
    'Submit': 'சமர்ப்பிக்க',
    'Search': 'தேடுக',
    'Loading...': 'ஏற்றுகிறது...',
    'Sign In': 'உள்நுழைய',
    'Sign Up': 'பதிவு செய்ய',
    'Create Account': 'கணக்கை உருவாக்கவும்',
    'Email': 'மின்னஞ்சல்',
    'Password': 'கடவுச்சொல்',
    'Full Name': 'முழு பெயர்'
  },
  te: {
    'Her Future. Her Finance. Her Freedom.': 'ఆమె భవిష్యత్తు. ఆమె ఆర్థికం. ఆమె స్వేచ్ఛ.',
    'Fintech & Career Hub': 'ఫిన్‌టెక్ & కెరీర్ హబ్',
    'Home': 'హోమ్',
    'About Us': 'మా గురించి',
    'Explore Modules': 'మాడ్యూల్స్ అన్వేషించండి',
    'How It Works': 'ఇది ఎలా పనిచేస్తుంది',
    'Success Stories': 'విజయ కథనాలు',
    'Go to Dashboard': 'డాష్‌బోర్డ్‌కు వెళ్లండి',
    'Open Dashboard': 'డాష్‌బోర్డ్ తెరవండి',
    'Log In': 'లాగిన్ అవ్వండి',
    'Get Started Free': 'ఉచితంగా ప్రారంభించండి',
    'Language:': 'భాష:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'ఉద్యోగాలు, గ్రాంట్లు, బడ్జెట్ టూల్స్, కోర్సులు లేదా మెంటార్లను శోధించండి... (Enter నొక్కండి)',
    'Overview': 'సమీక్ష',
    'HerFinance': 'హర్‌ఫైనాన్స్',
    'HerCareer': 'హర్‌కెరీర్',
    'HerBusiness': 'హర్‌బిజినెస్',
    'HerFund': 'హర్‌ఫండ్',
    'HerMarket': 'హర్‌మార్కెట్',
    'HerLearn': 'హర్‌లెర్న్',
    'HerNetwork': 'హర్‌నెట్‌వర్క్',
    'AI Assistant': 'AI సహాయకుడు',
    'My Profile': 'నా ప్రొఫైల్',
    'Settings': 'సెట్టింగ్‌లు',
    'Dashboard': 'డాష్‌బోర్డ్',
    'Welcome back': 'స్వాగతం',
    'Your Dashboard': 'మీ డాష్‌బోర్డ్',
    'Quick Actions': 'త్వరిత చర్యలు',
    'Recent Activity': 'ఇటీవలి కార్యాచరణ',
    'View All': 'అన్నీ చూడండి',
    'View Details': 'వివరాలు చూడండి',
    'Learn More': 'మరింత తెలుసుకోండి',
    'Get Started': 'ప్రారంభించండి',
    'Cancel': 'రద్దు చేయండి',
    'Save': 'సేవ్ చేయండి',
    'Submit': 'సమర్పించండి',
    'Search': 'శోధించండి',
    'Loading...': 'లోడ్ అవుతోంది...',
    'Sign In': 'సైన్ ఇన్',
    'Sign Up': 'సైన్ అప్',
    'Create Account': 'ఖాతాను సృష్టించండి',
    'Email': 'ఇమెయిల్',
    'Password': 'పాస్‌వర్డ్',
    'Full Name': 'పూర్తి పేరు'
  },
  gu: {
    'Her Future. Her Finance. Her Freedom.': 'તેણીનું ભવિષ્ય. તેણીનું નાણાં. તેણીની સ્વતંત્રતા.',
    'Fintech & Career Hub': 'ફિનટેક અને કારકિર્દી હબ',
    'Home': 'હોમ',
    'About Us': 'અમારા વિશે',
    'Explore Modules': 'મોડ્યુલ જુઓ',
    'How It Works': 'આ કેવી રીતે કાર્ય કરે છે',
    'Success Stories': 'સફળતાની વાર્તાઓ',
    'Go to Dashboard': 'ડેશબોર્ડ પર જાઓ',
    'Open Dashboard': 'ડેશબોર્ડ ખોલો',
    'Log In': 'લૉગ ઇન કરો',
    'Get Started Free': 'મફત શરૂ કરો',
    'Language:': 'ભાષા:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'નોકરીઓ, અનુદાન, બજેટ સાધનો, અભ્યાસક્રમો અથવા માર્ગદર્શકો શોધો... (Enter દબાવો)',
    'Overview': 'ઝાંખી',
    'HerFinance': 'હરફાઇનાન્સ',
    'HerCareer': 'હરકારકિર્દી',
    'HerBusiness': 'હરબિઝનેસ',
    'HerFund': 'હરફંડ',
    'HerMarket': 'હરમાર્કેટ',
    'HerLearn': 'હરલર્ન',
    'HerNetwork': 'હરનેટવર્ક',
    'AI Assistant': 'AI સહાયક',
    'My Profile': 'મારી પ્રોફાઇલ',
    'Settings': 'સેટિંગ્સ',
    'Dashboard': 'ડેશબોર્ડ',
    'Welcome back': 'પાછા આવવા બદલ સ્વાગત',
    'Your Dashboard': 'તમારું ડેશબોર્ડ',
    'Quick Actions': 'ઝડપી પગલાં',
    'Recent Activity': 'તાજેતરની પ્રવૃત્તિ',
    'View All': 'બધું જુઓ',
    'View Details': 'વિગતો જુઓ',
    'Learn More': 'વધુ જાણો',
    'Get Started': 'શરૂ કરો',
    'Cancel': 'રદ કરો',
    'Save': 'સાચવો',
    'Submit': 'સબમિટ કરો',
    'Search': 'શોધો',
    'Loading...': 'લોડ થઈ રહ્યું છે...',
    'Sign In': 'સાઇન ઇન',
    'Sign Up': 'સાઇન અપ',
    'Create Account': 'ખાતું બનાવો',
    'Email': 'ઇમેઇલ',
    'Password': 'પાસવર્ડ',
    'Full Name': 'પૂરું નામ'
  },
  kn: {
    'Her Future. Her Finance. Her Freedom.': 'ಅವಳ ಭವಿಷ್ಯ. ಅವಳ ಹಣಕಾಸು. ಅವಳ ಸ್ವಾತಂತ್ರ್ಯ.',
    'Fintech & Career Hub': 'ಫಿನ್‌ಟೆಕ್ ಮತ್ತು ವೃತ್ತಿ ಕೇಂದ್ರ',
    'Home': 'ಮುಖಪುಟ',
    'About Us': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'Explore Modules': 'ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'How It Works': 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    'Success Stories': 'ಯಶಸ್ಸಿನ ಕಥೆಗಳು',
    'Go to Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ',
    'Open Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
    'Log In': 'ಲಾಗಿನ್ ಆಗಿ',
    'Get Started Free': 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ',
    'Language:': 'ಭಾಷೆ:',
    'Overview': 'ಅವಲೋಕನ',
    'AI Assistant': 'AI ಸಹಾಯಕ',
    'My Profile': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    'Settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'Welcome back': 'ಮರಳಿ ಸ್ವಾಗತ',
    'Your Dashboard': 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'Quick Actions': 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    'Save': 'ಉಳಿಸಿ',
    'Cancel': 'ರದ್ದುಮಾಡಿ',
    'Submit': 'ಸಲ್ಲಿಸಿ',
    'Search': 'ಹುಡುಕಿ',
    'Sign In': 'ಸೈನ್ ಇನ್',
    'Sign Up': 'ಸೈನ್ ಅಪ್'
  },
  ml: {
    'Her Future. Her Finance. Her Freedom.': 'അവളുടെ ഭാവി. അവളുടെ ധനകാര്യം. അവളുടെ സ്വാതന്ത്ര്യം.',
    'Fintech & Career Hub': 'ഫിൻടെക് & കരിയർ ഹബ്',
    'Home': 'ഹോം',
    'About Us': 'ഞങ്ങളെക്കുറിച്ച്',
    'Explore Modules': 'മൊഡ്യൂളുകൾ പര്യവേക്ഷണം ചെയ്യുക',
    'How It Works': 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    'Success Stories': 'വിജയഗാഥകൾ',
    'Go to Dashboard': 'ഡാഷ്‌ബോർഡിലേക്ക് പോകുക',
    'Open Dashboard': 'ഡാഷ്‌ബോർഡ് തുറക്കുക',
    'Log In': 'ലോഗിൻ ചെയ്യുക',
    'Get Started Free': 'സൗജന്യമായി ആരംഭിക്കുക',
    'Language:': 'ഭാഷ:',
    'Overview': 'അവലോകനം',
    'AI Assistant': 'AI അസിസ്റ്റന്റ്',
    'My Profile': 'എന്റെ പ്രൊഫൈൽ',
    'Settings': 'ക്രമീകരണങ്ങൾ',
    'Dashboard': 'ഡാഷ്‌ബോർഡ്',
    'Welcome back': 'സ്വാഗതം',
    'Your Dashboard': 'നിങ്ങളുടെ ഡാഷ്‌ബോർഡ്',
    'Quick Actions': 'ദ്രുത നടപടികൾ',
    'Save': 'സേവ് ചെയ്യുക',
    'Cancel': 'റദ്ദാക്കുക',
    'Submit': 'സമർപ്പിക്കുക',
    'Search': 'തിരയുക',
    'Sign In': 'സൈൻ ഇൻ',
    'Sign Up': 'സൈൻ അപ്പ്'
  },
  pa: {
    'Her Future. Her Finance. Her Freedom.': 'ਉਸਦਾ ਭਵਿੱਖ। ਉਸਦਾ ਵਿੱਤ। ਉਸਦੀ ਆਜ਼ਾਦੀ।',
    'Fintech & Career Hub': 'ਫਿਨਟੈਕ ਅਤੇ ਕਰੀਅਰ ਹੱਬ',
    'Home': 'ਮੁੱਖ ਪੰਨਾ',
    'About Us': 'ਸਾਡੇ ਬਾਰੇ',
    'Explore Modules': 'ਮੌਡਿਊਲ ਦੇਖੋ',
    'How It Works': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    'Success Stories': 'ਸਫਲਤਾ ਦੀਆਂ ਕਹਾਣੀਆਂ',
    'Go to Dashboard': 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਜਾਓ',
    'Open Dashboard': 'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ',
    'Log In': 'ਲਾਗ ਇਨ ਕਰੋ',
    'Get Started Free': 'ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ',
    'Language:': 'ਭਾਸ਼ਾ:',
    'Overview': 'ਸੰਖੇਪ ਜਾਣਕਾਰੀ',
    'AI Assistant': 'AI ਸਹਾਇਕ',
    'My Profile': 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',
    'Settings': 'ਸੈਟਿੰਗਾਂ',
    'Dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'Welcome back': 'ਜੀ ਆਇਆਂ ਨੂੰ',
    'Your Dashboard': 'ਤੁਹਾਡਾ ਡੈਸ਼ਬੋਰਡ',
    'Quick Actions': 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
    'Save': 'ਸੰਭਾਲੋ',
    'Cancel': 'ਰੱਦ ਕਰੋ',
    'Submit': 'ਜਮ੍ਹਾ ਕਰੋ',
    'Search': 'ਖੋਜੋ',
    'Sign In': 'ਸਾਈਨ ਇਨ',
    'Sign Up': 'ਸਾਈਨ ਅੱਪ'
  },
  or: {
    'Her Future. Her Finance. Her Freedom.': 'ତାଙ୍କ ଭବିଷ୍ୟତ। ତାଙ୍କ ଅର୍ଥ। ତାଙ୍କ ସ୍ୱାଧୀନତା।',
    'Home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'About Us': 'ଆମ ବିଷୟରେ',
    'Explore Modules': 'ମଡ୍ୟୁଲ୍ ଦେଖନ୍ତୁ',
    'How It Works': 'ଏହା କିପରି କାਮ କରେ',
    'Success Stories': 'ସଫଳତା କାହାଣୀ',
    'Go to Dashboard': 'ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ',
    'Open Dashboard': 'ଡ୍ୟାସବୋର୍ଡ ଖୋଲନ୍ତୁ',
    'Log In': 'ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
    'Get Started Free': 'ମାଗଣାରେ ଆରମ୍ଭ କରନ୍ତୁ',
    'Language:': 'ଭାଷା:',
    'Overview': 'ସମୀକ୍ଷା',
    'AI Assistant': 'AI ସହାୟକ',
    'My Profile': 'ମୋ ପ୍ରୋଫାଇଲ୍',
    'Settings': 'ସେଟିଙ୍ଗ୍ସ',
    'Dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'Welcome back': 'ସ୍ୱାଗତ',
    'Save': 'ସାଇତନ୍ତୁ',
    'Cancel': 'ବାତିଲ କରନ୍ତୁ',
    'Submit': 'ଦାଖଲ କରନ୍ତୁ',
    'Search': 'ଖୋଜନ୍ତୁ',
    'Sign In': 'ସାଇନ୍ ଇନ୍',
    'Sign Up': 'ସାଇନ୍ ଅପ୍'
  },
  ur: {
    'Her Future. Her Finance. Her Freedom.': 'اس کا مستقبل۔ اس کا مالیات۔ اس کی آزادی۔',
    'Home': 'ہوم',
    'About Us': 'ہمارے بارے میں',
    'Explore Modules': 'ماڈیولز دیکھیں',
    'How It Works': 'یہ کیسے کام کرتا ہے',
    'Success Stories': 'کامیابی کی کہانیاں',
    'Go to Dashboard': 'ڈیش بورڈ پر جائیں',
    'Open Dashboard': 'ڈیش بورڈ کھولیں',
    'Log In': 'لاگ ان کریں',
    'Get Started Free': 'مفت شروع کریں',
    'Language:': 'زبان:',
    'Overview': 'جائزہ',
    'AI Assistant': 'اے آئی معاون',
    'My Profile': 'میرا پروفائل',
    'Settings': 'ترتیبات',
    'Dashboard': 'ڈیش بورڈ',
    'Welcome back': 'خوش آمدید',
    'Save': 'محفوظ کریں',
    'Cancel': 'منسوخ کریں',
    'Submit': 'جمع کرائیں',
    'Search': 'تلاش کریں',
    'Sign In': 'سائن ان',
    'Sign Up': 'سائن اپ'
  },
  es: {
    'Her Future. Her Finance. Her Freedom.': 'Su Futuro. Sus Finanzas. Su Libertad.',
    'Fintech & Career Hub': 'Centro de Fintech y Carreras Profesionales',
    'Home': 'Inicio',
    'About Us': 'Sobre Nosotros',
    'Explore Modules': 'Explorar Módulos',
    'How It Works': 'Cómo Funciona',
    'Success Stories': 'Casos de Éxito',
    'Go to Dashboard': 'Ir al Panel',
    'Open Dashboard': 'Abrir Panel',
    'Log In': 'Iniciar Sesión',
    'Get Started Free': 'Comenzar Gratis',
    'Language:': 'Idioma:',
    'Search jobs, grants, budget tools, courses or mentors... (Press Enter)': 'Buscar empleos, becas, presupuestos, cursos o mentores... (Presione Enter)',
    'Overview': 'Resumen',
    'HerFinance': 'HerFinance',
    'HerCareer': 'HerCareer',
    'HerBusiness': 'HerBusiness',
    'HerFund': 'HerFund',
    'HerMarket': 'HerMarket',
    'HerLearn': 'HerLearn',
    'HerNetwork': 'HerNetwork',
    'AI Assistant': 'Asistente IA',
    'My Profile': 'Mi Perfil',
    'Settings': 'Configuración',
    'Dashboard': 'Panel de Control',
    'Welcome back': 'Bienvenida de nuevo',
    'Your Dashboard': 'Tu Panel',
    'Quick Actions': 'Acciones Rápidas',
    'Recent Activity': 'Actividad Reciente',
    'View All': 'Ver Todo',
    'View Details': 'Ver Detalles',
    'Learn More': 'Más Información',
    'Get Started': 'Comenzar',
    'Cancel': 'Cancelar',
    'Save': 'Guardar',
    'Submit': 'Enviar',
    'Search': 'Buscar',
    'Loading...': 'Cargando...',
    'Sign In': 'Iniciar Sesión',
    'Sign Up': 'Registrarse',
    'Create Account': 'Crear Cuenta',
    'Email': 'Correo Electrónico',
    'Password': 'Contraseña',
    'Full Name': 'Nombre Completo'
  },
  fr: {
    'Her Future. Her Finance. Her Freedom.': 'Son Avenir. Ses Finances. Sa Liberté.',
    'Fintech & Career Hub': 'Pôle Fintech et Carrière',
    'Home': 'Accueil',
    'About Us': 'À Propos',
    'Explore Modules': 'Explorer les Modules',
    'How It Works': 'Comment Ça Marche',
    'Success Stories': 'Témoignages',
    'Go to Dashboard': 'Accéder au Tableau de Bord',
    'Open Dashboard': 'Ouvrir le Tableau de Bord',
    'Log In': 'Connexion',
    'Get Started Free': 'Commencer Gratuitement',
    'Language:': 'Langue :',
    'Overview': 'Aperçu',
    'AI Assistant': 'Assistant IA',
    'My Profile': 'Mon Profil',
    'Settings': 'Paramètres',
    'Dashboard': 'Tableau de Bord',
    'Welcome back': 'Bon retour',
    'Quick Actions': 'Actions Rapides',
    'Cancel': 'Annuler',
    'Save': 'Enregistrer',
    'Submit': 'Soumettre',
    'Search': 'Rechercher',
    'Sign In': 'Se Connecter',
    'Sign Up': "S'inscrire"
  },
  de: {
    'Her Future. Her Finance. Her Freedom.': 'Ihre Zukunft. Ihre Finanzen. Ihre Freiheit.',
    'Fintech & Career Hub': 'Fintech- & Karriere-Zentrum',
    'Home': 'Startseite',
    'About Us': 'Über Uns',
    'Explore Modules': 'Module Entdecken',
    'How It Works': 'So Funktioniert Es',
    'Success Stories': 'Erfolgsgeschichten',
    'Go to Dashboard': 'Zum Dashboard',
    'Open Dashboard': 'Dashboard Öffnen',
    'Log In': 'Anmelden',
    'Get Started Free': 'Kostenlos Starten',
    'Language:': 'Sprache:',
    'Overview': 'Übersicht',
    'AI Assistant': 'KI-Assistent',
    'My Profile': 'Mein Profil',
    'Settings': 'Einstellungen',
    'Dashboard': 'Dashboard',
    'Welcome back': 'Willkommen zurück',
    'Quick Actions': 'Schnellaktionen',
    'Cancel': 'Abbrechen',
    'Save': 'Speichern',
    'Submit': 'Absenden',
    'Search': 'Suchen',
    'Sign In': 'Anmelden',
    'Sign Up': 'Registrieren'
  },
  ar: {
    'Her Future. Her Finance. Her Freedom.': 'مستقبلها. ماليتها. حريتها.',
    'Home': 'الرئيسية',
    'About Us': 'من نحن',
    'Explore Modules': 'استكشاف الوحدات',
    'How It Works': 'كيف يعمل',
    'Success Stories': 'قصص النجاح',
    'Go to Dashboard': 'الذهاب إلى لوحة التحكم',
    'Open Dashboard': 'فتح لوحة التحكم',
    'Log In': 'تسجيل الدخول',
    'Get Started Free': 'ابدأ مجاناً',
    'Language:': 'اللغة:',
    'Overview': 'نظرة عامة',
    'AI Assistant': 'المساعد الذكي',
    'My Profile': 'ملفي الشخصي',
    'Settings': 'الإعدادات',
    'Dashboard': 'لوحة التحكم',
    'Welcome back': 'مرحباً بعودتك',
    'Quick Actions': 'إجراءات سريعة',
    'Cancel': 'إلغاء',
    'Save': 'حفظ',
    'Submit': 'إرسال',
    'Search': 'بحث',
    'Sign In': 'تسجيل الدخول',
    'Sign Up': 'إنشاء حساب'
  }
};

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

// Pre-build fast lookup map for reverse translation across all languages
const reverseTranslationMap = new Map<string, string>();
for (const langKey of Object.keys(translations)) {
  const dict = translations[langKey as Exclude<Language, 'en'>];
  if (!dict) continue;
  for (const [enKey, trVal] of Object.entries(dict)) {
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

/**
 * Programmatically synchronize Google Translate engine with selected language
 */
export function applyGoogleTranslation(targetLang: Language): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const hostname = window.location.hostname;

  if (targetLang === 'en') {
    // Clear all translation cookies across all paths and domains to return cleanly to English
    const cookies = ['googtrans', 'googtrans_en'];
    const domains = ['', hostname, `.${hostname}`];
    const paths = ['/', '', window.location.pathname];
    for (const c of cookies) {
      for (const d of domains) {
        for (const p of paths) {
          document.cookie = `${c}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;max-age=0;path=${p};${d ? `domain=${d};` : ''}`;
        }
      }
    }

    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.documentElement.removeAttribute('dir');
    if (document.body) {
      document.body.removeAttribute('dir');
    }
    document.documentElement.classList.remove('translated-ltr', 'translated-rtl');

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      if (select.value && select.value !== 'en') {
        select.value = 'en';
        select.dispatchEvent(new Event('change'));
      }
      if (select.value && select.value !== '') {
        select.value = '';
        select.dispatchEvent(new Event('change'));
      }
    }
    return;
  }

  // Set translation cookie for destination language
  document.cookie = `googtrans=/en/${targetLang};path=/;`;
  document.cookie = `googtrans=/en/${targetLang};path=/;domain=${hostname};`;
  if (hostname.includes('.')) {
    document.cookie = `googtrans=/en/${targetLang};path=/;domain=.${hostname};`;
  }

  const triggerGoogleCombo = () => {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      if (select.value !== targetLang) {
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));
      }
      return true;
    }
    return false;
  };

  if (!triggerGoogleCombo()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (triggerGoogleCombo() || attempts >= 10) {
        clearInterval(interval);
      }
    }, 250);
  }
}

export function observeLocalization(language: Language): () => void {
  if (typeof document === 'undefined') return () => undefined;

  document.documentElement.lang = language;
  applyGoogleTranslation(language);

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
