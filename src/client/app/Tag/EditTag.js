import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';
import request from 'superagent';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_tag_offset } from './ListTags';

function logChange(val) {
    console.log("Selected: " + val);
}

export default React.createClass({
  getInitialState: function() {
    return {name: ''};
  },
  componentDidMount: function() {
    this.loadTag();
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  loadTag: function() {
    // load new tag from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: '/api/db/KTag/'+this.props.params.id,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({'name':data[0].name});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/tag', status, err.toString());
      }.bind(this)
    });
  },
  handleEdit: function() {
    // edit tag
    // -------------------------------------------------------------------------
    var _edit = {"name":this.state.name}
    var _id = this.props.params.id;

    $.ajax({
      url: '/api/tag/'+_id,
      contentType: 'application/json; charset=UTF-8',
      type: 'PUT',
      data: JSON.stringify(_edit),
      success: function(data) {
        console.log("ok")
        window.location.replace(sprintf("/#/ListTags/%s",get_tag_offset()));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('/api/tag', status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Edit tag">
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
                    <Link to={sprintf('/ListTags/%s',get_tag_offset())}><Button>Cancel</Button></Link>
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
