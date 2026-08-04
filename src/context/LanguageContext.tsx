import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ta' | 'en'; // 'ta' = Tamil (Default), 'en' = English

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isTamil: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ta: {
    // Header & General
    app_title: 'Namma Veedu AI – தமிழ் வீடு வரைபடம்',
    app_subtitle: 'தமிழ்நாட்டிற்கான செயற்கை நுண்ணறிவு வீடு திட்டமிடும் தளம்',
    switch_language: 'English',
    active_region: 'தமிழ்நாடு (TN MVP)',
    switch_state: 'மாநிலம் மாற்றுக',
    new_plan_btn: 'புதிய AI வரைபடம்',
    docs_btn: 'விளக்கக் கையேடு',
    
    // Nav Tabs
    nav_overview: 'மேலோட்டம்',
    nav_create_plan: 'AI வீடு வரைபடம்',
    nav_saved_plans: 'சேமிக்கப்பட்ட வரைபடங்கள்',
    nav_cost_estimator: 'கட்டுமான செலவு கணக்கீட்டான்',
    nav_material_prices: 'இன்றைய பொருள் விலைகள்',
    nav_browse_engineers: 'தமிழ்நாடு பொறியாளர்கள்',
    nav_book_engineer: 'ஆலோசனை பதிவு',
    nav_reviews: 'மதிப்புரைகள்',
    
    // Property & Measurement
    plot_measurement: 'மனை அளவீடு (Plot Area)',
    unit_sqft: 'சதுர அடி (Sq Ft)',
    unit_cent: 'சென்ட் (Cent)',
    unit_ground: 'கிரவுண்ட் (Ground)',
    unit_acre: 'ஏக்கர் (Acre)',
    unit_converter_title: 'தமிழ்நாடு மனை அளவு மாற்றி (Unit Converter)',
    
    // House Types
    house_type: 'வீட்டின் வகை',
    house_individual: 'தனி வீடு (Individual House)',
    house_duplex: 'டூப்ளக்스 வீடு (Duplex)',
    house_villa: 'வில்லா (Luxury Villa)',
    house_rental: 'வாடகை கட்டிடம் (Rental Portions)',
    
    // Vastu Shastra
    vastu_title: 'தமிழ்நாடு வாஸ்து சாஸ்திரம்',
    vastu_facing: 'மனை திசை',
    facing_east: 'கிழக்கு பார்த்த வீடு (East Facing)',
    facing_north: 'வடக்கு பார்த்த வீடு (North Facing)',
    facing_south: 'தெற்கு பார்த்த வீடு (South Facing)',
    facing_west: 'மேற்கு பார்த்த வீடு (West Facing)',
    vastu_kanni_moolai: 'தென்மேற்கு (கன்னி மூலை) - மாஸ்டர் படுக்கையறை',
    vastu_agni_moolai: 'தென்கிழக்கு (அக்னி மூலை) - சமையலறை',
    vastu_eesanya_moolai: 'வடகிழக்கு (ஈசான்ய மூலை) - பூஜை அறை / வாசல்',

    // Cost Estimator
    cost_material_total: 'மொத்த பொருள் செலவு (Material Cost)',
    cost_labour_total: 'மொத்த கூலி செலவு (Labour Cost)',
    cost_grand_total: 'மொத்த தோராய செலவு (Total Cost)',
    cost_per_sqft: 'சதுர அடி வீதம் (Cost / Sq Ft)',
    cement_price: 'சிமெண்ட் பை (50kg Bag)',
    steel_price: 'டிஎம்டி கம்பிகள் (TMT Steel / kg)',
    sand_price: 'மணல் / எம்-சாண்ட் (M-Sand / cu ft)',
    bricks_price: 'செங்கல் (Chamber Bricks / Piece)',
    aggregate_price: 'ஜல்லி (Coarse Aggregate / cu ft)',
    paint_price: 'பெயிண்ட் (Paint / Liter)',
    electrical_price: 'மின்சார வயரிங் (Electrical / sq ft)',
    plumbing_price: 'பிளம்பிங் கழாய்கள் (Plumbing / sq ft)',
    labour_rate: 'கொத்தனார் / சித்தாள் கூலி (Labour / Day)',

    // Engineers
    engineer_title: 'தமிழ்நாடு உரிமம் பெற்ற பொறியாளர்கள் & ஆர்க்கிடெக்ட்கள்',
    filter_district: 'மாவட்ட தேர்வு (Filter District)',
    all_districts: 'அனைத்து மாவட்டங்களும் (All 38 Districts)',
    filter_experience: 'அனுபவம்',
    filter_rating: 'மதிப்பீடு',
    filter_budget: 'கட்டணம் (Consultation Budget)',
    btn_call: 'அழைக்க (Call)',
    btn_whatsapp: 'வாட்ஸ்அப் (WhatsApp)',
    btn_book_consultation: 'ஆலோசனை பதிவு செய்க',
    tn_license: 'தமிழ்நாடு அரசு பதிவு எண்',

    // Future States
    expansion_notice: 'அடுத்த கட்டமாக கேரளா, கர்நாடகா, ஆந்திரா மற்றும் தெலங்கானா மாநிலங்கள் சேர்க்கப்படும்.',
    export_pdf: 'PDF அறிக்கை பதிவிறக்கு',
    export_csv: 'CSV பதிவிறக்கு',
  },
  en: {
    // Header & General
    app_title: 'Namma Veedu AI',
    app_subtitle: 'AI-Powered Smart House Planning Platform for Tamil Nadu',
    switch_language: 'தமிழ்',
    active_region: 'Tamil Nadu (TN MVP)',
    switch_state: 'Change State',
    new_plan_btn: 'New AI Plan',
    docs_btn: 'Docs & Guide',

    // Nav Tabs
    nav_overview: 'Overview',
    nav_create_plan: 'AI House Planner',
    nav_saved_plans: 'Saved Plans',
    nav_cost_estimator: 'Cost Estimator',
    nav_material_prices: 'Live Material Rates',
    nav_browse_engineers: 'TN Engineers',
    nav_book_engineer: 'Book Consultation',
    nav_reviews: 'Reviews',

    // Property & Measurement
    plot_measurement: 'Plot Area Measurement',
    unit_sqft: 'Square Feet (Sq Ft)',
    unit_cent: 'Cent (435.6 sq ft)',
    unit_ground: 'Ground (2400 sq ft)',
    unit_acre: 'Acre (43,560 sq ft)',
    unit_converter_title: 'Tamil Nadu Land Unit Converter',

    // House Types
    house_type: 'House Construction Type',
    house_individual: 'Individual House',
    house_duplex: 'Duplex House',
    house_villa: 'Luxury Villa',
    house_rental: 'Rental Portion Building',

    // Vastu Shastra
    vastu_title: 'Tamil Nadu Vastu Shastra',
    vastu_facing: 'Plot Facing Direction',
    facing_east: 'East Facing House',
    facing_north: 'North Facing House',
    facing_south: 'South Facing House',
    facing_west: 'West Facing House',
    vastu_kanni_moolai: 'South-West (Kanni Moolai) Master Bedroom',
    vastu_agni_moolai: 'South-East (Agni Moolai) Kitchen',
    vastu_eesanya_moolai: 'North-East (Eesanya Moolai) Pooja / Main Entrance',

    // Cost Estimator
    cost_material_total: 'Total Material Cost',
    cost_labour_total: 'Total Labour Cost',
    cost_grand_total: 'Total Estimated Cost',
    cost_per_sqft: 'Cost Rate per Sq Ft',
    cement_price: 'Cement (50kg Bag)',
    steel_price: 'Reinforcement Steel (TMT / kg)',
    sand_price: 'M-Sand / River Sand (cu ft)',
    bricks_price: 'Chamber Red Bricks (Piece)',
    aggregate_price: 'Stone Aggregate (20mm / cu ft)',
    paint_price: 'Emulsion Paint (Liter)',
    electrical_price: 'Electrical Conduits & Panels (sq ft)',
    plumbing_price: 'Plumbing Fixtures & Pipes (sq ft)',
    labour_rate: 'Mason & Skilled Labour (Day Rate)',

    // Engineers
    engineer_title: 'Tamil Nadu Licensed Engineers & Architects',
    filter_district: 'Filter District',
    all_districts: 'All 38 Districts',
    filter_experience: 'Experience',
    filter_rating: 'Rating',
    filter_budget: 'Consultation Fee',
    btn_call: 'Call Now',
    btn_whatsapp: 'WhatsApp',
    btn_book_consultation: 'Book Consultation',
    tn_license: 'TN Registration No',

    // Future States
    expansion_notice: 'Scalable architecture ready for Kerala, Karnataka, Andhra Pradesh & Telangana expansion.',
    export_pdf: 'Download PDF Report',
    export_csv: 'Export CSV Spreadsheet',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ta'); // Tamil Default

  // Load preferred language from localStorage if present
  useEffect(() => {
    const savedLang = localStorage.getItem('buildai_tn_lang') as Language;
    if (savedLang === 'ta' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('buildai_tn_lang', lang);
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'ta' ? 'en' : 'ta');
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        toggleLanguage,
        t,
        isTamil: language === 'ta',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
