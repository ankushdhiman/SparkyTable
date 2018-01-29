const React = require('react');
const _ = require('lodash');
const SparkLine = require('./sparkline.react');

const SortedTable = (props) => {
    const sortedTableData = _.sortBy(props.tableData, props.sortingKey);

    return(
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Currency Pair</th>
                    <th>Best Bid</th>
                    <th>Best Ask</th>
                    <th>Change in Best Bid</th>
                    <th>Change in Best Ask</th>
                    <th>Mid Prices</th>
                </tr>
            </thead>
            {_.isEmpty(sortedTableData) ? null : 
            <tbody>
            {_.map(sortedTableData, (datum, index) =>
                <tr key={index}>
                    <td>{_.toUpper(datum.name)}</td>
                    <td>{datum.bestBid}</td>
                    <td>{datum.bestAsk}</td>
                    <td>{datum.lastChangeBid}</td>
                    <td>{datum.lastChangeAsk}</td>
                    <td><SparkLine data={datum.midPrices} id={index.toString()} /></td>
                </tr>
                )}
            </tbody>}
        </table>
    );
};

SortedTable.displayName = "SortedTable";

SortedTable.PropTypes = {
    tableData: React.PropTypes.array,
    sortingKey: React.PropTypes.string
};

module.exports = SortedTable;