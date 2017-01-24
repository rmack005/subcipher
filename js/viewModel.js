define(["knockout", "lodash", "markdown"], function(ko, _, markdown) {
	"use strict";

	var letters = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

	var randomSubstitutionList = function() {
		var shuffled = _.shuffle(letters);

		return _.map(_.zip(letters, shuffled), function(item) {
			return new SubstitutionItem(item[0], item[1]);
		});
	}

	var parseSubstitutionList = function(list) {
		return _.chain(list.toUpperCase().split(','))
			.map(function(item) {
				return item.split('=');
			})
			.fromPairs()
			.value();
	};

	var performSubstitution = function(text, substitutionList) {
		return _.chain(text.toUpperCase().split(''))
			.map(function(c) {
				return _.has(substitutionList, c) ? substitutionList[c] : c;
			})
			.value()
			.join("");
	};

	var SubstitutionItem = function(from, to, parent) {
		this.from = ko.observable(from);
		this.to = ko.observable(to);
		this.parent = parent;
	};

	var SubstitutionList = function() {
		var self = this;
		this.list = ko.observableArray(randomSubstitutionList());

		this.availableFrom = ko.pureComputed(function() {
			var usedItems = _.map(this.list(), function(item) {
				return item.from();
			});

			return _.difference(letters, usedItems);
		}, this);

		this.availableTo = ko.pureComputed(function() {
			var usedItems = _.map(this.list(), function(item) {
				return item.to();
			});

			return _.difference(letters, usedItems);
		}, this);

		this.substitutionObject = ko.pureComputed(function() {
			return _.chain(this.list())
				.map(function(item) {
					return [item.from(), item.to()];
				})
				.fromPairs()
				.value();
	   }, this);

		this.add = function() {
			if((self.availableFrom().length <= 0) || (self.availableTo().length <= 0)) return;

			var from = self.availableFrom()[0];
			var to = self.availableTo()[0];

			self.list.push(new SubstitutionItem(from, to));
		};

	   this.remove = function(item) {
			self.list.remove(item);
	   };

		this.updateFrom = function(item, from) {
			item.from(from);
		};

		this.updateTo = function(item, to) {
			item.to(to);
		};

		this.reseed = function() {
			var newItems = _.shuffle(letters);
			
			for(var i=0; i < self.list().length; i++) {
				self.updateTo(self.list()[i], newItems[i]);
			}
		};
	};

	var ViewModel = function() {
		this.plainText = ko.observable("");
		this.substitutionList = new SubstitutionList();

		this.cipherText = ko.pureComputed(function() {
			return markdown.toHTML(performSubstitution(this.plainText(), this.substitutionList.substitutionObject()));
	   }, this);
	};

	return ViewModel;
});