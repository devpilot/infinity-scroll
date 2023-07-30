import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("Test for Count", () => {
  beforeEach(() => {
    render(<App />);
  });
  test("count element showing", () => {
    expect(screen.getByTestId("count")).toBeInTheDocument();
  });
  test("count to be 10", async () => {
    await waitFor(()=>{
      expect(screen.getByTestId("count")).toHaveTextContent("count: 10");
    })
    
  });
});
