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
      column_has_filter:[true,true],
      filter_columns_displaynames: ["Name","URL"],
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
      column_has_filter:[true,false],
      filter_columns_displaynames: ["Name",''],
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
      column_has_filter:[true],
      filter_columns_displaynames: ["Name"],
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
      column_has_filter:[true],
      filter_columns_displaynames: ["Name"],
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
      column_has_filter:[false,true,true],
      filter_columns_displaynames: ["Conext","Name","URL"],
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
      column_has_filter:[false,true,true],
      filter_columns_displaynames: ["Conext","Name","URL"],
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
      column_has_filter:[false,true,true],
      filter_columns_displaynames: ["Conext","Name","URL"],
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
      column_has_filter:[false,true,false],
      filter_columns_displaynames: ["Conext","Name",''],
      filter_columns: ["Name"],
      offset: 0,
      limit: 2,
      new_filters: [''],
      filters: [''],
      active_page: 1,
      max_page: 1,
      total_rows: 0
    }
  })
)

export {
  pagination_store
}
