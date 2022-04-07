import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
const COLUMNS = [
    { label: 'First Name', fieldName: 'FIRST_NAME', type: 'text'},
    { label: 'Last Name', fieldName: 'LAST_NAME', type: 'text' },
    { label: 'Email', fieldName: 'EMAIL', type: 'Email' },
    { 
        label: 'Account Name', 
        fieldName: 'AccountURL', 
        type: 'url', 
        typeAttributes: { label: {fieldName: 'ACCOUNT_NAME'}},
    },
    { label: 'Mobile Phone', fieldName: 'MOBILE_PHONE', type: 'Phone' },
    { 
        label: 'Created Date', 
        fieldName: 'CREATED_DATE', 
        type: 'date', 
        typeAttributes: { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "numeric" }
    }
];
export default class ContactSearchList extends LightningElement {
    columns = COLUMNS;
    searchValue = '';
    inputValue = '';
    records;
    error;

    @wire(getContacts, {searchValue: '$searchValue'})
    wiredContacts ( {data} ) {
        if (data) {
            let tempRecords = data;
            tempRecords = tempRecords.map( row => {
                return { 
                    FIRST_NAME: row.FirstName,
                    LAST_NAME: row.LastName,
                    EMAIL: row.Email,
                    ACCOUNT_NAME: (row.AccountId === undefined ? 'no Account' : row.Account.Name),
                    MOBILE_PHONE: row.MobilePhone,
                    CREATED_DATE: row.CreatedDate,
                    AccountURL: (row.AccountId === undefined ? '' : '/lightning/r/Account/' + row.AccountId + '/view')
                 };
            })
            this.records = tempRecords;
        }
     
    }

    handleSearchContact(event) { 
        this.inputValue = event.target.value;
    }
    handleClickFilterButton() { 
        this.searchValue = this.inputValue;
    }
}
