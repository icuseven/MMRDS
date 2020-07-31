const api = {
  getSubstanceMetadata() {
    return fetch(
      'http://test-mmria.services-dev.cdc.gov/api/version/20.07.13/metadata'
    ).then((r) => r.json());
  },
  getSubstanceMapping() {
    return fetch(
      'https://testdb-mmria.services-dev.cdc.gov/metadata/substance-mapping'
    ).then((r) => r.json());
  },
};

class SubstanceRow extends React.Component {
  handleChange = (e) => {
    const { source_value } = this.props.substance;
    const { value } = e.target;
    this.props.setSubstanceLists({ source_value, target_value: value });
  };
  render() {
    const { substance, targetSubstanceList } = this.props;
    const options = targetSubstanceList.map((substance) => substance.value);
    return (
      <div className="row">
        <div className="col-6 text-left">{substance.source_value}</div>
        <div className="col-6">
          <SelectOptions
            {...{
              options,
              selected: substance.target_value,
              handleChange: this.handleChange,
            }}
          />
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
    substance_lists: {},
    selected: '',
  };
  componentDidMount() {
    api.getSubstanceMetadata().then((resp) => {
      const targetSubstanceList = resp.lookup.find(
        (list) => list.name === 'substance'
      ).values;
      this.setState({ targetSubstanceList });
    });
    api.getSubstanceMapping().then((resp) => {
      const { _id, _rev, substance_lists } = resp;
      const selected = Object.keys(substance_lists)[0];
      this.setState({ _id, _rev, substance_lists, selected });
    });
  }
  setSubstanceLists = (newValue) => {
    const { substance_lists, selected } = this.state;
    const updatedList = substance_lists[selected].map((val) => {
      if (val.source_value === newValue.source_value) {
        return newValue;
      }
      return val;
    });
    const newSubstanceLists = { ...substance_lists, [selected]: updatedList };
    this.setState({ substance_lists: newSubstanceLists });
  };
  handleListChange = (e) => {
    const { value } = e.target;
    this.setState({ selected: value });
  };
  handleSave = () => {
    console.log(JSON.stringify(this.state.substance_lists));
  };
  render() {
    const { substance_lists, selected, targetSubstanceList } = this.state;
    const substanceList = substance_lists[selected];
    const ROWS = substanceList
      ? substanceList.map((substance) => (
          <SubstanceRow
            key={substance.source_value}
            {...{
              substance,
              targetSubstanceList,
              setSubstanceLists: this.setSubstanceLists,
            }}
          />
        ))
      : [];
    return (
      <div className="container">
        <div className="row">
          <SelectOptions
            {...{
              options: Object.keys(substance_lists),
              selected,
              handleChange: this.handleListChange,
            }}
          />
        </div>
        {ROWS}
        <button onClick={this.handleSave}>Save Changes</button>
      </div>
    );
  }
}
