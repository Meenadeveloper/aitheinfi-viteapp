import React, { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const UniqueCodeInput: React.FC = () => {
     const navigate = useNavigate();
 const [uniqueCode, setUniqueCode] = useState("AET-0001");
 const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    if (!uniqueCode.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setError("⚠️ Please enter a code.");
      return;
    }

        try {
         setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}check-unique-code`,
        {
          unique_code: uniqueCode, // ✅ payload key
        }
            );
            
          setLoading(false);
          console.log("Response:", response);
          if (response?.data?.status === true) {
            toast.success(response.data.message);
            navigate("/welcome"); // ✅ redirect
          } else {
            toast.error(response.data.message || "Invalid unique code.");
          }
      localStorage.setItem("uniqueCodeData", JSON.stringify(response.data));
      console.log("Success:", response.data);

      // clear error on success
      setError("");
    } catch (error: any) {
      console.error("Error:", error);
      // ✅ Show backend error if exists, otherwise fallback
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong. Please try again."
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 w-full max-w-sm mx-auto">
      <div className="flex w-full max-w-[320px] relative rounded-sm">
        <input
          type="text"
          maxLength={10}
          //   pattern="\d{10}"
          //   inputMode="numeric"
          placeholder="Enter Code"
          value={uniqueCode}
          name="unique_code"
          onChange={(e) => setUniqueCode(e.target.value)}
          className={`unique-code-input flex-1 px-4 py-2  
            outline-none transition duration-300 text-center
            ${shake ? "animate-shake unique-code-input-error" : ""}
            focus:ring-2 focus:ring-blue-400`}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="absolute right-0 p-2 bg-gray-900 text-white flex items-center justify-center"
        >
          {loading ? (
            <CircularProgress size={20} thickness={5} color="inherit" />
          ) : (
            <FiArrowRight size={22} />
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-4 text-center w-[100%]">
          {error}
        </p>
      )}

      <style>
        {`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
        `}
      </style>
    </div>
  );
};

export default UniqueCodeInput;
