import React from "react";

const Loader = () => {
  return (
    <div className="w-full fixed flex items-center justify-center h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent dark:border-gray-600 dark:border-t-transparent" />
    </div>
  );
};

export default Loader;
