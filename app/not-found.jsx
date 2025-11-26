import Link from "next/link";
import React from "react";

const PageNotFound = () => {
  return (
    <main className="flex justify-center px-3 items-center min-h-screen bg-gray-100">
      <div className="text-center p-5 rounded shadow bg-white">
        <h1 className="text-6xl text-red-600 mb-3">404</h1>
        <h3 className="mb-3">Page Not Found</h3>
        <p className="text-gray-500 mb-4">
          الصفحه اللي بتدور عليها مش موجوده ارجع تاني للصفحه الرئيسيه
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white py-2 px-4 rounded inline-block"
        >
          العوده الي الصفحه الرئيسيه
        </Link>
      </div>
    </main>
  );
};

export default PageNotFound;
