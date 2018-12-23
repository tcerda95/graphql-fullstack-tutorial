import React, { Component } from 'react';

class CreateLink extends Component {
  handleChange = e => {
    const newValue = { ...this.props.value };
    const { name } = e.target;

    newValue[name] = e.target.value;

    this.props.onChange(newValue);
  }

  render() {
    const { description, url } = this.props.value;
    const { onSubmit, submitting } = this.props;

    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            name="description"
            value={description}
            onChange={this.handleChange}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            name="url"
            value={url}
            onChange={this.handleChange}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={onSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </div>
    );
  }
}

export default CreateLink;
