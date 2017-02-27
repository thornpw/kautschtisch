import React from 'react'

import Header from './Header'
import Footer from './Footer'
import SideBar from './SideBar'

import { Grid,Row,Col } from 'react-bootstrap';

export default React.createClass({
  render: function() {
    return (
      <div className="layout">
      <Grid>
        <Row>
          <Header/>
        </Row>
        <Row className="show-grid">
          <Col sm={2} md={2}>
            <SideBar/>
          </Col>
          <Col sm={10} md={10}>
            {this.props.children}
          </Col>
        </Row>
        <Row>
          <Footer/>
        </Row>
      </Grid>
      </div>
    );
  }
});
