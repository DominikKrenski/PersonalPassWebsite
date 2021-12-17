import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import httpClient from '../../../../utils/HttpClient';
import accessService from '../../../../utils/AccessService';
import dateService from '../../../../utils/DateService';
import encryptionService from '../../../../utils/EncryptionService';
import errorService from '../../../../utils/ErrorService';
import useForm from '../../../../hooks/useForm';
import urls from '../../../../utils/urls';

import ValidationMessage from '../../../shared/validation-message/ValidationMessage';

import './AddressForm.local.scss';

const AddressForm = props => {
  const { closeCallback, successCallback, address, type } = props;

  const [accessData, setAccessData] = useState(null);

  useEffect(() => {
    const accessSubscription = accessService.getAccessData().subscribe(data => setAccessData(data));

    return () => accessSubscription.unsubscribe();
  }, []);


  const handleCancelButtonClick = () => {
    closeCallback(false);
  }

  const setInitialValues = () => {
    const values = {
      ...(address.entry.entryTitle && { entryTitle: address.entry.entryTitle }),
      ...(address.entry.firstName && { firstName: address.entry.firstName }),
      ...(address.entry.middleName && { middleName: address.entry.middleName }),
      ...(address.entry.lastName && { lastName: address.entry.lastName }),
      ...(address.entry.birthday && { birthday: dateService.convertServerDateToFormDate(address.entry.birthday)}),
      ...(address.entry.company && { company: address.entry.company }),
      ...(address.entry.addressOne && { addressOne: address.entry.addressOne }),
      ...(address.entry.addressTwo && { addressTwo: address.entry.addressTwo }),
      ...(address.entry.city && { city: address.entry.city }),
      ...(address.entry.country && { country: address.entry.country }),
      ...(address.entry.state && { state: address.entry.state }),
      ...(address.entry.email && { email: address.entry.email }),
      ...(address.entry.phone && { phone: address.entry.phone }),
      ...(address.entry.mobilePhone && { mobilePhone: address.entry.mobilePhone }),
      ...(address.entry.notes && { notes: address.entry.notes })
    }

    return values;
  }

  let submitFunc = null;
  let tableTitle = null;
  let tableFooter = null;
  let initialValues = {};

  if (type === 'add') {
    tableTitle = 'Add Address';

    submitFunc = async data => {
      try {
        const encryptedAddress = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        const res = await httpClient.post(urls.addresses, { 'data': `${encryptedAddress.vector}.${encryptedAddress.encryptedData}` });
        successCallback(true);
        closeCallback(false);
      } catch (err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    tableFooter = (
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
                  Cancel
                </button>
              </p>
              <p className="control">
                <button id="send-button" type="submit" className="button is-small is-rounded">
                  Add Address
                </button>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    )
  } else if (type === 'edit') {
    tableTitle = `Update: ${address.entry.entryTitle}`;

    initialValues = setInitialValues();

    submitFunc = async data => {
      try {
        const encryptedAddress = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        const res = await httpClient.put(`${urls.addresses}/${address.id}`, { 'data': `${encryptedAddress.vector}.${encryptedAddress.encryptedData}` });
        successCallback(true);
        closeCallback(false);
      } catch (err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    tableFooter = (
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
                  Cancel
                </button>
              </p>
              <p className="control">
                <button id="send-button" type="submit" className="button is-small is-rounded">
                  Update Address
                </button>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    )
  } else {
    tableTitle = `${address.entry.entryTitle}`;

    initialValues = setInitialValues();

    tableFooter = (
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
                  Close
                </button>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    )
  }

  const [handleChange, handleSubmit, data, errors] = useForm({
    ...(Object.keys(initialValues) && { 'initialValues': initialValues }),
    validators: {
      entryTitle: {
        required: true,
        maxLength: 100
      },
      firstName: {
        maxLength: 100
      },
      middleName: {
        maxLength: 100
      },
      lastName: {
        maxLength: 100
      },
      birthday: {
        maxLength: 10
      },
      company: {
        maxLength: 300
      },
      addressOne: {
        maxLength: 500
      },
      addressTwo: {
        maxLength: 500
      },
      city: {
        maxLength: 255
      },
      country: {
        maxLength: 255
      },
      state: {
        maxLength: 255
      },
      email: {
        maxLength: 360
      },
      phone: {
        maxLength: 20
      },
      mobilePhone: {
        maxLength: 20
      },
      notes: {
        maxLength: 500
      }
    },
    sanitizers: {
      entryTitle: {
        trim: true
      },
      firstName: {
        trim: true
      },
      middleName: {
        trim: true
      },
      lastName: {
        trim: true
      },
      birthday: {
        trim: true,
        date: true
      },
      company: {
        trim: true
      },
      addressOne: {
        trim: true
      },
      addressTwo: {
        trim: true
      },
      city: {
        trim: true
      },
      country: {
        trim: true
      },
      state: {
        trim: true
      },
      email: {
        trim: true
      },
      phone: {
        trim: true
      },
      mobilePhone: {
        trim: true
      },
      notes: {
        trim: true
      }
    }
  });

  return (
    <div id="address-form-wrapper">
      <div className="column is-half is-offset-one-quarter">
        <div id="address-form">
          <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submitFunc)}>
            <table className="table is-bordered is-fullwidth is-striped">
              <thead>
                <tr>
                  <th colSpan={2}><h1>{tableTitle}</h1></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Entry Title <span>*</span></td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className={`input ${errors.entryTitle ? "error" : ""}`}
                          type="text"
                          name="entryTitle"
                          value={data.entryTitle || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('entryTitle')}
                        />
                      </div>
                      {
                        errors.entryTitle &&
                        <ValidationMessage field="entryTitle" errors={errors.entryTitle} />
                      }
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>First Name</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className={`input ${errors.firstName ? "error" : ""}`}
                          type="text"
                          name="firstName"
                          value={data.firstName || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('firstName')}
                        />
                      </div>
                      {
                        errors.firstName &&
                        <ValidationMessage field="firstName" errors={errors.firstName} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Middle Name</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="middleName"
                          value={data.middleName || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('middleName')}
                        />
                      </div>
                      {
                        errors.middleName &&
                        <ValidationMessage field="middleName" errors={errors.middleName} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Last Name</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="lastName"
                          value={data.lastName || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('lastName')}
                        />
                      </div>
                      {
                        errors.lastName &&
                        <ValidationMessage field="lastName" errors={errors.lastName} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Birthday</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="date"
                          name="birthday"
                          value={data.birthday || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('birthday')}
                        />
                      </div>
                      {
                        errors.birthday &&
                        <ValidationMessage field="birthday" errors={errors.birthday} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Company</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="company"
                          value={data.company || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('company')}
                        />
                      </div>
                      {
                        errors.company &&
                        <ValidationMessage field="company" errors={errors.company} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Address 1</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="addressOne"
                          value={data.addressOne || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('addressOne')}
                        />
                      </div>
                      {
                        errors.addressOne &&
                        <ValidationMessage field="addressOne" errors={errors.addressOne} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Address 2</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="addressTwo"
                          value={data.addressTwo || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('addressTwo')}
                        />
                      </div>
                      {
                        errors.addressTwo &&
                        <ValidationMessage field="addressTwo" errors={errors.addressTwo} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>City</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="city"
                          value={data.city || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('city')}
                        />
                      </div>
                      {
                        errors.city &&
                        <ValidationMessage field="city" errors={errors.city} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Country</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="country"
                          value={data.country || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('country')}
                        />
                      </div>
                      {
                        errors.country &&
                        <ValidationMessage field="country" errors={errors.country} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>State</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="state"
                          value={data.state || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('state')}
                        />
                      </div>
                      {
                        errors.state &&
                        <ValidationMessage field="state" errors={errors.state} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Email Address</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="email"
                          name="email"
                          value={data.email || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('email')}
                        />
                      </div>
                      {
                        errors.email &&
                        <ValidationMessage field="email" errors={errors.email} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Phone</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="phone"
                          value={data.phone || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('phone')}
                        />
                      </div>
                      {
                        errors.phone &&
                        <ValidationMessage field="phone" errors={errors.phone} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Mobile Phone</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="mobilePhone"
                          value={data.mobilePhone || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('mobilePhone')}
                        />
                      </div>
                      {
                        errors.mobilePhone &&
                        <ValidationMessage field="mobilePhone" errors={errors.mobilePhone} />
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Notes</td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="notes"
                          value={data.notes || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('notes')}
                        />
                      </div>
                      {
                        errors.notes &&
                        <ValidationMessage field="notes" errors={errors.notes} />
                      }
                    </div>
                  </td>
                </tr>
              </tbody>
              {tableFooter}
            </table>
          </form>
        </div>
      </div>
    </div>
  )
}

AddressForm.propTypes = {
  type: PropTypes.oneOf(['add', 'edit', 'show']).isRequired,
  successCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  address: PropTypes.exact({
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
    })
  })
}

export default AddressForm;
