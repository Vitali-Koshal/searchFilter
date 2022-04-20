import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
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
    },
    { type:"button", typeAttributes: {
                                        class: 'greenButton',
                                        label: 'Delete',
                                        title: 'Delete',
                                        value: 'delete',
                                        variant: 'brand',
                                        iconPosition: 'right',
                                    }
    }
];
export default class ContactSearchList extends LightningElement {
    columns = COLUMNS; //table columns
    searchValue = ''; //search input field value
    records; //contacts records data
    error;
    deleteRecordModalWindow = false; //delete modal window state value: close-false, open-true
    recordId;   //Contact Id to delete record 
    contactName;  //Deleting Contact full name (FirstName + Last Name)
    @track refreshTable; 
    openCreateNewModal = false; //create new modal window state value: close-false, open-true
    temp;

    @wire(getContacts, {searchValue: '$searchValue'})
    wiredContacts (response) {
        this.refreshTable = response;
        const {data, error} = response;
        if (data) {
            this.records = data;
            this.records = this.records.map( row => {
                return { 
                    FIRST_NAME: row.FirstName,
                    LAST_NAME: row.LastName,
                    EMAIL: row.Email,
                    ACCOUNT_NAME: (row.AccountId === undefined ? 'no Account' : row.Account.Name),
                    MOBILE_PHONE: row.MobilePhone,
                    CREATED_DATE: row.CreatedDate,
                    contactId: row.Id,
                    AccountURL: (row.AccountId === undefined ? '' : '/lightning/r/Account/' + row.AccountId + '/view')
                 };
            })
        }
     
    }
    

    handleClickFilterButton() { 
        this.searchValue = this.template.querySelector('.input_field').value;
    }

    handleRowAction(event) {
        this.recordId = event.detail.row.contactId;
        this.contactName = event.detail.row.FIRST_NAME + ' ' + event.detail.row.LAST_NAME;
        this.deleteRecordModalWindow = true;  
    }
    handleDeleteModalWindow() {
        this.deleteRecordModalWindow = false;
    }
    handleDeleteContactAction() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.refreshData.bind(this), 1000); 
        const toastEvent = new ShowToastEvent({
            title: "Contact deleted",
            message: "Record ID: " + this.recordId + ' Contact name: ' + this.contactName,
            variant: "info"
            });
        this.dispatchEvent(toastEvent);
    }
    refreshData() {
        refreshApex(this.refreshTable);
        
    }

    //create new contact method
    handleClickNewButton() {
        this.openCreateNewModal = true;
    }
    handleCreateNewContactCancelButton() {
        this.openCreateNewModal = false;
    }
    handleCreateContactAction(event) {
        this.searchValue = '';
        this.template.querySelector('.input_field').value = '';
        this.contactName = event.detail;
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.refreshData.bind(this), 1000); 
        const toastEvent = new ShowToastEvent({
            title: 'Contact created',
            message: ' Contact name: ' + this.contactName,
            variant: 'success'
            });
        this.dispatchEvent(toastEvent);
    }
    
}
