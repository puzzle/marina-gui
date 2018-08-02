import React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { formatCurrency } from '../common/number.helper';
import { getExplorerAddrUrl, SATOSHIS_IN_BTC } from '../common/bitcoin.helper';

class MonthlyPayouts extends React.Component {
  render() {
    const { translate, monthlyPayouts } = this.props;

    const data = monthlyPayouts || [];
    const columns = getColumnDefinitions(translate);

    return (
      <ReactTable data={data} columns={columns} minRows={0} />
    );
  }
}

function getColumnDefinitions(translate) {
  return [{
    Header: translate('payout.date'),
    accessor: 'paymentDate',
  }, {
    Header: translate('payout.address'),
    accessor: 'publicAddress',
    Cell: row => (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={getExplorerAddrUrl(row.value)}
      >
        {row.value}
      </a>),
  }, {
    Header: translate('payout.rateChf'),
    accessor: 'rateChf',
    Cell: row => formatCurrency(row.value),
  }, {
    Header: translate('payout.amountChf'),
    accessor: 'amountChf',
    Cell: row => formatCurrency(row.value),
  }, {
    Header: translate('payout.amountBtc'),
    accessor: 'amountBtc',
    Cell: row => row.value / SATOSHIS_IN_BTC,
  }];
}

function mapStateToProps(state) {
  return {
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(MonthlyPayouts);
