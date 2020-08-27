import React from 'react';
import SelectOptions from '../sharedmodules/SelectOptions.jsx';

export default class AddNewMapping extends React.Component {
  state = {
    isValid: true,
    sourceValue: '',
    targetValue: 'Other',
  };
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ sourceValue: value });
  };
  handleBlur = () => {
    this.setState({ isValid: this.state.sourceValue !== '' });
  };
  handleAdd = () => {
    const { sourceValue, targetValue } = this.state;
    this.props.onSave({ source_value: sourceValue, target_value: targetValue });
  };
  handleTargetChange = (e) => {
    const { value } = e.target;
    this.setState({ targetValue: value });
  };
  render() {
    const options = this.props.targetSubstanceList.map(
      ({ value, display }) => ({
        display,
        value,
      })
    );
    const disabled = !this.state.isValid || this.state.sourceValue === '';
    return (
      <React.Fragment>
        <label htmlFor="new-source-value">Source Value: </label>
        <input
          className="mr-2"
          type="text"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.state.sourceValue}
          style={!this.state.isValid ? { border: '1px solid red' } : {}}
        />
        <label htmlFor="new-target-value">Target Value: </label>
        <SelectOptions
          {...{
            className: 'mr-2',
            id: 'new-target-value',
            options,
            selected: this.state.targetValue,
            handleChange: this.handleTargetChange,
          }}
        />
        <button onClick={this.handleAdd} disabled={disabled}>
          Add
        </button>
      </React.Fragment>
    );
  }
}
