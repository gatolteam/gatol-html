var CreateGame = (function() {

    // PRIVATE VARIABLES
    var create_container; // holds create game container, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        create_container.on('click', '#add_csv_btn', function(e) {
            if (inDev) {
                location.href = devUrl + 'input_csv.html';
            } else {
                location.href = 'http://allenyu94.github.io/gatol-html/input_csv'; 
            }
        });

        create_container.on('click', '#delete_csv_btn', function(e) {
            qset = $('.csv_item.selected');
            try {
                qset_li = qset[0].closest('li');
            } catch (err) {
                alert("Please select a csv");
                return;
            }
            del_id = qset_li.id;

            token = getCookie('auth_token');


            var delSuccess = function(data) {
                console.log(data)

                bar = $('#' + del_id).next('div');
                $('#' + del_id).remove();
                bar.remove();
            };

            var delFailed = function(data) {
                consoleError(data);
                alert("You have games that rely on this CSV. You can not delete it.");
            };


            url = '/api/question_sets/';
            makeDeleteRequestWithAuthorization(url + del_id, token, delSuccess, delFailed)

        });

        create_container.on('click', '#create_finish', function(e) {
            var finish = {} // container to hold game data to be created
            qset = create_container.find('.csv_item.selected');
            template = create_container.find('.template_item.selected');
            try {
                template_li = template[0].closest('li');
            } catch (err) {
                alert("Please select a Game Template");
                return;
            }
            try {
                qset_li = qset[0].closest('li');
            } catch (err) {
                alert("Please select a CSV");
                return;
            }
            finish.question_set_id = qset_li.id;
            finish.game_template_id = template_li.id;
            finish.description = create_container.find('#create_game_description').val();
            finish.name = create_container.find('#create_game_title').val();
            console.log(finish);

            token = getCookie('auth_token');

            var onSuccess = function(data) {
                //alert('successfully created game');
                if (inDev) {
                    location.href = devUrl + 'dashboard.html';
                } else {
                    location.href = 'http://allenyu94.github.io/gatol-html/dashboard';
                }

            };

            var onFailure = function(data) {
                alertMsg = "";
                errors = JSON.parse(data.responseText).errors;

                for (var i = 0; i < errors.length; i++) {
                    alertMsg += errors[i];
                    if (i != errors.length-1) {
                        alertMsg += " and ";
                    }
                };

                consoleError(data);
            };

            url = '/api/games';
            makePostRequestWithAuthorization(url, finish, token, onSuccess, onFailure);

        });

        create_container.on('click', '#create_cancel', function(e) {
            if (inDev) {
                location.href = devUrl + 'dashboard.html';
            } else {
                location.href = 'http://allenyu94.github.io/gatol-html/dashboard';
            }
        });

        create_container.on('click', '.csv_item', function(e) {
            $('.csv_item').removeClass('selected');
            $(this).addClass('selected'); 
        });

        create_container.on('click', '.template_item', function(e) {
            $('.template_item').removeClass('selected');
            $(this).addClass('selected'); 
        });

    };

    // GET DATA FROM BACKEND

    var setQuestionSets = function(e) {

        var onSuccess = function(data) {
            qsets = data.question_sets;
            var ul = document.getElementById('csv_list');
            for (var i = 0; i < qsets.length; i++) {
                console.log(qsets[i]);
                var li = document.createElement('li');
                var a = document.createElement('a');
                var bar = document.createElement('div');

                a.setAttribute('href', '#' + qsets[i].setname);
                a.setAttribute('class', 'csv_item');
                a.innerHTML = qsets[i].setname;
                bar.setAttribute('class', 'fullbar');
                li.appendChild(a);
                li.setAttribute('id', qsets[i].id);
                ul.appendChild(li);
                ul.appendChild(bar);
            }
        };

        var onFailure = function(data) {
            consoleError(data);
        };

        makeGetRequestWithAuthorization('/api/question_sets', getCookie('auth_token'), onSuccess, onFailure);
    };

    var setGameTemplates = function(e) {

        var onSuccess = function(data) {
            templates = data.templates;
            console.log(templates);
            var ul = document.getElementById('template_list');
            for (var i = 0; i < templates.length; i++) {
                console.log(templates[i]);
                var li = document.createElement('li');
                var a = document.createElement('a');
                var bar = document.createElement('div');

                a.setAttribute('href', '#' + templates[i].name);
                a.setAttribute('class', 'template_item');
                a.innerHTML = templates[i].name;
                bar.setAttribute('class', 'fullbar');
                li.appendChild(a);
                li.setAttribute('id', templates[i].id);
                ul.appendChild(li);
                ul.appendChild(bar);
            }
        };

        var onFailure = function(data) {
            consoleError(data);
        };

        makeGetRequestWithAuthorization('/api/game_templates', getCookie('auth_token'), onSuccess, onFailure);
    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        checkIfLoggedIn();
        
        create_container = $("#create_game_container");

        setQuestionSets();
        setGameTemplates();

        attachCreateHandler();

    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via CreateGame.key_name, e.g. CreateGame.start()
    return {
        start: start
    };

})();
