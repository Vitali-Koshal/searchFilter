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
    columns = COLUMNS;
    searchValue = '';
    inputValue = '';
    records;
    error;
    deleteRecordModalWindow = false;
    recordId;
    contactName;
    tempRecords;
    @track refreshTable;

    openCreateNewModal = false;

    temp = 'her';
    @wire(getContacts, {searchValue: '$searchValue'})
    wiredContacts (response) {
        this.refreshTable = response;
        const {data, error} = response;
        if (data) {
            this.tempRecords = data;
            this.tempRecords = this.tempRecords.map( row => {
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
            this.records = this.tempRecords;
        }
     
    }

    handleSearchContact(event) { 
        this.inputValue = event.target.value;
    }
    handleClickFilterButton() { 
        this.searchValue = this.inputValue;
    }

    handleRowAction(event) {
        this.recordId = event.detail.row.contactId;
        this.contactName = event.detail.row.FIRST_NAME + ' ' + event.detail.row.LAST_NAME;
        this.deleteRecordModalWindow = true;  
    }
    handleDeleteModalWindow() {
        this.deleteRecordModalWindow = false;
    }
    handelRefreshWindowAfterDelete() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.refreshData.bind(this), 500); 
    }
    refreshData() {
        this.temp = 'refresh after delete';
        refreshApex(this.refreshTable);
        const toastEvent = new ShowToastEvent({
            title: "Contact deleted",
            message: "Record ID: " + this.recordId + ' Contact name: ' + this.contactName,
            variant: "info"
            });
            this.dispatchEvent(toastEvent);
    }

    //create new contact method
    handleClickNewButton() {
        this.openCreateNewModal = true;
    }
    handelCreateNewContactCancelButton() {
        this.openCreateNewModal = false;
    }
    
}
