import React from 'react';

import { Link } from 'react-router';
import { Button,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// ContextPile
// =============================================================================
// React component to display a file context in a context list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// doParentReadraw      redraw the parent
// data                 the attributes from the parent
// -FileUUID            the UUID of the file
// -MediaUID            the uid of the file. Used to link to the edit page
// -ContextUID          the uid of the context. Used to delete the context
//
// Model (state)
// *****************************************************************************
//
// Functions
// *****************************************************************************
// handleDelete         deletes the context
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class ContextFile extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDelete(id_to_delete) {
    $.ajax({
      url: "http://localhost:3300/api/db/KObject2MediaTag/" +  this.props.data.ContextUID,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.doParentRedraw()
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("ContextPile 1", status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return (
      <tr className="file">
        <td className="border">
          <Button bsStyle="danger" onClick={this.handleDelete.bind(this)}><img src="media/gfx/delete.png"/></Button>
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
