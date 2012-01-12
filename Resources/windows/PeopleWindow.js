
(function () {

    feri.ui.createPeopleWindow = function () {
        var PeopleWindow = Titanium.UI.createWindow({
            id: 'peopleWindow',
            title: 'Zaposleni',
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });

        // Create the table view
        var tableview = Titanium.UI.createTableView({
            backgroundColor: '#fff'
        });

        PeopleWindow.doRefresh = function () {
            var nameList = getNameList();
            var sortedNames = nameList.sort(function (a, b) {
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                return 0;
            });

            var headerLetter = '';
            var index = [];
            var presenterRow = [];
            var data = [];
            for (var i in sortedNames) {
                var user = sortedNames[i].split(':');
                var uid = parseInt(user[1]) + 0;
                var fullName = user[0] + '';

                var shortName = user[2] + '';
                var name = shortName;
                if (fullName.charAt(fullName.length - 2) == ',') {
                    fullName = fullName.slice(0, fullName.length - 2);
                } else {
                    name = fullName;
                }

                presenterRow = Ti.UI.createTableViewRow({
                    hasChild: feri.isAndroid(),
                    className: 'people_row',
                    selectedColor: '#999',
                    backgroundColor: '#fff',
                    color: '#000',
                    name: name,
                    uid: uid,
                    height: 40,
                    layout: 'auto'
                });
                presenterRow[feri.ui.backgroundSelectedProperty + 'Color'] = feri.ui.backgroundSelectedColor;

                if (fullName == shortName) {
                    fullName = '';
                } else {
                    fullName = feri.cleanSpecialChars(fullName);
                    var firstLastName = fullName.split(', ');
                    fullName = firstLastName[1] + ' ' + firstLastName[0];
                    shortName = "(" + shortName + ")";
                    var lastName = firstLastName[0];
                    var firstName = firstLastName[1];
                }

                if (feri.isAndroid()) {
                    presenterRow.add(Ti.UI.createLabel({
                        text: fullName,
                        fontFamily: 'sans-serif',
                        font: {
                            fontWeight: 'bold'
                        },
                        left: (fullName != '') ? 9 : 0,
                        height: 40,
                        color: '#000',
                        touchEnabled: false
                    }));
                } else {
                    if (fullName != '') {
                        var nameView = Ti.UI.createView({
                            height: 40,
                            layout: 'horizontal'
                        });

                        var firstNameLabel = Ti.UI.createLabel({
                            text: firstName,
                            font: 'Helvetica',
                            left: 10,
                            height: 40,
                            width: 'auto',
                            color: '#000',
                            touchEnabled: false
                        });
                        nameView.add(firstNameLabel);

                        var lastNameLabel = Ti.UI.createLabel({
                            text: lastName,
                            font: 'Helvetica-Bold',
                            left: 5,
                            height: 40,
                            width: 'auto',
                            color: '#000',
                            touchEnabled: false
                        });
                        nameView.add(lastNameLabel);
                        presenterRow.add(nameView);
                    }
                }

                // If there is a new last name first letter, insert a header in the table.
                // We also push a new index so we can create a right side index for iphone.
                if (headerLetter == '' || name.charAt(0).toUpperCase() != headerLetter) {
                    headerLetter = name.charAt(0).toUpperCase();
                    data.push(feri.ui.createHeaderRow(headerLetter));
                    index.push({
                        title: headerLetter,
                        index: i
                    });
                }

                data.push(presenterRow);
            }

            tableview.setData(data);
            tableview.index = index;
        };

        PeopleWindow.doRefresh();
        Ti.App.addEventListener('app:update_people', function () {
            PeopleWindow.doRefresh();
        });

        // create table view event listener
        tableview.addEventListener('click', function (e) {
            if (!e.rowData.uid) {
                return;
            }
            // event data
            var index = e.index;
            
            feri.navGroup.open(feri.ui.createPeopleDetailWindow({
                title: e.rowData.name,
                uid: e.rowData.uid,
                name: e.rowData.name
            }), {
                animated: true
            });
        });

        // add table view to the window
        PeopleWindow.add(tableview);

        return PeopleWindow;
    };


    function getNameList() {
        var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT uid, name, full_name FROM user");
        var nameList = [];
        
        if (rows) {
            while (rows.isValidRow()) {
                var uid = rows.fieldByName('uid');
                var full = rows.fieldByName('full_name');
                if (full) {
                    var names = rows.fieldByName('full_name').split(' ');
                    var lastName = names[names.length - 1];
                    var firstName = full.substr(0, full.length - (lastName.length + 1));
                    nameList.push(lastName + ', ' + firstName + ':' + rows.fieldByName('uid') + ':' + rows.fieldByName('name'));
                } else {
                    nameList.push(rows.fieldByName('name') + ':' + rows.fieldByName('uid') + ':' + rows.fieldByName('name'));
                }
                rows.next();
            }
            rows.close();
        }

        return nameList;
    }

})();