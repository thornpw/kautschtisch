import React from 'react';

import { Link } from 'react-router';
import { Button,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// row data components
// =============================================================================
var MediaPicture = React.createClass({
  handleDelete: function(id_to_delete) {
    console.log("handleDelete")
    $.ajax({
      url: "/api/db/KPicture/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.props.doParentRedraw()
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/picture/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
      return (
        <tr className="picture">
          <td className="border">
            <Button bsStyle="danger" onClick={this.handleDelete.bind(null,this.props.data.id,this)}><img src="media/gfx/delete.png"/></Button>
          </td>
          <td width="100%" className="border">
            {
              this.props.data.uuid != null && this.props.data.uuid != '' ?
                <Thumbnail key="b" src={this.props.data.uuid != '' ? "uploads/"+this.props.data.uuid : null}/>
                : null
            }
          </td>
        </tr>
      );
  }
});

module.exports = MediaPicture;
