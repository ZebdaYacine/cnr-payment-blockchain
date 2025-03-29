import React from "react";
import { motion } from "framer-motion";

const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        className="text-6xl mb-4"
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        🚀👋
      </motion.div>

      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
        Bienvenue sur CNR-Payement
      </h1>

      <p className="text-xl font-semibold max-w-3xl mb-8 mt-5">
        Cette plateforme vous permet d'échanger des fichiers de manière
        sécurisée entre différentes entités en toute simplicité. 🤝
      </p>

      <p className="text-lg font-semibold mb-4">
        👀 Consulter la vidéo pour savoir comment l'utiliser.
      </p>

      <div className="w-full max-w-2xl aspect-video mb-6 rounded-xl overflow-hidden shadow-lg border border-base-300">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/AVXtUY8XFqY"
          title="Vidéo d'introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default WelcomePage;
