import React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import * as moment from 'moment';
import * as _ from 'lodash';
import { formatCurrency } from '../common/number.helper';
import { getExplorerAddrUrl, SATOSHIS_IN_BTC } from '../common/bitcoin.helper';

class MonthlyPayouts extends React.Component {
  render() {
    const { translate, monthlyPayouts } = this.props;

    const data = monthlyPayouts || [];
    const columns = getColumnDefinitions(translate);
    const defaultSorted = [{ id: 'paymentDate', desc: true }];

    return (
      <ReactTable
        data={data}
        columns={columns}
        minRows={0}
        defaultSorted={defaultSorted}
      />
    );
  }
}

function getColumnDefinitions(translate) {
  return [{
    Header: translate('payout.date'),
    accessor: 'paymentDate',
    Cell: row => moment(row.value).format('DD.MM.YYYY HH:mm'),
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
      </a>
    ),
  }, {
    Header: translate('payout.rateChf'),
    accessor: 'rateChf',
    Cell: row => formatCurrency(row.value),
    Footer: (row) => {
      const total = _.sumBy(row.data, 'rateChf') / row.data.length;
      return (
        <span><strong>{translate('app.avg')}</strong> {formatCurrency(total)}</span>);
    },
  }, {
    Header: translate('payout.amountChf'),
    accessor: 'amountChf',
    Cell: row => formatCurrency(row.value),
    Footer: (row) => {
      const total = _.sumBy(row.data, 'amountChf');
      return (
        <span><strong>{translate('app.total')}</strong> {formatCurrency(total)}</span>);
    },
  }, {
    Header: translate('payout.amountBtc'),
    accessor: 'amountBtc',
    Cell: row => row.value / SATOSHIS_IN_BTC,
    Footer: (row) => {
      const total = _.sumBy(row.data, 'amountBtc');
      return (
        <span><strong>{translate('app.total')}</strong> {total / SATOSHIS_IN_BTC}</span>);
    },
  }];
}

function mapStateToProps(state) {
  return {
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(MonthlyPayouts);
