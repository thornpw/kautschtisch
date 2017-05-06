import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Table,Thumbnail,Tabs,Tab,Grid,Row,Pagination } from 'react-bootstrap';

import { FileProperties } from "../Components/Files/FileProperties"
import { PagedMediaTable2 } from "../Components/PagedMediaTable2"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

export default class EditFile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'Name': '',
      'Info':'',
      'Path':'',
      'File':undefined,
    };
  }

  componentDidMount() {
    this.loadFile();
  }

  loadFile() {
    // load new file from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: "http://localhost:3300/api/db/KFile/'" + this.props.params.uid + "'",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({
          'Name':data.data[0].Name,
          'Info':data.data[0].Info,
          'Path':data.data[0].Path,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/file', status, err.toString());
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
    // edit file
    // -------------------------------------------------------------------------
    var _edit = {
      "Name":this.state.Name,
      "Info":this.state.Info,
      "Path":"file_uploads/" + this.state.File.name
    }

    var _uid = this.props.params.uid;

    if(this.state.File != undefined) {
      var _file =  new FormData()
      _file.append('file', this.state.File);

      // request a uuid
      // -------------------------------------------------------------------------
      $.ajax({
        url: "http://localhost:3300/api/file/'" + _uid + "'",
        dataType: 'json',
        type: 'PUT',
        data: _edit,
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
              console.error('http://localhost:3300/api/file 1', status, err.toString());
            }.bind(this)
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/api/file 1', status, err.toString());
        }.bind(this)
      })
    } else {
      $.ajax({
        url: "http://localhost:3300/api/file/'" + _uid + "'",
        dataType: 'json',
        type: 'PUT',
        data: _edit,
        success: function(data) {
          window.location.replace(sprintf("/#/ListFiles/0"));
        },
        error: function(xhr, status, err) {
          console.log(status,xhr,err);
          console.error('/api/file', status, err.toString())
        }
      })
    }
  }

  render() {
    return (
      <div>
        <Panel header="Edit file">
          <Tabs defaultActiveKey={1} id="file_tabs">
            <Tab eventKey={1} title="Data">
              <br/>
              <Form horizontal>
                <FileProperties update_parent={this.update_parent.bind(this)} data={this.state}/>
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
                        <Link to={sprintf("/ListFiles/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>
          </Tab>
          <Tab eventKey={2} title="Links">
            <br/>
            <PagedMediaTable2
              object_type='file_links'
              uid_object = {this.props.params.uid.toString()}
              row_type = "URLLink"
              view_name = "KLinksOfObject"
              tagged_component = "TaggedLink"
              object_filter= "0002"
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
