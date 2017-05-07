import React from 'react';
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import { URLLink } from "../Components/Links/URLLink"
import { ObjectList } from "../Components/Lists/ObjectList"
import { ListColumn } from "../Components/Lists/ListColumn"
import { buildConditionFromFilters } from "../Utils/filter_utils"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { createStore } from 'redux'
import { addPagination,setNewFilter,setFilter,clearFilter,changeOffset,setAmountOfRows,resetPagination } from '../Redux/actions/pagination_actions'
import { r_pagination } from '../Redux/reducers/pagination_reducers'
import { pagination_store} from '../Redux/store/pagination_store'

// Link List
// -----------------------------------------------------------------------------
class ListLinks extends React.Component {
  constructor(props) {
    super(props)

    this.object_type='links'
    this.state = {
      data: []
    }
    this.redux_state = pagination_store.getState().paginations[this.object_type]
  }

  load_data() {
    $.ajax({
      url: sprintf("http://localhost:3300/api/db/search/KLink?offset=%s&limit=%s%s",this.redux_state.offset,this.redux_state.limit,buildConditionFromFilters(this.redux_state.filters,this.redux_state.filter_columns)),
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

  createLink(){
    var output = []
    var items = this.state.data

    for(var i = 0; i < items.length; i++) {
      output.push(<URLLink key={i} data={items[i]} table ="KLink" doParentReload={this.load_data.bind(this)}/>)
    }
    return output
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params != undefined && nextProps.params.reload == 1) {
      pagination_store.dispatch(resetPagination(this.object_type))
      this.load_data()
    }
  }

  componentDidMount() {
    if(this.props.params != undefined && this.props.params.reload == 1) {
      pagination_store.dispatch(resetPagination(this.object_type))
    }
    this.load_data()
  }

  render() {
    return (
      <div>
        <Panel header={"Links"}>
          <ObjectList
            add_link="/AddLink"
            createObject={this.createLink.bind(this)}
            object_type={this.object_type}
            update_data={this.load_data.bind(this)}
          >
            <ListColumn object_type='links' column_number={0} display_name="Name" update_data={this.load_data.bind(this)}/>
            <ListColumn object_type='links' column_number={1} display_name="URL" update_data={this.load_data.bind(this)}/>
          </ObjectList>
        </Panel>
      </div>
    )
  }
}

export default ListLinks
