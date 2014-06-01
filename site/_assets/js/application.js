var App = {};

App.User = Backbone.Model.extend({
	idAttribute: "_id",
});

App.Users = Backbone.Collection.extend({
	model: App.User,
	url: '/api/users'
});

App.UsersView = Backbone.View.extend({
	el:$("#users"),
	initialize: function() {
		this.user_form = _.template($('#user_form').html());
		//this.users_template = _.template($('#users_template').html());
		//this.user_template = _.template($('#user_template').html());
		this.render();
	},
	render: function() {
		console.log($(this.el));
		$(this.el).html(this.user_form({
			user_form: this.user_form,
			//users: this.collection.models,
			//user_template: this.user_template
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
		users.create({name: userName, password: userpass, city: usercity, email: useremail, loginName: usersidentity}, {
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
	    var taskForDeletion = users.get(id);
	    $(taskLi).remove();
	    tasks.remove(taskForDeletion);
	},
});

App.init = function() {
	new App.UsersView({collection: users});
}