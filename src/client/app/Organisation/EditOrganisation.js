import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Table,Thumbnail,Tabs,Tab,Grid,Row,Pagination } from 'react-bootstrap';

import { OrganisationProperties } from "../Components/Organisations/OrganisationProperties"
import { PagedMediaTable2 } from "../Components/PagedMediaTable2"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

export default class EditOrganisation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'Name': '',
      'Info':'',
    };
  }

  componentDidMount() {
    this.loadOrganisation();
  }

  loadOrganisation() {
    // load new file from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: "http://localhost:3300/api/db/KOrganisation/'" + this.props.params.uid + "'",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({
          'Name':data.data[0].Name,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/organisation', status, err.toString());
      }.bind(this)
    });
  }

  update_parent(_Name,_Info,_File) {
    this.setState({
      'Name': _Name
    });
  }

  handleEdit() {
    // edit file
    // -------------------------------------------------------------------------
    var _edit = {
      "Name":this.state.Name
    }

    var _uid = this.props.params.uid;

    $.ajax({
      url: "http://localhost:3300/api/organisation/'" + _uid + "'",
      dataType: 'json',
      type: 'PUT',
      data: _edit,
      success: function(data) {
        window.location.replace(sprintf("/#/ListOrganisations/0"));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('/api/organisation', status, err.toString())
      }
    })
  }

  render() {
    return (
      <div>
        <Panel header="Edit organisation">
          <Tabs defaultActiveKey={1} id="organisation_tabs">
            <Tab eventKey={1} title="Data">
              <br/>
              <Form horizontal>
                <OrganisationProperties update_parent={this.update_parent.bind(this)} data={this.state}/>
                <FormGroup>
                  <Col smOffset={1} sm={11}>
                    <ButtonToolbar>
                      <ButtonGroup>
                      {
                        this.state.Name != '' ?
                        <Button onClick={this.handleEdit.bind(this)} bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                          : <Button onClick={this.handleEdit.bind(this)} bsStyle="success" disabled><img src="media/gfx/ok.png"/></Button>
                      }
                      </ButtonGroup>
                      <ButtonGroup>
                        <Link to={sprintf("/ListOrganisations/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>
          </Tab>
          <Tab eventKey={3} title="Links">
            <br/>
            <PagedMediaTable2
              object_type='organisation_links'
              uid_object = {this.props.params.uid.toString()}
              row_type = "URLLink"
              view_name = "KLinksOfObject"
              tagged_component = "TaggedLink"
              object_filter= "0010"
              media_type="0004"
              max_buttons= {5}
            />
          </Tab>
        </Tabs>
        </Panel>
      </div>
    )
  }
}
