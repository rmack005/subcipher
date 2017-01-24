requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-3.1.1.min',
        tether: 'tether.min',
        bootstrap: 'bootstrap.min',
        knockout: 'knockout-3.4.1',
        markdown: 'markdown-0.6.0-beta1.min'
    },
    shim: {
        bootstrap: {
            deps: ['tether', 'jquery']
        },
        markdown: {
            exports: 'markdown'
        }
    }
});

//  Bootstrap 4 requires that Tether be defined on the global object.  
//  Lame hack to resolve this.
requirejs(['tether'], function(Tether) {
    "use strict";

    window.Tether = Tether;
});

requirejs(['jquery', 'bootstrap', 'knockout', 'viewModel'],
function($, bootstrap, ko, viewModel) {
    "use strict";

    $( document ).ready(function() {
       var model = new viewModel();
        ko.applyBindings(model);
    });
});