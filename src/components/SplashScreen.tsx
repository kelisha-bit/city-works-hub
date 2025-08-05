import React, { useEffect, useState } from 'react';
import { Church, Heart } from 'lucide-react';

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
        {/* Animated Church Icon */}
        <div className="relative mb-8">
          <div className="animate-pulse">
            <Church className="h-24 w-24 mx-auto mb-4" />
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