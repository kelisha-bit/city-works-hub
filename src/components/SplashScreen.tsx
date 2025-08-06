import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-hero flex items-center justify-center z-50 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="text-center text-primary-foreground">
        {/* Animated Church Logo */}
        <div className="relative mb-8">
          <div className="animate-pulse">
            <img 
              src="/lovable-uploads/43dd6e19-8b73-4be1-84ce-2ea7ae92f8e6.png" 
              alt="Greater Works City Church Logo" 
              className="h-24 w-24 mx-auto mb-4"
            />
          </div>
          <div className="absolute -top-2 -right-2">
            <Heart className="h-8 w-8 text-accent animate-bounce" />
          </div>
        </div>

        {/* Church Name */}
        <h1 className="text-4xl font-bold mb-2 animate-fade-in">
          Greater Works
        </h1>
        <h2 className="text-3xl font-semibold mb-4 animate-fade-in delay-300">
          City Church
        </h2>

        {/* Tagline */}
        <p className="text-lg opacity-90 animate-fade-in delay-500">
          Raising transformational leaders
        </p>

        {/* Loading Animation */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;