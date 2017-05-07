import React from 'react';
import { Link } from 'react-router'
import { Button } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// ContextLink
// =============================================================================
// React component to display a context link in a object list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// table                table to sarch the context in
// data                 the attributes from the parent
// -Name                the name of the link
// -URL                 the link URL
// -UID                 the UID of the link. Used to delete it
// doParentReload       call function to load links in the parent component
//
// Model (state)
// *****************************************************************************
//
// Functions
// *****************************************************************************
// handleDelete         deletes a context
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class ContextLink extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDelete() {
    $.ajax({
      url: "http://localhost:3300/api/db/KObject2MediaTag/" +  this.props.data.ContextUID,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.doParentReload();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("ContextLink 1", status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return (
      <tr className="link">
        <td className="border">
          <Button bsStyle="danger" onClick={this.handleDelete.bind(this)}><img src="media/gfx/delete.png"/></Button>
        </td>
        <td className="border">
          {this.props.data.TagName}
        </td>
        <td className="border">
          <Link to={"/EditLink/" + this.props.data.MediaUID}> {this.props.data.Name}</Link>
        </td>
        <td className="border">
          <a target="_blank" href={this.props.data.URL}> {this.props.data.URL}</a>
        </td>
      </tr>
    )
  }
}
