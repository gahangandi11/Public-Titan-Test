import React from 'react'
import OtpInput from 'react-otp-input';
import './Code.css'

type SetCodeProps = {
    setCode: (code: string) => void;
    code ?: string;
  };

const Code : React.FC<SetCodeProps> = ({code, setCode}) => {
  return (
    <OtpInput
      value={code}
      onChange={(val)=>{setCode(val)}}
      numInputs={6}
      renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
      containerStyle="otp-input-container"
        inputStyle="otp-input"
    />
  )
}

export default Code;