$(() => {
    $('#gridContainer').dxDataGrid({
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
        dataSource: new DevExpress.data.CustomStore({
            key: "date",
            loadMode: "raw", // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
            load: function() {
                return $.getJSON("/WeatherForecast")
                    .fail(function() { throw "Data loading error" });
            }
        }),
        paging: {
            pageSize: 10,
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 25, 50, 100],
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
                dataField: 'date',
                dataType: 'date',
            },
            {
                dataField: 'temperatureC',
                dataType: 'number',
                alignment: 'right',
            },
            {
                dataField: 'temperatureF',
                dataType: 'number',
                alignment: 'right',
            },
            {
                dataField: 'summary',
                dataType: 'string',
            }
        ],
        onContentReady(e) {
            if (!collapsed) {
                collapsed = true;
                e.component.expandRow(['EnviroCare']);
            }
        },
    });
});

const discountCellTemplate = function (container, options) {
    $('<div/>').dxBullet({
        onIncidentOccurred: null,
        size: {
            width: 150,
            height: 35,
        },
        margin: {
            top: 5,
            bottom: 0,
            left: 5,
        },
        showTarget: false,
        showZeroLevel: true,
        value: options.value * 100,
        startScaleValue: 0,
        endScaleValue: 100,
        tooltip: {
            enabled: true,
            font: {
                size: 18,
            },
            paddingTopBottom: 2,
            customizeTooltip() {
                return { text: options.text };
            },
            zIndex: 5,
        },
    }).appendTo(container);
};

let collapsed = false;
