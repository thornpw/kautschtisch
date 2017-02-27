import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div className="data">
          {this.props.children}
      </div>
    );
  }
});
