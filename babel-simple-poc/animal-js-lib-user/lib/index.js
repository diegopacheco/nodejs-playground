"use strict";

var requireLocal = require('app-root-path').require; // Error: Cannot find module 
// const AnimalsTSLib = requireLocal('../animal-lib-ts/src');
// Need to import the JS generated not the TS code


var AnimalsTSLib = requireLocal('../animal-lib-ts/lib');
console.log("JS Lib Calling TS lib FISH == " + AnimalsTSLib.Animals.Fish);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlTG9jYWwiLCJyZXF1aXJlIiwiQW5pbWFsc1RTTGliIiwiY29uc29sZSIsImxvZyIsIkFuaW1hbHMiLCJGaXNoIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFlBQVksR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QkEsT0FBOUMsQyxDQUVBO0FBQ0E7QUFFQTs7O0FBQ0EsSUFBTUMsWUFBWSxHQUFHRixZQUFZLENBQUMsc0JBQUQsQ0FBakM7QUFFQUcsT0FBTyxDQUFDQyxHQUFSLENBQVksbUNBQW1DRixZQUFZLENBQUNHLE9BQWIsQ0FBcUJDLElBQXBFIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVxdWlyZUxvY2FsID0gcmVxdWlyZSgnYXBwLXJvb3QtcGF0aCcpLnJlcXVpcmVcblxuLy8gRXJyb3I6IENhbm5vdCBmaW5kIG1vZHVsZSBcbi8vIGNvbnN0IEFuaW1hbHNUU0xpYiA9IHJlcXVpcmVMb2NhbCgnLi4vYW5pbWFsLWxpYi10cy9zcmMnKTtcblxuLy8gTmVlZCB0byBpbXBvcnQgdGhlIEpTIGdlbmVyYXRlZCBub3QgdGhlIFRTIGNvZGVcbmNvbnN0IEFuaW1hbHNUU0xpYiA9IHJlcXVpcmVMb2NhbCgnLi4vYW5pbWFsLWxpYi10cy9saWInKTtcblxuY29uc29sZS5sb2coXCJKUyBMaWIgQ2FsbGluZyBUUyBsaWIgRklTSCA9PSBcIiArIEFuaW1hbHNUU0xpYi5BbmltYWxzLkZpc2gpOyJdfQ==