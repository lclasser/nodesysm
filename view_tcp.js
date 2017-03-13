<!DOCTYPE html>
<html>
<head>
    <base href="http://demos.telerik.com/kendo-ui/grid/index">
    <style>html { font-size: 14px; font-family: Arial, Helvetica, sans-serif; }</style>
    <title></title>
    <link rel="stylesheet" href="https://kendo.cdn.telerik.com/2017.1.118/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="https://kendo.cdn.telerik.com/2017.1.118/styles/kendo.blueopal.min.css" />

    <script src="https://kendo.cdn.telerik.com/2017.1.118/js/jquery.min.js"></script>
    <script src="https://kendo.cdn.telerik.com/2017.1.118/js/kendo.all.min.js"></script>
</head>
<body>

<h2>TCP Info (netstat)</h2>

<div id="example">
    <div id="grid"></div>
    <script>
        $(document).ready(function () {
			var data_tcp = new kendo.data.DataSource({
				transport: {
					read: {
						url: "http://192.168.73.11:8081/?type=tcp",
						dataType: "json"
					},
				}
			});

            $("#grid").kendoGrid({
                dataSource: data_tcp,
                height: 450,
                groupable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [
                	{
	                	field: "lip",
	                    title: "Local IP",
	                    width: 70,
	                }, {
	                    field: "lport",
	                    title: "Port",
	                    width: 40,
	                }, {
	                	field: "rip",
	                    title: "Remote IP",
	                    width: 70,
	                }, {
	                    field: "rport",
	                    title: "Port",
	                    width: 40,
	                }, {
	                    field: "st",
	                    title: "Status",
	                    width: 60,
	                }, {
	                    field: "tx_queue",
	                    title: "tx",
	                    width: 120,
	                }, {
	                    field: "rx_queue",
	                    title: "rx",
	                    width: 120,
	                }
				]
            });
        });
    </script>
</div>

</body>
</html>
