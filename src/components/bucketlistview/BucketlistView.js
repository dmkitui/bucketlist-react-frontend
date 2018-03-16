import React, { Component } from 'react';
import scrollIntoView from 'scroll-into-view';
import './BucketlistView.css';
import ItemView from './ListItemView';
import ModalDialogs from '../../helpers/Dialogs';
import Animation from '../../helpers/animation';
import AuthAPI from '../../api/Auth';
import Helpers from '../../helpers/Utilities';

class BucketlistView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bucketlists: [],
      loading: true,
      selectedBucketlist: null,
      loggedIn: this.props.loggedIn,
    };
    this.clickedItem = this.clickedItem.bind(this);
    this.updateAfterChanges = this.updateAfterChanges.bind(this);
  }

  componentDidMount() {
    const _this = this;
    console.log('State: ', this.state.loggedIn);
    if (!this.state.loggedIn) {
      ModalDialogs.errorStatus('You are not logged in. Log in first.');
      return;
    }
    console.log('Why still running?');
    if (!Helpers.isTokenValid()) {
      this.setState({ loading: false });
      return;
    }
    AuthAPI.getBucketlists()
      .then((response) => {
        const data = response.data;
        console.log('DATA: ', response);
        if (data.length > 0) {
          const pageInfo = data.pop();
        }
        // Sort the data by ID.
        _this.setState({
          bucketlists: data,
          loading: false,
        });
        console.log('BUCKETLISTS: ', this.state.bucketlists);
      }).catch((error) => {
        console.log('FETCH ERRORS: ', error);
        const errorText = error.message;
        this.state.loading = false;
        ModalDialogs.error(errorText);
      });
  }

  updateAfterChanges(id) {
    const bucketlist = this.state.bucketlists.filter(x => (x.id === id))[0];
    const indexToDelete = this.state.bucketlists.indexOf(bucketlist);
    this.state.bucketlists.splice(indexToDelete, 1);
    this.setState({ bucketlists: this.state.bucketlists });
  }

  clickedItem(id, el) {
    if (id === this.state.selectedBucketlist) {
      this.setState({ selectedBucketlist: false });
    } else {
      scrollIntoView(el, { time: 500 });
      this.setState({ selectedBucketlist: id });
    }
  }

  renderBucketlists(bucketlists) {
    if (bucketlists.length > 0) {
      return bucketlists.map((bucketlist, index) => (
        <ItemView
          key={bucketlist.id}
          count={index}
          updateUI={this.updateAfterChanges}
          bucketlist={bucketlist}
          clickEvent={this.clickedItem}
          showItems={(index === (this.state.selectedBucketlist - 1))}
        />
      ));
    }
    return (
      <div className="empty-list">
        <span> No bucketlists to display</span>
      </div>
    );
  }
  render() {
    const currentBucketlists = this.renderBucketlists(this.state.bucketlists);
    if (this.state.loading) {
      return (
        <section>
          <div className="anim">
            <Animation type="bubbles" color="green" />
            <span>Fetching Your Bucketlists</span>
          </div>
        </section>
      );
    }
    return (
      <section>
        {currentBucketlists}
      </section>
    );
  }
}
export default BucketlistView;
