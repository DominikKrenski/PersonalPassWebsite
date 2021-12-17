import PropTypes from 'prop-types';

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

DataRow.propTypes = {
  id: PropTypes.number.isRequired,
  showButtonClick: PropTypes.func.isRequired,
  editButtonClick: PropTypes.func.isRequired,
  deleteButtonClick: PropTypes.func.isRequired,
  data: PropTypes.exact({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    entry: PropTypes.exact({
      entryTitle: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      middleName: PropTypes.string,
      lastName: PropTypes.string,
      birthday: PropTypes.string,
      company: PropTypes.string,
      addressOne: PropTypes.string,
      addressTwo: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      state: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      mobilePhone: PropTypes.string,
      notes: PropTypes.string
    }).isRequired
  }).isRequired
}

export default DataRow;
