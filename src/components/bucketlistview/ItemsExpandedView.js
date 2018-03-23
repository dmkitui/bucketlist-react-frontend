import React, { Component } from 'react';
import './ListItemView.css';
import Helpers from '../../helpers/Utilities';

class ItemsExpandedView extends Component {
  constructor (props) {
    super(props);
  }
  render(){
    let item = this.props.item;
    return(
      <tr>
        <div className="table-rows">
          <tbody>
            <tr>
              <td className="index-field">{this.props.index + 1}.</td>
              <td className="item-name">{item.item_name}</td>
              <td className="date-field">{Helpers.dateTimeFormat(item.date_created)}</td>
              <td className="date-field">{Helpers.dateTimeFormat(item.date_modified)}</td>
              <td className="status-btn"><button className="state-button btn btn-sm">Done</button></td>
            </tr>
          </tbody>
        </div>
      </tr>
    )
  }
}
export default ItemsExpandedView;