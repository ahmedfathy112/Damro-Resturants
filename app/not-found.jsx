import Link from "next/link";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PageNotFound = () => {
  return (
    <main className="d-flex justify-content-center px-3 align-items-center vh-100 bg-light">
      <div className="text-center p-5 rounded shadow bg-white">
        <h1 className="display-4 text-danger mb-3">404</h1>
        <h3 className="mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          الصفحه اللي بتدور عليها مش موجوده ارجع تاني للصفحه الرئيسيه
        </p>
        <Link href="/" className="btn btn-primary">
          العوده الي الصفحه الرئيسيه
        </Link>
      </div>
    </main>
  );
};

export default PageNotFound;
