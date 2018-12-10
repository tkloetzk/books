import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Header.css';

export default class Header extends Component {
  constructor(...args) {
    super(...args);
    this.state = { height: undefined };
    this.containerDOM = null;
    this.scrollPosition = 0;
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (this.props.scrollAction >= scrollTop) {
      const step = this.scrollPosition - scrollTop;
      const actualHeight = this.containerDOM.offsetHeight;
      const height = actualHeight + step;
      this.setState({ height });
      this.scrollPosition = scrollTop;
    }
  }
  render() {
    return (
      <header
        className="header"
        ref={n => {
          this.containerDOM = n;
        }}
        style={{ height: this.state.height }}
      >
        <div className="header-content display-4">{this.props.children}</div>
      </header>
    );
  }
}
Header.propTypes = {
  children: PropTypes.string.isRequired,
  scrollAction: PropTypes.number
};
Header.defaultProps = {
  scrollAction: 250
};
