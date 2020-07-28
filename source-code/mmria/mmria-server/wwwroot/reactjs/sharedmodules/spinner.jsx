class Spinner extends React.Component {
  render() {
    const active = this.props.active ? 'spinner-active' : '';
    return (
      <span className={'spinner-container spinner-inline ml-2' + active}>
        <span className="spinner-body text-primary">
          <span className="spinner"></span>
        </span>
      </span>
    );
  }
}
