interface ByUserProps {
  name: string;
  avatar: string;
}

function ByUser({ name, avatar }: ByUserProps) {
  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <div className="avatar">
          <div className="w-8 h-8 rounded-full">
            <img src={avatar} alt="User Avatar" />
          </div>
        </div>
        <span className="font-semibold text-blue-500">By {name}</span>
      </div>{" "}
    </>
  );
}

export default ByUser;
