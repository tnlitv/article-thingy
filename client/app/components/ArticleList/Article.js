import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom'

import axios from 'axios';
// import '../style.css';

class Article extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <Link to={`/fb?articleUrl=${this.props.url}`}>Edit</Link>
            </div>
        )
    }
}
export default Article;