import React from 'react';
import { Link } from 'react-router'
import { Button,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// Picture
// =============================================================================
// React component to display a picture in a object list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// data                 the attributes from the parent
// -Name                the name of the picture
// -uid                 the UID of the picture. Used to delete it
// -FileUUID            UUID of the picture
// -update_parent_data  call function to load pictures in the parent component
//
// Model (state)
// *****************************************************************************
//
// Functions
// *****************************************************************************
// handleDelete         deletes a picture
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class Picture extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDelete() {
    $.ajax({
      url: "http://localhost:3300/api/db/KPicture/" + this.props.data.UID,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.update_parent_data();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Picture 1", status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return (
      <tr className="picture">
        <td className="border">
          <Button bsStyle="danger" onClick={this.handleDelete.bind(this)}><img src="media/gfx/delete.png"/></Button>
          </td>
          <td width="100%" className="border">
            <Link to={"/EditPicture/" + this.props.data.UID}> {this.props.data.Name}</Link>
          </td>
          <td width="100%" className="border">
          {
            this.props.data.FileUUID != null && this.props.data.FileUUID != '' ?
              <Thumbnail key="b" src={this.props.data.FileUUID != '' ? "http://localhost:3300/uploads/"+this.props.data.FileUUID : null}/>
              : null
          }
        </td>
      </tr>
    )
  }
}
