function NotYet() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      {/* Emoji and Heading */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl">🚧</span>
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
          Page en cours de développement
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Nous travaillons dur pour rendre cette page disponible bientôt. Merci
          de votre patience !
        </p>
      </div>

      {/* Placeholder Textarea and Button */}
      <textarea
        placeholder="Laissez un message ou une remarque..."
        className="textarea textarea-success w-full max-w-md"
      />
      <button className="btn btn-success btn-outline">Envoyer</button>
    </div>
  );
}

export default NotYet;
