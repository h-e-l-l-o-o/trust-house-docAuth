export const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    setMainContactPhone(value);
  };
