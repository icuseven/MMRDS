// @TODO use module imports in the future
// import SubstanceRow from './SubstanceRow.jsx';
// import AddNewMapping from './AddNewMapping.jsx';
// import { getValidTarget, substanceMappingAPI } from './helpers.jsx';

class MetadataSubstanceLists extends React.Component {
  state = {
    targetSubstanceList: [],
    _id: '',
    _rev: '',
    substanceLists: {},
    duplicatesMemo: {},
    selected: '',
    sortSourceAscending: undefined,
    sortTargetAscending: undefined,
    loading: true,
    addNew: false,
    saved: undefined,
  };
  componentDidMount() {
    const metaPromise = substanceMappingAPI.getSubstanceMetadata();
    const mappingPromise = substanceMappingAPI.getSubstanceMapping();
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
              source_value: value.source_value,
              target_value: getValidTarget(
                targetSubstanceList,
                value.target_value
              ),
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
    let updatedList = [];
    let newDuplicatesMemo = {};
    function setDuplicate(value) {
      const isDuplicate = newDuplicatesMemo[value];
      // recreate the duplicates memo for the list
      if (isDuplicate === undefined) {
        newDuplicatesMemo[value] = false;
      } else if (isDuplicate === false) {
        newDuplicatesMemo[value] = true;
      }
    }
    if (id) {
      substanceLists[selected].forEach((val, currentIndex) => {
        // Update or Delete
        if (id && val.id === id) {
          if (newValue) {
            // if the newValue is falsy the val with the matching id is deleted is a delete
            updatedList.push(newValue);
            // check if the new source_value is a duplicate
            const sourceValue = newValue.source_value;
            setDuplicate(sourceValue);
          }
        } else {
          updatedList.push(val);
          const sourceValue = val.source_value;
          setDuplicate(sourceValue);
        }
      });
    } else {
      // Create New
      newDuplicatesMemo = this.state.duplicatesMemo;
      updatedList = substanceLists[selected];
      updatedList.push({
        ...newValue,
        id: updatedList.length, // equals the last index + 1
      });
      const sourceValue = newValue.source_value;
      setDuplicate(sourceValue);
    }
    const duplicatesMemo = {
      ...this.state.duplicatesMemo,
      [selected]: newDuplicatesMemo,
    };
    const newSubstanceLists = { ...substanceLists, [selected]: updatedList };
    this.setState({
      substanceLists: newSubstanceLists,
      duplicatesMemo,
      addNew: false,
      saved: undefined,
    });
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
    substanceMappingAPI
      .saveSubstanceMapping({ _id, _rev, substance_lists })
      .then((response) => {
        if (response.ok) {
          this.setState({ _rev: response.rev, saved: true });
        } else {
          this.setState({ saved: false });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ saved: false });
      });
  };
  sortSubstanceList(substanceList) {
    // only compairs first letter
    const { sortSourceAscending, sortTargetAscending } = this.state;
    let sortAscending = undefined;
    let target = '';
    if (sortSourceAscending !== undefined) {
      sortAscending = sortSourceAscending;
      target = 'source_value';
    } else {
      sortAscending = sortTargetAscending;
      target = 'target_value';
    }
    // if undefined do no sort
    if (sortAscending === undefined) return substanceList;
    function getValue(source) {
      return source[target].charAt(0).toLowerCase();
    }
    // if true sort ascending
    if (sortAscending === true) {
      return [...substanceList].sort((a, b) => {
        const first = getValue(a);
        const second = getValue(b);
        if (first > second) return 1;
        if (second > first) return -1;
        return 0;
      });
    }
    // if false sort descending
    if (sortAscending === false) {
      return [...substanceList].sort((a, b) => {
        const first = getValue(a);
        const second = getValue(b);
        if (first < second) return 1;
        if (second < first) return -1;
        return 0;
      });
    }
  }
  setSort = (target, value) => {
    if (target === 'source_value') {
      this.setState({
        sortSourceAscending: value,
        sortTargetAscending: undefined,
      });
    }
    if (target === 'target_value') {
      this.setState({
        sortSourceAscending: undefined,
        sortTargetAscending: value,
      });
    }
  };

  addNew = () => {
    this.setState({ addNew: true });
  };
  render() {
    const {
      substanceLists,
      selected,
      targetSubstanceList,
      duplicatesMemo,
      saved,
    } = this.state;
    const hasDuplicates = selected
      ? Object.values(duplicatesMemo[selected]).includes(true)
      : false;
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
        <div className="row position-sticky substance-lists__sticky-controls">
          {saved !== undefined ? (
            saved ? (
              <div
                className="alert alert-success text-right"
                style={{ width: '100%' }}
                role="alert"
              >
                Saved!
              </div>
            ) : (
              <div
                className="alert alert-danger text-right"
                style={{ width: '100%' }}
                role="alert"
              >
                Error Saving Changes
              </div>
            )
          ) : null}
          <div className="container">
            <div className="row justify-content-between">
              <div>
                <label htmlFor="substance-lists">Select Substance List: </label>
                <SelectOptions
                  {...{
                    id: 'substance-lists',
                    options: Object.keys(substanceLists).map((value) => ({
                      value,
                    })),
                    selected,
                    handleChange: this.handleListChange,
                  }}
                />
              </div>
              <button onClick={this.handleSave}>Save Changes</button>
            </div>
            <div className="row">
              {this.state.addNew ? (
                <AddNewMapping
                  {...{ targetSubstanceList, onSave: this.setSubstanceLists }}
                />
              ) : (
                <button onClick={this.addNew}>Add New Mapping</button>
              )}
            </div>
            {hasDuplicates && (
              <div className="row">
                <span className="text-danger">Duplicates Detected Below</span>
              </div>
            )}
          </div>
        </div>
        <div className="row pt-2">
          <div className="col-4">
            <button onClick={() => this.setSort('source_value', true)}>
              Sort A to Z
            </button>
            <button onClick={() => this.setSort('source_value', false)}>
              Sort Z to A
            </button>
          </div>
          <div className="col-4">
            <button onClick={() => this.setSort('target_value', true)}>
              Sort A to Z
            </button>
            <button onClick={() => this.setSort('target_value', false)}>
              Sort Z to A
            </button>
          </div>
        </div>
        {ROWS}
      </div>
    );
  }
}
