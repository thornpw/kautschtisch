import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_engine_file_offset } from './ListEngine_files';

export default React.createClass({
  getInitialState: function() {
    return {name: '',name_engine_file:''};
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleAdd: function(e) {
    e.preventDefault();
    // add new engine_file to memory
    // -------------------------------------------------------------------------
    var _new = {'name':this.state.name}

    // send new engine_file to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: '/api/engine_file',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        this.setState({'name':''});
        window.location.replace(sprintf("/#/ListEngine_files/%s",get_engine_file_offset()));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/engine_file', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Add new engine_file">
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
                    <Link to={sprintf('/ListEngine_files/%s',get_engine_file_offset())}><Button>Cancel</Button></Link>
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
