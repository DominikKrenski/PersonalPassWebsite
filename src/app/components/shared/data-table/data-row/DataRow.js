import '../DataTable.local.scss';

const DataRow = props => {
  const { id, data, showButtonClick, editButtonClick, deleteButtonClick } = props;

  return (
    <tr>
      <td>{id}</td>
      <td>{data.entry.entryTitle}</td>
      <td>
        <button
          className="button is-primary is-inverted is-small"
          value={data.id}
          onClick={showButtonClick}
        >
          Show
        </button>
        <button
          className="button is-info is-inverted is-small"
          value={data.id}
          onClick={editButtonClick}
        >
          Edit
        </button>
        <button
          className="button is-danger is-inverted is-small"
          value={data.id}
          onClick={deleteButtonClick}
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

export default DataRow;
