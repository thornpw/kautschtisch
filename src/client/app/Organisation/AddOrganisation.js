import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import { OrganisationProperties } from "../Components/Organisations/OrganisationProperties"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

export default class AddOrganisation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'Name': ''
    };
  }

  update_parent(_Name) {
    this.setState({
      'Name': _Name,
    });
  }

  handleAdd(e) {
    e.preventDefault();
    // add new organisation to memory
    // -------------------------------------------------------------------------
    var _new = {
      'Name':this.state.Name
    }

    // send new organisation to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/organisation',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        window.location.replace(sprintf("/#/ListOrganisations/0"));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/organisation', status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return (
      <div>
        <Panel header="Add new organisation">
          <Form onSubmit={this.handleAdd.bind(this)} horizontal>
            <OrganisationProperties update_parent={this.update_parent.bind(this)}/>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                  {
                    this.state.Name != '' ?
                    <Button type="submit" bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                      : <Button type="submit" bsStyle="success" disabled><img src="media/gfx/ok.png"/></Button>
                  }
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf("/ListOrganisations/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Panel>
      </div>
    )
  }
}
