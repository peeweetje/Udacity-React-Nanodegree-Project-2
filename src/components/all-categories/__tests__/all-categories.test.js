import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import Categories from "../all_categories";

// set-up and tear-down tests
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // container *must* be attached to document so events work correctly.
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

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
