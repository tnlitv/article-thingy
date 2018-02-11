import React from 'react';
import { render } from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import ParagraphBox from './components/ArticlePage/ParagraphBox';
import ArticleList from './components/ArticleList/ArticleList';
import SuggestionsList from './components/ResultsList/SuggestionsList';


import './styles/styles.scss';

render((
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={ArticleList} />
                <Route exact path="/fb/results" component={SuggestionsList} />
                <Route exact path="/fb" component={ParagraphBox} />
                <Route component={NotFound} />
            </Switch>
        </App>
    </Router>
), document.getElementById('app'));
