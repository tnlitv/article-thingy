import React, { Component } from 'react';
// import '../style.css';
import axios from 'axios';

class Paragraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toBeUpdated: false,
            author: '',
            text: props.originalText
        }
        this.updateParagraph = this.updateParagraph.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleParagraphUpdate = this.handleParagraphUpdate.bind(this);
    }
    updateParagraph(e) {
        e.preventDefault();
        this.setState({ toBeUpdated: !this.state.toBeUpdated });
    }
    handleParagraphUpdate(e) {
        e.preventDefault();
        let suggestion = { text: this.state.text };
        axios
            .post(`http://localhost:3001/api/paragraphs/${this.props.id}/suggestions`, suggestion)
            .then(res => {
                this.setState({
                    toBeUpdated: !this.state.toBeUpdated,
                    text: this.props.originalText
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    render() {
        return (
            <div className='paragraph-text'>
                <div>{this.props.originalText}</div>
                <input type='button' className='btn' onClick={this.updateParagraph} value='Suggest'/>
                {(this.state.toBeUpdated)
                    ? (<form onSubmit={this.handleParagraphUpdate}>
                        <textarea
                            placeholder='Update your paragraph…'
                            className='suggest-textarea'
                            value={this.state.text}
                            onChange={this.handleTextChange} />
                        <input
                            type='submit'
                            className='btn' 
                            disabled={this.props.originalText === this.state.text}
                            value='Send' />
                    </form>)
                    : null}
            </div>
        )
    }
}
export default Paragraph;