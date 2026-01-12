import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AlertTriangle, HelpCircle, Info, X } from 'lucide-react';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning', // warning, danger, info
  });

  const resolver = useRef(null);

  const confirm = useCallback(({ 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?', 
    confirmText = 'Confirm', 
    cancelText = 'Cancel', 
    type = 'warning' 
  } = {}) => {
    setOptions({ title, message, confirmText, cancelText, type });
    setIsOpen(true);
    
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolver.current) {
      resolver.current(true);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolver.current) {
      resolver.current(false);
    }
  };

  const icons = {
    warning: <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />,
    danger: <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />,
    info: <HelpCircle className="w-12 h-12 text-blue-500 mb-4" />
  };

  const confirmBtnColors = {
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-200',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-200',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200'
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all scale-100 opacity-100"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col items-center text-center">
              {icons[options.type]}
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {options.title}
              </h3>
              
              <p className="text-gray-500 text-sm md:text-base mb-8">
                {options.message}
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all focus:ring-2 focus:ring-gray-200 hover:scale-[0.98] active:scale-95"
                >
                  {options.cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-3 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[0.98] active:scale-95 focus:ring-2 focus:ring-offset-1 ${confirmBtnColors[options.type]}`}
                >
                  {options.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
};
