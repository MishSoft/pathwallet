"use client";

import React from "react";
import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-950">
      <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
      <div className="max-w-3xl text-gray-700 dark:text-gray-300 space-y-4">
        <p>
          Welcome to PathWallet! Please read these terms and conditions
          carefully before using our service.
        </p>
        <p>
          1. **Account Usage**: Users are responsible for maintaining the
          confidentiality of their account.
        </p>
        <p>
          2. **Data Handling**: All financial data you enter will be stored
          securely and will not be shared with third parties without your
          consent.
        </p>
        <p>
          3. **Prohibited Activities**: Users must not misuse the service,
          attempt to hack, or use fraudulent methods.
        </p>
        <p>
          4. **Liability**: PathWallet is not liable for any financial losses
          resulting from the use of the app.
        </p>
        <p>
          5. **Modifications**: We may update these terms at any time. Changes
          will be effective immediately upon posting.
        </p>
        <p className="mt-4">
          <Link href="/register" className="text-pink-500 underline">
            Go back to Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
