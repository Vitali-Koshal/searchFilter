import { LightningElement, api, wire } from 'lwc';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';
export default class DeleteWindow extends LightningElement {
    @api openModal;
    @api recordId; 
    @api contactName;

    handleCancelButton() {
        const deleteWindowEvent = new CustomEvent("deleterecordwindow", {});
        //dispatches the event
        this.dispatchEvent(deleteWindowEvent);
    }
    handleDeleteButton() {
        //deleteContact({idValue: this.recordId});
        this.handleCancelButton();
        const refreshWindowEvent = new CustomEvent("refreshwindowafterdelete", {});
        //dispatches the event
        this.dispatchEvent(refreshWindowEvent);
        
    }
}