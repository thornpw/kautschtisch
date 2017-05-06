import React from 'react';
import { Link } from 'react-router'
import { Button,Panel,Table,Pagination } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { createStore } from 'redux'
import { addPagination,setNewFilter,setFilter,clearFilter,changeOffset,setAmountOfRows,resetPagination } from '../../Redux/actions/pagination_actions'
import { r_pagination } from '../../Redux/reducers/pagination_reducers'
import { pagination_store} from '../../Redux/store/pagination_store'

// Link List
// -----------------------------------------------------------------------------
export class ObjectList extends React.Component {
  constructor(props) {
    super(props)

    this.redux_state = pagination_store.getState().paginations[this.props.object_type]
  }

  handleSelect(eventKey) {
    pagination_store.dispatch(changeOffset(this.props.object_type,eventKey))
    this.props.update_data()
  }

  render() {
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                { this.props.add_link != '' ?
                  <Link to={this.props.add_link}><Button bsStyle="success" type="submit"><img src="media/gfx/add.png"/></Button></Link> :
                  <div/>
                }
              </th>
              {this.props.children}
            </tr>
          </thead>
          <tbody>
            {this.props.createObject()}
          </tbody>
        </Table>
        <ul className="pagination">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={Math.ceil(this.redux_state.total_rows /this.redux_state.limit)}
            maxButtons={5}
            activePage={this.redux_state.active_page}
            onSelect={this.handleSelect.bind(this)}
          />
        </ul>
        <div className="form-group">
          &nbsp;
        </div>
      </div>
    )
  }
}
