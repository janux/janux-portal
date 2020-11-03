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
			isShortWidth: null,
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
			columnDefs: { field: 'name', sortable: true }
		}
	},
	beforeMount () {
		this.getBrowserWidth()
		this.setGridStyleParameters()
	},
	mounted () {
		this.gridApi = this.gridOptions.api
		this.gridColumnApi = this.gridOptions.columnApi
		// TODO ask if is neccesary make resize call function
		// window.addEventListener('resize', this.getBrowserWidth)
	},
	beforeDestroy () {
		// window.removeEventListener('resize', this.getBrowserWidth())
	},
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.partyService.findPeople().then(response => {
			next(vm => {
				vm.staffList = response
				console.log('staffList', vm.staffList)
			})
		})
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	}),
	methods: {
		setGridStyleParameters () {
			this.getBrowserWidth()
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
					headerName: 'Name´s',
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
		getBrowserWidth () {
			this.isMobile() ? this.isShortWidth = true : this.isShortWidth = false
		},
		isMobile () {
			let isMobile = {
				Android: function () {
					return navigator.userAgent.match(/Android/i)
				},
				BlackBerry: function () {
					return navigator.userAgent.match(/BlackBerry/i)
				},
				iOS: function () {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i)
				},
				Opera: function () {
					return navigator.userAgent.match(/Opera Mini/i)
				},
				Windows: function () {
					return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)
				},
				any: function () {
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
				}
			}
			if (isMobile.any() || window.innerWidth <= 769) {
				return true
			} else {
				return false
			}
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
