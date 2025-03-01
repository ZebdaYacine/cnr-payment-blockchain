import { MdOutlineAccessTime } from "react-icons/md";

interface AtTimeProps {
  value: string;
}

function AtTime({ value }: AtTimeProps) {
  return (
    <>
      <div className="badge badge-soft badge-secondary gap-2">
        <MdOutlineAccessTime />
        {value}
      </div>
    </>
  );
}

export default AtTime;
