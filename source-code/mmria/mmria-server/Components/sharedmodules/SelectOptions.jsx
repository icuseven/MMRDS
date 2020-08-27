import React from 'react';

export default class SelectOptions extends React.Component {
  render() {
    const { options, selected, handleChange, id, className } = this.props;
    const OPTS = options.map(({ display, value }) => {
      return (
        <option key={value} value={value}>
          {display || value}
        </option>
      );
    });
    return (
      <select
        id={id}
        value={selected}
        onChange={handleChange}
        className={className || ''}
      >
        {OPTS}
      </select>
    );
  }
}
