import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({
  title,
  isOpen,
  onClick,
  children,
  className = '',
}) => {
  return (
    <div className={`border border-border rounded-custom overflow-hidden bg-card/20 backdrop-blur-md ${className}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4.5 text-left font-semibold text-text hover:text-primary transition-colors focus:outline-none select-none"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 text-text/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <div
        className={`transition-all duration-350 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] border-t border-border/50 opacity-100 p-4.5' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="text-text/70 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export const Accordion = ({
  items = [],
  allowMultiple = false,
  className = '',
  ...props
}) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleItemClick = (index) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        setOpenIndexes(openIndexes.filter((idx) => idx !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      if (openIndexes.includes(index)) {
        setOpenIndexes([]);
      } else {
        setOpenIndexes([index]);
      }
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`} {...props}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndexes.includes(index)}
          onClick={() => handleItemClick(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
