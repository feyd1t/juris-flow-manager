
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const WelcomeHeader = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Welcome message typing effect
  useEffect(() => {
    const messages = [
      "Bem-vindo ao NPJ Flow Manager",
      "Gerenciamento de Casos Jurídicos",
      "Sistema de Núcleo de Prática Jurídica"
    ];
    let currentMessageIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    const typeWriter = () => {
      const currentMessage = messages[currentMessageIndex];
      
      if (isDeleting) {
        setWelcomeMessage(currentMessage.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        typingSpeed = 50;
      } else {
        setWelcomeMessage(currentMessage.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        typingSpeed = 150;
      }
      
      if (!isDeleting && currentCharIndex === currentMessage.length) {
        // Pause at end of typing
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        typingSpeed = 500;
      }
      
      setTimeout(typeWriter, typingSpeed);
    };
    
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="text-center"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-npj-blue">NPJ Flow Manager</h1>
      <p className="text-gray-600 mt-2 h-6 overflow-hidden">{welcomeMessage}</p>
    </motion.div>
  );
};
