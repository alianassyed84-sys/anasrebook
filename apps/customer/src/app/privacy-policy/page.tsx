import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-700 space-y-4">
          <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            RebookIndia built the RebookIndia app and website. This service is provided by RebookIndia and is intended for use as is.
            This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Information Collection and Use</h3>
          <p>
            For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, 
            including but not limited to your name, phone number, and postal address. The information that we request will be retained by us and used as described in this privacy policy.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Cookies</h3>
          <p>
            Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
            Our Service uses these "cookies" to improve your shopping experience and maintain your cart session.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Security</h3>
          <p>
            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>
          
          <p className="mt-8 font-medium">
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@rebookindia.in.
          </p>
        </div>
      </div>
    </div>
  );
}
