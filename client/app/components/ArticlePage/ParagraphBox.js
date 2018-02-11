import React, { Component } from 'react';
import ParagraphList from './ParagraphList';
import axios from 'axios';
// import '../style.css';
import queryString from 'query-string';

class ParagraphBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paragraphs: [],
            article: {
                title: '',
                id: undefined
            }
        };
        this.loadParagraphsFromServer = this.loadParagraphsFromServer.bind(this);
        this.handleParagraphUpdate = this.handleParagraphUpdate.bind(this);
    }
    loadParagraphsFromServer() {
        var url = queryString.parse(this.props.location.search).articleUrl;
        axios.get(`http://localhost:3001/api/articles?articleUrl=${url}`)
            .then(res => {
                this.setState({
                    article: { title: res.data.title, id: res.data._id },
                    paragraphs: res.data.paragraphs
                });
            })
    }
    handleParagraphUpdate(paragraph) {
        console.log(paragraph);
        axios.post(`http://localhost:3001/api/articles/${paragraph.id}`, paragraph)
            .catch(err => {
                console.log(err);
            })
    }
    componentDidMount() {
        this.loadParagraphsFromServer();
    }

    render() {
        return (
            <div className='paragraph-box' >
                <h2 >{this.state.article.title}</h2>
                <ParagraphList
                    data={this.state.paragraphs} />
            </div>
        )
    }
}
export default ParagraphBox;