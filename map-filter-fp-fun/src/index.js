var officers = [
  { id: 20, name: 'Captain Piett', age: 30 },
  { id: 24, name: 'General Veers', age: 40 },
  { id: 56, name: 'Admiral Ozzel', age: 50 },
  { id: 88, name: 'Commander Jerjerrod', age:25 }
];

const oldFilter = function(officer){
   return officer.age >= 40;
}

var oldOfficers = officers.filter(oldFilter);
console.log(oldOfficers);

var officersIds = officers.map(function (officer) {
  return officer.id
});
console.log(officersIds);

var totalYears = officers.reduce(function (accumulator, officer) {
  return accumulator + officer.age;
}, 0);
console.log(`total yers == ${totalYears}`);

