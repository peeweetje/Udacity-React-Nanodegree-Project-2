import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategories, fetchPostsCategory } from "../actions";
import { Sidebar, Menu, Image, Icon, Responsive } from "semantic-ui-react";

class SideBar extends Component {
  //Keeps track of the visibility state of the mobile sidebar.
  state = { visible: false };

  //Get all the categories, to display in the Mobile Menu (sidebar).
  componentDidMount() {
    this.props.fetchCategories();
  }

  //Dispatches action to get the posts for a category, when clicking on a Menu Button,
  //otherwise the posts won't update when you navigate between the different category pages.
  getPostsByCategory = category => {
    this.props.fetchPostsCategory(category);
  };

  //Toggele the visibility from the SideBar when the menu button is clicked.
  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;
    const { receiveCategories } = this.props;
    return (
      <div>
        <Responsive
          as={Menu}
          maxWidth={767}
          className="hamburger-menu"
          size="large"
          secondary
          attached="top"
        >
          <Menu.Item onClick={this.toggleVisibility}>
            <Icon name="sidebar" />Menu
          </Menu.Item>
        </Responsive>
        <Responsive maxWidth={767} as={Image}>
          <Sidebar
            as={Menu}
            width="thin"
            animation="overlay"
            visible={visible}
            icon="labeled"
            vertical
            inverted
          >
            <Link to="/">
              <Menu.Item className="mobile-menu-btn" name="home">
                Home
              </Menu.Item>
            </Link>
            {//Check if their are categories, if so, map over the,
            receiveCategories.length > 0 &&
              receiveCategories.map(category => (
                <Link
                  //When the menu link/item is clicked, dispatch action to
                  //fetch the matching posts for a category, and go to the right
                  //page.
                  onClick={() => this.getPostsByCategory(category.name)}
                  key={category.path}
                  to={`/${category.name}`}
                >
                  <Menu.Item name="menu-item">
                    {//Capitalize first letter of the category
                    // + past the rest of the category name behind
                    //capitalized first letter, to display on menu
                    category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </Menu.Item>
                </Link>
              ))}
            <Link onClick={this.toggleVisibility} to="#">
              <Menu.Item className="close-btn">
                <Icon name="close" />
              </Menu.Item>
            </Link>
          </Sidebar>
          <Sidebar.Pusher />
        </Responsive>
      </div>
    );
  }
}

//Give SideBar access to categories from redux store.
const mapStateToProps = ({ receiveCategories }) => ({
  receiveCategories
});

//Pass actions directly into connect method, so mapDispatchToProps function
//doesn't have to be defined, and less code is needed.
export default connect(mapStateToProps, {
  fetchCategories,
  fetchPostsCategory
})(SideBar);
