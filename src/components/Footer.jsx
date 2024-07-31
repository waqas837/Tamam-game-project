import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-pink-500">
              عصر مخك
            </a>
          </div>

          {/* Links Section */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
            <a
              href="/about"
              className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
            >
              من نحن
            </a>

            <a
              href="/terms"
              className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
            >
              شروط الخدمة
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} عصر مخك. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
