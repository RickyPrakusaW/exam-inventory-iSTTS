import React from 'react';
import { Plus } from 'lucide-react';

const PageHeader = ({ title, subtitle, icon: Icon, buttonText, onButtonClick }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                    {Icon && <Icon className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />}
                    <span>{title}</span>
                </h1>
                {subtitle && <p className="text-gray-500 text-base md:text-lg">{subtitle}</p>}
            </div>
            {buttonText && onButtonClick && (
                <button 
                    onClick={onButtonClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="md:inline">{buttonText}</span>
                </button>
            )}
        </div>
    );
};

export default PageHeader;
