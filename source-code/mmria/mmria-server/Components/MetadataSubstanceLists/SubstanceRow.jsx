import React from 'react';
import SelectOptions from '../sharedmodules/SelectOptions.jsx';

export default class SubstanceRow extends React.Component {
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
