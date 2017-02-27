import React from 'react';

import { Button,ButtonGroup,ButtonToolbar,FormControl } from 'react-bootstrap';


const Search = React.createClass({
  getInitialState: function() {
    return {
      input_filter:'',
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({input_filter:nextProps.input_filter});
  },
  render: function() {
    return (
      <table>
        <tbody>
          <tr>
            <td>{this.props.column_name}</td>
            <td width="4px"></td>
            <td>
                <FormControl type="text" placeholder="Search for" onChange={this.props.onFilterChange} value = {this.state.input_filter}/>
            </td>
            <td style={{padding:'4px'}}>
            { this.state.input_filter != this.props.actual_filter ?
              <div display="inline">
                  <Button className='glyphicon glyphicon-refresh' onClick={this.props.onFilterReset}/>
              </div>: null
            }
            </td>
            <td style={{padding:'0px'}}>
            { this.state.input_filter.length > 0 ?
              <div display="inline">
                  <Button className='glyphicon glyphicon-remove' onClick={this.props.onFilterClear}/>
              </div>: null
            }
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
});

module.exports = Search;
