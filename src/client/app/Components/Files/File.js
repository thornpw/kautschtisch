import React from 'react';

import { Link } from 'react-router'
import { Button,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// File
// =============================================================================
// React component to display a file in a object list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// data                 the attributes from the parent
// -Name                the name of the file
// -uid                 the UID of the file. Used to delete it
// -FileUUID            UUID of the file
// -doParentReload  call function to load files in the parent component
//
// Model (state)
// *****************************************************************************
//
// Functions
// *****************************************************************************
// handleDelete         deletes a file
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class File extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDelete() {
    $.ajax({
      url: "http://localhost:3300/api/db/KFile/" + this.props.data.UID,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.doParentReload();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("File 1", status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return (
      <tr className="file">
        <td className="border">
          <Button bsStyle="danger" onClick={this.handleDelete.bind(this)}><img src="media/gfx/delete.png"/></Button>
        </td>
        <td width="100%" className="border">
          <Link to={"/EditFile/" + this.props.data.UID}> {this.props.data.Name}</Link>
        </td>
      </tr>
    )
  }
}
