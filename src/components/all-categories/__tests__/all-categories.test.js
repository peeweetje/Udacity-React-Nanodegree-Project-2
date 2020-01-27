import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Categories from "../all_categories";

describe("Categories", () => {
  it("calls onClick prop on add post button", () => {
    const onClick = jest.fn();
    const { getByText } = render(<button onClick={onClick}>Add Post</button>);

    fireEvent.click(getByText(/Add Post/i));
    expect(onClick).toHaveBeenCalled();
  });
  //   it("calls onclick prop on delete post button", () => {
  //     const onClick = jest.fn();
  //     const { getByText } = render(
  //       <button onClick={onClick}>Delete Post</button>
  //     );

  //     fireEvent.click(getByText(/Delete Post/i));
  //     expect(onClick).toBeNull();
  //   });
});

test("if on click post can be edited", () => {});

test("if on click votes are up and down", () => {});
