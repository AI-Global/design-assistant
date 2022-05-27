import Chart from 'react-apexcharts';


const ApexBar = ({ options, series, type, width }) => {
  return <Chart
    options={options}
    series={series}
    type={type}
    width={width}
  />
}

export default ApexBar