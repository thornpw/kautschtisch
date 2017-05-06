export function addPagination(paginations) {
  return {
    type: 'ADD_PAGINATION',
    paginations
  }
}

export function setNewFilter(pagination,number,new_filter) {
  return {
    type: 'SET_NEWFILTER',
    pagination,
    number,
    new_filter
  }
}

export function setFilter(pagination,number) {
  return {
    type: 'SET_FILTER',
    pagination,
    number
  }
}

export function clearFilter(pagination,number) {
  return {
    type: 'CLEAR_FILTER',
    pagination,
    number
  }
}

export function changeOffset(pagination,page) {
  return {
    type: 'CHANGE_OFFSET',
    pagination,
    page
  }
}

export function setAmountOfRows(pagination,amount) {
  return {
    type: 'SET_AMOUNT_OF_ROWS',
    pagination,
    amount
  }
}

export function resetPagination() {
  return {
    type: 'RESET_PAGINATION',
  }
}

export function resetContextPagination() {
  return {
    type: 'RESET_CONTEXT_PAGINATION',
  }
}
