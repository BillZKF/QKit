//Replace this file with Iterative Portion Fitting or better agent gen method.
self.importScripts("../bower_components/chance/chance.js","../dist/utils.js","../dist/behaviorTree.js","libs/jstat.min.js");
//
var popGenConditions = {
  "existsAge": {
    key: "age",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsSex": {
    key: "sex",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsIncomeGroup": {
    key: "incomeGroup",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsMass": {
    key: "mass",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsLocation": {
    key: "location",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsExposed": {
    key: "exposed",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsInfectious": {
    key: "infectious",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "existsSucceptible": {
    key: "succeptible",
    value: false,
    check: QEpiKit.Utils.hasProp
  },
  "isUnder3": {
    key: "age",
    value: 3,
    check: QEpiKit.Utils.lt
  },
  "isUnder19": {
    key: "age",
    value: 19,
    check: QEpiKit.Utils.lt
  },
  "isUnder65": {
    key: "age",
    value: 65,
    check: QEpiKit.Utils.lt
  },
  "isOver19": {
    key: "age",
    value: 19,
    check: QEpiKit.Utils.gtEq
  }
};


//actions
var popGenActions = {
"setAge": function(person) {
  person.age = chance1.integer({
    min: 1,
    max: 85
  });
},
"setSex": function(person) {
  person.sex = chance1.pick(["male", "female"]);
},
"setIncomeGroup": function(person) {
  //low to high
  person.incomeGroup = chance1({
    min: 1,
    max: 5
  });
},
"setMass": function(person) {
  var percentile = chance1.floating({
    min: 0,
    max: 1
  });
  person.mass = person.sex === "female" ? jStat.normal.inv(percentile, 60, 5) : jStat.normal.inv(percentile, 75, 8);
},
"setOrigin": function(person){
  person.origin = "Nepal";
}
};
//Generate agents for SPHERE demo
var SetHeight = new QEpiKit.BTAction("set-mass", conditions.existsMass, actions.setMass);
var SetMass = new QEpiKit.BTAction("set-mass", conditions.existsMass, actions.setMass);
var SetSex = new QEpiKit.BTAction("set-sex", conditions.existsSex, actions.setSex);
var SetAge = new QEpiKit.BTAction("set-age", conditions.existsAge, actions.setAge);
var SetOrigin = new QEpiKit.BTAction("set-location", conditions.existsLocation, actions.setOrigin);
var SequenceDemographic = new QEpiKit.BTSequence("sequence-demographic", [SetOrigin, SetAge, SetSex, SetPhysical]);
var Root = new QEpiKit.BTRoot("start-pop-gen", [SequenceDemographic]);

function empty(number) {
  var emptyData = [];
  for (var i = 0; i < number; i++) {
    emptyData[i] = {
      id: i,
      alive: true
    };
  }
  return emptyData;
}

var campAgents = empty(960);
var PopGenTree = new QEpiKit.BehaviorTree("pop-gen-tree", Root, campAgents);
PopGenTree.update();

postMessage(campAgents);
self.close();
