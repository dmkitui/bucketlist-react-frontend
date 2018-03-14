import React, { Component } from 'react';
import moment from 'moment';

export default function dateTimeFormat(timeObj) {
    let time = new Date(timeObj + ' UTC');
    return moment(time.getTime()).format('MMM Do YYYY, [at] h:mm[]a');
}
