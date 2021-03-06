import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';
import request from 'superagent';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_engine_configuration_offset } from './ListEngine_configurations';

export default React.createClass({
  getInitialState: function() {
    return {name: ''};
  },
  componentDidMount: function() {
    this.loadEngine_configuration();
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  loadEngine_configuration: function() {
    // load new engine_configuration from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/db/KEngine_configuration/'+this.props.params.id,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({'name':data[0].name});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('http://localhost:3300/api/engine_configuration', status, err.toString());
      }.bind(this)
    });
  },
  handleEdit: function() {
    // edit engine_configuration
    // -------------------------------------------------------------------------
    var _edit = {"name":this.state.name}
    var _id = this.props.params.id;

    $.ajax({
      url: 'http://localhost:3300/api/engine_configuration/'+_id,
      contentType: 'application/json; charset=UTF-8',
      type: 'PUT',
      data: JSON.stringify(_edit),
      success: function(data) {
        window.location.replace(sprintf("/#/ListEngine_configurations/%s",get_engine_configuration_offset()));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('http://localhost:3300/api/engine_configuration', status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Edit engine_configuration">
          <Form horizontal>
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
                    <Button onClick={this.handleEdit}>Ok</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf('http://localhost:3300/ListEngine_configurations/%s',get_engine_configuration_offset())}><Button>Cancel</Button></Link>
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
