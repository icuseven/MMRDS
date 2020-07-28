class SelectOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: getDefaultSelected(props),
    };
    function getDefaultSelected({ options }) {
      const selectedOpt = options.find((opt) => !!opt.selected);
      return selectedOpt.value || selectedOpt.text;
    }
  }
  handleChange(e) {
    const value = e.target;
    this.setState({ selected: value });
  }

  render() {
    const { options, id } = this.props;
    let selected = '';
    const OPTS = options.map(({ text, value, selected }) => {
      if (!!selected) selected = value || text;
      return (
        <option key={value || text} value={value || text}>
          {text}
        </option>
      );
    });
    return (
      <select id={id} className="custom-select" value={this.state.selected}>
        {OPTS}
      </select>
    );
  }
}
