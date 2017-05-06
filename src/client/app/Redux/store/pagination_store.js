import { createStore } from 'redux'
import { addPagination,setNewFilter,setFilter,clearFilter,changeOffset,setAmountOfRows } from '../actions/pagination_actions'
import { r_pagination } from '../../Redux/reducers/pagination_reducers'

let pagination_store = createStore(r_pagination)

pagination_store.dispatch(
  addPagination({
    'links':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: ['',''],
      filter_columns: ["Name","URL"],
      offset: 0,
      limit: 2,
      new_filters: ['',''],
      filters: ['',''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'pictures':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name"],
      offset: 0,
      limit: 2,
      new_filters: [''],
      filters: [''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'files':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name"],
      offset: 0,
      limit: 2,
      new_filters: [''],
      filters: [''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'organisations':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name"],
      offset: 0,
      limit: 2,
      new_filters: [''],
      filters: [''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'picture_links':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name","URL"],
      offset: 0,
      limit: 2,
      new_filters: ['',''],
      filters: ['',''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'file_links':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name","URL"],
      offset: 0,
      limit: 2,
      new_filters: ['',''],
      filters: ['',''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'organisation_links':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name","URL"],
      offset: 0,
      limit: 2,
      new_filters: ['',''],
      filters: ['',''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    },
    'organisation_pictures':{
      initial_offset: 0,
      initial_limit: 2,
      initial_filters: [''],
      filter_columns: ["Name",""],
      offset: 0,
      limit: 2,
      new_filters: ['',''],
      filters: ['',''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    }
  })
)

export {
  pagination_store
}
