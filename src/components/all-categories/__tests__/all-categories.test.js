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

  it("calls onclick prop on delete post button", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <button onClick={onClick}>Delete post</button>
    );

    fireEvent.click(getByText(/Delete post/i));
    expect(onClick).toHaveBeenCalled();
  });

  it("calls onclick prop on post can be edited", () => {
    const onClick = jest.fn();
    const { getByText } = render(<button onClick={onClick}>Edit post</button>);

    fireEvent.click(getByText(/Edit post/i));
    expect(onClick).toHaveBeenCalled();
  });
});

test("if on click votes are up and down", () => {});
