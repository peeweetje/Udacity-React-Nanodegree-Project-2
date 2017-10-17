import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Image,
  Icon,
  Header,
  Responsive
} from "semantic-ui-react";

class SideBar extends Component {
  state = { visible: false };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;
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
        <Responsive as={Sidebar.Pusher} maxWidth={767} as={Image}>
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
              <Menu.Item name="home">Home</Menu.Item>
            </Link>
            <Link to="/react">
              <Menu.Item name="react">React</Menu.Item>
            </Link>
            <Link to="/redux">
              <Menu.Item name="Redux">Redux</Menu.Item>
            </Link>
            <Link to="/udacity">
              <Menu.Item name="udacity">Udacity</Menu.Item>
            </Link>
            <Link to="javascript">
              <Menu.Item name="javascript">Javascript</Menu.Item>
            </Link>
          </Sidebar>
          <Sidebar.Pusher />
        </Responsive>
      </div>
    );
  }
}

export default SideBar;
