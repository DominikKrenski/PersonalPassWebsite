import DataRow from './data-row/DataRow';

import './DataTable.local.scss';

const DataTable = props => {
  const { arr , showButtonClick, editButtonClick, deleteButtonClick } = props;

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
            <th>TITLE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable;
