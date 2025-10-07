import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const Chart = ({ chartData }) => {
    console.log(chartData);


    return (
        <div>
            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <ComposedChart
                        width={300}
                        height={400}
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="date" /> {/*scale="band"*/}
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="totalRevenue" fill="#8884d8" stroke="#8884d8" />
                        <Bar dataKey="totalRevenue" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="totalQuantity" stroke="#ff7300" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

Chart.propTypes = {
    chartData: PropTypes.array,
}

export default Chart;