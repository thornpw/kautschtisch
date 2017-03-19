import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_tag_category_offset } from './ListTag_categorys';

export default React.createClass({
  getInitialState: function() {
    return {name: '',description: ''};
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  onDescriptionChange: function(e) {
    this.setState({description: e.target.value});
  },
  handleAdd: function(e) {
    e.preventDefault();
    // add new tag_category to memory
    // -------------------------------------------------------------------------
    var _new = {'name':this.state.name,'description':this.state.description}

    // send new tag_category to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/tag_category',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        this.setState({'name':'','description':''});
        window.location.replace(sprintf("/#/ListTag_categorys/%s",get_tag_category_offset()));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/tag_category', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Add new tag_category">
          <Form onSubmit={this.handleAdd} horizontal>
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
                    <Button style={{padding:'8px 35px 8px 35px'}} type="submit" className="button-ok">
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
