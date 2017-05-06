import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import { PictureProperties } from "../Components/Pictures/PictureProperties"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

export default class AddPicture extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      'Name':'',
      'Info':'',
      'File':undefined
    }
  }

  update_parent(_Name,_Info,_File) {
    this.setState({
      'Name': _Name,
      'Info': _Info,
      'File': _File
    });
  }

  handleAdd(e) {
    e.preventDefault();

    // create data for picture post
    // ---------------------------------------------------------------------
    var photo =  new FormData()
    photo.append('photo', this.state.File);

    var _new = {
      'Name':this.state.Name,
      'Info':this.state.Info
    };

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
         _new['FileUUID'] = _uuid;

        // send new picture to the db
        // -------------------------------------------------------------------------
        $.ajax({
          url: 'http://localhost:3300/api/picture',
          dataType: 'json',
          type: 'POST',
          data: _new,
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
                console.error('http://localhost:3300/api/picture 1', status, err.toString());
              }.bind(this)
            });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('/api/picture 1', status, err.toString());
          }.bind(this)
        });
      },
      error: function(xhr, status, err) {
        console.error('/api/picture 2', status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <Panel header="Add new picture">
          <Form onSubmit={this.handleAdd.bind(this)} horizontal>
            <PictureProperties update_parent={this.update_parent.bind(this)}/>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                  {
                    this.state.Name != '' && this.state.File != undefined ?
                    <Button type="submit" bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                      : <Button type="submit" bsStyle="success" disabled><img src="media/gfx/ok.png"/></Button>
                  }
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf("/ListPictures/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
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
