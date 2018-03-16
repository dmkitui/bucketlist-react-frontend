import React, { Component } from 'react';
import swal from 'sweetalert';
import './ListItemView.css';
import Helpers from '../../helpers/Utilities';
import ItemsExpandedView from './ItemsExpandedView';
import AuthAPI from '../../api/Auth';
import ModalDialogs from '../../helpers/Dialogs';

class ItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bucketlist: this.props.bucketlists,
      showButtons: false,
      showItems: false,
      selectedBucketlist: null,
    };
  }
  componentDidMount() {
    this.setState({ showButtons: false });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showItems) {
      this.setState({
        showItems: true,
      });
    } else {
      this.setState({
        showItems: false,
      });
    }
  }
  addItem(event, bucketlist) {
    if (!Helpers.isTokenValid()) {
      ModalDialogs.errorStatus('You are not logged in. Log in first.');
      event.stopPropagation();
      return;
    }
    ModalDialogs.prompt({
      title: 'Add Item Bucketlist',
      text: null,
      content: { element: 'input', attributes: { placeholder: 'New Item', type: 'text' } },
      ok: 'Add Item',
    }).then((itemName) => {
      console.log('Item Name: ', itemName);
      if ((itemName === '') || (itemName === 'ok')) {
        console.log('Nope!!!');
        ModalDialogs.error('Item title cannot be blank!');
      } else {
        console.log('Proceed to backend...');
        AuthAPI.addItem(bucketlist.id, itemName)
          .then((resp) => {
            if (resp.status === 201) {
              const item = resp.data;
              this.setState({ bucketlist: bucketlist.items.push(item) });
              if (!this.state.showItems) {
                this.setState({ showItems: true });
              }
              ModalDialogs.success('Item added to bucketlist successfully.');
            } else {
              console.log('Error: ', resp.status, 'Message: ', resp);
            }
          }).catch((error) => {
            console.log('ERRORS: ', error, 'SPECS: ', error.message);
            try {
              if (error.message !== 'Network Error') {
                ModalDialogs.error(error.response.data.message);
              } else {
                console.log('MAshida 101!', error);
                ModalDialogs.error(error.message);
              }
            } catch (error) {
              ModalDialogs.error(error.message);
            }
          });
      }
    }).catch((err) => {
      if (err) {
        ModalDialogs.error('An Error Occurred While Accessing Server');
      } else {
        swal.stopLoading();
      }
    });
    event.stopPropagation();
  }
  editBucketlistTitle(e, bucketlist) {
    if (!Helpers.isTokenValid()) {
      ModalDialogs.errorStatus('You are not logged in. Log in first.');
      e.stopPropagation();
      return;
    }
    const title = bucketlist.name;
    const id = bucketlist.id;

    ModalDialogs.prompt({
      title: 'Edit Bucketlist?',
      content: {
        element: 'input',
        attributes: {
          defaultValue: title, value: title, placeholder: title, type: 'text',
        },
      },
      icon: 'warning',
      ok: 'Edit',
    })
      .then((newTitle) => {
        console.log('Value: ', newTitle, 'Old Title: ', title);
        if (newTitle !== '') {
          console.log('Why are w running?');
          if (newTitle !== title) {
            console.log('Title changed: ', newTitle);
            AuthAPI.editBucketlistTitle((id), newTitle)
              .then((res) => {
                console.log('Bucketlist: ', res);
                ModalDialogs.success('Bucketlist Successfully Updated');
                bucketlist.date_modified = res.data.date_modified;
                bucketlist.name = res.data.name;
                this.setState({ bucketlist });
              })
              .catch((error) => {
                if (error.response !== undefined) {
                  console.log('Error 1: ', error);
                  ModalDialogs.error(error.response.data.message);
                } else {
                  console.log('Error 2');
                  ModalDialogs.error(error.message);
                }
              });
          } else {
            ModalDialogs.error('Title cannot be same as current. No changes made.');
          }
        } else {
          ModalDialogs.error('New Title cannot be blank!');
        }
      }).catch((error) => {
        console.log('Error: ', error.response);
        ModalDialogs.error(error.response);
        swal.stopLoading();
      });
    e.stopPropagation();
  }

  onDeleteBucketlist(e, id) {
    if (!Helpers.isTokenValid()) {
      ModalDialogs.errorStatus('You are not logged in. Log in first.');
      e.stopPropagation();
      return;
    }
    ModalDialogs.prompt({
      title: 'Delete Bucketlist?',
      text: 'Once deleted, you cant undo this!',
      icon: 'warning',
      ok: 'Delete',
    })
      .then((willDelete) => {
        console.log('Delete: ', willDelete);
        if (willDelete) {
          AuthAPI.deleteBucketlist(id)
            .then((res) => {
              ModalDialogs.success('Bucketlist Deleted Successfully');
              this.props.updateUI(id);
            })
            .catch((error) => {
              console.log('Prompt Error: ', error);
              try {
                ModalDialogs.error(error.response.data.message);
              } catch (error) {
                ModalDialogs.error('There was an ERROR accessing the server');
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          ModalDialogs.error('Error Accessing Server');
        } else {
          swal.stopLoading();
        }
      });
    e.stopPropagation();
  }

  mouseHover(event) {
    this.setState({ showButtons: !this.state.showButtons });
  }

  expandView(event, id) {
    event.preventDefault();
    const element = event.target;
    this.props.clickEvent(id, element);
  }

  renderExpandedItems(items) {
    if (items.length > 0) {
      return items.map((item, index) => (
        <ItemsExpandedView key={item.id} item={item} index={index} />
      ));
    }
    return (
      <div>
        <span>No items in the bucketlist as of now. Add some now?</span>
      </div>
    );
  }
  render() {
    const bucketlist = this.props.bucketlist;
    const bucketlistItems = this.renderExpandedItems(bucketlist.items);
    return (
      <div
        className={(this.state.showItems) ? 'item-container selected-item container' : 'item-container container'}
        id={this.props.bucketlist.id}
        onClick={event => this.expandView(event, (this.props.count + 1))}
        onMouseEnter={event => this.mouseHover(event)}
        onMouseLeave={event => this.mouseHover(event)}
      >
        <div className="row align-items-top holder">
          <div className="title-view col-7">
            <div>
              <div className={this.state.showItems ? 'item-title-expanded' : 'item-title'}>{this.props.count + 1}. {bucketlist.name}</div>
              <br />
              <div className="expanded-metadata" hidden={!this.state.showItems}>
                Created on: <span className="expanded-date">{Helpers.dateTimeFormat(this.props.bucketlist.date_created)}</span>
                <br />
                Last Activity: <span className="expanded-date">{Helpers.dateTimeFormat(this.props.bucketlist.date_modified)}</span>
              </div>
            </div>
            <div className="metadata text-left" hidden={this.state.showItems}>
              <span className="item-time">Created: <span className="value">{Helpers.dateTimeFormat(this.props.bucketlist.date_created)}</span></span>
              <span className="item-time date_modified">Last Activity: <span className="value">{Helpers.dateTimeFormat(this.props.bucketlist.date_modified)}</span></span>
              <br />
              {bucketlist.items.length > 0 ? <span className="item-count"><span className="value">{bucketlist.items.length}</span> Bucketlist Items</span> : <span className="item-count">No items yet.</span>}
            </div>
          </div>
          <div className="action-buttons col-5 text-right" hidden={!this.state.showButtons}>
            <button className="btn btn-lg edit" onClick={event => this.editBucketlistTitle(event, bucketlist)}>Edit</button>
            <button className="btn btn-lg add-item" onClick={event => this.addItem(event, bucketlist)}>Add Item</button>
            <button className="btn btn-lg add-item" >Share</button>
            <button className="btn btn-lg delete" onClick={(event) => { this.onDeleteBucketlist(event, bucketlist.id); }}>Delete</button>
          </div>
          <div className="row container">
            <div className="expanded-items-view col-12" hidden={!this.state.showItems}>
              {bucketlist.items.length > 0 ? <span className="text-center table-title">Bucketlist Items</span> : <span className="no-items">No items in the bucketlist as of now. Add some now?</span>}
              <div className="table-holder" hidden={bucketlist.items.length === 0}>
                <table className="table-hover">
                  <th>
                    <td className="index-field">No.</td>
                    <td className="item-name">Name</td>
                    <td className="date-field">Date Created</td>
                    <td className="date-field">Date Modified</td>
                    <td className="status-btn">Status</td>
                  </th>
                  <tbody>
                    {bucketlistItems}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ItemView;
