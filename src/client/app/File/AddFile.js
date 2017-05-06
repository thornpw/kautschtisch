import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import { FileProperties } from "../Components/Files/FileProperties"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

export default class AddFile extends React.Component {
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

    // create data for file post
    // ---------------------------------------------------------------------
    var _file =  new FormData()
    _file.append('file', this.state.File);

    var _new = {
      'Name':this.state.Name,
      'Info':this.state.Info,
      'Path':'file_uploads/' + this.state.File.name
    };

    // send new file to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/file',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        $.ajax({
          url: 'http://localhost:3300/api/file/upload/'+ this.state.File.name,
          data: _file,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function(data){
            window.location.replace(sprintf("/#/ListFiles/0"));
          }.bind(this),
          error: function(xhr,status,err) {
            console.error('/api/file 1', status, err.toString());
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/file 2', status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return (
      <div>
        <Panel header="Add new file">
          <Form onSubmit={this.handleAdd.bind(this)} horizontal>
            <FileProperties update_parent={this.update_parent.bind(this)}/>
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
                    <Link to={sprintf("/ListFiles/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
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
