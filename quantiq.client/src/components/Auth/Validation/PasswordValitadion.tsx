import React, { useState, useEffect } from "react";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  return (
    <div className="password-requirements">
      <h4>Password Requirements:</h4>
      <ul>
        <li>{requirements.length ? "✅" : "❌"} At least 8 characters long</li>
        <li>
          {requirements.uppercase ? "✅" : "❌"} Contains uppercase letter
        </li>
        <li>
          {requirements.lowercase ? "✅" : "❌"} Contains lowercase letter
        </li>
        <li>{requirements.number ? "✅" : "❌"} Contains a number</li>
        <li>
          {requirements.specialChar ? "✅" : "❌"} Contains a special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
