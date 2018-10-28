const expect = require('expect');

const {Users} = require('./user');

describe('Users',()=>
{
    var users;

    beforeEach('Users',() =>{
        users = new Users();

        users.users=[{
            id:'1',
            name : 'nathan1',
            room : 'A'
        },{
            id:'2',
            name : 'nathan2',
            room : 'A'
        },{
            id:'3',
            name : 'nathan3',
            room : 'B'
        },{
            id:'4',
            name : 'nathan4',
            room : 'B'
        }];
    });
    
    it('should add new user',() => {
        var users = new Users();
        
        var user = {
            id :'123',
            name : 'nathan',
            room : 'joe'
        };

        var resUser = users.addUser(user.id,user.name,user.room);

        expect(users.users).toEqual([user]);
     
    });

    it('should return names for room A',()=>{
        var userList = users.getUserList('A');

        expect(userList).toEqual(['nathan1','nathan2']);
    });

    it('should return names for room B',()=>{
        var userList = users.getUserList('B');

        expect(userList).toEqual(['nathan3','nathan4']);
    });

    it('should remove a user',()=>{
        var userId = '1';
        var user = users.removeUser(userId);
      
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(3);
    });

    it('should not remove a user',()=>{
        var userId = '5';
        var user = users.removeUser(userId);
      
        expect(user).not.toBeDefined();
        expect(users.users.length).toBe(4);
    });

    it('should find a user',()=>{
        var userId = '1';
        var user = users.getUser(userId);

        expect(user).toBeTruthy();
        expect(user.id).toBe(userId);
    });

    it('should not find a user',()=>{
        var userId = '5';
        var user = users.getUser(userId);
    
        expect(user).not.toBeDefined();
       
    });
});