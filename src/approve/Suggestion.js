
import React, { Component } from 'react';
import '../style.css';
import marked from 'marked';
import axios from 'axios';

class Suggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: this.props.data.suggestions,
            originalText: this.props.data.originalText,
            id: this.props.data._id
        }
        // should i use props or state for originalText and id ? 
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleApproveButtonClick = this.handleApproveButtonClick.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
        this.handleNewSuggestionApprove = this.handleNewSuggestionApprove.bind(this);
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    handleApproveButtonClick(id) {
        let suggestion = { id: id, is_approved: true };
        axios
            .put(`http://localhost:3001/api/paragraphs/${this.state.id}/suggestions`, suggestion)
            .then(res => {
                this.setState({
                    suggestions: this.state.suggestions.map(function (element) {
                        element.is_approved = element._id === id
                        return element;
                    })
                });
                this.props.onParagraphApprove(this.state.id);
            })
            .catch(err => {
                console.log(err);
            })
    }
    handleDeleteButtonClick(e) {
        e.preventDefault();
        this.props.onParagraphDelete(this.state.id);
    }
    handleNewSuggestionApprove() {
        let suggestion = {
            text: this.state.newSuggestionText,
            is_approved: true
        };
        axios.post(`http://localhost:3001/api/paragraphs/${this.state.id}/suggestions`, suggestion)
            .then(res => {
                this.setState({
                    newSuggestionText: ''
                });

                this.props.onParagraphApprove(this.state.id);
            })
    }
    handleTextChange(e) {
        this.setState({ newSuggestionText: e.target.value });
    }
    render() {
        let suggestionNodes = this.state.suggestions.map((suggestion, ind) => {
            //should i extract it to a new component to avoid arrow function ?
            return (
                <div key={ind}>
                    <input type='button' value='Approve' className='btn'
                        onClick={() => this.handleApproveButtonClick(suggestion._id)}
                        disabled={suggestion.is_approved} />
                    <span> {suggestion.text} </span>
                </div>
            )
        })

        return (
            <div className='paragraph-box'>
                <div className='paragraph-text'>
                    <input type='button' value='Delete' className='btn' onClick={this.handleDeleteButtonClick} />
                    <div >{this.state.originalText}</div>
                </div>

                <div>
                    {suggestionNodes}

                    <form onSubmit={this.handleNewSuggestionApprove}>
                        <textarea
                            placeholder='Write your own suggestion'
                            className='suggest-textarea'
                            value={this.state.newSuggestionText}
                            onChange={this.handleTextChange} />
                        <input
                            type='submit'
                            className='btn'
                            onChange={this.handleTextChange}
                            disabled={this.state.originalText === this.state.newSuggestionText}
                            value='Approve' />
                    </form>
                </div>

            </div>
        )
    }
}
export default Suggestion;