const api = {
  toJSON(response) {
    // why do this: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
    if (!response.ok) {
      const { statusText, status } = response;
      throw Error(statusText || status);
    }
    return response.json();
  },
  getSubstanceMetadata() {
    return fetch(
      window.location.origin + '/api/version/20.07.13/metadata'
    ).then(this.toJSON);
  },
  getSubstanceMapping() {
    return fetch(window.location.origin + '/api/substance-mapping').then(
      this.toJSON
    );
  },
  saveSubstanceMapping(bodyContent) {
    const url = window.location.origin + '/api/substance_mapping';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(bodyContent);
    return fetch(url, { method, headers, body }).then(this.toJSON);
  },
};

class SubstanceRow extends React.Component {
  state = {
    canDelete: false,
    canUpdate: false,
    sourceValueText: this.props.substance.source_value,
  };

  handleTargetChange = (e) => {
    const { source_value, id } = this.props.substance;
    const { value } = e.target;
    this.props.setSubstanceLists({ source_value, target_value: value, id }, id);
  };

  handleSourceChange = (e) => {
    if (!this.state.canUpdate) return;
    const { value } = e.target;
    this.setState({ sourceValueText: value });
  };

  handleSourceEdit = (e) => {
    if (!this.state.canUpdate) {
      this.setState({ canUpdate: true });
    } else {
      const value = this.state.sourceValueText;
      this.setState({ canUpdate: false });
      this.props.setSubstanceLists(
        { ...this.props.substance, source_value: value },
        this.props.substance.id
      );
    }
  };

  handleDelete = (e) => {
    if (this.state.canDelete) {
      // pass it a falsy value and it will remove the element from the array
      this.props.setSubstanceLists(undefined, this.props.substance.id);
    } else {
      this.setState({ canDelete: true });
    }
  };
  cancelDelete = (e) => {
    this.setState({ canDelete: false });
  };
  render() {
    const { substance, targetSubstanceList, duplicatesMemo } = this.props;
    const options = targetSubstanceList.map(({ value, display }) => ({
      display,
      value,
    }));
    const isDuplicate = duplicatesMemo[substance.source_value];
    return (
      <div className="row border-bottom p-1">
        <div className="col-4">
          <input
            className={`${isDuplicate ? ' bg-warning' : ''}`}
            onChange={this.handleSourceChange}
            value={this.state.sourceValueText}
          />
          <button onClick={this.handleSourceEdit}>
            {this.state.canUpdate ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="col-4">
          <SelectOptions
            {...{
              options,
              selected: substance.target_value,
              handleChange: this.handleTargetChange,
            }}
          />
        </div>
        <div className="col-4">
          <button onClick={this.handleDelete}>
            {this.state.canDelete ? 'Confirm ' : ''}Delete
          </button>
          {this.state.canDelete && (
            <button onClick={this.cancelDelete}>Cancel</button>
          )}
        </div>
      </div>
    );
  }
}
class MetadataSubstanceLists extends React.Component {
  state = {
    targetSubstanceList: [],
    _id: '',
    _rev: '',
    substanceLists: {},
    duplicatesMemo: {},
    selected: '',
    sortAscending: undefined,
    loading: true,
  };
  componentDidMount() {
    const metaPromise = api.getSubstanceMetadata();
    const mappingPromise = api.getSubstanceMapping();
    Promise.all([metaPromise, mappingPromise]).then(
      ([metaResp, mappingResp]) => {
        const targetSubstanceList = metaResp.lookup.find(
          (list) => list.name === 'substance'
        ).values;
        const { _id, _rev, substance_lists } = mappingResp;
        const selected = Object.keys(substance_lists)[0];
        const substanceLists = {};
        const duplicatesMemo = {};
        Object.keys(substance_lists).forEach((listName) => {
          duplicatesMemo[listName] = {};
          const listWithIds = substance_lists[listName].map((value, index) => {
            if (duplicatesMemo[listName][value.source_value] === undefined) {
              duplicatesMemo[listName][value.source_value] = false;
            } else if (duplicatesMemo[listName][value.source_value === false]) {
              duplicatesMemo[listName][value.source_value] = true;
            }
            return {
              ...value,
              id: value.source_value + index,
            };
          });
          substanceLists[listName] = listWithIds;
        });
        this.setState({
          targetSubstanceList,
          _id,
          _rev,
          substanceLists,
          selected,
          duplicatesMemo,
          loading: false,
        });
      }
    );
  }
  setSubstanceLists = (newValue, id) => {
    const { substanceLists, selected } = this.state;
    const updatedList = [];
    const newDuplicatesMemo = {};
    let finalIndex = 0;
    substanceLists[selected].forEach((val, currentIndex) => {
      finalIndex = currentIndex;
      // Update or Delete
      if (id && val.id === id) {
        if (newValue) {
          // if the newValue is falsy the val with the matching id is deleted is a delete
          updatedList.push(newValue);
          // check if the new source_value is a duplicate
          const sourceValue = newValue.source_value;
          const isDuplicate = newDuplicatesMemo[sourceValue];
          // recreate the duplicates memo for the list
          if (isDuplicate === undefined) {
            newDuplicatesMemo[sourceValue] = false;
          } else if (isDuplicate === false) {
            newDuplicatesMemo[sourceValue] = true;
          }
        }
      } else {
        updatedList.push(val);
        const sourceValue = val.source_value;
        const isDuplicate = newDuplicatesMemo[sourceValue];
        // recreate the duplicates memo for the list
        if (isDuplicate === undefined) {
          newDuplicatesMemo[sourceValue] = false;
        } else if (isDuplicate === false) {
          newDuplicatesMemo[sourceValue] = true;
        }
      }
    });
    // Create New
    if (!id && !newValue)
      updatedList.push({
        source_value: '',
        target_value: '9999',
        id: finalIndex,
      });
    const duplicatesMemo = {
      ...this.state.duplicatesMemo,
      [selected]: newDuplicatesMemo,
    };
    const newSubstanceLists = { ...substanceLists, [selected]: updatedList };
    this.setState({ substanceLists: newSubstanceLists, duplicatesMemo });
  };

  handleListChange = (e) => {
    const { value } = e.target;
    this.setState({ selected: value });
  };
  handleSave = () => {
    const substance_lists = {};
    // filter out all the
    const { substanceLists, _rev, _id } = this.state;
    Object.keys(substanceLists).forEach((key) => {
      substance_lists[key] = substanceLists[key].map((substance) => ({
        source_value: substance.source_value,
        target_value: substance.target_value,
      }));
    });
    api
      .saveSubstanceMapping({ _id, _rev, substance_lists })
      .then((response) => {
        if (!response.ok) {
          debugger;
        }
        console.log(response._rev);
        this.setState({ _rev: response._rev });
      })
      .catch(console.error);
  };
  sortSubstanceList(substanceList) {
    // only compairs first letter
    const { sortAscending } = this.state;
    // if undefined do no sort
    if (sortAscending === undefined) return substanceList;
    // if true sort ascending
    if (sortAscending === true) {
      return [...substanceList].sort((a, b) => {
        const first = a.source_value.charAt(0);
        const second = b.source_value.charAt(0);
        if (first > second) return 1;
        if (second > first) return -1;
        return 0;
      });
    }
    // if false sort descending
    if (sortAscending === false) {
      return [...substanceList].sort((a, b) => {
        const first = a.source_value.charAt(0);
        const second = b.source_value.charAt(0);
        if (first < second) return 1;
        if (second < first) return -1;
        return 0;
      });
    }
  }
  setSort = (value) => {
    this.setState({ sortAscending: value });
  };
  render() {
    const {
      substanceLists,
      selected,
      targetSubstanceList,
      duplicatesMemo,
    } = this.state;
    const substanceList = substanceLists[selected];
    const ROWS = substanceList
      ? this.sortSubstanceList(substanceList).map((substance) => {
          return (
            <SubstanceRow
              key={substance.id}
              {...{
                duplicatesMemo: duplicatesMemo[selected],
                substance,
                targetSubstanceList,
                setSubstanceLists: this.setSubstanceLists,
              }}
            />
          );
        })
      : [];
    return this.state.loading ? (
      <div>Loading...</div>
    ) : (
      <div className="container">
        <div className="row">
          <SelectOptions
            {...{
              options: Object.keys(substanceLists).map((value) => ({ value })),
              selected,
              handleChange: this.handleListChange,
            }}
          />
          <button onClick={this.handleSave}>Save Changes</button>
        </div>
        <div className="row pt-2">
          <button onClick={() => this.setSort(true)}>Sort A to Z</button>
          <button onClick={() => this.setSort(false)}>Sort Z to A</button>
        </div>
        {ROWS}
        <div className="row">
          <button onClick={() => this.setSubstanceLists()}>
            Add New Mapping
          </button>
        </div>
      </div>
    );
  }
}
