import React from 'react';
import { Link } from 'react-router'
import { Button } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// URLLink
// =============================================================================
// React component to display a link in a object list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// table                table to sarch the link in
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
// handleDelete         deletes a link
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class URLLink extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDelete() {
    $.ajax({
      url: sprintf("http://localhost:3300/api/db/KLink/%s",this.props.data.UID),
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.doParentReload();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("URLLink 1", status, err.toString());
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
          <Link to={"/EditLink/" + this.props.data.UID}> {this.props.data.Name}</Link>
        </td>
        <td className="border">
          <a target="_blank" href={this.props.data.URL}> {this.props.data.URL}</a>
        </td>
      </tr>
    )
  }
}
