class kpagination {
  constructor(offset,limit,filter) {
    this.initial_offset = offset;
    this.initial_limit = limit;
    this.initial_filter=filter;

    this.offset = offset;
    this.limit = limit;
    this.filter=filter;
    this.filters=[]
    this.new_filters=[]
    this.active_page = 0
  }

  get_initial_offset() {
    return this.initial_offset;
  }

  get_offset() {
    return this.offset;
  }

  set_offset(value) {
    this.offset=parseInt(value);
  }

  get_initial_limit() {
    return this.initial_limit;
  }

  get_limit() {
    return this.limit;
  }

  set_limit(value) {
    this.limit=parseInt(value);
  }

  get_filter() {
    return this.filter;
  }

  set_filter(value) {
    this.filter=value;
  }

  get_filters(number) {
    return this.filters[number]
  }

  set_filters(number,value) {
    this.filters[number] = value
  }

  get_new_filters(number) {
    return this.new_filters[number]
  }

  set_new_filters(number,value) {
    this.new_filters[number] = value
  }

  get_initial_filter() {
    return this.initial_filter;
  }

  get_initial_filter_string() {
    return '';
  }

  get_filter_string() {
    var _filter = this.get_filter();
    var _temp_filter = ''

    if(_filter == '') {
      _temp_filter = '°'
    } else {
      _temp_filter = _filter
    }

    return "&filter=where|Name|like|'°"+_filter+"°'";
  }

  get_active_page() {
    if(this.active_page == 0) {
      this.active_page = 1
    }

    return this.active_page;
  }

  set_active_page(value) {
    this.active_page=value;
  }
}

export {
  kpagination
}
