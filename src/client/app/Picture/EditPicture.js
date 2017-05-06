import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Table,Thumbnail,Tabs,Tab,Grid,Row,Pagination } from 'react-bootstrap';

import { PictureProperties } from "../Components/Pictures/PictureProperties"
import { PagedMediaTable2 } from "../Components/PagedMediaTable2"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

export default class EditPicture extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'Name': '',
      'Info':'',
      'FileUUID':'',
      'File':undefined,
    };
  }

  componentDidMount() {
    this.loadPicture();
  }

  loadPicture() {
    // load new picture from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: "http://localhost:3300/api/db/KPicture/'" + this.props.params.uid + "'",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({
          'Name':data.data[0].Name,
          'Info':data.data[0].Info,
          'FileUUID':data.data[0].FileUUID,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/picture', status, err.toString());
      }.bind(this)
    });
  }

  update_parent(_Name,_Info,_File) {
    this.setState({
      'Name': _Name,
      'Info': _Info,
      'File': _File,
    });
  }

  handleEdit() {
    // edit picture
    // -------------------------------------------------------------------------
    var _edit = {
      "Name":this.state.Name,
      "Info":this.state.Info,
      "FileUUID":this.state.FileUUID
    }

    var _uid = this.props.params.uid;

    if(this.state.File != undefined) {
      var photo =  new FormData()
      photo.append('photo', this.state.File);

      // request a uuid
      // -------------------------------------------------------------------------
      $.ajax({
        url: encodeURI(sprintf('http://localhost:3300/api/uuid')),
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function(data) {
          // add uuid to new data
          var _uuid = data.uuid
           _edit['FileUUID'] = _uuid

          // send new picture to the db
          // -------------------------------------------------------------------------
          $.ajax({
            url: "http://localhost:3300/api/picture/'" + _uid + "'",
            dataType: 'json',
            type: 'PUT',
            data: _edit,
            success: function(data) {
              $.ajax({
                url: 'http://localhost:3300/api/picture/upload/'+ _uuid,
                data: photo,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                  window.location.replace(sprintf("/#/ListPictures/0"));
                }.bind(this),
                error: function(xhr,status,err) {
                  console.error('http://localhost:3300/api/picture 1', status, err.toString())
                }.bind(this)
              });
            }.bind(this),
            error: function(xhr, status, err) {
              console.error('/api/picture 1', status, err.toString())
            }.bind(this)
          });
        },
        error: function(xhr, status, err) {
          console.error('/api/picture 2', status, err.toString())
        }.bind(this)
      });
    } else {
      $.ajax({
        url: "http://localhost:3300/api/picture/'" + _uid + "'",
        dataType: 'json',
        type: 'PUT',
        data: _edit,
        success: function(data) {
          window.location.replace(sprintf("/#/ListPictures/0"));
        },
        error: function(xhr, status, err) {
          console.log(status,xhr,err);
          console.error('/api/picture', status, err.toString())
        }
      })
    }
  }

  render() {
    return (
      <div>
        <Panel header="Edit picture">
          <Tabs defaultActiveKey={1} id="picture_tabs">
            <Tab eventKey={1} title="Data">
              <br/>
              <Form horizontal>
                <PictureProperties update_parent={this.update_parent.bind(this)} data={this.state}/>
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
                        <Link to={sprintf("/ListPictures/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>
          </Tab>
          <Tab eventKey={3} title="Links">
            <br/>
            <PagedMediaTable2
              object_type='picture_links'
              uid_object = {this.props.params.uid.toString()}
              row_type = "URLLink"
              view_name = "KLinksOfObject"
              tagged_component = "TaggedLink"
              object_filter= "0009"
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
