const expect = require('expect');

const {Rooms} = require('./room');

describe('Rooms',()=>{

    beforeEach('Rooms',() =>{
        rooms = new Rooms();

        rooms.rooms = [{
            name :'Room1'
        },{
            name :'Room2'
        },{
            name :'Room3'
        }];
    });
    
    it('should add a room',()=>{
        var rooms = new Rooms();

        var room = {
            name:'Room4'
        };

        rooms.addRoom(room.name);

        expect(rooms.rooms).toEqual([room]);
    });

    it('should remove a room',()=>{
        var roomName = 'Room1';
        var room = rooms.removeRoom(roomName);
      
        expect(room.name).toBe(roomName);
        expect(rooms.rooms.length).toBe(2);
    });

});