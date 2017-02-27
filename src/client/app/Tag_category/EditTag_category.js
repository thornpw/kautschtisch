import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';
import request from 'superagent';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_tag_category_offset } from './ListTag_categorys';

function logChange(val) {
    console.log("Selected: " + val);
}

export default React.createClass({
  getInitialState: function() {
    return {name: '',description: ''};
  },
  componentDidMount: function() {
    this.loadTag_category();
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  onDescriptionChange: function(e) {
    this.setState({description: e.target.value});
  },
  loadTag_category: function() {
    // load new tag_category from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: '/api/db/KTag_category/'+this.props.params.id,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({'name':data[0].name,'description':data[0].description});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/tag_category', status, err.toString());
      }.bind(this)
    });
  },
  handleEdit: function() {
    // edit tag_category
    // -------------------------------------------------------------------------
    var _edit = {"name":this.state.name,"description":this.state.description}
    var _id = this.props.params.id;

    $.ajax({
      url: '/api/tag_category/'+_id,
      contentType: 'application/json; charset=UTF-8',
      type: 'PUT',
      data: JSON.stringify(_edit),
      success: function(data) {
        console.log("ok")
        window.location.replace(sprintf("/#/ListTag_categorys/%s",get_tag_category_offset()));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('/api/tag_category', status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Edit tag_category">
          <Form horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onNameChange} value= {this.state.name}  />
              </Col>
            </FormGroup>
            <FormGroup controlId="description">
              <Col componentClass={ControlLabel} sm={2}>
                Description
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onDescriptionChange} value= {this.state.description}  />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button onClick={this.handleEdit} style={{padding:'8px 35px 8px 35px'}}  className="button-ok">
                      <span className="glyphicon glyphicon-ok"></span>
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf('/ListTag_categorys/%s',get_tag_category_offset())}>
                      <Button style={{padding:'8px 35px 8px 35px'}}>
                        <span className="glyphicon glyphicon-remove"></span>
                      </Button>
                    </Link>
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
