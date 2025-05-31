import React from "react";
import { motion } from "framer-motion";

const WelcomePage: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 py-16 text-center space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-7xl sm:text-8xl mb-2"
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        🚀👋
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight mb-3"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Bienvenue sur CNR-Paiement
      </motion.h1>

      <motion.p
        className="text-xl sm:text-2xl  font-bold  max-w-3xl text-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Une plateforme sécurisée pour échanger des fichiers entre entités,
        simple, rapide et efficace. 🤝
      </motion.p>

      <motion.p
        className="text-lg sm:text-xl font-semibold text-success mt-4 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        🎥 Regardez la vidéo pour découvrir comment l'utiliser.
      </motion.p>

      <motion.div
        className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-base-300"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/AVXtUY8XFqY"
          title="Vidéo d'introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>
  );
};

export default WelcomePage;
