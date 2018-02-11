import React, { Component } from 'react';
import Paragraph from './Paragraph';
// import '../style.css';
class ParagraphList extends Component {
    render() {
        let paragraphNodes = this.props.data.map(paragraph => {
            return (
                // should I pass props separately or just object
                <Paragraph
                    className='paragraph-text'
                    key={paragraph._id}
                    id={paragraph._id}
                    originalText={paragraph.originalText}
                ></Paragraph>
            )
        })
        return (
            <div className='paragraph-list' >
                {paragraphNodes}
            </div>
        )
    }
}

export default ParagraphList;