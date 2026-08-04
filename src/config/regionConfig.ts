export interface StateRegion {
  id: string;
  nameEn: string;
  nameTa: string;
  code: string;
  isMvpActive: boolean;
  currencySymbol: string;
  currencyCode: string;
  districts: {
    id: string;
    nameEn: string;
    nameTa: string;
    tier: 'metro' | 'tier2' | 'tier3';
    costMultiplier: number;
  }[];
}

export const INDIAN_STATES: Record<string, StateRegion> = {
  TN: {
    id: 'TN',
    nameEn: 'Tamil Nadu',
    nameTa: 'தமிழ்நாடு',
    code: 'TN',
    isMvpActive: true,
    currencySymbol: '₹',
    currencyCode: 'INR',
    districts: [
      { id: 'chennai', nameEn: 'Chennai', nameTa: 'சென்னை', tier: 'metro', costMultiplier: 1.25 },
      { id: 'coimbatore', nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', tier: 'metro', costMultiplier: 1.18 },
      { id: 'madurai', nameEn: 'Madurai', nameTa: 'மதுரை', tier: 'tier2', costMultiplier: 1.10 },
      { id: 'salem', nameEn: 'Salem', nameTa: 'சேலம்', tier: 'tier2', costMultiplier: 1.08 },
      { id: 'tiruppur', nameEn: 'Tiruppur', nameTa: 'திருப்பூர்', tier: 'tier2', costMultiplier: 1.12 },
      { id: 'erode', nameEn: 'Erode', nameTa: 'ஈரோடு', tier: 'tier2', costMultiplier: 1.08 },
      { id: 'trichy', nameEn: 'Tiruchirappalli (Trichy)', nameTa: 'திருச்சிராப்பள்ளி (திருச்சி)', tier: 'tier2', costMultiplier: 1.12 },
      { id: 'tirunelveli', nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி', tier: 'tier2', costMultiplier: 1.06 },
      { id: 'krishnagiri', nameEn: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி', tier: 'tier2', costMultiplier: 1.08 },
      { id: 'kanyakumari', nameEn: 'Kanyakumari', nameTa: 'கன்னியாகுமரி', tier: 'tier2', costMultiplier: 1.07 },
      { id: 'thanjavur', nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்', tier: 'tier3', costMultiplier: 1.04 },
      { id: 'vellore', nameEn: 'Vellore', nameTa: 'வேலூர்', tier: 'tier2', costMultiplier: 1.08 },
      { id: 'dindigul', nameEn: 'Dindigul', nameTa: 'திண்டுக்கல்', tier: 'tier3', costMultiplier: 1.02 },
      { id: 'namakkal', nameEn: 'Namakkal', nameTa: 'நாமக்கல்', tier: 'tier3', costMultiplier: 1.03 },
      { id: 'nilgiris', nameEn: 'Nilgiris (Ooty)', nameTa: 'நீலகிரி (ஊட்டி)', tier: 'tier2', costMultiplier: 1.20 },
      { id: 'cuddalore', nameEn: 'Cuddalore', nameTa: 'கடலூர்', tier: 'tier3', costMultiplier: 1.02 },
      { id: 'villupuram', nameEn: 'Villupuram', nameTa: 'விழுப்புரம்', tier: 'tier3', costMultiplier: 1.00 },
      { id: 'ariyalur', nameEn: 'Ariyalur', nameTa: 'அரியலூர்', tier: 'tier3', costMultiplier: 0.98 },
      { id: 'chengalpattu', nameEn: 'Chengalpattu', nameTa: 'செங்கல்பட்டு', tier: 'metro', costMultiplier: 1.20 },
      { id: 'dharmapuri', nameEn: 'Dharmapuri', nameTa: 'தர்மபுரி', tier: 'tier3', costMultiplier: 0.98 },
      { id: 'kallakurichi', nameEn: 'Kallakurichi', nameTa: 'கள்ளக்குறிச்சி', tier: 'tier3', costMultiplier: 0.97 },
      { id: 'kanchipuram', nameEn: 'Kanchipuram', nameTa: 'காஞ்சிபுரம்', tier: 'tier2', costMultiplier: 1.15 },
      { id: 'karur', nameEn: 'Karur', nameTa: 'கரூர்', tier: 'tier3', costMultiplier: 1.03 },
      { id: 'mayiladuthurai', nameEn: 'Mayiladuthurai', nameTa: 'மயிலாடுதுறை', tier: 'tier3', costMultiplier: 1.01 },
      { id: 'nagapattinam', nameEn: 'Nagapattinam', nameTa: 'நாகப்பட்டினம்', tier: 'tier3', costMultiplier: 1.00 },
      { id: 'perambalur', nameEn: 'Perambalur', nameTa: 'பெரம்பலூர்', tier: 'tier3', costMultiplier: 0.97 },
      { id: 'pudukkottai', nameEn: 'Pudukkottai', nameTa: 'புதுக்கோட்டை', tier: 'tier3', costMultiplier: 1.00 },
      { id: 'ramanathapuram', nameEn: 'Ramanathapuram', nameTa: 'ராமநாதபுரம்', tier: 'tier3', costMultiplier: 1.00 },
      { id: 'ranipet', nameEn: 'Ranipet', nameTa: 'ராணிப்பேட்டை', tier: 'tier3', costMultiplier: 1.05 },
      { id: 'sivaganga', nameEn: 'Sivaganga', nameTa: 'சிவகங்கை', tier: 'tier3', costMultiplier: 0.99 },
      { id: 'tenkasi', nameEn: 'Tenkasi', nameTa: 'தென்காசி', tier: 'tier3', costMultiplier: 1.01 },
      { id: 'theni', nameEn: 'Theni', nameTa: 'தேனி', tier: 'tier3', costMultiplier: 1.02 },
      { id: 'thoothukudi', nameEn: 'Thoothukudi', nameTa: 'தூத்துக்குடி', tier: 'tier2', costMultiplier: 1.06 },
      { id: 'tirupathur', nameEn: 'Tirupathur', nameTa: 'திருப்பத்தூர்', tier: 'tier3', costMultiplier: 1.01 },
      { id: 'tiruvallur', nameEn: 'Tiruvallur', nameTa: 'திருவள்ளூர்', tier: 'tier2', costMultiplier: 1.15 },
      { id: 'tiruvannamalai', nameEn: 'Tiruvannamalai', nameTa: 'திருவண்ணாமலை', tier: 'tier3', costMultiplier: 1.02 },
      { id: 'tiruvarur', nameEn: 'Tiruvarur', nameTa: 'திருவாரூர்', tier: 'tier3', costMultiplier: 1.00 },
      { id: 'virudhunagar', nameEn: 'Virudhunagar', nameTa: 'விருதுநகர்', tier: 'tier3', costMultiplier: 1.02 }
    ]
  },
  KL: {
    id: 'KL',
    nameEn: 'Kerala (Upcoming)',
    nameTa: 'கேரளா (விரைவில்)',
    code: 'KL',
    isMvpActive: false,
    currencySymbol: '₹',
    currencyCode: 'INR',
    districts: []
  },
  KA: {
    id: 'KA',
    nameEn: 'Karnataka (Upcoming)',
    nameTa: 'கர்நாடகா (விரைவில்)',
    code: 'KA',
    isMvpActive: false,
    currencySymbol: '₹',
    currencyCode: 'INR',
    districts: []
  },
  AP: {
    id: 'AP',
    nameEn: 'Andhra Pradesh (Upcoming)',
    nameTa: 'ஆந்திர பிரதேசம் (விரைவில்)',
    code: 'AP',
    isMvpActive: false,
    currencySymbol: '₹',
    currencyCode: 'INR',
    districts: []
  },
  TG: {
    id: 'TG',
    nameEn: 'Telangana (Upcoming)',
    nameTa: 'தெலங்கானா (விரைவில்)',
    code: 'TG',
    isMvpActive: false,
    currencySymbol: '₹',
    currencyCode: 'INR',
    districts: []
  }
};

export const DEFAULT_ACTIVE_STATE = INDIAN_STATES.TN;
