import { GovernmentLink, GovernmentLevel } from '../types/index';

/**
 * State & Union Territory Translations across languages
 */
export const STATE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Tamil Nadu': {
    ta: 'தமிழ்நாடு',
    hi: 'तमिलनाडु',
    te: 'తమిళనాడు',
    kn: 'ತಮಿಳುನಾಡು',
    ml: 'തമിഴ്നാട്',
    bn: 'তামিলনাড়ু',
    mr: 'तमिळनाडू',
    gu: 'તમિલનાડુ',
  },
  'Andhra Pradesh': {
    ta: 'ஆந்திரப் பிரதேசம்',
    hi: 'आंध्र प्रदेश',
    te: 'ఆంధ్ర ప్రదేశ్',
    kn: 'ಆಂಧ್ರ ಪ್ರದೇಶ',
    ml: 'ആന്ധ്രാപ്രദേശ്',
    bn: 'অন্ধ্রপ্রদেশ',
    mr: 'आंध्र प्रदेश',
    gu: 'આંધ્ર પ્રદેશ',
  },
  'Arunachal Pradesh': {
    ta: 'அருணாச்சலப் பிரதேசம்',
    hi: 'अरुणाचल प्रदेश',
    te: 'అరుణాచల్ ప్రదేశ్',
    kn: 'ಅರುಣಾಚಲ ಪ್ರದೇಶ',
    ml: 'അരുണാചൽ പ്രദേശ്',
  },
  'Assam': {
    ta: 'அசாம்',
    hi: 'असम',
    te: 'అస్సాం',
    as: 'অসম',
    bn: 'আসাম',
  },
  'Bihar': {
    ta: 'பீகார்',
    hi: 'बिहार',
    te: 'బీహార్',
    bn: 'বিহার',
  },
  'Chhattisgarh': {
    ta: 'சத்தீஸ்கர்',
    hi: 'छत्तीसगढ़',
    te: 'ఛత్తీస్‌గఢ్',
  },
  'Goa': {
    ta: 'கோவா',
    hi: 'गोवा',
    te: 'గోవా',
    kok: 'गोंय',
  },
  'Gujarat': {
    ta: 'குஜராத்',
    hi: 'गुजरात',
    te: 'గుజరాత్',
    gu: 'ગુજરાત',
  },
  'Haryana': {
    ta: 'ஹரியானா',
    hi: 'हरियाणा',
    te: 'హర్యానా',
  },
  'Himachal Pradesh': {
    ta: 'இமாச்சலப் பிரதேசம்',
    hi: 'हिमाचल प्रदेश',
    te: 'హిమాచల్ ప్రదేశ్',
  },
  'Jharkhand': {
    ta: 'ஜார்க்கண்ட்',
    hi: 'झारखंड',
    te: 'జార్ఖండ్',
  },
  'Karnataka': {
    ta: 'கர்நாடகா',
    hi: 'कर्नाटक',
    te: 'కర్ణాటక',
    kn: 'ಕರ್ನಾಟಕ',
    ml: 'കർണാടക',
  },
  'Kerala': {
    ta: 'கேரளா',
    hi: 'केरल',
    te: 'కేరళ',
    ml: 'കേരളം',
    kn: 'ಕೇರಳ',
  },
  'Madhya Pradesh': {
    ta: 'மத்தியப் பிரதேசம்',
    hi: 'मध्य प्रदेश',
    te: 'మధ్యప్రదేశ్',
  },
  'Maharashtra': {
    ta: 'மகாராஷ்டிரா',
    hi: 'महाराष्ट्र',
    te: 'మహారాష్ట్ర',
    mr: 'महाराष्ट्र',
  },
  'Manipur': {
    ta: 'மணிப்பூர்',
    hi: 'मणिपुर',
    te: 'మణిపూర్',
    mni: 'মণিপুর',
  },
  'Meghalaya': {
    ta: 'மேகாலயா',
    hi: 'मेघालय',
    te: 'మేఘాలయ',
  },
  'Mizoram': {
    ta: 'மிசோரம்',
    hi: 'मिजोरम',
    te: 'మిజోరం',
  },
  'Nagaland': {
    ta: 'நாகாலாந்து',
    hi: 'नागालैंड',
    te: 'నాగాలాండ్',
  },
  'Odisha': {
    ta: 'ஒடிசா',
    hi: 'ओडिशा',
    te: 'ఒడిశా',
    or: 'ଓଡ଼ିଶା',
  },
  'Punjab': {
    ta: 'பஞ்சாப்',
    hi: 'पंजाब',
    te: 'పంజాబ్',
    pa: 'ਪੰਜਾਬ',
  },
  'Rajasthan': {
    ta: 'ராஜஸ்தான்',
    hi: 'राजस्थान',
    te: 'రాజస్థాన్',
  },
  'Sikkim': {
    ta: 'சிக்கிம்',
    hi: 'सिक्किम',
    te: 'సిక్కిం',
  },
  'Telangana': {
    ta: 'தெலங்கானா',
    hi: 'तेलंगाना',
    te: 'తెలంగాణ',
  },
  'Tripura': {
    ta: 'திரிபுரா',
    hi: 'त्रिपुरा',
    te: 'త్రిపుర',
  },
  'Uttar Pradesh': {
    ta: 'உத்தரப் பிரதேசம்',
    hi: 'उत्तर प्रदेश',
    te: 'ఉత్తరప్రదేశ్',
    ur: 'اتر پردیش',
  },
  'Uttarakhand': {
    ta: 'உத்தரகாண்ட்',
    hi: 'उत्तराखंड',
    te: 'ఉత్తరాఖండ్',
  },
  'West Bengal': {
    ta: 'மேற்கு வங்கம்',
    hi: 'पश्चिम बंगाल',
    te: 'పశ్చిమ బెంగాల్',
    bn: 'পশ্চিমবঙ্গ',
  },
  'Andaman and Nicobar Islands': {
    ta: 'அந்தமான் மற்றும் நிக்கோபார் தீவுகள்',
    hi: 'अंडमान और निकोबार द्वीप समूह',
    te: 'అండమాన్ మరియు నికోబార్ దీవులు',
  },
  'Chandigarh': {
    ta: 'சண்டிகர்',
    hi: 'चंडीगढ़',
    te: 'చండీగఢ్',
    pa: 'ਚੰਡੀਗੜ੍ਹ',
  },
  'Dadra and Nagar Haveli and Daman and Diu': {
    ta: 'தாத்ரா & நகர் ஹவேலி மற்றும் தாமன் & தியூ',
    hi: 'दादरा और नगर हवेली और दमन और दीव',
    te: 'దాద్రా మరియు నగర్ హవేలీ మరియు డామన్ మరియు డయ్యూ',
    gu: 'દાદરા અને નગર હવેલી અને દમણ અને દીવ',
  },
  'Delhi (NCT)': {
    ta: 'தில்லி (தேசிய தலைநகர் பிரதேசம்)',
    hi: 'दिल्ली (राष्ट्रीय राजधानी क्षेत्र)',
    te: 'ఢిల్లీ (ఎన్‌సీటీ)',
    ur: 'دہلی',
  },
  'Jammu and Kashmir': {
    ta: 'ஜம்மு & காஷ்மீர்',
    hi: 'जम्मू और कश्मीर',
    te: 'జమ్మూ కాశ్మీర్',
    ur: 'جموں و کشمیر',
    ks: 'جۆم تہٕ کٔشیٖر',
  },
  'Ladakh': {
    ta: 'லடாக்',
    hi: 'लद्दाख',
    te: 'లడఖ్',
  },
  'Lakshadweep': {
    ta: 'லட்சத்தீவு',
    hi: 'लक्षद्वीप',
    te: 'లక్షద్వీప్',
    ml: 'ലക്ഷദ്വീപ്',
  },
  'Puducherry': {
    ta: 'புதுச்சேரி',
    hi: 'पुडुचेरी',
    te: 'పుదుచ్చేరి',
    ml: 'പുതുച്ചേരി',
  },
};

/**
 * Category Translations
 */
export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'National gateway (direct portal)': {
    ta: 'தேசிய முதன்மை நுழைவு வாயில்',
    hi: 'राष्ट्रीय मुख्य पोर्टल',
    te: 'జాతీయ ప్రధాన పోర్టల్',
  },
  'Government directory (direct portal)': {
    ta: 'அரசு இணையதள வழிகாட்டி',
    hi: 'सरकारी वेब निर्देशिका',
    te: 'ప్రభుత్వ డైరెక్టరీ',
  },
  'Citizen services (direct portal)': {
    ta: 'குடிமக்கள் சேவைகள்',
    hi: 'नागरिक सेवाएं',
    te: 'పౌర సేవలు',
  },
  'Citizen Information': {
    ta: 'குடிமக்கள் தகவல் & சேவைகள்',
    hi: 'नागरिक सूचना एवं सेवाएं',
    te: 'పౌర సమాచారం',
  },
  'Government Directory': {
    ta: 'அரசு இணையதளங்கள் வழிகாட்டி',
    hi: 'सरकारी निर्देशिका',
    te: 'ప్రభుత్వ డైరెక్టరీ',
  },
  'Identity services (direct portal)': {
    ta: 'அடையாள அட்டை சேவைகள் (ஆதார் / வாக்காளர்)',
    hi: 'पहचान सेवाएं (आधार / वोटर)',
    te: 'గుర్తింపు సేవలు',
  },
  'Passport and travel (direct portal)': {
    ta: 'கடவுச்சீட்டு மற்றும் விசா சேவைகள்',
    hi: 'पासपोर्ट एवं यात्रा सेवाएं',
    te: 'పాస్‌పోర్ట్ మరియు ప్రయాణం',
  },
  'Digital public services (direct portal)': {
    ta: 'டிஜிட்டல் பொதுச் சேவைகள்',
    hi: 'डिजिटल सार्वजनिक सेवाएं',
    te: 'డిజిటల్ పబ్లిక్ సర్వీసెస్',
  },
  'Digital documents (direct portal)': {
    ta: 'டிஜிட்டல் ஆவணப் பெட்டகம் (DigiLocker)',
    hi: 'डिजिटल दस्तावेज (डिजीलॉकर)',
    te: 'డిజిటల్ డాక్యుమెంట్లు',
  },
  'Education policy (direct portal)': {
    ta: 'கல்வி கொள்கை மற்றும் மேலாண்மை',
    hi: 'शिक्षा नीति एवं प्रबंधन',
    te: 'విద్యా విధానం',
  },
  'Higher education (direct portal)': {
    ta: 'உயர்கல்வி மற்றும் பல்கலைக்கழகங்கள்',
    hi: 'उच्च शिक्षा एवं विश्वविद्यालय',
    te: 'ఉన్నత విద్య',
  },
  'Technical education (direct portal)': {
    ta: 'தொழில்நுட்பக் கல்வி (AICTE)',
    hi: 'तकनीकी शिक्षा',
    te: 'సాంకేతిక విద్య',
  },
  'School education / exams (direct portal)': {
    ta: 'பள்ளிக் கல்வி மற்றும் பொதுத்தேர்வுகள்',
    hi: 'स्कूली शिक्षा एवं बोर्ड परीक्षाएं',
    te: 'పాఠశాల విద్య / పరీక్షలు',
  },
  'Entrance examinations (direct portal)': {
    ta: 'தேசிய நுழைவுத் தேர்வுகள் (NTA)',
    hi: 'प्रवेश परीक्षाएं (एनटीए)',
    te: 'ప్రవేశ పరీక్షలు',
  },
  'Scholarships (direct portal)': {
    ta: 'அரசு உதவித்தொகைகள் (NSP)',
    hi: 'छात्रवृत्ति पोर्टल',
    te: 'స్కాలర్‌షిప్‌లు',
  },
  'Employment (direct portal)': {
    ta: 'வேலைவாய்ப்பு மற்றும் தொழில் சேவைகள்',
    hi: 'रोजगार एवं करियर सेवाएं',
    te: 'ఉపాధి సేవలు',
  },
  'Recruitment (direct portal)': {
    ta: 'அரசுப் பணியாளர் தேர்வு (UPSC / SSC)',
    hi: 'भर्ती एवं चयन आयोग',
    te: 'ఉద్యోగ నియామకాలు',
  },
  'Recruitment / examinations (direct portal)': {
    ta: 'பணியாளர் தேர்வு மற்றும் தேர்வுகள்',
    hi: 'भर्ती एवं परीक्षाएं',
    te: 'నియామక పరీక్షలు',
  },
  'Defence recruitment (direct portal)': {
    ta: 'பாதுகாப்புப் படை தேர்வு (ராணுவம்/கடற்படை)',
    hi: 'रक्षा भर्ती (सेना/नौसेना/वायुसेना)',
    te: 'రక్షణ దళాల నియామకం',
  },
  'Taxation (direct portal)': {
    ta: 'வருமான வரி & வரி சேவைகள்',
    hi: 'आयकर एवं प्रत्यक्ष कर',
    te: 'ఆదాయపు పన్ను సేవలు',
  },
  'Taxation / GST (direct portal)': {
    ta: 'சரக்கு மற்றும் சேவை வரி (GST)',
    hi: 'वस्तु एवं सेवा कर (जीएसटी)',
    te: 'జీఎస్టీ పోర్టల్',
  },
  'Transport / vehicle services (direct portal)': {
    ta: 'வாகனப் பதிவு மற்றும் ஓட்டுநர் உரிமம்',
    hi: 'वाहन एवं ड्राइविंग लाइसेंस सेवाएं',
    te: 'రవాణా / వాహన సేవలు',
  },
  'Transport / driving licence (direct portal)': {
    ta: 'ஓட்டுநர் உரிமம் மற்றும் போக்குவரத்து',
    hi: 'ड्राइविंग लाइसेंस एवं परिवहन',
    te: 'డ్రైవింగ్ లైసెన్స్ సేవలు',
  },
  'Rail transport (direct portal)': {
    ta: 'இந்திய ரயில்வே & டிக்கெட் முன்பதிவு',
    hi: 'भारतीय रेलवे एवं टिकट बुकिंग',
    te: 'రైల్వే రవాణా సేవలు',
  },
  'Agriculture / farmer welfare (direct portal)': {
    ta: 'விவசாயம் மற்றும் உழவர் நலன் (PM-Kisan)',
    hi: 'कृषि एवं किसान कल्याण',
    te: 'వ్యవసాయం / రైతు సంక్షేమం',
  },
  'Agriculture / farmer benefits (direct portal)': {
    ta: 'விவசாயிகள் நலத்திட்ட உதவிகள்',
    hi: 'किसान लाभ एवं अनुदान',
    te: 'రైతు పథకాలు',
  },
  'Health / family welfare (direct portal)': {
    ta: 'சுகாதாரம் மற்றும் குடும்ப நலன் (ஆயுஷ்மான்)',
    hi: 'स्वास्थ्य एवं परिवार कल्याण',
    te: 'ఆరోగ్యం మరియు కుటుంబ సంక్షేమం',
  },
  'Judiciary (direct portal)': {
    ta: 'நீதித்துறை மற்றும் மின்-நீதிமன்றங்கள்',
    hi: 'न्यायपालिका एवं ई-कोर्ट',
    te: 'న్యాయవ్యవస్థ / ఈ-కోర్టులు',
  },
  'Consumer protection (direct portal)': {
    ta: 'நுகர்வோர் பாதுகாப்பு & குறைதீர்ப்பு',
    hi: 'उपभोक्ता संरक्षण एवं शिकायत निवारण',
    te: 'వినియోగదారుల రక్షణ',
  },
  'State/UT main government portal': {
    ta: 'மாநில / யூனியன் பிரதேச அதிகாரப்பூர்வ தலைமை தளம்',
    hi: 'राज्य / केंद्र शासित प्रदेश मुख्य सरकारी पोर्टल',
    te: 'రాష్ట్ర / యుటి అధికారిక ప్రధాన పోర్టల్',
  },
  'Land records (direct portal)': {
    ta: 'நில ஆவணங்கள், பட்டா / சிட்டா மற்றும் வில்லங்கச் சான்று',
    hi: 'भूमि अभिलेख, खसरा, खतौनी एवं रजिस्ट्री',
    te: 'భూ రికార్డులు / పట్టాదారు పాస్‌బుక్',
  },
  'e-Governance (direct portal)': {
    ta: 'மின்-ஆளுகை குடிமக்கள் சேவைகள்',
    hi: 'ई-गवर्नेंस नागरिक सेवाएं',
    te: 'ఈ-గవర్నెన్స్ సేవలు',
  },
  'Registration / revenue (direct portal)': {
    ta: 'பத்திரப்பதிவு மற்றும் வருவாய்த்துறை',
    hi: 'पंजीकरण एवं राजस्व विभाग',
    te: 'రిజిస్ట్రేషన్ మరియు రెవెన్యూ',
  },
  'Social welfare / pensions (direct portal)': {
    ta: 'சமூக நலம் மற்றும் முதியோர் ஓய்வூதியம்',
    hi: 'समाज कल्याण एवं पेंशन योजनाएं',
    te: 'సాంఘిక సంక్షేమం / పెన్షన్లు',
  },
};

/**
 * Direct tailored descriptions for well-known portals in Tamil, Hindi, Telugu
 */
const SPECIFIC_PORTAL_TRANSLATIONS: Record<
  string,
  {
    ta?: { name?: string; description?: string; uses?: string[] };
    hi?: { name?: string; description?: string; uses?: string[] };
    te?: { name?: string; description?: string; uses?: string[] };
  }
> = {
  // National Portal
  'https://www.india.gov.in/': {
    ta: {
      name: 'இந்தியாவின் தேசிய போர்டல்',
      description:
        'இந்திய அரசின் அதிகாரப்பூர்வ முதன்மை நுழைவு தளம். அனைத்து அமைச்சகங்கள், துறைகள், மக்கள் நலத்திட்டங்கள் மற்றும் பொதுச் சேவைகளை ஒருங்கிணைக்கிறது.',
      uses: ['அரசு தகவல்களை கண்டறியுங்கள்', 'மக்கள் நலத்திட்டங்களை அறிந்து கொள்ளுங்கள்', 'தேசிய வளங்களை அணுகுங்கள்'],
    },
    hi: {
      name: 'भारत का राष्ट्रीय पोर्टल',
      description:
        'भारत सरकार का मुख्य नागरिक पोर्टल जो सार्वजनिक सेवाओं, योजनाओं, मंत्रालयों, विभागों और आधिकारिक संसाधनों की जानकारी एकत्र करता है।',
      uses: ['सरकारी जानकारी प्राप्त करें', 'योजनाओं एवं सेवाओं की खोज करें', 'राष्ट्रीय संसाधनों का उपयोग करें'],
    },
  },
  // UIDAI Aadhaar
  'https://uidai.gov.in/': {
    ta: {
      name: 'இந்திய தனித்துவ அடையாள ஆணையம் (ஆதார்)',
      description:
        'ஆதார் எண் பதிவு, இணையவழி ஆதார் பதிவிறக்கம், முகவரி திருத்தம், பயோமெட்ரிக் பூட்டு மற்றும் ஆதார் சரிபார்ப்புக்கான அதிகாரப்பூர்வ தளம்.',
      uses: ['இ-ஆதார் கார்டு பதிவிறக்கம் செய்ய', 'முகவரியை புதுப்பிக்க', 'ஆதார் சரிபார்ப்பு மற்றும் இணைப்புகள்'],
    },
    hi: {
      name: 'भारतीय विशिष्ट पहचान प्राधिकरण (आधार - UIDAI)',
      description:
        'आधार नामांकन, ई-आधार डाउनलोड, पता अद्यतन, बायोमेट्रिक लॉक और सत्यापन के लिए आधिकारिक केंद्र सरकार का पोर्टल।',
      uses: ['ई-आधार डाउनलोड करें', 'पता और विवरण अपडेट करें', 'आधार स्थिति और सत्यापन जांचें'],
    },
  },
  // DigiLocker
  'https://www.digilocker.gov.in/': {
    ta: {
      name: 'டிஜிலாக்கர் (DigiLocker)',
      description:
        'டிஜிட்டல் இந்தியா திட்டத்தின் கீழ் உங்கள் சான்றிதழ்கள், ஓட்டுநர் உரிமம், வாகன ஆவணங்கள் மற்றும் கல்வி சான்றிதழ்களை பாதுகாப்பாக சேமித்து அணுகும் அதிகாரப்பூர்வ தளம்.',
      uses: ['அரசு சான்றிதழ்களை டிஜிட்டல் வடிவில் பெற', 'ஓட்டுநர் உரிமம் மற்றும் வாகன சான்றுகள் சேமிக்க', 'காகிதமில்லா சரிபார்ப்பு'],
    },
    hi: {
      name: 'डिजिलॉकर (DigiLocker)',
      description:
        'डिजिटल इंडिया के अंतर्गत अपने ड्राइविंग लाइसेंस, वाहन आरसी, शैक्षणिक अंकपत्र और सरकारी प्रमाण पत्रों को डिजिटल रूप में सुरक्षित रखने का पोर्टल।',
      uses: ['डिजिटल प्रमाण पत्र जारी करवाएं', 'दस्तावेजों को सुरक्षित रखें', 'कागजरहित सत्यापन साझा करें'],
    },
  },
  // Passport Seva
  'https://www.passportindia.gov.in/': {
    ta: {
      name: 'பாஸ்போர்ட் சேவா (Passport Seva)',
      description:
        'புதிய பாஸ்போர்ட் விண்ணப்பம், புதுப்பித்தல், நேர்காணல் நேரம் முன்பதிவு மற்றும் பாஸ்போர்ட் விண்ணப்ப நிலையை அறியும் அதிகாரப்பூர்வ தளம்.',
      uses: ['புதிய பாஸ்போர்ட்டிற்கு விண்ணப்பிக்க', 'நேர்காணல் நேரம் முன்பதிவு செய்ய', 'விண்ணப்ப நிலையை அறிய'],
    },
    hi: {
      name: 'पासपोर्ट सेवा (Passport Seva)',
      description:
        'विदेश मंत्रालय का आधिकारिक पोर्टल जहां नए पासपोर्ट के लिए आवेदन, नवीनीकरण, अपॉइंटमेंट बुकिंग और स्थिति की जांच की जा सकती है।',
      uses: ['पासपोर्ट के लिए आवेदन करें', 'अपॉइंटमेंट स्लॉट बुक करें', 'आवेदन की स्थिति ट्रैक करें'],
    },
  },
  // Parivahan
  'https://parivahan.gov.in/': {
    ta: {
      name: 'பரிவாஹன் சேவா (Parivahan Sewa)',
      description:
        'மத்திய சாலைப் போக்குவரத்து அமைச்சகத்தின் ஓட்டுநர் உரிமம் (DL), வாகனப் பதிவு (RC), வாகன வரி செலுத்துதல் மற்றும் தேசிய அனுமதிச் சீட்டுகளுக்கான தளம்.',
      uses: ['ஓட்டுநர் உரிமத்திற்கு விண்ணப்பிக்க', 'வாகனப் பதிவு மற்றும் உரிமையாளர் விவரங்கள் அறிய', 'வாகன வரி மற்றும் சலான் செலுத்த'],
    },
    hi: {
      name: 'परिवहन सेवा (Parivahan Sewa)',
      description:
        'सड़क परिवहन और राजमार्ग मंत्रालय का आधिकारिक पोर्टल: ड्राइविंग लाइसेंस (सारथी), वाहन पंजीकरण (वाहन), टैक्स भुगतान एवं ई-चालान।',
      uses: ['ड्राइविंग लाइसेंस बनवाएं या रिन्यू करें', 'वाहन पंजीकरण स्थिति देखें', 'ई-चालान भरें'],
    },
  },
  // Income Tax
  'https://www.incometax.gov.in/': {
    ta: {
      name: 'வருமான வரி இ-தாக்கல் தளம் (Income Tax e-Filing)',
      description:
        'வருமான வரி கணக்கு தாக்கல் (ITR), உடனடி பான் கார்டு விண்ணப்பம், வரி செலுத்துதல் மற்றும் பணத்திருப்பு நிலையை சரிபார்க்கும் நேரடி தளம்.',
      uses: ['வருமான வரி கணக்கு (ITR) தாக்கல் செய்ய', 'உடனடி பான் கார்டு பெற', 'பான் - ஆதார் இணைப்பு சரிபார்க்க'],
    },
    hi: {
      name: 'आयकर ई-फाइलिंग पोर्टल',
      description:
        'आयकर रिटर्न (आईटीआर) दाखिल करने, तत्काल ई-पैन बनवाने, टैक्स भुगतान करने और रिफंड स्थिति जांचने का आधिकारिक पोर्टल।',
      uses: ['इनकम टैक्स रिटर्न फाइल करें', 'इंस्टेंट ई-पैन कार्ड प्राप्त करें', 'पैन-आधार लिंक करें'],
    },
  },
  // GST Portal
  'https://www.gst.gov.in/': {
    ta: {
      name: 'சரக்கு மற்றும் சேவை வரி தளம் (GST Portal)',
      description:
        'வணிகங்களுக்கான ஜிஎஸ்டி பதிவு, மாதந்தோறும் வரி கணக்கு தாக்கல், வரி செலுத்துதல் மற்றும் ஜிஎஸ்டிஐஎன் சரிபார்ப்புக்கான அதிகாரப்பூர்வ தளம்.',
      uses: ['ஜிஎஸ்டி பதிவு செய்ய', 'ஜிஎஸ்டி கணக்குகளை தாக்கல் செய்ய', 'வரி சலான் உருவாக்க'],
    },
    hi: {
      name: 'जीएसटी पोर्टल (GST Portal)',
      description:
        'वस्तु एवं सेवा कर के अंतर्गत नए व्यापार पंजीकरण, मासिक/वार्षिक रिटर्न दाखिल करने, चालान भुगतान और टैक्स क्रेडिट प्रबंधन का पोर्टल।',
      uses: ['नया जीएसटी रजिस्ट्रेशन करें', 'जीएसटी रिटर्न दाखिल करें', 'कर चालान भुगतान करें'],
    },
  },
  // PM Kisan
  'https://pmkisan.gov.in/': {
    ta: {
      name: 'பிஎம் கிசான் சம்மான் நிதி (PM-Kisan)',
      description:
        'இந்திய விவசாயிகளுக்கு ஆண்டுதோறும் ரூ. 6000 நிதியுதவி வழங்கும் திட்டத்திற்கான பதிவு, இ-கேஒய்சி மற்றும் தவணை விவரங்களை சரிபார்க்கும் தளம்.',
      uses: ['விவசாயி புதிய பதிவு செய்ய', 'இ-கேஒய்சி புதுப்பிக்க', 'தவணைத் தொகை நிலையை சரிபார்க்க'],
    },
    hi: {
      name: 'पीएम किसान सम्मान निधि',
      description:
        'किसानों को प्रत्यक्ष आर्थिक सहायता प्रदान करने वाली योजना का आधिकारिक पोर्टल: ई-केवाईसी, नई किसान प्रविष्टि और किस्त की स्थिति।',
      uses: ['किसान लाभार्थी स्थिति देखें', 'ई-केवाईसी पूरा करें', 'नया किसान पंजीकरण करें'],
    },
  },
  // National Scholarship Portal
  'https://scholarships.gov.in/': {
    ta: {
      name: 'தேசிய உதவித்தொகை தளம் (NSP)',
      description:
        'மத்திய மற்றும் மாநில அரசுகளின் அனைத்து பள்ளி, கல்லூரி மற்றும் உயர் கல்வி உதவித்தொகை திட்டங்களுக்கு விண்ணப்பிக்கும் ஒருங்கிணைந்த தளம்.',
      uses: ['உதவித்தொகைக்கு ஆன்லைனில் விண்ணப்பிக்க', 'விண்ணப்ப நிலையை அறிய', 'புதுப்பித்தல் விண்ணப்பம் சமர்ப்பிக்க'],
    },
    hi: {
      name: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)',
      description:
        'केंद्र और राज्य सरकारों की विभिन्न छात्रवृत्ति योजनाओं के लिए एकल मंच: ऑनलाइन आवेदन, संस्था सत्यापन और डीबीटी स्थिति।',
      uses: ['छात्रवृत्ति के लिए आवेदन करें', 'आवेदन की स्थिति ट्रैक करें', 'नवीनीकरण आवेदन करें'],
    },
  },
  // Tamil Nadu e-Sevai
  'https://www.tnesevai.tn.gov.in/': {
    ta: {
      name: 'தமிழ்நாடு இ-சேவை இணையதளம்',
      description:
        'வருவாய்த்துறை சான்றிதழ்கள் (வருமானம், ஜாதி, இருப்பிடம்), முதல் பட்டதாரி சான்று மற்றும் பல்வேறு அரசு நலத்திட்டங்களுக்கு ஆன்லைனில் விண்ணப்பிக்கும் நேரடி தளம்.',
      uses: ['சாதி, வருமானம், இருப்பிட சான்றிதழ் பெற', 'விண்ணப்ப நிலையை அறிய', 'சான்றிதழ்களை பதிவிறக்கம் செய்ய'],
    },
    hi: {
      name: 'तमिलनाडु ई-सेवई पोर्टल',
      description:
        'तमिलनाडु सरकार का नागरिक सेवा पोर्टल: आय, जाति, निवास प्रमाण पत्र, राजस्व सेवाएं एवं विभिन्न सरकारी कल्याणकारी सेवाएं।',
      uses: ['सरकारी प्रमाण पत्रों के लिए आवेदन करें', 'आवेदन की स्थिति जांचें', 'प्रमाण पत्र डाउनलोड करें'],
    },
  },
  // Tamil Nadu Patta Chitta
  'https://eservices.tn.gov.in/eservicesnew/index.html': {
    ta: {
      name: 'தமிழ்நாடு பட்டா / சிட்டா & நில ஆவணங்கள்',
      description:
        'தமிழ்நாடு நில ஆவணங்கள், பட்டா, சிட்டா, புல வரைபடம் (FMB) மற்றும் அரசு புறம்போக்கு நில விவரங்களை இலவசமாக பார்வையிட்டு பதிவிறக்கும் அதிகாரப்பூர்வ தளம்.',
      uses: ['பட்டா மற்றும் சிட்டா பார்வையிட / பதிவிறக்க', 'புல வரைபடம் (FMB) காண', 'அங்கீகரிக்கப்பட்ட பட்டா விவரங்களை சரிபார்க்க'],
    },
    hi: {
      name: 'तमिलनाडु पट्टा / चिट्टा एवं भूमि रिकॉर्ड',
      description:
        'तमिलनाडु सरकार का आधिकारिक भूमि रिकॉर्ड पोर्टल: पट्टा, चिट्टा, एफएमबी स्केच और भूमि संबंधी विवरण ऑनलाइन देखें एवं डाउनलोड करें।',
      uses: ['पट्टा एवं चिट्टा डाउनलोड करें', 'एफएमबी स्केच देखें', 'भूमि सत्यापन करें'],
    },
  },
  // Tamil Nadu TNREGINET
  'https://tnreginet.gov.in/': {
    ta: {
      name: 'தமிழ்நாடு பதிவுத்துறை (TNREGINET)',
      description:
        'சொத்து பதிவு, வில்லங்கச் சான்றிதழ் (EC) தேடல் மற்றும் பதிவிறக்கம், வழிகாட்டி மதிப்பு (Guideline Value), பிறப்பு/இறப்பு மற்றும் திருமண பதிவு தளம்.',
      uses: ['வில்லங்கச் சான்று (EC) பெற', 'வழிகாட்டி மதிப்பு (Guideline Value) அறிய', 'பத்திரப் பதிவுக்கு முன்பதிவு செய்ய'],
    },
    hi: {
      name: 'तमिलनाडु पंजीकरण विभाग (TNREGINET)',
      description:
        'संपत्ति पंजीकरण, भारमुक्त प्रमाण पत्र (ईसी), दिशानिर्देश मूल्य (गाइडलाइन वैल्यू), विवाह और विलेख खोज के लिए तमिलनाडु का आधिकारिक पोर्टल।',
      uses: ['एनकम्ब्रन्स सर्टिफिकेट (ईसी) डाउनलोड करें', 'गाइडलाइन मूल्य जांचें', 'दस्तावेज पंजीकरण अपॉइंटमेंट लें'],
    },
  },
};

/**
 * Smart translator for link descriptions
 */
export function getTranslatedDescription(link: GovernmentLink, lang: string): string {
  if (!lang || lang === 'en') {
    return link.description;
  }

  // 1. Check exact URL or ID match in specific dictionary
  const cleanUrl = link.url ? link.url.trim().replace(/\/+$/, '') : '';
  for (const [keyUrl, trans] of Object.entries(SPECIFIC_PORTAL_TRANSLATIONS)) {
    const cleanKey = keyUrl.trim().replace(/\/+$/, '');
    if (cleanUrl === cleanKey || cleanUrl.includes(cleanKey.replace(/^https?:\/\//, ''))) {
      const match = (trans as any)[lang];
      if (match?.description) {
        return match.description;
      }
    }
  }

  // 2. State & Category based smart contextual description
  const stateName = link.stateOrUT || '';
  const transState = stateName ? getTranslatedState(stateName, lang) : '';
  const cat = link.category || '';
  const transCat = getTranslatedCategory(cat, lang);

  if (lang === 'ta') {
    if (link.governmentLevel === 'central') {
      if (cat.toLowerCase().includes('identity') || cat.toLowerCase().includes('aadhaar')) {
        return `இந்திய அரசின் அதிகாரப்பூர்வ அடையாள அட்டை மற்றும் குடிமக்கள் சரிபார்ப்பு தளம்.`;
      }
      if (cat.toLowerCase().includes('tax') || cat.toLowerCase().includes('gst')) {
        return `இந்திய அரசின் வரி நிர்வாகம், கணக்கு தாக்கல் மற்றும் நிதி சேவைகளுக்கான அதிகாரப்பூர்வ தளம்.`;
      }
      if (cat.toLowerCase().includes('transport') || cat.toLowerCase().includes('vehicle')) {
        return `மத்திய சாலைப் போக்குவரத்து மற்றும் வாகன சேவைகளுக்கான தேசிய அதிகாரப்பூர்வ தளம்.`;
      }
      if (cat.toLowerCase().includes('education') || cat.toLowerCase().includes('scholarship')) {
        return `இந்திய அரசின் தேசிய கல்வி கொள்கை, தேர்வுகள் மற்றும் மாணவர் உதவித்தொகை போர்டல்.`;
      }
      if (cat.toLowerCase().includes('health')) {
        return `இந்திய சுகாதார அமைச்சகத்தின் தேசிய மருத்துவ நலத்திட்டங்கள் மற்றும் பொதுச் சேவை தளம்.`;
      }
      if (cat.toLowerCase().includes('recruitment') || cat.toLowerCase().includes('employment')) {
        return `மத்திய அரசு பணியாளர் தேர்வு ஆணையம் மற்றும் வேலைவாய்ப்பு அறிவிப்புகளுக்கான அதிகாரப்பூர்வ தளம்.`;
      }
      if (cat.toLowerCase().includes('judiciary') || cat.toLowerCase().includes('court')) {
        return `இந்திய நீதிமன்றங்கள், வழக்கு நிலவரம் மற்றும் சட்ட சேவைகளுக்கான அதிகாரப்பூர்வ மின்-நீதிமன்ற தளம்.`;
      }
      return `${link.name} - இந்திய மத்திய அரசின் அதிகாரப்பூர்வ தளம் (${transCat}). பொது மக்கள் மற்றும் குடிமக்களுக்கான நேரடி இணைய சேவைகள்.`;
    } else {
      // State / UT level
      const place = transState || 'மாநில';
      if (cat.toLowerCase().includes('land') || link.name.toLowerCase().includes('land') || link.name.toLowerCase().includes('patta')) {
        return `${place} அரசின் அதிகாரப்பூர்வ நில ஆவணங்கள், பட்டா, சிட்டா மற்றும் நிலப் பதிவு சேவைகள் தளம்.`;
      }
      if (cat.toLowerCase().includes('citizen') || cat.toLowerCase().includes('esevai') || cat.toLowerCase().includes('e-governance')) {
        return `${place} அரசின் அனைத்து குடிமக்கள் நலத்திட்டங்கள் மற்றும் சான்றிதழ் சேவைகளுக்கான அதிகாரப்பூர்வ மின்-சேவை தளம்.`;
      }
      if (cat.toLowerCase().includes('registration') || cat.toLowerCase().includes('revenue')) {
        return `${place} பதிவு மற்றும் வருவாய்த்துறை: சொத்து விவரங்கள், வழிகாட்டி மதிப்பு மற்றும் வில்லங்கச் சான்று சேவைகள்.`;
      }
      if (cat.toLowerCase().includes('transport')) {
        return `${place} போக்குவரத்துத் துறை: ஓட்டுநர் உரிமம் மற்றும் வாகனச் சான்றுகளுக்கான அதிகாரப்பூர்வ இணையதளம்.`;
      }
      return `${link.name} - ${place} அரசின் அதிகாரப்பூர்வ இணையதளம் (${transCat}). துறையின் நேரடி சேவைகள் மற்றும் மக்கள் பயன்பாட்டுக்கான தளம்.`;
    }
  }

  if (lang === 'hi') {
    if (link.governmentLevel === 'central') {
      if (cat.toLowerCase().includes('identity') || cat.toLowerCase().includes('aadhaar')) {
        return `भारत सरकार का आधिकारिक पहचान पत्र एवं नागरिक सत्यापन पोर्टल।`;
      }
      if (cat.toLowerCase().includes('tax') || cat.toLowerCase().includes('gst')) {
        return `भारत सरकार के कर प्रशासन, आईटीआर दाखिल करने और वित्तीय सेवाओं का आधिकारिक पोर्टल।`;
      }
      if (cat.toLowerCase().includes('transport')) {
        return `सड़क परिवहन एवं राजमार्ग मंत्रालय का आधिकारिक वाहन एवं ड्राइविंग लाइसेंस पोर्टल।`;
      }
      if (cat.toLowerCase().includes('education') || cat.toLowerCase().includes('scholarship')) {
        return `राष्ट्रीय शिक्षा नीति, प्रवेश परीक्षा एवं छात्रवृत्ति का आधिकारिक केंद्र सरकार का पोर्टल।`;
      }
      if (cat.toLowerCase().includes('health')) {
        return `स्वास्थ्य एवं परिवार कल्याण मंत्रालय का राष्ट्रीय स्वास्थ्य योजना एवं नागरिक पोर्टल।`;
      }
      if (cat.toLowerCase().includes('recruitment') || cat.toLowerCase().includes('employment')) {
        return `केंद्रीय भर्ती आयोग, परीक्षा परिणाम एवं रोजगार सूचनाओं का आधिकारिक पोर्टल।`;
      }
      return `${link.name} - भारत सरकार का आधिकारिक राष्ट्रीय पोर्टल (${transCat}), नागरिकों के लिए सीधी सेवाएं।`;
    } else {
      const place = transState || 'राज्य';
      if (cat.toLowerCase().includes('land')) {
        return `${place} सरकार का आधिकारिक भूमि रिकॉर्ड, खसरा, खतौनी और दाखिल खारिज पोर्टल।`;
      }
      if (cat.toLowerCase().includes('citizen') || cat.toLowerCase().includes('e-governance')) {
        return `${place} सरकार का आधिकारिक नागरिक सेवा पोर्टल: सरकारी प्रमाण पत्र एवं योजनाओं का लाभ।`;
      }
      return `${link.name} - ${place} सरकार का आधिकारिक पोर्टल (${transCat}), विभागीय एवं लोक सेवाएं।`;
    }
  }

  if (lang === 'te') {
    const place = transState || (link.governmentLevel === 'central' ? 'కేంద్ర ప్రభుత్వం' : 'రాష్ట్ర ప్రభుత్వం');
    return `${link.name} - ${place} అధికారిక పోర్టల్ (${transCat}). పౌర సేవలు మరియు సమాచారం.`;
  }

  // Fallback to original description if other languages
  return link.description;
}

/**
 * Smart translator for link uses / actions
 */
export function getTranslatedUses(link: GovernmentLink, lang: string): string[] {
  if (!lang || lang === 'en') {
    return link.uses || [];
  }

  // 1. Check exact portal translation
  const cleanUrl = link.url ? link.url.trim().replace(/\/+$/, '') : '';
  for (const [keyUrl, trans] of Object.entries(SPECIFIC_PORTAL_TRANSLATIONS)) {
    const cleanKey = keyUrl.trim().replace(/\/+$/, '');
    if (cleanUrl === cleanKey || cleanUrl.includes(cleanKey.replace(/^https?:\/\//, ''))) {
      const match = (trans as any)[lang];
      if (match?.uses && match.uses.length > 0) {
        return match.uses;
      }
    }
  }

  // 2. Generic pattern translation for common uses
  if (lang === 'ta') {
    if (!link.uses || link.uses.length === 0) {
      return ['அதிகாரப்பூர்வ அரசு சேவைகளை அணுக', 'விவரங்கள் மற்றும் வழிகாட்டுதல்களை அறிய'];
    }
    return link.uses.map((use) => {
      const u = use.toLowerCase();
      if (u.includes('apply') || u.includes('application')) return 'ஆன்லைனில் விண்ணப்பிக்க';
      if (u.includes('status') || u.includes('track')) return 'விண்ணப்ப நிலையை அறிய';
      if (u.includes('download') || u.includes('certificate')) return 'சான்றிதழ்களை பதிவிறக்கம் செய்ய';
      if (u.includes('pay') || u.includes('tax') || u.includes('bill')) return 'கட்டணம் அல்லது வரி செலுத்த';
      if (u.includes('find') || u.includes('browse') || u.includes('information')) return 'அரசு தகவல்களை பார்வையிட';
      if (u.includes('register') || u.includes('registration')) return 'புதிய பதிவு மேற்கொள்ள';
      if (u.includes('verify') || u.includes('verification')) return 'உண்மைத்தன்மையை சரிபார்க்க';
      return use;
    });
  }

  if (lang === 'hi') {
    if (!link.uses || link.uses.length === 0) {
      return ['आधिकारिक सरकारी सेवाओं का उपयोग करें', 'विभागीय जानकारी प्राप्त करें'];
    }
    return link.uses.map((use) => {
      const u = use.toLowerCase();
      if (u.includes('apply') || u.includes('application')) return 'ऑनलाइन आवेदन करें';
      if (u.includes('status') || u.includes('track')) return 'आवेदन की स्थिति देखें';
      if (u.includes('download') || u.includes('certificate')) return 'प्रमाण पत्र डाउनलोड करें';
      if (u.includes('pay') || u.includes('tax') || u.includes('bill')) return 'ऑनलाइन शुल्क या टैक्स भरें';
      if (u.includes('find') || u.includes('browse') || u.includes('information')) return 'सरकारी जानकारी खोजें';
      if (u.includes('register') || u.includes('registration')) return 'नया पंजीकरण करें';
      if (u.includes('verify') || u.includes('verification')) return 'विवरण सत्यापित करें';
      return use;
    });
  }

  if (lang === 'te') {
    if (!link.uses || link.uses.length === 0) {
      return ['ప్రభుత్వ సేవలను పొందండి', 'వివరాలను చూడండి'];
    }
    return link.uses.map((use) => {
      const u = use.toLowerCase();
      if (u.includes('apply')) return 'ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి';
      if (u.includes('status')) return 'దరఖాస్తు స్థితిని తనిఖీ చేయండి';
      if (u.includes('download')) return 'సర్టిఫికేట్‌ను డౌన్‌లోడ్ చేసుకోండి';
      return use;
    });
  }

  return link.uses || [];
}

/**
 * Get translated state or union territory name
 */
export function getTranslatedState(stateName: string, lang: string): string {
  if (!stateName || !lang || lang === 'en') return stateName;
  const match = STATE_TRANSLATIONS[stateName];
  if (match && match[lang]) {
    return match[lang];
  }
  return stateName;
}

/**
 * Get translated service category
 */
export function getTranslatedCategory(category: string, lang: string): string {
  if (!category || !lang || lang === 'en') return category;
  const match = CATEGORY_TRANSLATIONS[category];
  if (match && match[lang]) {
    return match[lang];
  }
  return category;
}

/**
 * Get translated government level
 */
export function getTranslatedLevel(level: GovernmentLevel, lang: string): string {
  const norm = level === 'union_territory' ? 'ut' : level;
  if (norm === 'not_under_government') {
    if (lang === 'ta') return 'அரசு சாரா தளம்';
    if (lang === 'hi') return 'गैर-सरकारी पोर्टल';
    if (lang === 'te') return 'ప్రభుత్వేతర పోర్టల్';
    if (lang === 'bn') return 'বেসরকারি পোর্টাল';
    if (lang === 'mr') return 'अशासकीय पोर्टल';
    return 'Non-Government';
  }
  if (!lang || lang === 'en') {
    return norm === 'central' ? 'Central' : norm === 'ut' ? 'Union Territory' : 'State';
  }
  if (lang === 'ta') {
    return norm === 'central' ? 'மத்திய அரசு' : norm === 'ut' ? 'யூனியன் பிரதேசம்' : 'மாநில அரசு';
  }
  if (lang === 'hi') {
    return norm === 'central' ? 'केंद्र सरकार' : norm === 'ut' ? 'केंद्र शासित प्रदेश' : 'राज्य सरकार';
  }
  if (lang === 'te') {
    return norm === 'central' ? 'కేంద్ర ప్రభుత్వం' : norm === 'ut' ? 'కేంద్రపాలిత ప్రాంతం' : 'రాష్ట్ర ప్రభుత్వం';
  }
  if (lang === 'bn') {
    return norm === 'central' ? 'কেন্দ্রীয় সরকার' : norm === 'ut' ? 'কেন্দ্রশাসিত অঞ্চল' : 'রাজ্য সরকার';
  }
  if (lang === 'mr') {
    return norm === 'central' ? 'केंद्रीय सरकार' : norm === 'ut' ? 'केंद्रशासित प्रदेश' : 'राज्य शासन';
  }
  return norm === 'central' ? 'Central' : norm === 'ut' ? 'Union Territory' : 'State';
}

/**
 * Get translated link name (if custom name exists)
 */
export function getTranslatedLinkName(link: GovernmentLink, lang: string): string {
  if (!lang || lang === 'en') return link.name;
  const cleanUrl = link.url ? link.url.trim().replace(/\/+$/, '') : '';
  for (const [keyUrl, trans] of Object.entries(SPECIFIC_PORTAL_TRANSLATIONS)) {
    const cleanKey = keyUrl.trim().replace(/\/+$/, '');
    if (cleanUrl === cleanKey || cleanUrl.includes(cleanKey.replace(/^https?:\/\//, ''))) {
      const match = (trans as any)[lang];
      if (match?.name) {
        return match.name;
      }
    }
  }
  return link.name;
}
