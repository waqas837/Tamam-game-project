import React, { useState, useEffect } from "react";
import "../index.css";
import { X } from "lucide-react"; // Importing the cross icon from Lucide React

const PWAInstallAlert = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <X
          onClick={() => setShowInstallPrompt(false)}
          className="absolute top-2 right-2 text-gray-600 cursor-pointer"
          size={20}
        />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">تثبيت تطبيقنا</h2>
          <p className="text-gray-600 mb-4">
            قم بتثبيت تطبيقنا للحصول على تجربة أفضل والوصول إلى وضع عدم الاتصال!
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
          >
            إلغاء
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            تثبيت
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallAlert;
