import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

export default function Home() {
  const [selected, setSelected] = useState(null);

  const roles = [
    { name: "Admin", icon: <FaUserShield size={40} /> },
    { name: "Teacher", icon: <FaChalkboardTeacher size={40} /> },
    { name: "Student", icon: <FaUserGraduate size={40} /> },
  ];

  // Animation variants for the fade-in effect
  const boxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.5, ease: "easeOut" },
    }),
  };

  // Character animation for "Log in as"
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.05 },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Animated Title */}
      <motion.h2
        className="text-2xl font-semibold mb-6 flex"
        initial="hidden"
        animate="visible"
      >
        {"Log in as".split("").map((char, index) => (
          <motion.span key={index} variants={textVariants} custom={index}>
            {char}
          </motion.span>
        ))}
      </motion.h2>

      {/* Role Selection Boxes with Animation */}
      <div className="flex gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={index}
            className={`flex flex-col items-center justify-center p-6 w-40 h-40 bg-white rounded-lg shadow-lg border-2 transition-all cursor-pointer 
              ${selected === role.name ? "border-blue-500" : "border-gray-300"}`}
            onClick={() => setSelected(role.name)}
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            {role.icon}
            <p className="mt-2 font-medium">{role.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <motion.button
        className="mt-6 px-6 py-3 bg-black text-white rounded-lg shadow-md transition-all 
          hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 1, duration: 0.5 } }}
      >
        Continue
      </motion.button>
    </div>
  );
}