import React from 'react'

import { Navbar,Nav,NavItem } from 'react-bootstrap';

export default React.createClass({
  render: function() {
    return (
      <div className="header">
        <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>Kautschtisch</Navbar.Brand>
            </Navbar.Header>
            <Nav pullRight>
              <NavItem eventKey={1}>v0.3</NavItem>
            </Nav>
          </Navbar>
      </div>
    );
  }
});
