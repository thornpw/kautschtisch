import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel,Thumbnail } from 'react-bootstrap';

import { File } from "../Components/Files/File"
import { ObjectList } from "../Components/Lists/ObjectList"
import { ListColumn } from "../Components/Lists/ListColumn"
import { buildConditionFromFilters } from "../Utils/filter_utils"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { createStore } from 'redux'
import { addPagination,setNewFilter,setFilter,clearFilter,changeOffset,setAmountOfRows,resetPagination } from '../Redux/actions/pagination_actions'
import { r_pagination } from '../Redux/reducers/pagination_reducers'
import { pagination_store} from '../Redux/store/pagination_store'

// File List
// -----------------------------------------------------------------------------
class ListFiles extends React.Component {
  constructor(props) {
    super(props)

    this.object_type='files'
    this.state = {
      data: []
    }
    this.redux_state = pagination_store.getState().paginations[this.object_type]
  }

  load_data() {
    $.ajax({
      url: sprintf("http://localhost:3300/api/db/search/KFile?offset=%s&limit=%s%s",this.redux_state.offset,this.redux_state.limit,buildConditionFromFilters(this.redux_state.filters,this.redux_state.filter_columns)),
      dataType: 'json',
      cache: false,
      success: function(data) {
        pagination_store.dispatch(setAmountOfRows(this.object_type,data.amount))
        this.setState({
          data: data.data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  createFile(){
      var output = [];
      var items = this.state.data

      for(var i = 0; i < items.length; i++) {
        output.push(<File key={i} data={items[i]} update_parent_data={this.load_data.bind(this)}/>);
      }
      return output;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params != undefined && nextProps.params.redraw == 1) {
      pagination_store.dispatch(resetPagination(this.object_type))
      this.load_data()
    }
  }

  componentDidMount() {
    if(this.props.params != undefined && this.props.params.redraw == 1) {
      pagination_store.dispatch(resetPagination(this.object_type))
    }
    this.load_data()
  }

  render() {
    return (
      <div>
        <Panel header={"Files"}>
          <ObjectList
            add_link="/AddFile"
            createObject={this.createFile.bind(this)}
            object_type={this.object_type}
            update_data={this.load_data.bind(this)}
          >
            <ListColumn object_type='files' column_number={0} display_name="Name" update_data={this.load_data.bind(this)}/>
            <th>
              <table width="500px">
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </th>
          </ObjectList>
        </Panel>
      </div>
    )
  }
}

export default ListFiles
