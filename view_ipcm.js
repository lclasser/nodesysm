<!DOCTYPE html>
<html>
<head>
    <title></title>

<!--
    <link rel="stylesheet" href="//cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="//cdn.kendostatic.com/2013.1.319/styles/kendo.blueopal.min.css" />

    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://kendo.cdn.telerik.com/2017.1.118/js/kendo.all.min.js"></script>
-->
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
						url: "http://127.0.0.1:8082/?type=ipcm",
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
	                	field: "key",
	                    title: "SHM KEY",
	                    width: 70,
	                }, {
	                    field: "shmid",
	                    title: "SHM ID",
	                    width: 70,
	                }, {
	                	field: "perms",
	                    title: "Permission",
	                    width: 40,
	                }, {
	                    field: "size",
	                    title: "Size",
	                    width: 70,
	                }, {
	                    field: "nattach",
	                    title: "NAttach",
	                    width: 30,
	                }, {
	                    field: "muid",
	                    title: "Owner",
	                    width: 70,
	                }, {
	                    field: "atime",
	                    title: "Access Time",
	                    width: 120,
	                }, {
	                    field: "dtime",
	                    title: "dTime",
	                    width: 120,
	                }, {
	                    field: "ctime",
	                    title: "Created Time",
	                    width: 120,
	                }
				]
            });
        });
    </script>
</div>

</body>
</html>
