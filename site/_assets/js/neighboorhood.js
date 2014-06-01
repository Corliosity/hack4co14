var App = {};

App.Hood = Backbone.Model.extend({
	idAttribute: "_id",
});

App.Hoods = Backbone.Collection.extend({
	model: App.Hood,
	url: '/api/neighbors'
});

App.HoodsView = Backbone.View.extend({
	el:$("#neighboors"),
	initialize: function() {
		this.hood_form = _.template($('#hood_form').html());
		this.render();
	},
	render: function() {
		console.log($(this.el));
		$(this.el).html(this.hood_form({
			hood_form: this.hood_form
		}));
	},
	events: {
		'submit form' : 'createUser',
		'click button' : 'deleteTask'
	},
	createUser: function(event) {
		event.preventDefault();
		var userNameInput = $('.user-name');
		var userName = userNameInput.val();
		var userpass = $('.user-password').val();
		var usercity = $('.user-city').val();
		var useremail = $('.user-email').val();
		var usersidentity = $('.user-userName').val();
		hoods.create({name: userName, description: userpass, city: usercity, email: useremail, factors: usersidentity}, {
			success: function(user) {
				$('#users ul').prepend("<li data-id=" + user.id + ">" + usersidentity + "<button>Done!</button></li>");
				userNameInput.val('');
				$('.user-password').val('');
				$('.user-city').val('');
				$('.user-email').val('');
				$('.user-userName').val('');
			}
		});
		
	},
	deleteTask: function (event) {
	    var taskLi = this.$(event.currentTarget).parent();
	    var id = taskLi.data('id');
	    var taskForDeletion = hoods.get(id);
	    $(taskLi).remove();
	    tasks.remove(taskForDeletion);
	},
});


App.init = function() {
	new App.HoodsView({collection: hoods});
}