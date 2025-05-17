import { MdOutlineAccessTime } from "react-icons/md";

interface AtTimeProps {
  value: string;
}

function AtTime({ value }: AtTimeProps) {
  return (
    <>
      <div className="badge badge-primary  gap-2 font-bold">
        <MdOutlineAccessTime />
        {value}
      </div>
    </>
  );
}

export default AtTime;
