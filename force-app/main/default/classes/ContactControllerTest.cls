@isTest
public with sharing class ContactControllerTest {
   
    @TestSetup
    static void makeContacts(){
        List<Account> accounts = new List<Account>();
        accounts.add(new Account(Name = 'TestAccount1'));
        accounts.add(new Account(Name = 'TestAccount2')); 
        Account testAccount = new Account(Name = 'TestAccount3');
        accounts.add(testAccount);
        insert accounts;
        List<Contact> testContacts = new List<Contact>();
        for( Integer i = 1 ; i < 3 ; i++ ) {
            testContacts.add(new Contact(   AccountId=testAccount.Id,
                                            FirstName = 'TestContact ' + i, 
                                            LastName = 'TestContact' + i
                                            ));
        }
        insert testContacts;
    }

    @isTest
    static void getContacts_returnAllContacts_returnedAllTestContact() {
        List<Contact> contacts = [SELECT Id, FirstName FROM Contact];
        Test.startTest();
        Integer numberOfContacts = ContactController.getContacts('').size();
        System.assertEquals(contacts.size(), numberOfContacts, 'The number of contacts is not correct');
        Test.stopTest();
    }
    @isTest
    static void getContacts_returnSortedByLastName_returnedSortedByFirstName() {
        Test.startTest();
        List<Contact> sortedContact = ContactController.getContacts('');
        System.assertNotEquals(false, sortedContact.get(0).FirstName.equals('TestContact 1'), 'Contacts not sorted by FirstName');
        Test.stopTest();
    }
    @isTest
    static void deleteContact_deleteContact_contactDeleted() {
        Contact contact = [SELECT Id FROM Contact WHERE FirstName = 'TestContact 1'];
        Test.startTest();
        ContactController.deleteContact(contact.Id);
        List<Contact> contacts = [SELECT Id FROM Contact WHERE FirstName = 'TestContact 1'];
        System.assertEquals(0,contacts.size(),'The contact is not deleted');  
        Test.stopTest();    
    }
    @isTest
    static void deleteContact_wrongIdDeleteContact_exception() {
        boolean exceptionIsPresent = false;
        String errorMessage = '';
        Test.startTest();
        try {
            ContactController.deleteContact('wrongId');
        } 
        catch (Exception e) {
            exceptionIsPresent = true;
            errorMessage = e.getMessage();
        }
        System.assertNotEquals(true,exceptionIsPresent,errorMessage); 
        Test.stopTest();  
    }
    @isTest
    static void createContact_createContactAllFieldFilled_contactCreated () {
        Account testAccount = new Account(Name = 'testAccount');
        System.debug('ssssssssssssssssssssssssssss '+testAccount.Id);
        String accountId = testAccount.Id;
        Test.startTest();
        ContactController.createContact('firstName', 'lastName', 'email@n.com', accountId, '222-222');
        List<Contact> createdContact = [SELECT Id, FirstName FROM Contact WHERE FirstName = 'firstName'];
        System.assertEquals(1,createdContact.size(),'Contact was not created'); 
        Test.stopTest(); 
    }
    @isTest
    static void getAccounts_getAllAccounts_allAccountloaded() {
        Test.startTest(); 
        Integer accountsQuontity = ContactController.getAccounts('').size();
        Test.stopTest();
        System.assertEquals(3,accountsQuontity,'All accounts are not loaded'); 
    }
} 
