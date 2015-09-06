var models = {};

models.ORIGIN = 'https://stub1-61.appspot.com';

models.Account = Backbone.Model.extend({
	urlRoot : models.ORIGIN + '/account',
	idAttribute : 'key',
});

models.Comment = Backbone.Model.extend({
	urlRoot : models.ORIGIN + '/comment',
	idAttribute : 'key',
	parse : function(json) {
		json.postDateStr = new Date(json.postDate).toLocaleString();
		return json;
	}
});

models.Comments = Backbone.Collection.extend({
	model : models.Comment,
	url : models.ORIGIN + '/comments',
});
