
const React = require('react');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
Enzyme.configure({ adapter: new Adapter() });
const { shallowToJson } = require('enzyme-to-json');

const App = require('./../src/app');
const SortedTable = require('../src/table.react');
const SparkLine = require('./../src/sparkline.react');

const dummyData = [
    {
        bestAsk: 1,
        bestBid: 2,
        lastChangeBid: 3,
        lastChangeAsk: 4,
        midPrices: [5, 6, 7]
    },
    {
        bestAsk: 2,
        bestBid: 3,
        lastChangeBid: 1,
        lastChangeAsk: 4,
        midPrices: [5, 6, 7]
    }
];

test('SortedTable component should render as expected', () => {
    const component = Enzyme.shallow(<SortedTable tableData={dummyData} sortingKey="lastChangeBid" />);
    expect(shallowToJson(component)).toMatchSnapshot();
});

test('Table should have 2 SparkLine components', () => {
    const component = Enzyme.shallow(<SortedTable tableData={dummyData} sortingKey="lastChangeBid" />);
    expect(component.find('SparkLine')).toHaveLength(2);
});

test('Table should not have tbody, when tableData is empty', () => {
    const component = Enzyme.shallow(<SortedTable tableData={[]} sortingKey="lastChangeBid" />);
    expect(component.find('tbody')).toHaveLength(0);
});

test('Table should have 2 rows in tbody, when tableData is has 2 records', () => {
    const component = Enzyme.shallow(<SortedTable tableData={dummyData} sortingKey="lastChangeBid" />);
    expect(component.find('tbody').find('tr')).toHaveLength(2);
});

test('SparkLine component should render as expected', () => {
    const component = Enzyme.shallow(<SparkLine data={dummyData[0].midPrices} id="1" />);
    expect(shallowToJson(component)).toMatchSnapshot();
});

test('SparkLine component should have a span with id 1', () => {
    const component = Enzyme.shallow(<SparkLine data={dummyData[0].midPrices} id="1" />);
    expect(component.find('span')).toHaveLength(1);
});
