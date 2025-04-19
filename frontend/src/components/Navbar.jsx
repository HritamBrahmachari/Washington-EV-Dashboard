import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-950 via-blue-700 to-indigo-950 shadow-lg py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center">
        
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Washington EV Dashboard
            </h1>
            <p className="hidden md:block text-xs text-blue-100">
              Electric Vehicle Data Analytics
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
