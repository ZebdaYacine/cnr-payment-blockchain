import NavBarComponent from "../../../../../core/components/NavBar";
import UploadFileComponet from "../components/UploadFileComponet";

function HomePage() {
  return (
    <>
      <NavBarComponent />
      <div className="flex items-center  justify-center min-h-screen ">
        <UploadFileComponet />
      </div>
    </>
  );
}

export default HomePage;
