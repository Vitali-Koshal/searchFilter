public with sharing class ContactController {
  
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
    @AuraEnabled
    public static void deleteContact(String idValue){
        try {
            List<Contact> contacts=[SELECT Id, FirstName FROM Contact WHERE Id = :idValue ];
            delete contacts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
