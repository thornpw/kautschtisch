import React from 'react';
import Dropzone from 'react-dropzone';
// import request from 'superagent';

import { Link } from 'react-router';
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Table,Thumbnail,Tabs,Tab,Grid,Row,Pagination } from 'react-bootstrap';

import Selection from "../Components/Select.js"
import PagedMediaTable from "../Components/PagedMediaTable.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_engine_offset } from './ListEngines';

const game_pictures_initial_offset = 0;
const game_pictures_initial_limit = 2;
var game_pictures_filter = ''

var game_pictures_offset = game_pictures_initial_offset;
var game_pictures_limit = game_pictures_initial_limit;

function get_game_pictures_initial_offset() {
  return game_pictures_initial_offset;
}

function get_game_pictures_offset() {
  return game_pictures_offset;
}

function set_game_pictures_offset(value) {
  game_pictures_offset=parseInt(value);
}

function get_game_pictures_initial_limit() {
  return engine_s_initial_limit;
}

function get_game_pictures_limit() {
  return game_pictures_limit;
}

function set_game_pictures_limit(value) {
  game_pictures_limit=parseInt(value);
}

function get_game_pictures_filter() {
  return game_pictures_filter;
}

function set_game_pictures_filter(value) {
  game_pictures_filter=value;
}

export {
  get_game_pictures_initial_offset,
  get_game_pictures_offset,
  get_game_pictures_initial_limit,
  get_game_pictures_limit,
  set_game_pictures_offset,
  set_game_pictures_limit,
  get_game_pictures_filter,
  set_game_pictures_filter
};

export default React.createClass({
  getInitialState: function() {
    return {
      name: '',
      executable: '',
      name_system: '',
      id_system: '',
      name_default_engine_configuration:'',
      id_default_engine_configuration:'',
      uploadedFile: new FormData(),
      picturenew:'',uid_logo:'',
    };
  },
  componentDidMount: function() {
    this.loadEngine_configuration();
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  onExecutableChange: function(e) {
    this.setState({executable: e.target.value});
  },
  onSystemChange: function(e) {
    this.setState({id_system: e.target.value,name_system: e.target.childNodes[e.target.selectedIndex].label});
  },
  onEngine_configurationChangeChange: function(e) {
    this.setState({id_default_engine_configuration: e.target.value,name_default_engine_configuration: e.target.childNodes[e.target.selectedIndex].label});
  },
  onPictureNewChange: function(e) {
    this.setState({picturenew: e.target.value});
  },
  loadEngine_configuration: function() {
    // load new Engine from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: '/api/db/KEngine/'+this.props.params.id,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({
          'name':data[0].name,
          'executable':data[0].executable,
          'id_system':data[0].id_system,
          'id_default_engine_configuration':data[0].id_default_engine_configuration,
          'uid_logo':data[0].uid_logo
        });

        if(this.state.id_system == null ) {
          this.setState({name_system:''});
        } else {
          $.ajax({
            url: '/api/db/KSystem/'+this.state.id_system,
            dataType: 'json',
            type: 'GET',
            success: function(data) {
              this.setState({'name_system':data[0].name});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error('/api/system', status, err.toString());
            }.bind(this)
          });
        };

        if(this.state.id_default_engine_configuration == null ) {
          this.setState({name_default_engine_configuration:''});
        } else {
          $.ajax({
            url: '/api/db/KEngine_configuration/'+this.state.id_default_engine_configuration,
            dataType: 'json',
            type: 'GET',
            success: function(data) {
              if ('msg' in data) {
                this.setState({'name_default_engine_configuration':''});
              } else {
                this.setState({'name_default_engine_configuration':data[0].name});
              }
            }.bind(this),
            error: function(xhr, status, err) {
              console.error('/api/engine_configuration', status, err.toString());
            }.bind(this)
          });
        };

      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/engine', status, err.toString());
      }.bind(this)
    });
  },
  handleEdit: function() {
    // add new Engine to Memory
    // -------------------------------------------------------------------------
    // send new Engine to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: '/api/uuid',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var _uuid = '';

        if(this.state.picturenew.length > 0) {
          _uuid = data[0]['uuid'];
        } else {
          _uuid = this.state.uid_logo;
        }

        var _edit = {
          'id_system':this.state.id_system,
          'id_default_engine_configuration':this.state.id_default_engine_configuration,
          'name':this.state.name,
          'executable':this.state.executable,
          'uid_logo':_uuid
        };

        $.ajax({
          url: '/api/engine/'+this.props.params.id,
          type: 'PUT',
          data: JSON.stringify(_edit),
          contentType : 'application/json',
          dataType: 'json',
          success: function(data) {
            $.ajax({
                url: '/api/engine/upload/'+_uuid,
                data: this.state.uploadedFile,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                  console.log("ok");
                  window.location.replace(sprintf("/#/ListEngines/%s",get_engine_offset()));
                }.bind(this),
                error: function(xhr,status,err) {
                  console.error('/api/engine 1', status, err.toString());
                }.bind(this)
              });
              console.log("ok");
              window.location.replace(sprintf("/#/ListEngines/%s",get_engine_offset()));
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('/api/engine 2', status, err.toString());
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/engine 3', status, err.toString());
      }.bind(this)
    });
  },
  onImageDrop(files) {
    var photo = this.state.uploadedFile;
    photo.append('photo', files[0]);
    photo.append('test', 'hallo');
    this.setState({picturenew:files,uploadedFile: photo});
  },
  render: function() {
    return (
      <div>
        <Panel header="Edit engine">
          <Tabs defaultActiveKey={1} id="engine_tabs">
            <Tab eventKey={1} title="Data">
              <br/>
              <Form horizontal>
                <FormGroup controlId="name">
                  <Col componentClass={ControlLabel} sm={2}>
                    Name
                  </Col>
                  <Col sm={10}>
                    <FormControl onChange={this.onNameChange} value= {this.state.name}  />
                  </Col>
                </FormGroup>
                <FormGroup controlId="executable">
                  <Col componentClass={ControlLabel} sm={2}>
                    Executable
                  </Col>
                  <Col sm={10}>
                    <FormControl onChange={this.onExecutableChange} value = {this.state.executable} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="system">
                  <Col componentClass={ControlLabel} sm={2}>
                    System
                  </Col>
                  <Col sm={4}>
                    <Link to={sprintf('/EditSystem/%s',this.state.id_system)}>
                      <FormControl disabled value = {this.state.name_system} />
                    </Link>
                  </Col>
                  <Col sm={6}>
                    <Selection target="system" filters='-' column="name" value="a" change_function={this.onSystemChange}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="default_engine_configuration">
                  <Col componentClass={ControlLabel} sm={2}>
                    Default configuration
                  </Col>
                  <Col sm={4}>
                    <Link to={sprintf('/EditEngine_configuration/%s',this.state.id_default_engine_configuration)}>
                      <FormControl disabled value = {this.state.name_default_engine_configuration} />
                    </Link>
                  </Col>
                  <Col sm={6}>
                    <Selection target="engine_configuration" filters='-' column="name" value="a" change_function={this.onEngine_configurationChange}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="picture">
                  <Col componentClass={ControlLabel} sm={2}>
                    Logo
                  </Col>
                  <Col sm={10}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Actual</th>
                          <th>Select new</th>
                          <th>New</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td width="33%">
                          {
                            this.state.uid_logo != null && this.state.uid_logo != '' ?
                              <Thumbnail key="b" src={this.state.uid_logo != '' ? "uploads/"+this.state.uid_logo : null}/>
                              : null
                          }
                          </td>
                          <td width="33%">
                          <Dropzone
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop}>
                            <p>Drop an image or click to select a file to upload.</p>
                          </Dropzone>
                          </td>
                          <td width="33%">
                          {
                            this.state.picturenew.length > 0 ?
                              <div>
                                <div>{this.state.picturenew.map((file) =>
                                  <Thumbnail key="a" src={file.preview}/>
                                  )}</div>
                              </div>
                              : null
                          }
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <ButtonToolbar>
                      <ButtonGroup>
                        <Button onClick={this.handleEdit} bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Link to={sprintf('/ListEngines/%s',get_engine_offset())}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>
          </Tab>
          <Tab eventKey={2} title="Pictures">
            <br/>
            <PagedMediaTable
              uid_object = {"0001:" + this.props.params.id.toString()}
              row_type = "MediaPicture"
              get_initial_offset={get_game_pictures_initial_offset}
              get_offset={get_game_pictures_offset}
              set_offset={set_game_pictures_offset}
              get_inititial_limit={get_game_pictures_initial_limit}
              get_limit={get_game_pictures_limit}
              set_limit={set_game_pictures_limit}
              get_filter={get_game_pictures_filter}
              set_filter={set_game_pictures_filter}
              tag_filter= "id_tag_category|8"
              max_buttons= {5}
            />
          </Tab>
          <Tab eventKey={3} title="Videos">
            <br/>
            Tab 3 content
          </Tab>
          <Tab eventKey={4} title="Files">
            <br/>
            Tab 3 content
          </Tab>
        </Tabs>
        </Panel>
      </div>
    );
  }
});
