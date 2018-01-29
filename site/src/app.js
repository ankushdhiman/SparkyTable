const React = require('react');
const _ = require('lodash');
const { Observable } = require('rxjs');

const SortedTable = require('./table.react');

module.exports = React.createClass({
    displayName: 'App',
    
    propTypes: {
        client: React.PropTypes.object
    },

    getInitialState(){
        return {
            tableData: []
        };
    },
    
    componentWillMount(){
        const mainStream = Observable.create((observer) => {    
            this.props.client.subscribe('/fx/prices', (data) => {
                const selection = ['name', 'bestBid', 'bestAsk', 'lastChangeAsk', 'lastChangeBid'];
                const currentData = _.pick(JSON.parse(data.body), selection);
                observer.next(currentData)
            });
        });

        const delayedStream = mainStream.delay(30000);
        
        mainStream.subscribe(this.mainCallback);
        delayedStream.subscribe(this.delayedCallback);
    },

    delayedCallback(delayedData){
        const tableData = _.map(this.state.tableData, (record) => {
            if(record.name === delayedData.name){
                return _.merge(record, { midPrices: _.slice(record.midPrices, 1)})
            }
            return record;
        });

        this.setState({ tableData });
    },

    mainCallback(currentData){
        const midPrices = [(currentData.bestAsk + currentData.bestBid) / 2];
        let tableData = [];
        if(_.find(this.state.tableData, { 'name': currentData.name })) {
            tableData = _.map(this.state.tableData, (record) => {
                if(record.name === currentData.name) {
                    return _.merge(currentData, { midPrices: _.concat(record.midPrices, midPrices) })
                }
                return record;
            });
        }
        else {
            tableData = _.concat(this.state.tableData, _.merge(currentData, { midPrices }));
        }       

        this.setState({ tableData });
    },

    render(){
        return (
            <SortedTable 
                tableData={this.state.tableData}
                sortingKey="lastChangeBid"
            />
        );
    },

    componentWillUnmount(){
        this.props.client.disconnect(() => console.log('connection closed'));
    }
});

