/** * Project janux-vuejs-seed * Created by hielo on 2018-04-24 */

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid
			.row
				.col-lg-12
					.title-bar
						.title {{ $t('staff.staff') }}
						.options
							router-link(:to="{name:'staffCreate'}")
								span.fa.fa-user-plus.fa-lg
								//- | &nbsp; {{ $t('label.add') }}
					hr

					#grid-wrapper(style="width: 100%; height: 70vh;")
						//- Desktop ag grid
						ag-grid-vue(
							v-if="!isShortWidth"
							style="width: 100%; height: 100%;"
							class="ag-theme-alpine"
							id="myGrid"
							:gridOptions='gridOptions',
							pagination='true',
							paginationPageSize='15',
							:defaultColDef='defaultColDef'
							:columnDefs="columnDefs",
							:rowData="staffList",
							@first-data-rendered="onFirstDataRendered",
							@grid-size-changed="onGridSizeChanged"
						)
						//- !Desktop ag grid
						ag-grid-vue(
							v-if="isShortWidth"
							style="width: 100%; height: 100%;"
							class="ag-theme-alpine"
							id="myGrid"
							:gridOptions='gridOptions',
							pagination='true',
							paginationPageSize='15',
							:defaultColDef='defaultColDefResponsive'
							:columnDefs="columnDefs_is_ShortWidth",
							:getRowHeight="getRowHeight"
							:animateRows="true",
							@grid-ready="onGridReady"
							:rowData="staffList"
						)
	v-jnx-footer

</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'
import { AgGridVue } from 'ag-grid-vue'
import rowDelete from './ag-grid/row-delete'
import rowName from './ag-grid/row-name'
import rowPhone from './ag-grid/row-phone'
import rowEmail from './ag-grid/row-email'
import rowEdit from './ag-grid/row-edit'

export default {
	name: 'staff-list',
	components: {
		AgGridVue,
		rowName,
		rowPhone,
		rowEmail,
		rowEdit,
		rowDelete
	},
	data () {
		return {
			isShortWidth: false,
			sectionTitle: this.$t('staff.title'),
			gridOptions: null,
			gridApi: null,
			columnApi: null,
			staffList: [],
			defaultColDef: {
				resizable: true,
				sortable: true,
				filter: false
			},
			defaultColDefResponsive: {
				width: 150,
				sortable: true,
				resizable: true,
				filter: true
			},
			columnDefs: { field: 'name', sortable: true }
		}
	},
	mounted () {
		this.gridApi = this.gridOptions.api
		this.gridColumnApi = this.gridOptions.columnApi
		this.getBrowserWidth()
	},
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.partyService.findPeople().then(response => {
			next(vm => {
				vm.staffList = response
				console.log('staffList', vm.staffList)
			})
		})
	},
	methods: {
		openDelete () {
			console.log('Deleting staff')
		},
		onFirstDataRendered (params) {
			params.api.sizeColumnsToFit()
		},
		onGridSizeChanged (params) {
			let gridWidth = document.getElementById('grid-wrapper').offsetWidth
			let columnsToShow = []
			let columnsToHide = []
			let totalColsWidth = 0
			let allColumns = params.columnApi.getAllColumns()
			for (let i = 0; i < allColumns.length; i++) {
				let column = allColumns[i]
				totalColsWidth += column.getMinWidth()
				if (totalColsWidth > gridWidth) {
					columnsToHide.push(column.colId)
				} else {
					columnsToShow.push(column.colId)
				}
			}
			params.columnApi.setColumnsVisible(columnsToShow, true)
			params.columnApi.setColumnsVisible(columnsToHide, false)
			params.api.sizeColumnsToFit()
		},
		getBrowserWidth () {
			let width = window.innerWidth
			if (width <= 360) {
				this.isShortWidth = true
			} else {
				this.isShortWidth = false
			}
			console.log(`The width is ${window.innerWidth} px`)
		},

		onGridReady (params) {
			const updateData = (data) => {
				var differentHeights = [40, 80, 120, 200]
				data.forEach(function (dataItem, index) {
					dataItem.rowHeight = differentHeights[index % 4]
				})
				this.staffList = data
			}

			Vue.jnx.partyService.findPeople().then(response => {
				this.staffList = response
				updateData(this.staffList)
				console.log('response', response)
			})
		},
		getRowHeight (params) {
			// return params.data.rowHeight;
			return 200
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	}),
	beforeMount () {
		this.gridOptions = {}
		this.columnDefs = [
			{
				headerName: 'Name´s',
				field: 'name',
				cellRendererFramework: rowName,
				minWidth: 50,
				maxWidth: 450
			},
			{
				headerName: 'Phone Number',
				field: 'phone',
				cellRendererFramework: rowPhone,
				minWidth: 50,
				maxWidth: 450
			},
			{
				headerName: 'Email',
				field: 'email',
				cellRendererFramework: rowEmail,
				minWidth: 50,
				maxWidth: 450
			},
			{
				headerName: 'Edit',
				field: 'edit',
				cellRendererFramework: rowEdit,
				minWidth: 50,
				maxWidth: 200
			},
			{
				headerName: 'Delete',
				field: 'delete',
				cellRendererFramework: rowDelete,
				minWidth: 50,
				maxWidth: 100
			}
		]
		this.columnDefs_is_ShortWidth = []
	}
}
</script>
