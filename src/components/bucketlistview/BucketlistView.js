import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import scrollIntoView from 'scroll-into-view';
import 'font-awesome/css/font-awesome.min.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './BucketlistView.css';
import ItemView from './ListItemView';
import ModalDialogs from '../../helpers/Dialogs';
import Animation from '../../helpers/animation';
import AuthAPI from '../../api/Auth';


class BucketlistView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bucketlists: [],
      loading: true,
      selectedBucketlist: null,
      loggedIn: this.props.loggedIn,
      searchError: false,
      showSearch: false,
      searchResults: [],
    };
    this.clickedItem = this.clickedItem.bind(this);
    this.updateAfterChanges = this.updateAfterChanges.bind(this);
  }
  componentDidMount() {
    const _this = this;
    if (!this.state.loggedIn) {
      //      ModalDialogs.errorStatus('You are not logged in. Log in first.');
      _this.setState({ loading: false });
      return;
    }
    AuthAPI.getBucketlists()
      .then((response) => {
        const data = response.data;
        if (data.length > 0) {
          const pageInfo = data.pop();
        }
        _this.setState({
          bucketlists: data,
          loading: false,
        });
      }).catch((error) => {
        const errorText = error.message;
        this.setState({ loading: false });
        ModalDialogs.error(errorText);
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.newItem === this.props.newItem) {
      return;
    }
    this.state.bucketlists.push(nextProps.newItem);
    this.setState({
      bucketlists: this.state.bucketlists,
    });
    const el = ReactDOM.findDOMNode(this.selectedItem);
    el.click();
  }

  updateAfterChanges(id) {
    const bucketlist = this.state.bucketlists.filter(x => (x.id === id))[0];
    const indexToDelete = this.state.bucketlists.indexOf(bucketlist);
    this.state.bucketlists.splice(indexToDelete, 1);
    this.setState({ bucketlists: this.state.bucketlists });
  }
  searchFocus(evt) {
    evt.stopPropagation();
    this.setState({
      searchError: false,
      showSearch: false,
    });
  }

  search(evt) {
    const searchTerms = evt.target.value.toLowerCase();
    if (searchTerms === '' || searchTerms === ' ') {
      this.setState({ showSearch: false });
      if (evt.key === 'Enter') {
        this.setState({ searchError: true });
        return;
      }
      return;
    }
    this.setState({
      searchError: false,
      showSearch: true,
      selectedBucketlist: null,
    });

    // Search in the already loaded bucketlists

    const hits = this.state.bucketlists.filter(x => x.name.toLowerCase().search(searchTerms) !== -1);
    if (hits.length > 0) {
      this.setState({
        searchResults: hits,
        searchError: false,
      });
    } else {
      this.setState({
        searchResults: [],
        searchError: true,
      });
    }
  }

  clickedItem(id, el) {
    if (id === this.state.selectedBucketlist) {
      this.setState({ selectedBucketlist: false });
    } else {
      scrollIntoView(el, { time: 500 });
      this.setState({ selectedBucketlist: id });
    }
  }

  showBucketlists() {
    if (this.state.showSearch) {
      return (
        <ReactCSSTransitionGroup
          transitionName="search-results"
          transitionEnterTimeout={100}
          transitionAppear
          transitionAppearTimeout={100}
          transitionLeaveTimeout={200}
        >
          { this.renderBucketlists(this.state.searchResults) }
        </ReactCSSTransitionGroup>
      );
    }
    return (
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionAppear
          transitionAppearTimeout={500}
          transitionLeaveTimeout={900}
        >
          { this.renderBucketlists(this.state.bucketlists) }
        </ReactCSSTransitionGroup>
    );
  }
  renderBucketlists(bucketlists) {
    if (bucketlists.length > 0) {
      return bucketlists.map((bucketlist, index) => (
        <ItemView
          key={bucketlist.id}
          ref={focused => this.selectedItem = focused}
          count={index}
          updateUI={this.updateAfterChanges}
          bucketlist={bucketlist}
          clickEvent={this.clickedItem}
          showItems={(index === (this.state.selectedBucketlist - 1))}
          delay={index * 500}
        />
      ));
    }
    return (
      <div className="empty-list">
        {this.state.showSearch ?
          <span> No Bucketlists Match The Search Parameters</span> :
          <span> No Items To Display </span> }
      </div>
    );
  }
  render() {
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
        <div className="bucketlist-container">
          <div className="search-bar row col-12" disabled={this.state.bucketlists.length === 0}>
            <div className="col-4" />
            <div className="col-4">
              { this.state.showSearch ? <span className="search-title">SEARCH RESULTS</span> : ''}
            </div>
            <div className="search-box col-4">
              <div className="search-div">
                <span className="icon"><i className="fa fa-search" /></span>
                <input
                  className={this.state.searchError ? 'has-error' : ''}
                  onFocus={event => this.searchFocus(event)}
                  onClick={event => this.searchFocus(event)}
                  onChange={event => this.search(event)}
                  placeholder="Search..."
                  id="search"
                  type="text"
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      this.search(event);
                      event.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="items">
            <div className="scrollable-container">
              {this.showBucketlists()}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default BucketlistView;
