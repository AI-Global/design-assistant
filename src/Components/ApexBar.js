import Chart from 'react-apexcharts';


const ApexBar = ({ options, series, type, width }) => {
  return <Chart
    options={options}
    series={series}
    type={type}
    width={'100%'}
    height={'100%'}
  />
}

export default ApexBar