import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/dom";

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

describe("<Categories/>", () => {
  it("calls onClick prop on add post button", () => {
    const onClick = jest.fn();
    const { getByText } = render(<button onClick={onClick}>Add Post</button>);

    expect(getByText(/Add post/i)).toBeTruthy();
    fireEvent.click(getByText(/Add Post/i));
    expect(onClick).toHaveBeenCalled();
  });

  it("calls onclick prop on delete post button", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <button onClick={onClick}>Delete post</button>
    );
    expect(getByText(/Delete post/i)).toBeTruthy();
    fireEvent.click(getByText(/Delete post/i));
    expect(onClick).toHaveBeenCalled();
  });

  it("calls onclick prop on post can be edited", () => {
    const onClick = jest.fn();
    const { getByText } = render(<button onClick={onClick}>Edit post</button>);

    expect(getByText(/Edit post/i)).toBeTruthy();
    fireEvent.click(getByText(/Edit post/i));
    expect(onClick).toHaveBeenCalled();
  });
});
