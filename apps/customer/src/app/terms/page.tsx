import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-brand max-w-none text-gray-700 space-y-4">
          <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            Welcome to RebookIndia. These terms and conditions outline the rules and regulations for the use of the RebookIndia Website and App.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. Acceptance of Terms</h3>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use RebookIndia if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. Products and Pricing</h3>
          <p>
            All products listed on RebookIndia are second-hand unless explicitly stated otherwise. We strive to provide accurate grading of book conditions, but variations may occur. Pricing is determined by individual vendors or our dynamic pricing engine and is subject to change.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">3. User Accounts</h3>
          <p>
            You must be at least 18 years of age to use this website, or use it under the supervision of a parent or guardian. You are responsible for maintaining the confidentiality of your account and password.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">4. Vendor Agreements</h3>
          <p>
            Users who register as vendors agree to our separate Vendor Terms and Conditions, which dictate inventory management, payout schedules, and acceptable book conditions. Any violation may result in account termination.
          </p>
          
          <p className="mt-8 font-medium">
            Contact us at support@rebookindia.in for any legal inquiries or clarifications regarding these terms.
          </p>
        </div>
      </div>
    </div>
  );
}
