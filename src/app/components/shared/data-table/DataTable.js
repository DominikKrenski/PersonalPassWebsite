import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import DataRow from './data-row/DataRow';

import './DataTable.local.scss';

const DataTable = props => {
  const { arr , showButtonClick, editButtonClick, deleteButtonClick } = props;

  const { t } = useTranslation();

  const rows = arr.map((item, i) => {
    return (
      <DataRow
        key={item.id}
        id={i+1}
        data={item}
        showButtonClick={showButtonClick}
        editButtonClick={editButtonClick}
        deleteButtonClick={deleteButtonClick}
      />
    )
  });

  return (
    <div id="data-table">
      <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('titleHeader', { ns: 'data_table' })}</th>
            <th>{t('actionsHeader', { ns: 'data_table' })}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

DataTable.propTypes = {
  showButtonClick: PropTypes.func.isRequired,
  editButtonClick: PropTypes.func.isRequired,
  deleteButtonClick: PropTypes.func.isRequired,
  arr: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      entry: PropTypes.shape({
        entryTitle: PropTypes.string.isRequired
      })
    })
  ).isRequired
}

export default DataTable;
