import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';


import ParagraphBox from './suggest/ParagraphBox';
import ArticleList from './list-of-articles/ArticleList';
import SuggestionsList from './approve/SuggestionsList';



ReactDOM.render(
    <Router>
        <div className='content'>
            <ul>
                <li><Link to="/">All</Link></li>
                <li><Link to="/fb/results">Results</Link></li>
            </ul>

            <hr />

            <Route exact path="/" component={ArticleList} />
            <Route exact path="/fb/results" component={SuggestionsList} />
            <Route exact path="/fb" component={ParagraphBox} />
        </div>
    </Router>,
    document.getElementById('root')
);