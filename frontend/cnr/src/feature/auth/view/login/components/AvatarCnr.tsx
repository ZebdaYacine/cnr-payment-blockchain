import CNARLogo from "../../../../../assets/CNAR_logo.png";
import POSTLOGO from "../../../../../assets/AlgeriePoste.svg.png";

function AvatarCnr() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex flex-row justify-center items-center space-x-4 sm:space-x-8 md:space-x-12 lg:space-x-16 mb-4">
          <div className="w-24 sm:w-32 md:w-40 lg:w-48">
            <img
              src={CNARLogo}
              alt="CNAR Logo"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="w-20 sm:w-28 md:w-36 lg:w-44">
            <img
              src={POSTLOGO}
              alt="Poste Logo"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-zinc-500">
          Traitement Echeance
        </h1>
      </div>
    </>
  );
}

export default AvatarCnr;
