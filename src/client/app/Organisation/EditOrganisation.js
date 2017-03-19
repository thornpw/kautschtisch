import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';
import request from 'superagent';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_organisation_offset,get_organisation_limit,get_organisation_filter } from './ListOrganisations';

function logChange(val) {
    console.log("Selected: " + val);
}

export default React.createClass({
  getInitialState: function() {
    return {Name: ''};
  },
  componentDidMount: function() {
    this.loadOrganisation();
  },
  onNameChange: function(e) {
    this.setState({Name: e.target.value});
  },
  loadOrganisation: function() {
    // load new organisation from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: "http://localhost:3300/api/db/KOrganisation/'"+this.props.params.uid +"'",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({'Name':data.data[0].Name});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/organisation', status, err.toString());
      }.bind(this)
    });
  },
  handleEdit: function() {
    // edit organisation
    // -------------------------------------------------------------------------
    var _edit = {"Name":this.state.Name}
    var _uid = this.props.params.uid;

    $.ajax({
      url: "http://localhost:3300/api/organisation/'" + _uid + "'",
      dataType: 'json',
      //contentType: 'application/json; charset=UTF-8',
      type: 'PUT',
      data: _edit,
      //data: JSON.stringify(_edit),
      success: function(data) {
        console.log("ok")
        window.location.replace(sprintf("/#/ListOrganisations/%s/%s/%s",get_organisation_offset(),get_organisation_limit(),get_organisation_filter()));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('/api/organisation', status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Edit organisation">
          <Form horizontal>
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
                    <Button onClick={this.handleEdit} bsStyle="success"><img src="media/gfx/ok.png"/></Button>
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
