"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SubscribeCard = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    // Submit email to /api/subscribe
    fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        toast.success("Subscribed");
      })
      .catch((error) => {
        toast.error("Error subscribing");
        // ...
      });
  };

  return (
    <div className="container px-4 sm:px-8 mx-auto max-w-lg">
      {/* card wrapper */}
      <div className="wrapper bg-white rounded-sm shadow-lg">
        <div className="card px-8 py-4">
          <div className="card-text">
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
              Get the latest deals and offers right into your inbox!
            </h1>
            <p className="text-base md:text-lg text-gray-700 mt-3">
              Join the Xphones Family!
            </p>
          </div>

          <div className="card-mail flex items-center my-10">
            <input
              type="email"
              className="border-l border-t border-b border-gray-200 rounded-l-md w-full text-base md:text-lg px-3 py-2"
              placeholder="Enter Your Email"
              value={email}
              onChange={handleEmailChange}
            />
            <button
              className="bg-red-500 hover:bg-red-600 hover:border-red-600 text-white font-bold capitalize px-3 py-2 text-base md:text-lg rounded-r-md border-t border-r border-b border-red-500"
              onClick={handleSubmit}
            >
              subscribe
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SubscribeCard;
