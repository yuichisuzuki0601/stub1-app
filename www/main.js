var main = {};

main.mainRouter = null;

main.MainRouter = Backbone.Router.extend({
	routes : {
		'' : 'newComment',
		'edit-comment/:key' : 'editComment',
	},
	initialize : function() {
		this.collection = new models.Comments();
		this.postView = new main.PostView({
			el : $('#post-view'),
			collection : this.collection,
		});
		this.commentsView = new main.CommentsView({
			el : $('#comments-view'),
			collection : this.collection,
		});
	},
	newComment : function() {
		this.postView.model = new models.Comment(null, {
			collection : this.collection,
		});
		this.postView.btnCaption = 'post comment';
		this.postView.render();
	},
	editComment : function(key) {
		this.postView.model = this.collection.get(key);
		if (this.postView.model) {
			this.postView.btnCaption = 'edit comment';
			this.postView.render();
		} else {
			main.mainRouter.navigate('', {
				trigger : true,
			});
		}
	}
});

main.PostView = Backbone.View.extend({
	events : {
		'click #btn-post-comment' : 'postComment',
	},
	initialize : function() {
		this.$text = $('#text');
	},
	render : function() {
		this.$text.val(this.model.get('text'));
		$('#btn-post-comment').text(this.btnCaption);
	},
	postComment : function() {
		this.model.save({
			'text' : this.$text.val(),
		}).done(_.bind(function() {
			this.collection.add(this.model, {
				merge : true,
			});
			Backbone.history.fragment = '_';
			main.mainRouter.navigate('', {
				trigger : true,
			});
		}, this));
	},
});

main.CommentsView = Backbone.View.extend({
	initialize : function(options) {
		this.me = options.me;
		this.listenTo(this.collection, 'add', this.addCommentView);
		this.collection.fetch({
			silent : true,
		}).done(_.bind(function() {
			this.render();
		}, this));
	},
	render : function() {
		this.collection.each(function(comment) {
			this.addCommentView(comment);
		}, this);
		return this;
	},
	addCommentView : function(comment) {
		this.$el.prepend(new main.CommentView({
			model : comment,
		}).render().el);
	},
});

main.CommentView = Backbone.View.extend({
	tmpl : _.template($('#tmpl-comment-view').html()),
	events : {
		'click .btn-edit-comment' : 'editComment',
		'click .btn-delete-comment' : 'deleteComment',
	},
	initialize : function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.onDestroy);
	},
	render : function() {
		this.$el.html(this.tmpl(this.model.toJSON()));
		return this;
	},
	editComment : function() {
		main.mainRouter.navigate('edit-comment/' + this.model.id, {
			trigger : true,
		});
	},
	deleteComment : function() {
		this.model.destroy();
	},
	onDestroy : function() {
		this.remove();
	},
});

main.init = function(me) {
	main.mainRouter = new main.MainRouter();
	Backbone.history.start();
};

$(document).ready(function() {
	main.init();
});