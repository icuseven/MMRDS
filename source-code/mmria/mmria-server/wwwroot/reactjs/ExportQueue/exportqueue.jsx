class ResponseTableRow extends React.Component {
  escapeText(text) {
    return escape(text).replace(/%20/g, ' ').replace(/%3A/g, '-');
  }
  render() {
    const { rowData, selectRow, checked, rowId } = this.props;
    return (
      <tr className="tr font-weight-normal">
        <td className="td" data-type="date_created" width="38" align="center">
          <input
            id={escape(rowId)}
            type="checkbox"
            value={escape(rowId)}
            type="checkbox"
            onChange={selectRow}
            checked={checked}
          />
          <label htmlFor="" className="sr-only">
            {escape(rowId)}
          </label>
        </td>
        <td className="td" data-type="date_last_updated">
          {this.escapeText(rowData.date_last_updated)} <br />{' '}
          {escape(rowData.last_updated_by)}
        </td>
        <td className="td" data-type="jurisdiction_id">
          {this.escapeText(rowData.last_name)},{' '}
          {this.escapeText(rowData.first_name)}{' '}
          {this.escapeText(rowData.middle_name)} [
          {escape(rowData.jurisdiction_id)}]
        </td>
        <td className="td" data-type="record_id">
          {this.escapeText(rowData.record_id)}
        </td>
        <td className="td" data-type="date_of_death">
          {rowData.date_of_death_year != null
            ? escape(rowData.date_of_death_year)
            : ''}
          -
          {rowData.date_of_death_month != null
            ? escape(rowData.date_of_death_month)
            : ''}
        </td>
        <td className="td" data-type="committee_review_date">
          {rowData.committee_review_date != null
            ? escape(rowData.committee_review_date)
            : 'N/A'}
        </td>
        <td className="td" data-type="agency_case_id">
          {this.escapeText(rowData.agency_case_id)}
        </td>
        <td className="td" data-type="date_last_updated">
          {this.escapeText(rowData.date_last_updated)}
          <br />
          {this.escapeText(rowData.created_by)}
        </td>
      </tr>
    );
  }
  // let item = case_view_response.rows[i];
  // let value_list = item.value;

  // selected_dictionary[item.id] = value_list;

  // let checked = '';
  // let index = answer_summary.case_set.indexOf(item.id);

  // if (index > -1) {
  //   checked = 'checked=true';
  // }

  // // Items generated after user applies filters
  // html.push(`

  // `);
  // html.push(`<li className="foo"><input value=${escape(item.id)} type="checkbox" onclick="result_checkbox_click(this)" ${checked} /> ${escape(value_list.jurisdiction_id)} ${escape(value_list.last_name)},${escape(value_list.first_name)} ${escape(value_list.date_of_death_year)}/${escape(value_list.date_of_death_month)} ${escape(value_list.date_last_updated)} ${escape(value_list.last_updated_by)} agency_id:${escape(value_list.agency_case_id)} rc_id:${escape(value_list.record_id)}</li>`);
}

class ExportTable extends React.Component {
  render() {
    const { title, children } = this.props;
    return (
      <table className="table rounded-0 m-0">
        <thead className="thead">
          <tr className="tr bg-tertiary">
            <th className="th" colSpan="14" scope="colgroup">
              <span className="row no-gutters justify-content-between">
                <span>{title}</span>
              </span>
            </th>
          </tr>
        </thead>
        <thead className="thead">
          <tr className="tr">
            <th className="th" width="38" scope="col"></th>
            <th className="th" scope="col">
              Date last updated <br />
              Last updated by
            </th>
            <th className="th" scope="col">
              Name [Jurisdiction ID]
            </th>
            <th className="th" scope="col">
              Record ID
            </th>
            <th className="th" scope="col">
              Date of death
            </th>
            <th className="th" scope="col">
              Committee review date
            </th>
            <th className="th" scope="col">
              Agency case ID
            </th>
            <th className="th" scope="col">
              Date created
              <br />
              Created by
            </th>
          </tr>
        </thead>
        <tbody id="search_result_list" className="tbody">
          {children}
        </tbody>
      </table>
    );
  }
}

class Paginations extends React.Component {
  handleClick(page) {
    //g_ui.case_view_request.page = page;
    this.props.getCaseSet({ page });
  }
  render() {
    const { totalRows, take, page } = this.props;
    const BUTTONS = [];
    for (
      let currentPage = 1;
      (currentPage - 1) * take < totalRows;
      currentPage++
    ) {
      BUTTONS.push(
        <button
          type="button"
          key={`button-${currentPage}`}
          className="table-btn-link btn btn-link"
          alt="select page 1"
          onClick={() => handleClick(currentPage)}
        >
          {currentPage}
        </button>
      );
    }
    return (
      <div className="table-pagination row align-items-center no-gutters pt-1 pb-1 pl-2 pr-2">
        <div className="col">
          <div className="row no-gutters">
            <p className="mb-0">
              Total Records: <strong>{totalRows}</strong>
            </p>
            <p className="mb-0 ml-2 mr-2">|</p>
            <p className="mb-0">
              Viewing Page(s): <strong>{page}</strong> of{' '}
              <strong>{BUTTONS.length}</strong>
            </p>
          </div>
        </div>
        <div className="col row no-gutters align-items-center justify-content-end">
          <p className="mb-0">Select by page:</p>
          {BUTTONS}
        </div>
      </div>
    );
  }
}

function getQueryString({ page, take, sort, searchText, descending }) {
  const result = [];
  result.push('?skip=' + (page - 1) * take);
  result.push('take=' + take);
  result.push('sort=' + sort);
  if (searchText) {
    result.push(
      'search_key="' +
        searchText.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
        '"'
    );
  }
  result.push('descending=' + descending);
  return result.join('&');
}

class ExportQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterSortBy: [
        { value: 'first_name', text: 'First name' },
        { value: 'middle_name', text: 'Middle name' },
        { value: 'last_name', text: 'Last name' },
        { value: 'date_of_death_year', text: 'Date of death year' },
        { value: 'date_of_death_month', text: 'Date of death month' },
        { value: 'date_created', text: 'Date created' },
        { value: 'created_by', text: 'Created by' },
        {
          value: 'date_last_updated',
          selected: true,
          text: 'Date last updated',
        },
        { value: 'last_updated_by', text: 'Last updated by' },
        { value: 'record_id', text: 'Record id' },
        { value: 'agency_case_id', text: 'Agency case id' },
        { value: 'date_of_committee_review', text: 'Date of committee review' },
        { value: 'jurisdiction_id', text: 'Jurisdiction id' },
      ],
      filterRecordsPerPage: [
        { text: '25' },
        { text: '50' },
        { text: '100', selected: true },
        { text: '250' },
        { text: '500' },
      ],
      showCustomCaseFilter: this.props.showCustomCaseFilter,
      caseViewResponse: [],
      caseViewResponseTotalRows: 0,
      selectedRows: this.props.caseSet,
      searchText: '',
      page: 1,
      skip: 0,
      take: 100,
      sort: 'date_last_updated',
      descending: true,
    };
  }

  caseFilterTypeClick = (e) => {
    const p_value = e.target.value;
    answer_summary.case_filter_type = p_value.toLowerCase();
    this.setState({
      showCustomCaseFilter: !!(p_value.toLowerCase() === 'custom'),
    });
  };

  filterSearchTextChange = (e) => {
    const { value } = e.target;
    this.setState({ searchText: value });
  };

  getCaseSet = ({ page }) => {
    const { protocol, host } = location;
    let caseViewUrl = `${protocol}//${host}/api/case_view`;
    if (page) {
      this.setState({ page });
      caseViewUrl += `${getQueryString({ ...this.state, page })}`;
    } else {
      caseViewUrl += `${getQueryString(this.state)}`;
    }

    fetch(caseViewUrl)
      .then((response) => response.json())
      .then((resp) => {
        this.setState({
          loading: false,
          caseViewResponse: resp.rows,
          caseViewResponseTotalRows: resp.total_rows,
        });
        for (let i = 0; i < resp.rows.length; i++) {
          // cache the response
          let item = resp.rows[i];
          let value_list = item.value;
          selected_dictionary[item.id] = value_list;
        }
      });
  };

  applyFilterButtonClick = () => {
    this.setState({ loading: true });
    const searchText = document.getElementById('filter_search_text').value;
    const sort = document.getElementById('filter_sort_by').value;
    const take = document.getElementById('filter_records_perPage').value;
    const descending = document.getElementById('filter_decending').value;
    this.setState({
      take,
      searchText,
      sort,
      descending,
      loading: true,
    });

    this.getCaseSet({});
  };

  result_checkbox_click() {}
  selectRow = (e) => {
    const rowId = e.target.value;
    if (e.target.checked) {
      if (answer_summary.case_set.indexOf(rowId) < 0) {
        answer_summary.case_set.push(rowId);
      }
    } else {
      let index = answer_summary.case_set.indexOf(rowId);
      if (index > -1) {
        answer_summary.case_set.splice(index, 1);
      }
    }
    const selectedRowId = this.state.selectedRows[rowId];
    // by default it will be selected if it is not already in the selectedRows memo
    const selected = !selectedRowId;
    // create a new memo
    const newSelectedRows = { ...this.state.selectedRows, [rowId]: selected };
    this.setState({
      selectedRows: newSelectedRows,
    });
  };
  render() {
    const listStyle = {
      overflow: 'hidden',
      overflowY: 'auto',
      height: '360px',
      border: '1px solid #ced4da',
    };
    const INCLUDED_CASE_ROWS = [];
    const CASE_ROWS = this.state.caseViewResponse.map((respData) => {
      const selectedIdValue = this.state.selectedRows[respData.id];
      const checked = !!selectedIdValue;
      const { selectRow } = this;
      return (
        <ResponseTableRow
          key={respData.id}
          {...{
            rowData: respData.value,
            checked,
            selectRow,
            rowId: respData.id,
          }}
        />
      );
    });
    Object.keys(this.state.selectedRows).forEach((rowId) => {
      const selected = this.state.selectedRows[rowId];
      if (selected) {
        let rowData = selected_dictionary[rowId];
        INCLUDED_CASE_ROWS.push(
          <ResponseTableRow
            key={'inc' + rowId}
            {...{ rowData, checked: true, selectRow: () => {}, rowId }}
          />
        );
      }
    });
    return (
      <React.Fragment>
        <p className="mb-3">
          Please select which cases you want to include in the export?
        </p>
        <label
          htmlFor="case_filter_type_all"
          className="font-weight-normal mr-2"
        >
          <input
            id="case_filter_type_all"
            type="radio"
            name="case_filter_type"
            value="all"
            checked={this.state.showCustomCaseFilter === false}
            onChange={this.caseFilterTypeClick}
          />{' '}
          All
        </label>
        <label
          htmlFor="case_filter_type_custom2"
          className="font-weight-normal"
        >
          <input
            id="case_filter_type_custom"
            type="radio"
            name="case_filter_type_custom"
            value="custom"
            checked={this.state.showCustomCaseFilter === true}
            onChange={this.caseFilterTypeClick}
          />{' '}
          Custom
        </label>
        <ul
          className="font-weight-bold list-unstyled mt-3"
          style={{
            display: this.state.showCustomCaseFilter ? 'block' : 'none',
          }}
        >
          <li className="mb-4">
            <div className="form-inline mb-2">
              <label
                htmlFor="filter_search_text"
                className="font-weight-normal mr-2"
              >
                Search for:
              </label>
              <input
                type="text"
                className="form-control mr-2"
                id="filter_search_text"
                value={this.state.searchText}
                onChange={this.filterSearchTextChange}
              />
              <button
                type="button"
                className="btn btn-secondary"
                alt="search"
                onClick={this.applyFilterButtonClick}
              >
                Apply Filters
              </button>
              <Spinner active={this.state.loading} />
            </div>

            <div className="form-inline mb-2">
              <label
                htmlFor="filter_sort_by"
                className="font-weight-normal mr-2"
              >
                Sort by:
              </label>
              <SelectOptions
                id={'filter_sort_by'}
                options={this.state.filterSortBy}
              />
            </div>

            <div className="form-inline mb-2">
              <label
                htmlFor="filter_records_perPage"
                className="font-weight-normal mr-2"
              >
                Records per page:
              </label>
              <SelectOptions
                id={'filter_records_perPage'}
                options={this.state.filterRecordsPerPage}
              />
            </div>

            <div className="form-inline mb-2">
              <label
                htmlFor="filter_decending"
                className="font-weight-normal mr-2"
              >
                Descending order:
              </label>
              <input
                id="filter_decending"
                type="checkbox"
                defaultChecked="true"
              />
            </div>
          </li>
          {!!this.state.caseViewResponse.length && !this.state.loading && (
            <React.Fragment>
              <li className="mb-3" style={listStyle}>
                <Paginations
                  {...{
                    totalRows: this.state.caseViewResponseTotalRows,
                    take: this.state.take,
                    page: this.state.page,
                    getCaseSet: this.getCaseSet,
                  }}
                />
                <ExportTable title={'Filtered Cases'}>{CASE_ROWS}</ExportTable>
              </li>
              <li className="" style={listStyle}>
                <ExportTable
                  title={`Cases to be included in export (${INCLUDED_CASE_ROWS.length}):`}
                >
                  {INCLUDED_CASE_ROWS}
                </ExportTable>
              </li>
            </React.Fragment>
          )}
        </ul>
      </React.Fragment>
    );
  }
}

function renderReactExportQueue(p_answer_summary) {
  const showCustomCaseFilter =
    p_answer_summary['case_filter_type'] == 'custom' ? true : false;
  const caseSet = {};
  p_answer_summary.case_set.forEach((caseId) => {
    caseSet[caseId] = true;
  });
  ReactDOM.render(
    <ExportQueue {...{ showCustomCaseFilter, caseSet }} />,
    document.getElementById('react-content')
  );
}
