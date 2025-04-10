DevExpress.localization.locale(navigator.language);

$(() => {
    let selectedRowIndex = -1;

    const grid = $('#gridContainer').dxDataGrid({
        // dataSource: {
        //     store: {
        //         type: 'odata',
        //         version: 2,
        //         url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
        //         key: 'Id',
        //         beforeSend(request) {
        //             const year = new Date().getFullYear() - 1;
        //             request.params.startDate = `${year}-05-10`;
        //             request.params.endDate = `${year}-5-15`;
        //         },
        //     },
        // },
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
                        .done(deferred.resolve)
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
            useIcons: true
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
                dataField: 'itemNumber',
                dataType: 'string',
            },
            {
                dataField: 'itemName',
                dataType: 'string',
            },
            {
                dataField: 'itemTypeId',
                dataType: 'number',
            },
            {
                dataField: 'roomNumber',
                dataType: 'number',
            }
        ],
    });
});

