public with sharing class ContactController {
    public ContactController() {

    }
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(String searchValue) {
        String searchPatern = '%' + searchValue + '%';
        return [
            SELECT Id, FirstName, LastName, Email, Account.Name, MobilePhone, CreatedDate, AccountId
            FROM Contact
            WHERE FirstName LIKE :searchPatern
            ORDER BY FirstName
            ];
    }
}
