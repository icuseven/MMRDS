class SelectOptions extends React.Component {
  render() {
    const { options, selected, handleChange } = this.props;
    const OPTS = options.map(({ display, value }) => {
      return (
        <option key={value} value={value}>
          {display || value}
        </option>
      );
    });
    return (
      <select value={selected} onChange={handleChange}>
        {OPTS}
      </select>
    );
  }
}
