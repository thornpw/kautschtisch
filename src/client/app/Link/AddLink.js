import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import { Selection } from "../Components/Select"
import { LinkProperties } from "../Components/Links/LinkProperties"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

class AddLink extends React.Component {
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

  update_parent(_Name,_URL,_Info,_IsPicture,_IsVideo) {
    console.log(_Name)
    this.setState({
      'Name': _Name,
      'URL': _URL,
      'Info': _Info,
      'IsPicture': _IsPicture,
      'IsVideo': _IsVideo
    });
  }

  handleAdd(e) {
    e.preventDefault();
    // add new link to memory
    // -------------------------------------------------------------------------
    var _new = {
      "Name":this.state.Name,
      "URL":this.state.URL,
      "Info":this.state.Info,
      "IsPicture":this.state.IsPicture,
      "IsVideo":this.state.IsVideo
    }

    // send new link to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/link',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        this.setState({'Name':''});
        window.location.replace(sprintf("/#/ListLinks/0"));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/link', status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <Panel header="Add new link">
          <Form onSubmit={this.handleAdd.bind(this)} horizontal>
            <LinkProperties update_parent={this.update_parent.bind(this)}/>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                  {
                    this.state.Name != '' && this.state.URL != '' ?
                    <Button type="submit" bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                      : <Button type="submit" bsStyle="success" disabled><img src="media/gfx/ok.png"/></Button>
                  }
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf("/ListLinks/0")}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
};

export default AddLink
