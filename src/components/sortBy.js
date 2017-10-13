import React, { Component } from "react";
import { connect } from "react-redux";
import { changeSortAction } from "../actions";
import { Select } from "semantic-ui-react";

//Variable that holds the values of the dropdown sort menu.
const options = [
  { value: "popular", text: "Popular" },
  { value: "unpopular", text: "Unpopular" },
  { value: "oldest", text: "Oldest" },
  { value: "newest", text: "Newest" }
];

class SortBy extends Component {
  //Keeps track of the value of the dropdown sort menu.
  state = {
    value: ""
  };

  //Sets the value of the dropdown sort menu.
  setValue = (e, data) => {
    this.setState({ value: data.value });
    //Dispatches changeSort action to keep track of the value of the dropdown sort menu
    //in Redux.
    this.props.changeSort({ value: data.value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className="sort">
        <Select
          onChange={this.setValue}
          color="teal"
          name="sort"
          placeholder="Sort By"
          options={options}
          value={value}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sort: state.sort
});

const mapDispatchToProps = dispatch => ({
  changeSort: value => dispatch(changeSortAction(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(SortBy);
