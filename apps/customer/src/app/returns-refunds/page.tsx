import React from "react";

export default function ReturnsRefundsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-8">Returns & Refunds</h1>
        <div className="prose prose-brand max-w-none text-gray-700 space-y-4">
          <p>
            We stand behind the quality of the books sold on RebookIndia. 
            If you are not completely satisfied with your purchase, we're here to help.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Returns</h3>
          <p>
            You have 7 calendar days to return an item from the date you received it.
            To be eligible for a return, your item must be in the same condition that you received it.
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Book condition must match the listing state (i.e. no new markings/tears).</li>
            <li>You must have the receipt or proof of purchase.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Refunds</h3>
          <p>
            Once we receive your item, we will inspect it and notify you that we have received your returned item.
            We will immediately notify you on the status of your refund after inspecting the item.
            If your return is approved, we will initiate a refund to your original method of payment within 5-7 business days.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Return Shipping</h3>
          <p>
            If the return is due to an error on our part (e.g., incorrect book, significantly worse condition than stated), 
            we will cover the return shipping costs. In other cases, you will be responsible for paying for your own shipping costs for returning your item.
          </p>
        </div>
      </div>
    </div>
  );
}
