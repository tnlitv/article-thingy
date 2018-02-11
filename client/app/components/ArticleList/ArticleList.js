import React, { Component } from 'react';
import axios from 'axios';
// import '../style.css';
import Article from './Article';

class ArticleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
        };
    }

    loadArticleList() {
        axios.get('http://localhost:3001/api/all')
            .then(res => {
                this.setState({
                    articles: res.data,
                });
            })
    }

    componentDidMount() {
        this.loadArticleList();
    }

    render() {
       let articleNodes = this.state.articles.map(article => {
            return (
                <Article 
                    key={article.id}
                    title={article.title}
                    url={article.url}
                ></Article>
            )
        })
        return (
            <div>
                {articleNodes}
            </div>
        )
    }
}
export default ArticleList;