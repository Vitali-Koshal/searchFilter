@isTest
public with sharing class ContactControllerTest {
   
    @TestSetup
    static void makeContacts(){
        List<Contact> testContacts = new List<Contact>();
        for( Integer i = 1 ; i < 3 ; i++ ) {
            testContacts.add(new Contact(FirstName = 'TestContact ' + i, LastName = 'TestContact' + (3 - i) ));
        }
        insert testContacts;
    }

    @isTest
    static void getContacts_returnAllContacts_returnedAllTestContact() {
        List<Contact> contacts = [SELECT Id, FirstName FROM Contact];
        Test.startTest();
        Integer numberOfContacts = ContactController.getContacts('').size();
        Test.stopTest();
        System.assertEquals(contacts.size(), numberOfContacts, 'The number of contacts is not correct');
    }
    @isTest
    static void getContacts_returnSortedByLastName_returnedSortedByFirstName() {
        Test.startTest();
        List<Contact> sortedContact = ContactController.getContacts('');
        Test.stopTest();
        System.debug('Info '+sortedContact.get(0).FirstName.equals('TestContact 1')+' '+ null+ ' value');
        System.assertNotEquals(false, sortedContact.get(0).FirstName.equals('TestContact 1'), 'Contacts not sorted by FirstName');
    }
} 
