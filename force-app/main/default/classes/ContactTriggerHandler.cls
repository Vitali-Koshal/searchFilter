public with sharing class ContactTriggerHandler {
    public static void toastSendingAfterDelete() {
        const toastEvent = new ShowToastEvent({
        title: "Contact deleted",
        message: "Record ID: " + event.detail.id,
        variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
}
