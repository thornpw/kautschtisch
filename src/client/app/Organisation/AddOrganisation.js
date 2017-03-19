import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_organisation_offset,get_organisation_limit,get_organisation_filter } from './ListOrganisations';

export default React.createClass({
  getInitialState: function() {
    return {Name: '',name_organisation:''};
  },
  onNameChange: function(e) {
    this.setState({Name: e.target.value});
  },
  handleAdd: function(e) {
    e.preventDefault();
    // add new organisation to memory
    // -------------------------------------------------------------------------
    var _new = {'Name':this.state.Name}

    // send new organisation to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/organisation',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        this.setState({'Name':''});
        window.location.replace(sprintf("/#/ListOrganisations/%s/%s/%s",get_organisation_offset(),get_organisation_limit(),get_organisation_filter()));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/organisation', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Add new organisation">
          <Form onSubmit={this.handleAdd} horizontal>
            <FormGroup controlId="Name">
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onNameChange} value= {this.state.Name}  />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button type="submit" bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf("/ListOrganisations/%s/%s/%s",get_organisation_offset(),get_organisation_limit(),get_organisation_filter())}><Button><img src="media/gfx/cancel.png"/></Button></Link>
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
