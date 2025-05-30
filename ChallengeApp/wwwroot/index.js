﻿DevExpress.localization.locale(navigator.language);

$(() => {

    var lookupItemTypesDataSource = {
        store: new DevExpress.data.CustomStore({
            key: "itemTypeId",
            loadMode: "raw",
            load: function() {
                return $.getJSON("/api/ItemTypes");
            },
            insert: function(values) {
                var deferred = $.Deferred();
                $.ajax({
                    url: "/api/ItemTypes",
                    method: "POST",
                    data: JSON.stringify(values),
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(deferred.resolve)
                .fail(function(e){
                    deferred.reject("Insertion failed");
                });
                return deferred.promise();
            }
        }),
        sort: "itemTypeId"
    }

    const sendUnicValidationCheckRequest = function (id) {
        const d = $.Deferred();
        $.getJSON(`/api/Items/valid/${id}`, (result) => {
            if (result) { d.resolve(); }
            else { if (popupMode === 'creating') { d.reject(); }
                   else { d.resolve(); }
            }
        });
        return d.promise();
    };

    let popupMode = 'creating'; // 'creating', 'editing'

    const grid = $('#gridContainer').dxDataGrid({
        dataSource: store = new DevExpress.data.CustomStore({
            key: "itemNumber",
            loadMode: "raw", // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
            load: function() {
                return $.getJSON("/api/Items")
                    .fail(function() { throw "Data loading error" });
            },
            insert: function(values) {
                var deferred = $.Deferred();
                $.ajax({
                    url: "/api/Items",
                    method: "POST",
                    data: JSON.stringify(values),
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(deferred.resolve)
                .fail(function(e){
                    deferred.reject("Insertion failed");
                });
                return deferred.promise();
            },
            remove: function(key) {
                var deferred = $.Deferred();
                $.ajax({
                    url: "/api/Items/" + encodeURIComponent(key),
                    method: "DELETE",
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(deferred.resolve)
                .fail(function(e){
                    deferred.reject("Deletion failed");
                })
                return deferred.promise();
            },
            update: function(key, values) {
                var deferred = $.Deferred();
                store.byKey(key).done(
                    (item) => {
                        item = {...item, ...values};
                        console.log(`item.itemName=${item.itemName}`);
                        $.ajax({
                            url: "/api/Items/" + encodeURIComponent(item.itemNumber),
                            method: "PUT",
                            data: JSON.stringify(item),
                            dataType: 'json',
                            contentType: 'application/json',
                        })
                        .done((result) => { deferred.resolve(); })
                        .fail(function(e){
                            deferred.reject("Update failed");
                        })
                        return deferred.promise();
                    });          
            }
        }),
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true,
            useIcons: true,
            form: {
                onInitialized(e) {
                    //e.component.itemOption("itemNumber", "disabled", popupMode === 'editing' ? true : false);
                    e.component.itemOption("itemNumber", "visible", popupMode === 'editing' ? false : true);
                }
            }
        },
        selection: { mode: "single" },
        paging: {
            pageSize: 10,
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 25, 50, 100],
        },
        onRowDblClick(e) {
            e.component.editRow(e.rowIndex);
        },
        onInitNewRow(e) {
            popupMode = 'creating';
        },
        onEditingStart(e) {
            popupMode = 'editing';
        },
        remoteOperations: false,
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true,
        },
        groupPanel: { visible: true },
        grouping: {
            autoExpandAll: false,
        },
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        showBorders: true,
        width: '100%',
        columns: [
            {
                caption: 'Учетный номер',
                dataField: 'itemNumber',
                dataType: 'string',
                validationRules: [
                    { type: "required" },
                    {
                        type: 'stringLength',
                        max: 32,
                        message: 'Идентификатор не может быть больше 32 символа',
                    },
                    {
                        type: "pattern",
                        pattern: /^[A-Za-z0-9]+$/,
                        message: "Учетный номер должен состоять из цифр и латинских букв",
                    },                        
                    {
                        type: 'async',
                        message: 'Идентификатор должен быть уникальным',
                        validationCallback(params) {
                            return sendUnicValidationCheckRequest(params.value);
                        }
                    }
                ],
            },
            {
                caption: 'Наименование',
                dataField: 'itemName',
                dataType: 'string',
                validationRules: [
                    { type: "required" },
                    {
                        type: 'stringLength',
                        max: 256,
                        message: 'Наименование не может быть больше 256 символа',
                    }]
            },
            {
                caption: "Тип техники",
                dataField: 'itemTypeId',
                dataType: 'number',
                lookup: {
                    dataSource: lookupItemTypesDataSource,
                    valueExpr: "itemTypeId",
                    displayExpr: "itemTypeName"
                },
                validationRules: [{ type: "required" }]
            },
            {
                caption: 'Комната размещения',
                dataField: 'roomNumber',
                dataType: 'number',
                validationRules: [
                    { type: "required" },
                    {
                        type: 'range',
                        min: 1,
                        max: 1000,
                        message: 'Номер помещения должен быть в промежутке между 1 и 1000',
                    }]
            }
        ],
        onContextMenuPreparing: function (e) {
            if (e.row.rowType === "data") {
                e.items = [{
                    text: "Редактировать",
                    onItemClick: function () {
                        e.component.editRow(e.row.rowIndex);
                    }
                },
                {
                    text: "Добавить",
                    onItemClick: function () {
                        e.component.addRow();
                    }
                },
                {
                    text: "Удалить",
                    onItemClick: function () {
                        e.component.deleteRow(e.row.rowIndex);
                    }
                }];
            }
        }
    });
});

