import CNARLogo from "../../../../../assets/CNAR_logo.png";
function AvatarCnr() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex  justify-center avatar mb-4">
          <div className="w-30" style={{ width: "60%" }}>
            <img src={CNARLogo} alt="Logo" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center">
          Caisse National des Retraites
        </h1>
      </div>
    </>
  );
}

export default AvatarCnr;
