<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title></title>
    <!--
    <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2017.1.118/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2017.1.118/styles/kendo.blueopal.min.css" />
    <script src="https://kendo.cdn.telerik.com/2017.1.118/js/jquery.min.js"></script>
    -->
<!--
    <link rel="stylesheet" href="//cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="//cdn.kendostatic.com/2013.1.319/styles/kendo.blueopal.min.css" />

	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://kendo.cdn.telerik.com/2017.1.118/js/kendo.all.min.js"></script>
-->
	<script>
		$(document).ready(function(){
			$.getJSON("./main.js?type=info",function(result) {
				$.each(result.cpu, function(key, field) {
					var name = "#" + key;
					$(name).prepend(field);
			    });
				$.each(result.mem, function(key, field) {
					var name = "#" + key;
					$(name).prepend(field);
			    });
			});
		});
	</script>
</head>

<body>

<h2>CPU Info</h2>

<div class="k-grid k-widget" id="grid" style="height: 100%; touch-action: none;" data-role="grid">
	<div class="k-grid-header" style="padding-right: 12px;">
		<div class="k-grid-header-wrap k-auto-scrollable">
			<table role="grid">
				<colgroup>
					<col style="width:100px"/>
					<col style="width:350px"/>
				</colgroup>

				<thead role="rowgroup">
					<tr role="row">
						<th class="k-header" role="columnheader" aria-haspopup="true" rowspan="1" scope="col">항목</th>
						<th class="k-header" role="columnheader" aria-haspopup="true" rowspan="1" scope="col">내용</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>

	<div class="k-grid-content k-auto-scrollable" style="height: 100%;">
		<table role="grid" style="height: auto;">
			<colgroup>
				<col style="width:100px"/>
				<col style="width:350px"/>
			</colgroup>

			<tbody role="rowgroup">
				<tr role="row">
					<td role="gridcell">CPU Model</td>
					<td role="gridcell" id="model"></td>
				</tr>
				<tr class="k-alt" role="row">
					<td role="gridcell">Frequency</td>
					<td role="gridcell" id="MHz"></td>
				</tr>
				<tr role="row">
					<td role="gridcell">cache size</td>
					<td role="gridcell" id="cache"></td>
				</tr>
				<tr class="k-alt" role="row">
					<td role="gridcell">stepping</td>
					<td role="gridcell" id="stepping"></td>
				</tr>
				<tr role="row">
					<td role="gridcell">VendorID</td>
					<td role="gridcell" id="vendor_id"></td>
				</tr>
				<tr class="k-alt" role="row">
					<td role="gridcell">bogomips</td>
					<td role="gridcell" id="bogomips"></td>
				</tr>

				<tr class="k-alt" role="row">
				</tr>

				<tr class="k-alt" role="row">
					<td role="gridcell">Memory-Total</td>
					<td role="gridcell" id="total"></td>
				</tr>
				<tr class="k-alt" role="row">
					<td role="gridcell">Memory-Free</td>
					<td role="gridcell" id="free"></td>
				</tr>
				<tr class="k-alt" role="row">
					<td role="gridcell">Memory-available</td>
					<td role="gridcell" id="available"></td>
				</tr>
				<tr class="k-alt" role="row">
					<td role="gridcell">Memory-Swap</td>
					<td role="gridcell" id="swap"></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
