import React from 'react';
import { Link } from 'react-router'
import { Button,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// Organisation
// =============================================================================
// React component to display a organisation in a object list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// data                 the attributes from the parent
// -Name                the name of the organisation
// -uid                 the UID of the organisation. Used to delete it
// -update_parent_data  call function to load organisations in the parent component
//
// Model (state)
// *****************************************************************************
//
// Functions
// *****************************************************************************
// handleDelete         deletes a organisation
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class Organisation extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDelete() {
    $.ajax({
      url: "http://localhost:3300/api/db/KOrganisation/" + this.props.data.UID,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.update_parent_data();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Organisation 1", status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return (
      <tr className="organisation">
        <td className="border">
          <Button bsStyle="danger" onClick={this.handleDelete.bind(this)}><img src="media/gfx/delete.png"/></Button>
        </td>
        <td width="100%" className="border">
          <Link to={"/EditOrganisation/" + this.props.data.UID}> {this.props.data.Name}</Link>
        </td>
      </tr>
    )
  }
}
