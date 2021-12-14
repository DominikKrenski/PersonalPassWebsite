import { useEffect, useState } from 'react';

import httpClient from '../../../../utils/HttpClient';
import accessService from '../../../../utils/AccessService';
import encryptionService from '../../../../utils/EncryptionService';
import errorService from '../../../../utils/ErrorService';
import useForm from '../../../../hooks/useForm';
import urls from '../../../../utils/urls';

import ValidationMessage from '../../../shared/validation-message/ValidationMessage';

import './AddressForm.local.scss';

const AddressForm = props => {
  const { closeCallback, successCallback } = props;

  const [accessData, setAccessData] = useState(null);


  useEffect(() => {
    const accessSubscription = accessService.getAccessData().subscribe(data => setAccessData(data));

    return () => accessSubscription.unsubscribe();
  }, []);

  const [handleChange, handleSubmit, data, errors] = useForm({
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

  const submit = async data => {
    try {
      // encrypt all data with master key
      const encryptedAddress = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
      const res = await httpClient.post(urls.addresses, { 'data':  `${encryptedAddress.vector}.${encryptedAddress.encryptedData}`});
      successCallback(res.data);
      closeCallback(false);
    } catch (err) {
      errorService.updateError(err);
      closeCallback(false);
    }
  }

  const handleCancelButtonClick = () => {
    closeCallback(false);
  }

  return (
    <div id="address-form-wrapper">
      <div className="column is-half is-offset-one-quarter">
        <div id="address-form">
          <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submit)}>
            <table className="table is-bordered is-fullwidth is-striped">
              <thead>
                <tr>
                  <th colSpan={2}><h1>Add Address</h1></th>
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
            </table>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddressForm;
