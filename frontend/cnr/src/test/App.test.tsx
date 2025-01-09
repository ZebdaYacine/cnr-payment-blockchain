import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App"; // Ensure this path points to your App component

describe("App Component", () => {
  test("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
