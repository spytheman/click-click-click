Teams = new Meteor.Collection("teams");

var teamNames = ["Left","Right"];
var goal = 49;

/////////////////////////////////////////////////////////////////////////
// Meteor Server
/////////////////////////////////////////////////////////////////////////

if (Meteor.isServer) {
  Meteor.methods({
    restartGame: function() {
      Teams.remove({});
      for (var i = 0; i < teamNames.length; i++) {
        Teams.insert({name: teamNames[i], score: 0, winner: false});
      }
    }
  });

  Meteor.startup(function () {
    Meteor.call("restartGame");
  });
}

/////////////////////////////////////////////////////////////////////////
// Meteor Client
/////////////////////////////////////////////////////////////////////////

if (Meteor.isClient) {

  var reset = function() {
    Meteor.call("restartGame");
  }

  var registerScore = function(team) {
    if (team.score < goal) {
      Teams.update(team._id, {$inc: {score: 1}});
    } else {
      Teams.update(team._id, {$inc: {score: 1}});
      Teams.update(team._id, {$set: {winner: true}});
      Meteor.setTimeout(reset, 5000);
    }
  }


  Template.scoreboard.teams = function () {
    return Teams.find({});
  };

  Template.scoreboard.selected_name = function () {
    var team = Teams.findOne(Session.get("selected_team"));
    return team && team.name;
  };

  Template.scoreboard.events({
    'click section.inc': function () {
      Session.set("selected_team", this._id);
      var winner = Teams.findOne({winner: true});
      if (!winner) registerScore(this);
    }
  });

  Template.team.selected = function () {
    return Session.equals("selected_team", this._id) ? "selected" : '';
  };

  Template.team.events({
    'click': function () {
      Session.set("selected_team", this._id);
    }
  });
}
