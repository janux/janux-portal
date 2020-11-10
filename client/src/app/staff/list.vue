/** * Project janux-vuejs-seed * Created by hielo on 2018-04-24 */

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid
			.row
				.col-lg-12
					.title-bar.control-adjust
						.fieldset-flex.filter-adjust
							label.filter-period-label(for='period') Show staff created or updated in:
							md-field.filter-period-select
								md-select(aria-label='type' v-model='periodFilterKey', @input="periodChange")
									md-option(:value='field.key', v-for='(field, index) in periodFilter', :key='index') {{ $t(field.label) }}
						.options.add-btn
							.fieldset-flex(style="justify-content: flex-end;")
								router-link(:to="{name:'staffCreate'}")
									span Add Staff &nbsp;
									span.fa.fa-user-plus.fa-lg

					#grid-wrapper(style="width: 100%; height: 70vh;")
						//- No Desktop ag grid
						ag-grid-vue(
							v-if="isShortWidth"
							style="width: 100%; height: 100%;"
							class="ag-theme-alpine"
							id="myGrid"
							:gridOptions='gridOptions',
							pagination='true',
							paginationPageSize='15',
							:defaultColDef='defaultColDefResponsive'
							:columnDefs="resposive_columnDefs",
							:getRowHeight="getResponsiveRowHeight"
							:animateRows="true",
							@grid-ready="onGridReady"
							:rowData="staffList"
							)
						//- No Responsive ag grid
						ag-grid-vue(
							v-if="!isShortWidth && isShortWidth != null"
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
	v-jnx-footer

</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'
import { AgGridVue } from 'ag-grid-vue'
import rowDelete from './ag-grid/row-delete'
import responsiveName from './ag-grid/responsive-name'
import rowName from './ag-grid/row-name'
import rowPhone from './ag-grid/row-phone'
import rowEmail from './ag-grid/row-email'
import rowEdit from './ag-grid/row-edit'

export default {
	name: 'staff-list',
	components: {
		AgGridVue,
		responsiveName,
		rowName,
		rowPhone,
		rowEmail,
		rowEdit,
		rowDelete
	},
	data () {
		return {
			sectionTitle: this.$t('staff.title'),
			currentWidth: window.innerWidth - 40,
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
			columnDefs: { field: 'name', sortable: true },
			periodFilterKey: 'last30Days',
			periodFilter: [
				{
					key: 'last30Days',
					label: 'periodFilter.last30Days'
				},
				{
					key: 'last90Days',
					label: 'periodFilter.last90Days'
				},
				{
					key: 'oneYear',
					label: 'periodFilter.oneYear'
				},
				{
					key: 'yearToDate',
					label: 'periodFilter.yearToDate'
				},
				{
					key: 'fiveYearToDate',
					label: 'periodFilter.fiveYearToDate'
				}
			]
		}
	},
	beforeMount () {
		this.setGridStyleParameters()
	},
	mounted () {
		this.gridApi = this.gridOptions.api
		this.gridColumnApi = this.gridOptions.columnApi
		// TODO ask if is neccesary make resize call function
	},
	beforeRouteEnter: (to, from, next) => {
		const period = Vue.timePeriods['last30Days']
		Vue.jnx.partyService.findPeopleByPeriod({ to: period.to(), from: period.from() }).then(response => {
			next(vm => {
				vm.staffList = response
				console.log('staffList', vm.staffList)
			})
		})
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded,
		isShortWidth: state => state.isResponsive
	}),
	methods: {
		fetchUsers () {
			const period = Vue.timePeriods[this.periodFilterKey]
			Vue.jnx.partyService.findPeopleByPeriod({ to: period.to(), from: period.from() }).then((result) => {
				this.staffList = result
				console.log('users match', this.staffList)
				this.dataReady = true
			})
		},
		periodChange () {
			this.fetchUsers()
		},
		setGridStyleParameters () {
			this.gridOptions = {}
			this.columnDefs = [
				{
					headerName: 'Name´s',
					field: 'name',
					cellRendererFramework: rowName,
					minWidth: this.isShortWidth ? this.currentWidth : 50,
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
			this.resposive_columnDefs = [
				{
					headerName: 'Staff Results',
					field: 'responsiveName',
					cellRendererFramework: responsiveName,
					minWidth: this.currentWidth
				}
			]
		},
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
		onGridReady (params) {
			const updateData = (data) => {
				let differentHeights = [40, 80, 120, 200]
				data.forEach(function (dataItem, index) {
					dataItem.rowHeight = differentHeights[index % 4]
					dataItem.responsiveName = `${dataItem.name.last}, ${dataItem.name.first}`
				})
				this.staffList = data
			}

			Vue.jnx.partyService.findPeople().then(response => {
				this.staffList = response
				updateData(this.staffList)
				console.log('response', response)
			})
		},
		getResponsiveRowHeight (params) {
			return 170
		}
	}
}
</script>
