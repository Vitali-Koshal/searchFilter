import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createContact from '@salesforce/apex/ContactController.createContact';
import getAccounts from '@salesforce/apex/ContactController.getAccounts';


    
export default class CreateNewContactWindow extends LightningElement {
    @api openCreateNewModal; 
    lastNameValue;
    firstNameValue;
    emailValue;
    accountIdValue;
    mobileValue;
   
    selectRecordName;
    searchRecords = [];
    LoadingText = false;
    txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    messageFlag = false;
    iconFlag =  true;
    clearIconFlag = false;
    inputReadOnly = false;

        
    searchField(event) {
        var currentText = event.target.value;
        this.LoadingText = true;
        getAccounts({ searchValue: currentText  })
        .then(result => {
            this.searchRecords= result;
            this.LoadingText = false;
            
            this.txtclassname =  result.length > 0 ? 'slds-combobox' 
                                                    + 'slds-dropdown-trigger'
                                                    + 'slds-dropdown-trigger_click' 
                                                    + 'slds-is-open' 
                                                    : 'slds-combobox' 
                                                    + 'slds-dropdown-trigger' 
                                                    + 'slds-dropdown-trigger_click';
            if(currentText.length > 0 && result.length == 0) {
                this.messageFlag = true;
            }
            else {
                this.messageFlag = false;
            }

            if(this.accountIdValue != null && this.accountIdValue.length > 0) {
                this.iconFlag = false;
                this.clearIconFlag = true;
            }
            else {
                this.iconFlag = true;
                this.clearIconFlag = false;
            }
        })
        .catch(error => {
            console.log('-------error-------------'+error);
            console.log(error);
        });
        
    }
    setSelectedRecord(event) {
        var currentRecId = event.currentTarget.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        this.iconFlag = false;
        this.clearIconFlag = true;
        this.selectRecordName = event.currentTarget.dataset.name;
        this.accountIdValue = currentRecId;
        this.inputReadOnly = true;
        const selectedEvent = new CustomEvent('selected', { detail: {selectName, currentRecId}, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
    
    resetData() {
        this.selectRecordName = "";
        this.accountIdValue = "";
        this.inputReadOnly = false;
        this.iconFlag = true;
        this.clearIconFlag = false;
       
    }

    resetContactValues() {
        this.lastNameValue = '';
        this.firstNameValue = '';
        this.emailValue = '';
        this.accountIdValue = '';
        this.mobileValue = '';
        this.resetData();
    }

    handleCancelButton() {
        const createNewContactCancelEvent = new CustomEvent("createnewcontactcancelbutton", {});
        //dispatches the event
        this.dispatchEvent(createNewContactCancelEvent);
        this.resetContactValues();
    }
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
    handleLastNameField(event) {
        this.lastNameValue = event.target.value;
    }
    handleFirstNameField(event) {
        this.firstNameValue = event.target.value;
    }
    handleEmailField(event) {
        this.emailValue = event.target.value;
    }
    handleMobilePhoneField(event) {
        this.mobileValue = event.target.value;
    }
    handleSaveButton() {
        if(this.isInputValid()){
            createContact({
                firstName: this.firstNameValue, 
                lastName: this.lastNameValue,
                email: this.emailValue,
                accountId: this.accountIdValue,
                mobile: this.mobileValue
                });
            const createContactEvent = new CustomEvent("createcontactaction", {
                detail: this.firstNameValue + ' ' + this.lastNameValue
            });
            this.handleCancelButton();
            this.dispatchEvent(createContactEvent);
            this.resetContactValues();
        }
    }
    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
}