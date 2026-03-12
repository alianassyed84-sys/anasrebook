import React from "react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">
          RebookIndia is India's first organized second-hand book marketplace for students.
          We believe in the power of reusing resources, saving the environment, and making
          education more affordable for everyone.
        </p>
        <p className="mb-4">
          Our mission is to create a seamless platform where students and sellers can connect,
          ensuring that every book gets a second life and every student gets the best deal.
        </p>
      </div>
    </div>
  );
}
