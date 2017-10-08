import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategories, changeSortAction } from "../actions";
import { Grid, Button, Select, Label } from "semantic-ui-react";

const options = [
  { value: "popular", text: "Popular" },
  { value: "unpopular", text: "Unpopular" },
  { value: "date", text: "Date" }
];

class Menu extends Component {
  state = {
    value: "popular"
  };

  componentDidMount() {
    this.props.getCategories();
  }

  setValue = (e, data) => {
    this.setState({ value: data.value });
    this.props.changeSort({ value: data.value });
  };

  render() {
    const { value } = this.state;
    //console.log(this.state.value);
    return (
      <div className="categories">
        <Grid columns={7}>
          <Grid.Column>
            <Link to="/">
              <Button size="tiny" compact basic color="teal">
                All
              </Button>
            </Link>
          </Grid.Column>
          {this.props.categories.length > 0 &&
            this.props.categories.map(category => (
              <Grid.Column key={category.path}>
                <Link to={`/${category.name}`}>
                  <Button size="tiny" compact basic color="teal">
                    {category.name}
                  </Button>
                </Link>
              </Grid.Column>
            ))}

          <Grid.Column>
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
          </Grid.Column>
        </Grid>
        <Label content={`Current: ${value}`} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.receiveCategories,
  sort: state.sort
});

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(fetchCategories()),
  changeSort: value => dispatch(changeSortAction(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
