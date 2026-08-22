import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="w-full border-t border-slate-100 bg-slate-50 mt-16"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
        <div>&copy; 2026 University Student Portal. All rights reserved.</div>
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Help Center</span>
        </div>
      </div>
    </footer>
  );
};

