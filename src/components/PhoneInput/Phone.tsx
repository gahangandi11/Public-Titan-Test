import React, {useState} from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import './Phone.css'

interface PhoneInputProps {
   phone: string;
   setPhone: (phone: string) => void;
} 

const Phone:React.FC<PhoneInputProps> = ({phone,setPhone}) => {

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return false;
    
    // Convert to string if it's not already
    const phoneStr = phone.toString();
    
    // Remove all non-digit characters for validation
    const digitsOnly = phoneStr.replace(/\D/g, '');
    
    // Check if the number meets US phone number requirements
    return (digitsOnly.length === 11 && digitsOnly.charAt(0) === '1');
  };

  return (
    <PhoneInput
      country={'us'}
      onlyCountries={['us']}
      countryCodeEditable={false}
      value={phone}
      disableDropdown={true}
      onChange={(phone) => {
        setPhone(phone);
      }}
      onFocus={() => setIsPhoneFocused(true)}
      isValid={(value) => {
        if (!isPhoneFocused) return true;
        return validatePhoneNumber(value);
      }}
      />
  )
}

export default Phone