import { MdErrorOutline } from "react-icons/md";
interface WarningProps {
  message: string;
}

function Warning({ message }: WarningProps) {
  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 bg-red-100 rounded-lg shadow-md">
        <MdErrorOutline className="text-red-500 w-12 h-12 mb-2" />
        <p className="font-bold text-red-600 text-lg">{message}</p>
      </div>
    </>
  );
}

export default Warning;
