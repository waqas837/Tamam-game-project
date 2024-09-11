import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const Loader = () => {
  useEffect(() => {
    toast.loading("Processing");
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div>
      <Toaster></Toaster>
    </div>
  );
};

export default Loader;
