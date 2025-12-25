import React from "react";
import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-gray-500 mb-8">Last Updated: October 2023</p>

        <section className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Introduction</h2>
            <p>Welcome to PathWallet. By using our application, you agree to follow these terms. If you do not agree, please do not use the service.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Data Privacy</h2>
            <p>Your financial data (income, expenses, goals) is stored securely. We do not sell your personal data to third parties. We use Google Gemini AI to process your financial advice requests, but your data is not used to train global AI models.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. User Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. PathWallet is a tool for financial tracking and does not provide official legal or professional financial accounting services.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4. Limitation of Liability</h2>
            <p>PathWallet is provided &quot;as is&quot;. We are not responsible for any financial losses resulting from the use of our AI assistant or tracking tools.</p>
          </div>
        </section>

        <div className="mt-10 pt-6 border-t">
          <Link href="/register" className="text-blue-600 hover:underline">
            ← Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
