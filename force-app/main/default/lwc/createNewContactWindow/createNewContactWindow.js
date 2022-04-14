import { LightningElement, api } from 'lwc';
    
export default class CreateNewContactWindow extends LightningElement {
    @api openCreateNewModal;
    temp = false;

    handleCancelButton() {
        temp = true;
        const createNewContactCancelEvent = new CustomEvent("createnewcontactcancelbutton", {});
        //dispatches the event
        this.dispatchEvent(createNewContactCancelEvent);
    }
}