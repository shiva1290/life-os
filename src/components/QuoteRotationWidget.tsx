
import React, { useState, useEffect } from 'react';

const OPERATOR_QUOTES = [
  "Discipline is worship.",
  "You're not behind. You're catching up.",
  "No one's watching. Win anyway.",
  "You're building the future you envy.",
  "Excellence is a habit, not an accident.",
  "Pain is temporary. Quitting lasts forever.",
  "The only way out is through.",
  "Your future self is counting on you.",
  "Consistency beats intensity.",
  "You didn't come this far to only come this far."
];

const QuoteRotationWidget = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % OPERATOR_QUOTES.length);
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🧠</div>
          <h3 className="text-lg font-bold text-white">Operator Mindset</h3>
        </div>
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          <p className="text-xl text-white font-medium italic leading-relaxed">
            "{OPERATOR_QUOTES[currentQuoteIndex]}"
          </p>
        </div>
        <div className="flex justify-center mt-4 space-x-1">
          {OPERATOR_QUOTES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentQuoteIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteRotationWidget;
