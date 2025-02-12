import Commit from "./Commit";

function ListOdCommits() {
  return (
    <>
      <div className="flex  flex-col space-y-2">
        <h1 className="text-2xl font-bold">List of Commits:</h1>
        <div className="divider divider-info" />
        {[...Array(2)].map((_, index) => (
          <Commit key={index} />
        ))}
      </div>
    </>
  );
}

export default ListOdCommits;
