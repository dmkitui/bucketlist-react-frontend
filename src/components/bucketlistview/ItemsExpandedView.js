import React, { Component } from 'react';
import './ListItemView.css';
import Helpers from '../../helpers/Utilities';
import ModalDialogs from '../../helpers/Dialogs';
import AuthAPI from '../../api/Auth';

class ItemsExpandedView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      saving: false,
    };
  }
  editName(event) {
    event.stopPropagation();
    event.target.select();
  }
  saveChanges(event, identifier, currentName) {
    event.stopPropagation();
    const newName = document.getElementById(identifier).value;
    const bucketlistId = identifier.split('-')[0];
    const itemID = identifier.split('-')[1];
    if (newName === '') {
      ModalDialogs.error('New name cannot be blank!');
      document.getElementById(identifier).value = currentName;
      return;
    }
    if (newName === currentName) {
      ModalDialogs.error('New name cannot be same as old one!');
      document.getElementById(identifier).value = currentName;
      return;
    }
    document.getElementById(identifier).value = 'Updating...';
    this.setState({ saving: true });
    AuthAPI.editItemName(itemID, bucketlistId, newName)
      .then((res) => {
        if (res.status === 201) {
          this.setState({ saving: false });
          document.getElementById(identifier).value = newName;
          ModalDialogs.success('Item Name Updated Successfully');
        } else {
          ModalDialogs.error(`Some error Occurred ${res.message}`);
          this.setState({ saving: false });
          document.getElementById(identifier).value = currentName;
        }
      })
      .catch((error) => {
        this.setState({ saving: false });
        document.getElementById(identifier).value = currentName;
        ModalDialogs.error(error.message);
      });
  }
  completeItem(event, itemId) {
    event.stopPropagation();
    ModalDialogs.prompt({
      title: 'Are You sure?',
      text: 'Are you really, really done with the task?',
      icon: 'warning',
      ok: 'Yap!',
      cancel: 'Nope, Not Really',
      dangerMode: true,
    })
      .then((res) => {
        if (res) {
          AuthAPI.completeItem(itemId, this.props.bucketlistId)
            .then((apiResponse) => {
              if (apiResponse.status === 201) {
                const data = apiResponse.data;
                this.setState({
                  item: data,
                });
                ModalDialogs.success('Item Completed successfully.');
                const { message, ...updatedItem } = data;
                this.props.updatedItem(updatedItem);
              }
            })
            .catch((error) => {
              ModalDialogs.error(error.message);
            });
        }
      })
      .catch((error) => {
        ModalDialogs.error(error.message);
      });
  }
  render() {
    const identifier = `${this.props.bucketlistId}-${this.props.item.id}`;
    return (
      <div className="table-rows">
        <tbody>
          <tr>
            <td className="index-field">{this.props.index + 1}.</td>
            <td className="item-name">
              <input
                onClick={event => this.editName(event)}
                defaultValue={this.state.item.item_name}
                id={identifier}
                disabled={this.state.saving}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    this.saveChanges(event, identifier, this.state.item.item_name);
                    event.preventDefault();
                  }
                }}
              />
            </td>
            <td className="date-field" onClick={event => event.stopPropagation()}>{Helpers.dateTimeFormat(this.state.item.date_created)}</td>
            <td className="date-field" onClick={event => event.stopPropagation()}>{Helpers.dateTimeFormat(this.state.item.date_modified)}</td>
            <td className="status-btn" onClick={event => event.stopPropagation()}>
              <button
                onClick={event => this.completeItem(event, this.state.item.id)}
                className="state-button btn btn-sm"
                disabled={this.state.item.done}
            >{this.state.item.done ? 'Done' : 'Not Done'}
            </button>
            </td>
          </tr>
        </tbody>
      </div>
    );
  }
}
export default ItemsExpandedView;
