import { LightningElement, api } from 'lwc';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';
export default class DeleteWindow extends LightningElement {
    @api openDeleteModal;
    @api recordId; 
    @api contactName;

    handleCancelButton() {
        const deleteWindowEvent = new CustomEvent("deleterecordwindow", {});
        //dispatches the event
        this.dispatchEvent(deleteWindowEvent);
    }
    handleDeleteButton() {
        deleteContact({idValue: this.recordId});
        this.handleCancelButton();
        const deleteContactEvent = new CustomEvent("deletecontactaction", {});
        this.dispatchEvent(deleteContactEvent);
        
    }
}