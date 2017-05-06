import React from 'react';
import { Link } from 'react-router'
import { Button,FormControl } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { createStore } from 'redux'
import { addPagination,setNewFilter,setFilter,clearFilter,changeOffset,setAmountOfRows } from '../../Redux/actions/pagination_actions'
import { r_pagination } from '../../Redux/reducers/pagination_reducers'
import { pagination_store} from '../../Redux/store/pagination_store'

// ListColumn
// =============================================================================
// React component to display a link a object list
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// display_name         the name of the column
// column_number        the number of the column in the list
// update_data          call function to reload parent data
//
// Model (state)
// *****************************************************************************
// new_filter           the text that is entered in the search field. This text
//                      becomes the real filter after pressing the search button
//
// Functions
// *****************************************************************************
// onNewFilterChange    callback when a character is typed
// onFilterChange       the filter becomes the text in the search field
// onFilterClear        clear the filter as well as the search field
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

class ListColumn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      new_filter:''
    }
  }

  onNewFilterChange(e) {
    console.log("1")
    this.setState({new_filter: e.target.value})
    pagination_store.dispatch(setNewFilter(this.props.object_type,this.props.column_number,e.target.value))
  }

  onFilterChange(e) {
    console.log("2:"+this.props.object_type)
    pagination_store.dispatch(setFilter(this.props.object_type,this.props.column_number))
    this.props.update_data()
  }

  onFilterClear(e) {
        console.log("3")
    this.setState({new_filter: ''})
    pagination_store.dispatch(clearFilter(this.props.object_type,this.props.column_number))
    this.props.update_data()
  }

  render() {
    return (
      <th>
        <table width="300px">
          <tbody>
            <tr>
              <td>{this.props.display_name}</td>
              <td width="4px"></td>
              <td>
                  <FormControl type="text" placeholder="Search for" onChange={this.onNewFilterChange.bind(this)} value = {this.state.new_filter}/>
              </td>
              <td width="4px"></td>
              <td>
                <Button onClick={this.onFilterChange.bind(this)}><img src="media/gfx/search.png"/></Button>
              </td>
              <td width="4px"></td>
              <td>
                <Button onClick={this.onFilterClear.bind(this)}><img src="media/gfx/clear_filter.png"/></Button>
              </td>
            </tr>
          </tbody>
        </table>
      </th>
    )
  }
}

export {
  ListColumn
}
