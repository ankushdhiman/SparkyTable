const React = require('react');
const _ = require('lodash');

module.exports = React.createClass({
    displayName: 'SparkLine',
    
    propTypes: {
        id: React.PropTypes.string,
        data: React.PropTypes.array
    },

    componentDidMount(){
        this.mySpan = document.getElementById(this.props.id);
        if(this.mySpan) {
            Sparkline.draw(this.mySpan, this.props.data)
        }        
    },

    componentWillReceiveProps(nextProps){
        if(this.mySpan) {
            Sparkline.draw(this.mySpan, nextProps.data)
        }     
    },

    render(){
        return <span id={this.props.id}></span>;
    }
});