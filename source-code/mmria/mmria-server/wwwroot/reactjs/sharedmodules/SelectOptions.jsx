class SelectOptions extends React.Component {
  render() {
    const { options, selected, handleChange } = this.props;
    const OPTS = options.map((value) => {
      return (
        <option key={value} value={value}>
          {value}
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
