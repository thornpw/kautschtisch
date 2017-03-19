import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_system_offset } from './ListSystems';

export default React.createClass({
  getInitialState: function() {
    return {name: '',name_system:''};
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleAdd: function(e) {
    e.preventDefault();
    // add new system to memory
    // -------------------------------------------------------------------------
    var _new = {'name':this.state.name}

    // send new system to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/system',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        this.setState({'name':''});
        window.location.replace(sprintf("/#/ListSystems/%s",get_system_offset()));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/system', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Add new system">
          <Form onSubmit={this.handleAdd} horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onNameChange} value= {this.state.name}  />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button type="submit" bsStyle="success">Ok</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf('/ListSystems/%s',get_system_offset())}><Button>Cancel</Button></Link>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
});
