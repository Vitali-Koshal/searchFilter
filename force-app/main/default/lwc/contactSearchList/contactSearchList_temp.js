import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName', type: 'text'},
    { label: 'Last Name', fieldName: 'LastName', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'Email' },
    { label: 'Account Name', fieldName: 'Account.Name', type: 'text' },
    { label: 'Mobile Phone', fieldName: 'MobilePhone', type: 'Phone' },
    { 
        label: 'Created Date', 
        fieldName: 'CreatedDate', 
        type: 'date', 
        typeAttributes: { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "numeric" }
    }
];
export default class ContactSearchList extends LightningElement {
    columns = COLUMNS;
    searchValue = '';
    inputValue = '';
   

    @wire(getContacts, {searchValue: '$searchValue'})
    contacts;
    
    handleSearchContact(event) { 
        this.inputValue = event.target.value;
    }
    handleClickFilterButton() { 
        this.searchValue = this.inputValue;
    }
}
