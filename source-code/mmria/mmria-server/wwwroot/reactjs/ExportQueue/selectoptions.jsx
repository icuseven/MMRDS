class SelectOptions extends React.Component {
  render() {
    const { options, id } = this.props;
    const OPTS = options.map(({ text, value, selected }) => (
      <option key={value} value={value || text} selected={!!selected}>
        {text}
      </option>
    ));
    return (
      <select id={id} className="custom-select">
        {OPTS}
      </select>
    );
  }
}
