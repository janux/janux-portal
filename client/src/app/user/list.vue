<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(:class="{'page-content-left' : navBarExpanded}")
		.container-fluid
			.row
				.col-lg-12

					.title-bar
						.title {{ $t('user.listTitle') }}
						.options
							router-link(:to="{name:'userCreate'}")
								span.fa.fa-user-plus.fa-lg
								//- | &nbsp; {{ $t('label.add') }}
					hr

					#grid-wrapper(style="width: 100%; height: 500px;")
						ag-grid-vue(
						style="width: 100%; height: 500px;"
						class="ag-theme-alpine"
						id="myGrid"
						:gridOptions='gridOptions',
						pagination='true',
						paginationPageSize='15',
						:defaultColDef='defaultColDef'
						:columnDefs="columnDefs",
						:rowData="usersMatch",
						@first-data-rendered="onFirstDataRendered",
						@grid-size-changed="onGridSizeChanged"
						)
	v-jnx-footer

	md-dialog-confirm(
		:md-active.sync='showDelConf',
		md-title='Confirm delete?',
		md-content='Are you sure to delete the users selected',
		:md-confirm-text='$t("label.ok")',
		:md-cancel-text='$t("label.no")',
		@md-cancel='',
		@md-confirm='confirmDelete')

	md-dialog-alert(
		:md-active.sync='showErrorSel',
		:md-content='$t("user.dialogs.noRowSelectedError")',
		:md-confirm-text='$t("label.ok")')

</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import { mapState } from 'vuex'
import { AgGridVue } from 'ag-grid-vue'

import rowName from './ag-grid/row-name'
import rowUsername from './ag-grid/row-username'
import rowRole from './ag-grid/row-role'
import rowPhone from './ag-grid/row-phone'
import rowEmail from './ag-grid/row-email'
import rowEdit from './ag-grid/row-edit'
import rowDelete from './ag-grid/row-delete'
import rowLockPass from './ag-grid/row-lock-pass'

import { EventBus } from '@/common/event-bus.js'

export default {
	name: 'user-list',
	components: {
		AgGridVue,
		rowName,
		rowUsername,
		rowRole,
		rowPhone,
		rowEmail,
		rowEdit,
		rowLockPass,
		rowDelete
	},
	data () {
		return {
			sectionTitle: this.$t('user.title'),
			searchFields: ['username', 'name', 'email', 'phone'],
			usersMatch: [],
			searchField: 'username',
			searchString: '',
			showDelConf: false,
			showErrorSel: false,
			selectedIds: [],

			gridOptions: null,
			gridApi: null,
			columnApi: null,
			// staffList: [],
			defaultColDef: {
				resizable: true,
				sortable: true,
				filter: true
			},
			columnDefs: { field: 'name', sortable: true },
			currentRowId: null
		}
	},
	created: function () {
		this.fetchUsers()
	},
	mounted () {
		this.gridApi = this.gridOptions.api
		this.gridColumnApi = this.gridOptions.columnApi
		this.getEventBus()
	},
	beforeMount () {
		this.gridOptions = {}
		this.columnDefs = [
			{
				headerName: 'User Name',
				field: 'username',
				cellRendererFramework: rowUsername,
				minWidth: 30,
				maxWidth: 220
			},
			{
				headerName: 'Name´s',
				field: 'name',
				cellRendererFramework: rowName,
				minWidth: 50,
				maxWidth: 450
			},
			{
				headerName: 'Role',
				field: 'role',
				cellRendererFramework: rowRole,
				minWidth: 50,
				maxWidth: 200
			},
			{
				headerName: 'Email',
				field: 'email',
				cellRendererFramework: rowEmail,
				minWidth: 50,
				maxWidth: 480
			},
			{
				headerName: 'Phone Number',
				field: 'phone',
				cellRendererFramework: rowPhone,
				minWidth: 50,
				maxWidth: 400
			},
			{
				headerName: 'Renew password',
				field: 'newPass',
				cellRendererFramework: rowLockPass,
				minWidth: 50,
				maxWidth: 170
			},
			{
				headerName: 'Edit',
				field: 'edit',
				cellRendererFramework: rowEdit,
				minWidth: 50,
				maxWidth: 100
			},
			{
				headerName: 'Delete',
				field: 'delete',
				cellRendererFramework: rowDelete,
				minWidth: 50,
				maxWidth: 100
			}
		]
	},
	methods: {
		fetchUsers () {
			Vue.jnx.userService.findBy('username', '').then(result => {
				this.usersMatch = _.map(result, function (user) {
					user.cdate = moment(user.cdate).format(
						'YYYY-MM-DD HH:mm:ss'
					)
					return user
				})
				// console.log('users match', this.usersMatch)
			})
		},
		findUsers () {
			Vue.jnx.userService
				.findBy(this.searchField, this.searchString)
				.then(result => {
					this.usersMatch = _.map(result, function (user) {
						user.cdate = moment(user.cdate).format(
							'YYYY-MM-DD HH:mm:ss'
						)
						return user
					})
					// console.log('usersMatch', this.usersMatch)
				})
		},
		openDelete () {
			this.showDelConf = true
		},

		confirmDelete () {
			console.log('confirmDelete')

			Vue.jnx.userService.deleteUser(this.currentRowId).then(() => {
				this.fetchUsers()
			})
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
		getEventBus () {
			EventBus.$on('ask-if-delete-this', (id) => {
				this.currentRowId = id
				this.openDelete()
			})
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
