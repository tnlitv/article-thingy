import React, { Component } from 'react';
import axios from 'axios';
// import '../../styles/style.css';
import queryString from 'query-string';

import Suggestion from './Suggestion';

class SuggestionsList extends Component {
    constructor(props) {
        super(props);
        var showApproved = queryString.parse(this.props.location.search).showApproved;

        this.state = {
            paragraphs: [],
            showApproved: showApproved == 'true'
        }
        this.handleParagraphApprove = this.handleParagraphApprove.bind(this);
        this.handleParagraphDelete = this.handleParagraphDelete.bind(this);

    }

    componentDidMount() {
        this.loadParagraphsFromServer();
    }

    loadParagraphsFromServer() {
        let endpoint = 'http://localhost:3001/api/suggestions';
        axios.get(endpoint, {
            params: {
                showApproved: this.state.showApproved,
            }
        })
            .then(res => {
                this.setState({
                    paragraphs: res.data
                });
            })
    }
    handleParagraphDelete(id) {
        axios.delete(`http://localhost:3001/api/paragraphs/${id}/`)
            .then(res => {
                this.setState({
                    paragraphs: this.state.paragraphs.filter(function (e) {
                        return e._id != id
                    })
                })
            })
            .catch(err => {
                console.error(err);
            });
    }
    handleParagraphApprove(id) {
        console.log(this.state);
        if (this.state.showApproved) return;

        this.setState({
            paragraphs: this.state.paragraphs.filter(function (e) {
                return e._id != id
            })
        })
    }

    render() {
        let paragraphNodes = this.state.paragraphs.map((paragraph, index) => {
            return (
                <Suggestion
                    key={paragraph._id}
                    data={paragraph}
                    onParagraphDelete={this.handleParagraphDelete}
                    onParagraphApprove={this.handleParagraphApprove}
                ></Suggestion>
            )
        })
        return (
            <div>
                {paragraphNodes}
            </div>
        )
    }
}
export default SuggestionsList;