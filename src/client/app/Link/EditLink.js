import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Table,Thumbnail,Tabs,Tab,Grid,Row,Pagination } from 'react-bootstrap';

import { Selection } from "../Components/Select"
import { LinkProperties } from "../Components/Links/LinkProperties"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { kpagination } from '../Utils/kpagination'
import { link_pagination } from './ListLinks';

var link_pictures_pagignation = new kpagination(0,2,'')

export {
  link_pictures_pagignation
};

class EditLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Name: '',
      URL:'',
      Info:'',
      IsPicture:false,
      IsVideo:false
    }
  }

  componentDidMount() {
    this.loadLink();
  }

  loadLink() {
    // load new link from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: "http://localhost:3300/api/db/KLink/'" + this.props.params.uid + "'",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        // string -> boolean ETL
        var _IsPicture = false
        var _IsVideo = false

        if(data.data[0].IsPicture == "true") {
          _IsPicture = true
        }

        if(data.data[0].IsVideo == "true") {
          _IsVideo = true
        }

        this.setState({
          'Name':data.data[0].Name,
          'URL':data.data[0].URL,
          'Info':data.data[0].Info,
          'IsPicture':_IsPicture,
          'IsVideo':_IsVideo
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/link', status, err.toString());
      }.bind(this)
    });
  }

  update_parent(_Name,_URL,_Info,_IsPicture,_IsVideo) {
    this.setState({
      'Name': _Name,
      'URL': _URL,
      'Info': _Info,
      'IsPicture': _IsPicture,
      'IsVideo': _IsVideo
    });
  }

  handleEdit() {
    // edit link
    // -------------------------------------------------------------------------
    var _edit = {
      "Name":this.state.Name,
      "URL":this.state.URL,
      "Info":this.state.Info,
      "IsPicture":this.state.IsPicture,
      "IsVideo":this.state.IsVideo
    }

    var _uid = this.props.params.uid;

    $.ajax({
      url: "http://localhost:3300/api/link/'" + _uid + "'",
      dataType: 'json',
      //contentType: 'application/json; charset=UTF-8',
      type: 'PUT',
      data: _edit,
      //data: JSON.stringify(_edit),
      success: function(data) {
        window.location.replace(sprintf("/#/ListLinks/0"));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('/api/link', status, err.toString());
      }
    });
  }

  render() {
    return (
      <div>
        <Panel header="Edit link">
          <Tabs defaultActiveKey={1} id="link_tabs">
            <Tab eventKey={1} title="Data">
              <br/>
              <Form horizontal>
                <LinkProperties update_parent={this.update_parent.bind(this)} data={this.state}/>
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <ButtonToolbar>
                      <ButtonGroup>
                      {
                        this.state.Name != '' && this.state.URL != '' ?
                        <Button onClick={this.handleEdit.bind(this)}  bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                          : <Button onClick={this.handleEdit.bind(this)}  bsStyle="success" disabled><img src="media/gfx/ok.png"/></Button>
                      }
                      </ButtonGroup>
                      <ButtonGroup>
                        <Link to={sprintf("/ListLinks/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>
          </Tab>
        </Tabs>
        </Panel>
      </div>
    );
  }
}

export default EditLink
